package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.Security.JwtService;
import br.com.hazze.cury.marketplace.dto.auth.AuthenticationRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.LoginResponseDTO;
import br.com.hazze.cury.marketplace.dto.auth.RegisterRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.RegisterResponseDTO;
import br.com.hazze.cury.marketplace.entities.Role;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public boolean checkEmailExists(String email) {
        return repository.existsByEmail(email);
    }

    public LoginResponseDTO login(AuthenticationRequestDTO data) {

        User user;

        try {
            var auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            data.email(),
                            data.password()
                    )
            );

            user = (User) auth.getPrincipal();

        } catch (Exception e) {
            throw new BusinessException("Email ou senha inválidos.");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponseDTO(
                token,
                "Bearer",
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public RegisterResponseDTO register(RegisterRequestDTO data) {
        if (repository.existsByEmail(data.email())) {
            throw new BusinessException("Email já cadastrado.");
        }

        if (repository.existsByCpf(data.cpf())) {
            throw new BusinessException("CPF já cadastrado.");
        }

        String encryptedPassword = passwordEncoder.encode(data.password());

        User newUser = new User();
        newUser.setEmail(data.email());
        newUser.setPassword(encryptedPassword);
        newUser.setRole(Role.CLIENT);
        newUser.setActive(true);

        newUser.setName(data.name());
        newUser.setCpf(data.cpf());
        newUser.setCep(data.cep());
        newUser.setPhone(data.phone());

        newUser.setStreet(data.street());
        newUser.setNumber(data.number());
        newUser.setComplement(data.complement());
        newUser.setNeighborhood(data.neighborhood());
        newUser.setCity(data.city());
        newUser.setState(data.state());

        User savedUser = repository.save(newUser);

        return new RegisterResponseDTO(
                savedUser.getId(),
                savedUser.getName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getCpf(),
                savedUser.getCep(),
                savedUser.getActive(),
                savedUser.getRole(),
                savedUser.getCreatedAt()
        );
    }
}