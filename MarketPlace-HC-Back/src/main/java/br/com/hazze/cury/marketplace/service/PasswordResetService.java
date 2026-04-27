package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.auth.ForgotPasswordRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.ResetPasswordRequestDTO;
import br.com.hazze.cury.marketplace.entities.PasswordResetToken;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.repositories.PasswordResetTokenRepository;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.reset-password.expiration-minutes}")
    private int expirationMinutes;

    @Transactional
    public String forgotPassword(ForgotPasswordRequestDTO dto) {
        User user = userRepository.findByEmail(dto.email())
                .orElse(null);

        if (user == null) {
            return null;
        }

        var existingToken = tokenRepository.findByUser(user);

        if (existingToken.isPresent()) {
            PasswordResetToken oldToken = existingToken.get();

            if (!oldToken.isUsed() && oldToken.getExpiresAt().isAfter(LocalDateTime.now())) {
                throw new BusinessException(
                        "Já existe um link de recuperação válido. Aguarde ele expirar para solicitar outro."
                );
            }

            tokenRepository.delete(oldToken);
            tokenRepository.flush();
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(expirationMinutes))
                .used(false)
                .build();

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        System.out.println("Link de recuperação: " + resetLink);

        return resetLink;
    }

    @Transactional
    public void resetPassword(ResetPasswordRequestDTO dto) {
        PasswordResetToken resetToken = tokenRepository.findByToken(dto.token())
                .orElseThrow(() -> new BusinessException("Token inválido."));

        if (resetToken.isUsed()) {
            throw new BusinessException("Token já utilizado.");
        }

        if (resetToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Token expirado.");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(dto.newPassword()));
        resetToken.setUsed(true);

        userRepository.save(user);
        tokenRepository.save(resetToken);
    }
}