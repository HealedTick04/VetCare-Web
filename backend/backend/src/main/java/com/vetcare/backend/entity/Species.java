package com.vetcare.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "species")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Species {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(length = 150)
    private String description;
}