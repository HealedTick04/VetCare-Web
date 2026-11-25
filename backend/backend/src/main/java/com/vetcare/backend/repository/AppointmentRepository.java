// AppointmentRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.Appointment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Override
    @EntityGraph(attributePaths = {"pet", "pet.owner", "pet.species", "veterinarian"})
    Optional<Appointment> findById(Long id);

    @EntityGraph(attributePaths = {"pet", "pet.owner", "pet.species", "veterinarian"})
    @Query("SELECT a FROM Appointment a WHERE " +
           "(:ownerId IS NULL OR a.pet.owner.id = :ownerId) AND " +
           "(:vetId IS NULL OR a.veterinarian.id = :vetId) AND " +
           "(:status IS NULL OR a.status = :status) AND " +
           "(:search IS NULL OR LOWER(a.pet.name) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(a.reason) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Appointment> searchAppointments(@Param("ownerId") Long ownerId, @Param("vetId") Long vetId,
                                         @Param("status") String status, @Param("search") String search,
                                         Pageable pageable);

    boolean existsByVeterinarianIdAndAppointmentDateAndStatusNot(Long veterinarianId, LocalDateTime date, String excludedStatus);
    long countByStatus(String status);
}