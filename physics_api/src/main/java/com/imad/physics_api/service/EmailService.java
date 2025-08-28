package com.imad.physics_api.service;

import com.imad.physics_api.model.entity.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;  // ✅ Correct import
import org.thymeleaf.context.Context; // ✅ Correct import

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Value("${app.mail.sender}")
    private String fromEmail;

    @Value("${app.mail.sender-name}")
    private String fromName;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    public void sendPasswordResetEmail(User user, String resetToken) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(fromEmail, fromName);
            helper.setTo(user.getEmail());
            helper.setSubject("Réinitialisation de votre mot de passe - Physics API");

            Context context = new Context();
            context.setVariable("userName", user.getFirstName());
            context.setVariable("resetLink", frontendBaseUrl + "/reset-password?token=" + resetToken);
            context.setVariable("expiryTime", "1 heure");

            String htmlContent = templateEngine.process("password-reset-email", context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

            logger.info("Password reset email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Failed to send password reset email to: {}", user.getEmail(), e);
            throw new RuntimeException("Failed to send password reset email");
        }
    }

    public void sendPasswordChangeConfirmationEmail(User user) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

            helper.setFrom(fromEmail, fromName);
            helper.setTo(user.getEmail());
            helper.setSubject("Confirmation de changement de mot de passe - Physics API");

            Context context = new Context();
            context.setVariable("userName", user.getFirstName());

            String htmlContent = templateEngine.process("password-change-confirmation", context);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);

            logger.info("Password change confirmation email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Failed to send password change confirmation email to: {}", user.getEmail(), e);
        }
    }
}