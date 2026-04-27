package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.request.UserAdminRequestDTO;
import br.com.hazze.cury.marketplace.dto.request.UserClientRequestDTO;
import br.com.hazze.cury.marketplace.dto.request.UserStatusUpdateDTO;
import br.com.hazze.cury.marketplace.dto.response.UserResponseDTO;
import br.com.hazze.cury.marketplace.entities.Role;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.UserMapper;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponseDTO createAdmin(UserAdminRequestDTO dto) {
        validateEmail(dto.email());

        User user = userMapper.toEntity(dto);

        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setRole(Role.ADMIN);
        user.setActive(true);

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> findAll() {
        return userMapper.toResponseList(userRepository.findAll());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO findById(Long id) {
        User user = findEntityById(id);
        return userMapper.toResponse(user);
    }

    @Transactional
    public UserResponseDTO update(Long id, UserClientRequestDTO dto) {
        User user = findEntityById(id);

        if (!user.getEmail().equals(dto.email()) && userRepository.existsByEmail(dto.email())) {
            throw new BusinessException("Já existe um usuário com esse e-mail.");
        }

        if (dto.cpf() != null && !dto.cpf().equals(user.getCpf()) && userRepository.existsByCpf(dto.cpf())) {
            throw new BusinessException("Já existe um usuário com esse CPF.");
        }

        user.setName(dto.name());
        user.setEmail(dto.email());
        user.setPassword(passwordEncoder.encode(dto.password()));
        user.setPhone(dto.phone());
        user.setCpf(dto.cpf());

        user.setCep(dto.cep());
        user.setStreet(dto.street());
        user.setNeighborhood(dto.neighborhood());
        user.setCity(dto.city());
        user.setState(dto.state());
        user.setNumber(dto.number());
        user.setComplement(dto.complement());

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public UserResponseDTO updateStatus(Long id, UserStatusUpdateDTO dto, Long authenticatedUserId) {
        User user = findEntityById(id);

        if (user.getId().equals(authenticatedUserId) && Boolean.FALSE.equals(dto.active())) {
            throw new BusinessException("Você não pode desativar sua própria conta.");
        }

        user.setActive(dto.active());

        return userMapper.toResponse(userRepository.save(user));
    }

    @Transactional
    public void delete(Long id) {
        User user = findEntityById(id);
        userRepository.delete(user);
    }

    private void validateEmail(String email) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Já existe um usuário com esse e-mail.");
        }
    }

    private void validateEmailAndCpf(String email, String cpf) {
        if (userRepository.existsByEmail(email)) {
            throw new BusinessException("Já existe um usuário com esse e-mail.");
        }

        if (cpf != null && userRepository.existsByCpf(cpf)) {
            throw new BusinessException("Já existe um usuário com esse CPF.");
        }
    }

    private User findEntityById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }
}