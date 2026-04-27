package br.com.hazze.cury.marketplace.config;

import br.com.hazze.cury.marketplace.entities.Role;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class InitializerConfiguration {

    @Bean
    CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            boolean adminExists = userRepository.findByEmail("admin@email.com").isPresent();

            if (!adminExists) {
                User admin = new User();
                admin.setName("Administrador");
                admin.setEmail("admin@email.com");
                admin.setPassword(passwordEncoder.encode("123456"));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);

                userRepository.save(admin);
            }
        };
    }
}
