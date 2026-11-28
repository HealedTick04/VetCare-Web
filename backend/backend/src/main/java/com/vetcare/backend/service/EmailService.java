package com.vetcare.backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@vetcare.local}")
    private String fromEmail;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public void sendPasswordResetEmail(String toEmail, String firstName, String rawToken) {
        String baseUrl = frontendUrl.endsWith("/")
                ? frontendUrl.substring(0, frontendUrl.length() - 1)
                : frontendUrl;
        String resetLink = baseUrl + "/reset-password?token=" + rawToken;

        String subject = "VetCare - Recuperación de contraseña";
        String htmlContent = buildRecoveryHtml(firstName, resetLink);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(
                    message,
                    MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                    StandardCharsets.UTF_8.name()
            );

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            // Nunca se registra el token ni el enlace completo en logs por seguridad
            log.info("Correo de recuperación de contraseña enviado a {}", toEmail);
        } catch (MessagingException | RuntimeException e) {
            log.error("Error al enviar correo de recuperación a {}: {}", toEmail, e.getMessage());
            throw new IllegalStateException("No se pudo enviar el correo de recuperación en este momento.");
        }
    }

    private String buildRecoveryHtml(String firstName, String resetLink) {
        String safeName = (firstName != null && !firstName.isBlank()) ? firstName : "Usuario";
        return """
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 560px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
                  <div style="background-color: #2c5e8a; padding: 24px; text-align: center; color: #ffffff;">
                    <h1 style="margin: 0; font-size: 22px; letter-spacing: 2px;">VETCARE</h1>
                    <p style="margin: 6px 0 0; font-size: 13px; opacity: 0.9;">Cuidando de quienes más quieres</p>
                  </div>
                  <div style="padding: 28px 24px; color: #1e293b; line-height: 1.6;">
                    <h2 style="margin-top: 0; font-size: 18px; color: #0f172a;">Hola, %s</h2>
                    <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>VetCare</strong>.</p>
                    <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
                    <div style="text-align: center; margin: 28px 0;">
                      <a href="%s" style="background-color: #3976a1; color: #ffffff; text-decoration: none; padding: 12px 26px; border-radius: 8px; font-weight: 600; display: inline-block;">
                        Restablecer contraseña
                      </a>
                    </div>
                    <p style="font-size: 13px; color: #475569;">
                      <strong>Importante:</strong> Este enlace es de un solo uso y expirará en <strong>30 minutos</strong>.
                    </p>
                    <p style="font-size: 13px; color: #64748b; border-top: 1px solid #e2e8f0; padding-top: 16px; margin-top: 24px;">
                      Si no solicitaste el cambio de contraseña, puedes ignorar este mensaje de forma segura. Tu contraseña actual no sufrirá cambios.
                    </p>
                  </div>
                </div>
                """.formatted(safeName, resetLink);
    }
}