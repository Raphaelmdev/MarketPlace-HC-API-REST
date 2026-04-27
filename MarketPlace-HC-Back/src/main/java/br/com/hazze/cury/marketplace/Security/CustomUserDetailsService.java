package br.com.hazze.cury.marketplace.Security;

import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.stereotype.Service;

@AllArgsConstructor
@Getter
@Setter
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws ResourceNotFoundException {
        User user = repository.findByEmail(username)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));
        return user;
    }
}
