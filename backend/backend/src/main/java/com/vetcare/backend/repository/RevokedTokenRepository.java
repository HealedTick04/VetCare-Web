// RevokedTokenRepository.java
package com.vetcare.backend.repository;

import com.vetcare.backend.entity.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);
}