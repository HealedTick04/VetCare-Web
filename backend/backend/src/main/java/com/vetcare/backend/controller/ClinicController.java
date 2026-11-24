package com.vetcare.backend.controller;

import com.vetcare.backend.dto.modules.ModuleDtos.*;
import com.vetcare.backend.entity.*;
import com.vetcare.backend.exception.ResourceNotFoundException;
import com.vetcare.backend.repository.*;
import com.vetcare.backend.security.CustomUserDetails;
import com.vetcare.backend.service.ClinicService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ClinicController {

    private final ClinicService clinicService;
    private final SpeciesRepository speciesRepository;
    private final BreedRepository breedRepository;
    private final TreatmentRepository treatmentRepository;
    private final ServiceItemRepository serviceItemRepository;
    private final InventoryItemRepository inventoryItemRepository;
    private final NotificationRepository notificationRepository;

    // --- HEALTH & DASHBOARD ---
    @GetMapping("/health")
    public ResponseEntity<Object> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "VetCare API"));
    }

    @GetMapping("/dashboard/stats")
    public ResponseEntity<Object> dashboardStats() {
        return ResponseEntity.ok(clinicService.getDashboardStats());
    }

    // --- USERS & PROFILE ---
    @GetMapping("/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIAN')")
    public ResponseEntity<Object> getUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(clinicService.getUsers(role, search, pageable));
    }

    @PostMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createUser(@Valid @RequestBody AdminCreateUserRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clinicService.createUserByAdmin(request));
    }

    @PutMapping("/users/profile")
    public ResponseEntity<Object> updateMyProfile(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(clinicService.updateProfile(currentUser.getId(), request));
    }

    @PatchMapping("/users/{id}/toggle-active")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> toggleUserActive(@PathVariable Long id) {
        clinicService.toggleUserActive(id);
        return ResponseEntity.ok(Map.of("message", "Estado del usuario actualizado"));
    }

    // --- CATALOGS (SPECIES & BREEDS) ---
    @GetMapping("/species")
    public ResponseEntity<Object> getAllSpecies() {
        return ResponseEntity.ok(speciesRepository.findAll());
    }

    @GetMapping("/species/{speciesId}/breeds")
    public ResponseEntity<Object> getBreedsBySpecies(@PathVariable Long speciesId) {
        return ResponseEntity.ok(breedRepository.findBySpeciesId(speciesId));
    }

    // --- PETS ---
    @GetMapping("/pets")
    public ResponseEntity<Object> getPets(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(required = false) Long speciesId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(clinicService.getPets(currentUser, speciesId, search, pageable));
    }

    @PostMapping("/pets")
    public ResponseEntity<Object> createPet(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody PetRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clinicService.createPet(currentUser, request));
    }

    @PutMapping("/pets/{id}")
    public ResponseEntity<Object> updatePet(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id,
            @Valid @RequestBody PetRequest request) {
        return ResponseEntity.ok(clinicService.updatePet(currentUser, id, request));
    }

    @DeleteMapping("/pets/{id}")
    public ResponseEntity<Object> deletePet(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PathVariable Long id) {
        clinicService.deletePet(currentUser, id);
        return ResponseEntity.ok(Map.of("message", "Mascota eliminada correctamente"));
    }

    // --- APPOINTMENTS ---
    @GetMapping("/appointments")
    public ResponseEntity<Object> getAppointments(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(clinicService.getAppointments(currentUser, status, search, pageable));
    }

    @PostMapping("/appointments")
    public ResponseEntity<Object> createAppointment(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody AppointmentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clinicService.createAppointment(currentUser, request));
    }

    @PatchMapping("/appointments/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIAN', 'CLIENT')")
    public ResponseEntity<Object> updateAppointmentStatus(
            @PathVariable Long id,
            @Valid @RequestBody AppointmentStatusRequest request) {
        return ResponseEntity.ok(clinicService.updateAppointmentStatus(id, request.getStatus()));
    }

    // --- MEDICAL RECORDS & TREATMENTS (N:M) ---
    @GetMapping("/medical-records")
    public ResponseEntity<Object> getMedicalRecords(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @RequestParam(required = false) Long petId,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(clinicService.getMedicalRecords(currentUser, petId, search, pageable));
    }

    @PostMapping("/medical-records")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIAN')")
    public ResponseEntity<Object> createMedicalRecord(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @Valid @RequestBody MedicalRecordRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(clinicService.createMedicalRecord(currentUser, request));
    }

    @GetMapping("/treatments")
    public ResponseEntity<Object> getTreatments(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(treatmentRepository.findByNameContainingIgnoreCase(search, pageable));
    }

    // --- SERVICES & INVENTORY ---
    @GetMapping("/services")
    public ResponseEntity<Object> getServices(
            @RequestParam(defaultValue = "") String search,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(serviceItemRepository.findByNameContainingIgnoreCase(search, pageable));
    }

    @PostMapping("/services")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createService(@Valid @RequestBody ServiceRequest req) {
        ServiceItem item = ServiceItem.builder()
                .name(req.getName()).description(req.getDescription())
                .price(req.getPrice()).durationMinutes(req.getDurationMinutes())
                .active(req.getActive()).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(serviceItemRepository.save(item));
    }

    @GetMapping("/inventory")
    @PreAuthorize("hasAnyRole('ADMIN', 'VETERINARIAN')")
    public ResponseEntity<Object> getInventory(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @PageableDefault(size = 10) Pageable pageable) {
        String cat = (category == null || category.isBlank()) ? null : category;
        String q = (search == null || search.isBlank()) ? null : search;
        return ResponseEntity.ok(inventoryItemRepository.searchInventory(cat, q, pageable));
    }

    @PostMapping("/inventory")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> createInventoryItem(@Valid @RequestBody InventoryRequest req) {
        InventoryItem item = InventoryItem.builder()
                .name(req.getName()).category(req.getCategory()).stock(req.getStock())
                .minStock(req.getMinStock()).unitPrice(req.getUnitPrice())
                .expirationDate(req.getExpirationDate()).active(req.getActive()).build();
        return ResponseEntity.status(HttpStatus.CREATED).body(inventoryItemRepository.save(item));
    }

    // --- NOTIFICATIONS ---
    @GetMapping("/notifications")
    public ResponseEntity<Object> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails currentUser,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId(), pageable));
    }

    @PatchMapping("/notifications/{id}/read")
    public ResponseEntity<Object> markNotificationAsRead(@PathVariable Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificación no encontrada"));
        n.setIsRead(true);
        return ResponseEntity.ok(notificationRepository.save(n));
    }
}