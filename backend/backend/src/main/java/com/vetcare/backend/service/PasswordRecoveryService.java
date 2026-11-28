package com.vetcare.backend.service;

import com.vetcare.backend.dto.auth.ForgotPasswordResponseDTO;
import com.vetcare.backend.dto.auth.ResetPasswordResponseDTO;
import com.vetcare.backend.dto.auth.ValidateResetTokenResponseDTO;
import com.vetcare.backend.entity.PasswordResetToken;
import com.vetcare.backend.entity.User;
import com.vetcare.backend.exception.ExpiredResetTokenException;
import com.vetcare.backend.exception.InvalidResetTokenException;
import com.vetcare.backend.repository.PasswordResetTokenRepository;
import com.vetcare.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class PasswordRecoveryService {

    private static final int TOKEN_BYTES = 32;
    private static final int EXPIRATION_MINUTES = 30;
    private static final String GENERIC_FORGOT_MESSAGE =
            "Si la cuenta existe, recibirás instrucciones para recuperar tu contraseña.";
    private static final Pattern PASSWORD_POLICY =
            Pattern.compile("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}$");

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public ForgotPasswordResponseDTO requestPasswordReset(String rawEmail) {
        if (rawEmail == null || rawEmail.isBlank()) {
            throw new IllegalArgumentException("El correo electrónico es obligatorio.");
        }

        String normalizedEmail = rawEmail.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (Boolean.TRUE.equals(user.getActive())) {
                LocalDateTime now = LocalDateTime.now();

                // Invalidar tokens anteriores pendientes del usuario
                passwordResetTokenRepository.invalidateAllPendingByUserId(user.getId(), now);

                // Generar token seguro (32 bytes -> Base64 URL-safe) y guardar solo su SHA-256
                String rawToken = generateSecureToken();
                String tokenHash = hashTokenSha256(rawToken);

                PasswordResetToken tokenEntity = PasswordResetToken.builder()
                        .user(user)
                        .tokenHash(tokenHash)
                        .expiresAt(now.plusMinutes(EXPIRATION_MINUTES))
                        .build();

                passwordResetTokenRepository.save(tokenEntity);

                // Enviar el token original únicamente en el correo electrónico
                emailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), rawToken);
            }
        }

        // Respuesta genérica idéntica exista o no el correo
        return ForgotPasswordResponseDTO.builder()
                .message(GENERIC_FORGOT_MESSAGE)
                .build();
    }

    @Transactional(readOnly = true)
    public ValidateResetTokenResponseDTO validateResetToken(String rawToken) {
        PasswordResetToken resetToken = resolveAndVerifyToken(rawToken);

        User user = resetToken.getUser();
        if (user == null || !Boolean.TRUE.equals(user.getActive())) {
            throw new InvalidResetTokenException("La cuenta asociada a este enlace no se encuentra habilitada.");
        }

        return ValidateResetTokenResponseDTO.builder()
                .valid(true)
                .message("El enlace de recuperación es válido.")
                .build();
    }

    @Transactional
    public ResetPasswordResponseDTO resetPassword(String rawToken, String newPassword, String confirmPassword) {
        if (newPassword == null || newPassword.isBlank() || confirmPassword == null || confirmPassword.isBlank()) {
            throw new IllegalArgumentException("Debes ingresar y confirmar la nueva contraseña.");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new IllegalArgumentException("Las contraseñas no coinciden.");
        }

        if (!PASSWORD_POLICY.matcher(newPassword).matches()) {
            throw new IllegalArgumentException(
                    "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un número."
            );
        }

        PasswordResetToken resetToken = resolveAndVerifyToken(rawToken);

        User user = resetToken.getUser();
        if (user == null || !Boolean.TRUE.equals(user.getActive())) {
            throw new InvalidResetTokenException("La cuenta asociada no se encuentra habilitada.");
        }

        LocalDateTime now = LocalDateTime.now();

        // Actualizar contraseña con el mismo PasswordEncoder BCrypt
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Marcar este token como utilizado e invalidar cualquier otro pendiente
        resetToken.setUsedAt(now);
        passwordResetTokenRepository.save(resetToken);
        passwordResetTokenRepository.invalidateAllPendingByUserId(user.getId(), now);

        log.info("Contraseña actualizada mediante recuperación para el usuario ID {}", user.getId());

        return ResetPasswordResponseDTO.builder()
                .message("La contraseña se actualizó correctamente.")
                .build();
    }

    private PasswordResetToken resolveAndVerifyToken(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) {
            throw new InvalidResetTokenException("El enlace de recuperación no es válido.");
        }

        String tokenHash = hashTokenSha256(rawToken.trim());

        PasswordResetToken resetToken = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidResetTokenException("El enlace de recuperación no es válido."));

        if (resetToken.getUsedAt() != null) {
            throw new InvalidResetTokenException("Este enlace de recuperación ya fue utilizado.");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ExpiredResetTokenException("El enlace de recuperación ha expirado. Solicita uno nuevo.");
        }

        return resetToken;
    }

    private String generateSecureToken() {
        byte[] bytes = new byte[TOKEN_BYTES];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private String hashTokenSha256(String rawToken) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(encodedHash);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Algoritmo SHA-256 no disponible", e);
        }
    }
}