package com.vetcare.backend.dto.auth;

import jakarta.validation.constraints.*;
import lombok.*;

public class AuthDtos {

    public static final String PASSWORD_REGEX = "^(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&.#_-])[A-Za-z\\d@$!%*?&.#_-]{8,}$";
    public static final String PASSWORD_MSG = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial (@$!%*?&.#_-)";

    @Data
    public static class RegisterRequest {
        @NotBlank(message = "El nombre es obligatorio")
        @Size(max = 80, message = "El nombre no debe exceder 80 caracteres")
        private String firstName;

        @NotBlank(message = "El apellido es obligatorio")
        @Size(max = 80, message = "El apellido no debe exceder 80 caracteres")
        private String lastName;

        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "Formato de correo electrónico inválido")
        private String email;

        @NotBlank(message = "La contraseña es obligatoria")
        @Pattern(regexp = PASSWORD_REGEX, message = PASSWORD_MSG)
        private String password;

        @Size(max = 20, message = "El teléfono no debe exceder 20 caracteres")
        private String phone;
    }

    @Data
    public static class LoginRequest {
        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "Formato de correo electrónico inválido")
        private String email;

        @NotBlank(message = "La contraseña es obligatoria")
        private String password;
    }

    @Data
    public static class ForgotPasswordRequest {
        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "Formato de correo electrónico inválido")
        private String email;
    }

    @Data
    public static class ResetPasswordRequest {
        @NotBlank(message = "El token de recuperación es obligatorio")
        private String token;

        @NotBlank(message = "La nueva contraseña es obligatoria")
        @Pattern(regexp = PASSWORD_REGEX, message = PASSWORD_MSG)
        private String newPassword;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class UserProfileResponse {
        private Long id;
        private String firstName;
        private String lastName;
        private String email;
        private String phone;
        private String avatarUrl;
        private String role;
        private Boolean active;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AuthResponse {
        private String token;
        private String tokenType;
        private UserProfileResponse user;
    }
}