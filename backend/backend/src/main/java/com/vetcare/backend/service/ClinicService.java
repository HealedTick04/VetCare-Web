package com.vetcare.backend.service;

import com.vetcare.backend.dto.auth.AuthDtos.UserProfileResponse;
import com.vetcare.backend.dto.modules.ModuleDtos.*;
import com.vetcare.backend.entity.*;
import com.vetcare.backend.exception.BusinessRuleException;
import com.vetcare.backend.exception.ResourceNotFoundException;
import com.vetcare.backend.repository.*;
import com.vetcare.backend.security.CustomUserDetails;
import com.vetcare.backend.service.notification.EmailNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ClinicService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final SpeciesRepository speciesRepository;
    private final BreedRepository breedRepository;
    private final PetRepository petRepository;
    private final AppointmentRepository appointmentRepository;
    private final MedicalRecordRepository medicalRecordRepository;
    private final TreatmentRepository treatmentRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final NotificationRepository notificationRepository;
    private final EmailNotificationService emailService;
    private final PasswordEncoder passwordEncoder;

    // --- USUARIOS Y PERFIL ---
    public Page<UserProfileResponse> getUsers(String role, String search, Pageable pageable) {
        return userRepository.searchUsers(emptyToNull(role), emptyToNull(search), pageable)
                .map(this::toUserProfile);
    }

    @Transactional
    public UserProfileResponse createUserByAdmin(AdminCreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new BusinessRuleException("El correo ya está registrado");
        }
        Role role = roleRepository.findByName(req.getRole().toUpperCase())
                .orElseThrow(() -> new ResourceNotFoundException("Rol no encontrado: " + req.getRole()));
        User user = User.builder()
                .firstName(req.getFirstName())
                .lastName(req.getLastName())
                .email(req.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(req.getPassword()))
                .phone(req.getPhone())
                .role(role)
                .active(true)
                .build();
        return toUserProfile(userRepository.save(user));
    }

    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        user.setFirstName(req.getFirstName());
        user.setLastName(req.getLastName());
        user.setPhone(req.getPhone());
        user.setAvatarUrl(req.getAvatarUrl());
        return toUserProfile(userRepository.save(user));
    }

    @Transactional
    public void toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        user.setActive(!Boolean.TRUE.equals(user.getActive()));
        userRepository.save(user);
    }

    // --- MASCOTAS ---
    public Page<PetResponse> getPets(CustomUserDetails currentUser, Long speciesId, String search, Pageable pageable) {
        Long ownerFilter = "CLIENT".equals(currentUser.getRoleName()) ? currentUser.getId() : null;
        return petRepository.searchPets(ownerFilter, speciesId, emptyToNull(search), pageable)
                .map(this::toPetResponse);
    }

    @Transactional
    public PetResponse createPet(CustomUserDetails currentUser, PetRequest req) {
        Long ownerId = "CLIENT".equals(currentUser.getRoleName())
                ? currentUser.getId()
                : (req.getOwnerId() != null ? req.getOwnerId() : currentUser.getId());

        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dueño no encontrado"));
        Species species = speciesRepository.findById(req.getSpeciesId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie no encontrada"));
        Breed breed = req.getBreedId() != null
                ? breedRepository.findById(req.getBreedId()).orElseThrow(() -> new ResourceNotFoundException("Raza no encontrada"))
                : null;

        Pet pet = Pet.builder()
                .owner(owner)
                .species(species)
                .breed(breed)
                .name(req.getName())
                .birthDate(req.getBirthDate())
                .weight(req.getWeight())
                .sex(req.getSex())
                .observations(req.getObservations())
                .build();
        return toPetResponse(petRepository.save(pet));
    }

    @Transactional
    public PetResponse updatePet(CustomUserDetails currentUser, Long id, PetRequest req) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada"));
        if ("CLIENT".equals(currentUser.getRoleName()) && !pet.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("No puedes editar una mascota que no te pertenece");
        }
        Species species = speciesRepository.findById(req.getSpeciesId())
                .orElseThrow(() -> new ResourceNotFoundException("Especie no encontrada"));
        Breed breed = req.getBreedId() != null
                ? breedRepository.findById(req.getBreedId()).orElse(null)
                : null;

        pet.setName(req.getName());
        pet.setSpecies(species);
        pet.setBreed(breed);
        pet.setBirthDate(req.getBirthDate());
        pet.setWeight(req.getWeight());
        pet.setSex(req.getSex());
        pet.setObservations(req.getObservations());
        return toPetResponse(petRepository.save(pet));
    }

    @Transactional
    public void deletePet(CustomUserDetails currentUser, Long id) {
        Pet pet = petRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada"));
        if ("CLIENT".equals(currentUser.getRoleName()) && !pet.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("No puedes eliminar una mascota que no te pertenece");
        }
        petRepository.delete(pet);
    }

    // --- CITAS (Dispara Correo + SMS + WhatsApp reales) ---
    public Page<AppointmentResponse> getAppointments(CustomUserDetails currentUser, String status, String search, Pageable pageable) {
        Long ownerFilter = "CLIENT".equals(currentUser.getRoleName()) ? currentUser.getId() : null;
        Long vetFilter = "VETERINARIAN".equals(currentUser.getRoleName()) ? currentUser.getId() : null;
        return appointmentRepository.searchAppointments(ownerFilter, vetFilter, emptyToNull(status), emptyToNull(search), pageable)
                .map(this::toAppointmentResponse);
    }

    @Transactional
    public AppointmentResponse createAppointment(CustomUserDetails currentUser, AppointmentRequest req) {
        Pet pet = petRepository.findById(req.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada"));
        if ("CLIENT".equals(currentUser.getRoleName()) && !pet.getOwner().getId().equals(currentUser.getId())) {
            throw new AccessDeniedException("Solo puedes agendar citas para tus propias mascotas");
        }

        User vet = userRepository.findById(req.getVeterinarianId())
                .orElseThrow(() -> new ResourceNotFoundException("Veterinario no encontrado"));
        if (!"VETERINARIAN".equals(vet.getRole().getName())) {
            throw new BusinessRuleException("El usuario seleccionado no tiene rol de veterinario");
        }

        if (appointmentRepository.existsByVeterinarianIdAndAppointmentDateAndStatusNot(
                vet.getId(), req.getAppointmentDate(), "CANCELLED")) {
            throw new BusinessRuleException("El veterinario ya tiene una cita programada en ese horario");
        }

        Appointment appointment = Appointment.builder()
                .pet(pet)
                .veterinarian(vet)
                .appointmentDate(req.getAppointmentDate())
                .durationMinutes(req.getDurationMinutes() != null ? req.getDurationMinutes() : 30)
                .reason(req.getReason())
                .status("PENDING")
                .clientNotes(req.getClientNotes())
                .build();

        Appointment saved = appointmentRepository.save(appointment);

        // Notificación interna + Correo + SMS + WhatsApp reales al dueño
        User owner = pet.getOwner();
        String fechaTxt = saved.getAppointmentDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
        String msg = "Hola " + owner.getFirstName() + ", tu cita para " + pet.getName()
                + " con Dr(a). " + vet.getFirstName() + " " + vet.getLastName()
                + " quedó agendada para el " + fechaTxt + " (" + saved.getReason() + ").";

        notificationRepository.save(Notification.builder()
                .user(owner)
                .title("Cita Agendada - " + pet.getName())
                .message(msg)
                .type("APPOINTMENT")
                .build());

        emailService.sendEmail(owner.getEmail(), "Confirmación de Cita - VetCare", msg);

        return toAppointmentResponse(saved);
    }

    @Transactional
    public AppointmentResponse updateAppointmentStatus(Long id, String status) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cita no encontrada"));
        appointment.setStatus(status);
        Appointment saved = appointmentRepository.save(appointment);

        User owner = saved.getPet().getOwner();
        String msg = "El estado de la cita de " + saved.getPet().getName() + " cambió a: " + status;
        notificationRepository.save(Notification.builder()
                .user(owner)
                .title("Actualización de Cita")
                .message(msg)
                .type("APPOINTMENT_STATUS")
                .build());
        emailService.sendEmail(owner.getEmail(), "Actualización de Cita - VetCare", msg);

        return toAppointmentResponse(saved);
    }

    // --- HISTORIAL MÉDICO (Relación N:M con Treatments) ---
    public Page<MedicalRecordResponse> getMedicalRecords(CustomUserDetails currentUser, Long petId, String search, Pageable pageable) {
        Long ownerFilter = "CLIENT".equals(currentUser.getRoleName()) ? currentUser.getId() : null;
        return medicalRecordRepository.searchRecords(ownerFilter, petId, emptyToNull(search), pageable)
                .map(this::toMedicalRecordResponse);
    }

    @Transactional
    public MedicalRecordResponse createMedicalRecord(CustomUserDetails vetUser, MedicalRecordRequest req) {
        Pet pet = petRepository.findById(req.getPetId())
                .orElseThrow(() -> new ResourceNotFoundException("Mascota no encontrada"));
        User vet = userRepository.findById(vetUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Veterinario no encontrado"));

        MedicalRecord record = MedicalRecord.builder()
                .pet(pet)
                .veterinarian(vet)
                .diagnosis(req.getDiagnosis())
                .symptoms(req.getSymptoms())
                .observations(req.getObservations())
                .recommendations(req.getRecommendations())
                .build();

        if (req.getTreatments() != null) {
            for (RecordTreatmentItemRequest item : req.getTreatments()) {
                Treatment t = treatmentRepository.findById(item.getTreatmentId())
                        .orElseThrow(() -> new ResourceNotFoundException("Tratamiento no encontrado: " + item.getTreatmentId()));
                record.getTreatments().add(MedicalRecordTreatment.builder()
                        .medicalRecord(record)
                        .treatment(t)
                        .dosage(item.getDosage())
                        .frequency(item.getFrequency())
                        .duration(item.getDuration())
                        .instructions(item.getInstructions())
                        .build());
            }
        }

        MedicalRecord saved = medicalRecordRepository.save(record);
        return toMedicalRecordResponse(saved);
    }

    // --- DASHBOARD STATS ---
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalClients", userRepository.countByRoleName("CLIENT"));
        stats.put("totalVeterinarians", userRepository.countByRoleName("VETERINARIAN"));
        stats.put("totalPets", petRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        stats.put("pendingAppointments", appointmentRepository.countByStatus("PENDING"));
        stats.put("completedAppointments", appointmentRepository.countByStatus("COMPLETED"));
        stats.put("totalMedicalRecords", medicalRecordRepository.count());
        stats.put("totalServices", serviceItemRepository.count());
        stats.put("totalInventoryItems", inventoryItemRepository.count());
        return stats;
    }

    // --- MAPPERS ---
    private String emptyToNull(String val) {
        return (val == null || val.isBlank()) ? null : val.trim();
    }

    public UserProfileResponse toUserProfile(User u) {
        return UserProfileResponse.builder()
                .id(u.getId()).firstName(u.getFirstName()).lastName(u.getLastName())
                .email(u.getEmail()).phone(u.getPhone()).avatarUrl(u.getAvatarUrl())
                .role(u.getRole().getName()).active(u.getActive())
                .build();
    }

    public PetResponse toPetResponse(Pet p) {
        return PetResponse.builder()
                .id(p.getId()).name(p.getName())
                .ownerId(p.getOwner().getId())
                .ownerName(p.getOwner().getFirstName() + " " + p.getOwner().getLastName())
                .ownerEmail(p.getOwner().getEmail())
                .speciesId(p.getSpecies().getId()).speciesName(p.getSpecies().getName())
                .breedId(p.getBreed() != null ? p.getBreed().getId() : null)
                .breedName(p.getBreed() != null ? p.getBreed().getName() : null)
                .birthDate(p.getBirthDate()).weight(p.getWeight()).sex(p.getSex())
                .observations(p.getObservations()).createdAt(p.getCreatedAt())
                .build();
    }

    public AppointmentResponse toAppointmentResponse(Appointment a) {
        return AppointmentResponse.builder()
                .id(a.getId()).petId(a.getPet().getId()).petName(a.getPet().getName())
                .speciesName(a.getPet().getSpecies().getName())
                .ownerId(a.getPet().getOwner().getId())
                .ownerName(a.getPet().getOwner().getFirstName() + " " + a.getPet().getOwner().getLastName())
                .veterinarianId(a.getVeterinarian().getId())
                .veterinarianName(a.getVeterinarian().getFirstName() + " " + a.getVeterinarian().getLastName())
                .appointmentDate(a.getAppointmentDate()).durationMinutes(a.getDurationMinutes())
                .reason(a.getReason()).status(a.getStatus()).clientNotes(a.getClientNotes())
                .build();
    }

    public MedicalRecordResponse toMedicalRecordResponse(MedicalRecord m) {
        List<RecordTreatmentItemResponse> items = m.getTreatments().stream().map(t ->
                RecordTreatmentItemResponse.builder()
                        .treatmentId(t.getTreatment().getId())
                        .treatmentName(t.getTreatment().getName())
                        .dosage(t.getDosage()).frequency(t.getFrequency())
                        .duration(t.getDuration()).instructions(t.getInstructions())
                        .build()
        ).toList();

        return MedicalRecordResponse.builder()
                .id(m.getId()).petId(m.getPet().getId()).petName(m.getPet().getName())
                .ownerName(m.getPet().getOwner().getFirstName() + " " + m.getPet().getOwner().getLastName())
                .veterinarianId(m.getVeterinarian().getId())
                .veterinarianName(m.getVeterinarian().getFirstName() + " " + m.getVeterinarian().getLastName())
                .recordDate(m.getRecordDate()).diagnosis(m.getDiagnosis())
                .symptoms(m.getSymptoms()).observations(m.getObservations())
                .recommendations(m.getRecommendations()).treatments(items)
                .build();
    }
}