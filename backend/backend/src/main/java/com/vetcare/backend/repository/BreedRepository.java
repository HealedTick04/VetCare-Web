// BreedRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.Breed;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BreedRepository extends JpaRepository<Breed, Long> {
    @EntityGraph(attributePaths = {"species"})
    List<Breed> findBySpeciesId(Long speciesId);
}