package com.vetcare.backend.controller;

import com.vetcare.backend.dto.auth.*;
import com.vetcare.backend.dto.auth.AuthDtos.*;
import com.vetcare.backend.service.AuthService;
import com.vetcare.backend.service.PasswordRecoveryService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentLinkedDeque;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private static final int MAX_REQUESTS_PER_WINDOW = 5;
    private static final long WINDOW_SECONDS = 600; // 10 minutos
    private final Map<String, Deque<Instant>> rateLimitBuckets = new ConcurrentHashMap<>();

    private final AuthService authService;
    private final PasswordRecoveryService passwordRecoveryService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        authService.logout(authHeader);
        return ResponseEntity.ok(Map.of("message", "Sesión cerrada y token invalidado correctamente"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequestDTO request,
            HttpServletRequest httpRequest
    ) {
        String clientKey = extractClientIp(httpRequest) + ":" + request.getEmail().trim().toLowerCase();
        if (isRateLimited(clientKey)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Demasiadas solicitudes. Por favor espera unos minutos antes de intentarlo de nuevo."));
        }

        ForgotPasswordResponseDTO response = passwordRecoveryService.requestPasswordReset(request.getEmail());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/validate-reset-token")
    public ResponseEntity<ValidateResetTokenResponseDTO> validateResetToken(
            @Valid @RequestBody ValidateResetTokenRequestDTO request
    ) {
        return ResponseEntity.ok(passwordRecoveryService.validateResetToken(request.getToken()));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ResetPasswordResponseDTO> resetPassword(
            @Valid @RequestBody ResetPasswordRequestDTO request
    ) {
        return ResponseEntity.ok(
                passwordRecoveryService.resetPassword(
                        request.getToken(),
                        request.getNewPassword(),
                        request.getConfirmPassword()
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponse> me(Authentication authentication) {
        return ResponseEntity.ok(authService.getCurrentUserProfile(authentication.getName()));
    }

    private boolean isRateLimited(String key) {
        Instant now = Instant.now();
        Instant windowStart = now.minusSeconds(WINDOW_SECONDS);
        Deque<Instant> timestamps = rateLimitBuckets.computeIfAbsent(key, k -> new ConcurrentLinkedDeque<>());

        synchronized (timestamps) {
            while (!timestamps.isEmpty() && timestamps.peekFirst().isBefore(windowStart)) {
                timestamps.pollFirst();
            }
            if (timestamps.size() >= MAX_REQUESTS_PER_WINDOW) {
                return true;
            }
            timestamps.addLast(now);
            return false;
        }
    }

    private String extractClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}