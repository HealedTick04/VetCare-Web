// TreatmentRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.Treatment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TreatmentRepository extends JpaRepository<Treatment, Long> {
    Page<Treatment> findByNameContainingIgnoreCase(String name, Pageable pageable);
}