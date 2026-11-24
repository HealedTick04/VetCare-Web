package com.vetcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "medical_record_treatments")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MedicalRecordTreatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "medical_record_id", nullable = false)
    private MedicalRecord medicalRecord;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "treatment_id", nullable = false)
    private Treatment treatment;

    @Column(length = 100)
    private String dosage;

    @Column(length = 100)
    private String frequency;

    @Column(length = 100)
    private String duration;

    @Column(columnDefinition = "TEXT")
    private String instructions;
}