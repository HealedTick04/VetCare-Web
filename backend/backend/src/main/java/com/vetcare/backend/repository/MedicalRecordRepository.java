// MedicalRecordRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.MedicalRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {
    @Override
    @EntityGraph(attributePaths = {"pet", "pet.owner", "veterinarian", "treatments", "treatments.treatment"})
    Optional<MedicalRecord> findById(Long id);

    @EntityGraph(attributePaths = {"pet", "pet.owner", "veterinarian"})
    @Query("SELECT m FROM MedicalRecord m WHERE " +
           "(:ownerId IS NULL OR m.pet.owner.id = :ownerId) AND " +
           "(:petId IS NULL OR m.pet.id = :petId) AND " +
           "(:search IS NULL OR LOWER(m.pet.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(m.diagnosis) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<MedicalRecord> searchRecords(@Param("ownerId") Long ownerId, @Param("petId") Long petId,
                                      @Param("search") String search, Pageable pageable);
}