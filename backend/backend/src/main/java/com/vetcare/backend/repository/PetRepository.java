// PetRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.Pet;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Pet, Long> {
    @Override
    @EntityGraph(attributePaths = {"owner", "species", "breed"})
    Optional<Pet> findById(Long id);

    @EntityGraph(attributePaths = {"owner", "species", "breed"})
    @Query("SELECT p FROM Pet p WHERE " +
           "(:ownerId IS NULL OR p.owner.id = :ownerId) AND " +
           "(:speciesId IS NULL OR p.species.id = :speciesId) AND " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Pet> searchPets(@Param("ownerId") Long ownerId, @Param("speciesId") Long speciesId,
                         @Param("search") String search, Pageable pageable);
}