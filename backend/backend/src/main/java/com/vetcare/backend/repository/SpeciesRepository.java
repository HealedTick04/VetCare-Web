// SpeciesRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.Species;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpeciesRepository extends JpaRepository<Species, Long> {
    Optional<Species> findByName(String name);
}