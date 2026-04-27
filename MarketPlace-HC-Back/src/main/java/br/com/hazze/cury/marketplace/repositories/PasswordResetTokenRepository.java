package br.com.hazze.cury.marketplace.repositories;

import br.com.hazze.cury.marketplace.entities.PasswordResetToken;
import br.com.hazze.cury.marketplace.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    Optional<PasswordResetToken> findByToken(String token);

    Optional<PasswordResetToken> findByUser(User user);
}