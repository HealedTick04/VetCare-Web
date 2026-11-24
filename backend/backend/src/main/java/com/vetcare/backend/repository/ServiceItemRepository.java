// ServiceItemRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.ServiceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    Page<ServiceItem> findByNameContainingIgnoreCase(String name, Pageable pageable);
}