package com.vetcare.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ValidateResetTokenRequestDTO {
    @NotBlank(message = "El token de recuperación es obligatorio")
    private String token;
}