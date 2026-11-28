package com.vetcare.backend.service;

import com.vetcare.backend.dto.auth.AuthDtos.*;
import com.vetcare.backend.entity.*;
import com.vetcare.backend.exception.BusinessRuleException;
import com.vetcare.backend.exception.ResourceNotFoundException;
import com.vetcare.backend.repository.*;
import com.vetcare.backend.security.CustomUserDetails;
import com.vetcare.backend.security.JwtService;
import com.vetcare.backend.service.notification.EmailNotificationService;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final RevokedTokenRepository revokedTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailNotificationService emailService;
    private final NotificationRepository notificationRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessRuleException("El correo electrónico ya está registrado");
        }

        Role clientRole = roleRepository.findByName("CLIENT")
                .orElseThrow(() -> new ResourceNotFoundException("Rol CLIENT no encontrado en la base de datos"));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(clientRole)
                .active(true)
                .build();

        userRepository.save(user);

        notificationRepository.save(Notification.builder()
                .user(user)
                .title("Bienvenido a VetCare")
                .message("Exito " + user.getFirstName() + ", tu cuenta ha sido creada exitosamente.")
                .type("Bienvenido")
                .build());

        emailService.sendEmail(
                user.getEmail(),
                "Bienvenido a VetCare",
                "Exito " + user.getFirstName() + ", tu cuenta en VetCare ha sido creada exitosamente."
        );

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwt = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .user(mapToProfile(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

        if (!Boolean.TRUE.equals(user.getActive())) {
            throw new BusinessRuleException("La cuenta se encuentra desactivada");
        }

        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwt = jwtService.generateToken(userDetails);

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .user(mapToProfile(user))
                .build();
    }

    @Transactional
    public void logout(String authHeader) {
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (!revokedTokenRepository.existsByToken(token)) {
                RevokedToken revoked = RevokedToken.builder()
                        .token(token)
                        .expiresAt(jwtService.extractExpirationAsLocalDateTime(token))
                        .build();
                revokedTokenRepository.save(revoked);
            }
        }
    }

    public UserProfileResponse getCurrentUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return mapToProfile(user);
    }

    public UserProfileResponse mapToProfile(User user) {
        return UserProfileResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .avatarUrl(user.getAvatarUrl())
                .role(user.getRole().getName())
                .active(user.getActive())
                .build();
    }
}