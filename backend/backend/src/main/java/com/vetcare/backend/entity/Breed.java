package com.vetcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "breeds")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Breed {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "species_id", nullable = false)
    private Species species;

    @Column(nullable = false, length = 80)
    private String name;

    @Column(length = 150)
    private String description;
}