package com.vetcare.backend.dto.modules;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class ModuleDtos {

    // --- PETS ---
    @Data
    public static class PetRequest {
        private Long ownerId; // quien crea es CLIENT (se toma del token)

        @NotNull(message = "La especie es obligatoria")
        private Long speciesId;

        private Long breedId;

        @NotBlank(message = "El nombre de la mascota es obligatorio")
        @Size(max = 100, message = "Máximo 100 caracteres")
        private String name;

        @PastOrPresent(message = "La fecha de nacimiento no puede ser futura")
        private LocalDate birthDate;

        @DecimalMin(value = "0.01", message = "El peso debe ser mayor a 0")
        private BigDecimal weight;

        @Pattern(regexp = "^(MALE|FEMALE|UNKNOWN)$", message = "El sexo debe ser MALE, FEMALE o UNKNOWN")
        private String sex;

        private String observations;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class PetResponse {
        private Long id;
        private String name;
        private Long ownerId;
        private String ownerName;
        private String ownerEmail;
        private Long speciesId;
        private String speciesName;
        private Long breedId;
        private String breedName;
        private LocalDate birthDate;
        private BigDecimal weight;
        private String sex;
        private String observations;
        private LocalDateTime createdAt;
    }

    // --- APPOINTMENTS ---
    @Data
    public static class AppointmentRequest {
        @NotNull(message = "La mascota es obligatoria")
        private Long petId;

        @NotNull(message = "El veterinario es obligatorio")
        private Long veterinarianId;

        @NotNull(message = "La fecha y hora de la cita son obligatorias")
        @Future(message = "La cita debe programarse en una fecha futura")
        private LocalDateTime appointmentDate;

        @Min(value = 15, message = "La duración mínima es 15 minutos")
        private Integer durationMinutes = 30;

        @NotBlank(message = "El motivo de la cita es obligatorio")
        @Size(max = 255)
        private String reason;

        private String clientNotes;
    }

    @Data
    public static class AppointmentStatusRequest {
        @NotBlank(message = "El estado es obligatorio")
        @Pattern(regexp = "^(PENDING|CONFIRMED|COMPLETED|CANCELLED|NO_SHOW)$", message = "Estado de cita inválido")
        private String status;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class AppointmentResponse {
        private Long id;
        private Long petId;
        private String petName;
        private String speciesName;
        private Long ownerId;
        private String ownerName;
        private Long veterinarianId;
        private String veterinarianName;
        private LocalDateTime appointmentDate;
        private Integer durationMinutes;
        private String reason;
        private String status;
        private String clientNotes;
    }

    // --- MEDICAL RECORDS & TREATMENTS (N:M) ---
    @Data
    public static class RecordTreatmentItemRequest {
        @NotNull(message = "El ID del tratamiento es obligatorio")
        private Long treatmentId;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
    }

    @Data
    public static class MedicalRecordRequest {
        @NotNull(message = "La mascota es obligatoria")
        private Long petId;

        @NotBlank(message = "El diagnóstico es obligatorio")
        private String diagnosis;

        private String symptoms;
        private String observations;
        private String recommendations;

        @Valid
        private List<RecordTreatmentItemRequest> treatments;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class RecordTreatmentItemResponse {
        private Long treatmentId;
        private String treatmentName;
        private String dosage;
        private String frequency;
        private String duration;
        private String instructions;
    }

    @Data @Builder @AllArgsConstructor @NoArgsConstructor
    public static class MedicalRecordResponse {
        private Long id;
        private Long petId;
        private String petName;
        private String ownerName;
        private Long veterinarianId;
        private String veterinarianName;
        private LocalDateTime recordDate;
        private String diagnosis;
        private String symptoms;
        private String observations;
        private String recommendations;
        private List<RecordTreatmentItemResponse> treatments;
    }

    // --- SERVICES & INVENTORY ---
    @Data
    public static class ServiceRequest {
        @NotBlank(message = "El nombre del servicio es obligatorio")
        private String name;
        private String description;
        @NotNull(message = "El precio es obligatorio")
        @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
        private BigDecimal price;
        @Min(value = 5, message = "Duración mínima de 5 minutos")
        private Integer durationMinutes = 30;
        private Boolean active = true;
    }

    @Data
    public static class InventoryRequest {
        @NotBlank(message = "El nombre del producto es obligatorio")
        private String name;
        @NotBlank(message = "La categoría es obligatoria")
        private String category;
        @NotNull @Min(value = 0, message = "El stock no puede ser negativo")
        private Integer stock;
        @NotNull @Min(value = 0)
        private Integer minStock;
        @NotNull @DecimalMin(value = "0.0")
        private BigDecimal unitPrice;
        private LocalDate expirationDate;
        private Boolean active = true;
    }

    // --- PROFILE & USERS ---
    @Data
    public static class UpdateProfileRequest {
        @NotBlank(message = "El nombre es obligatorio")
        private String firstName;
        @NotBlank(message = "El apellido es obligatorio")
        private String lastName;
        private String phone;
        private String avatarUrl;
    }

    @Data
    public static class AdminCreateUserRequest {
        @NotBlank(message = "El nombre es obligatorio")
        private String firstName;
        @NotBlank(message = "El apellido es obligatorio")
        private String lastName;
        @NotBlank @Email(message = "Correo inválido")
        private String email;
        @NotBlank(message = "Contraseña obligatoria")
        private String password;
        private String phone;
        @NotBlank(message = "El rol es obligatorio (ADMIN, VETERINARIAN, CLIENT)")
        private String role;
    }
}