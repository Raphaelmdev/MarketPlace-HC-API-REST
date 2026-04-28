package br.com.hazze.cury.marketplace.controller;

import org.springframework.security.core.Authentication;
import br.com.hazze.cury.marketplace.dto.request.*;
import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.UserResponseDTO;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users", description = "Gerenciamento de usuários")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    /* ==============================
       CLIENTE
    ================================= */

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Buscar meu perfil", description = "Retorna os dados do usuário autenticado. Acesso: CLIENT")
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> findMe(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.findById(user.getId()));
    }

    /* 🔥 NOVO - ATUALIZAR PERFIL */
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar perfil", description = "Atualiza dados pessoais do cliente. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil atualizado",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/me/profile")
    public ResponseEntity<UserResponseDTO> updateProfile(
            Authentication authentication,
            @RequestBody @Valid UserClientUpdateDTO dto
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.updateProfile(user.getId(), dto));
    }

    /* 🔥 NOVO - ATUALIZAR ENDEREÇO */
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar endereço", description = "Atualiza endereço do cliente. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Endereço atualizado",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/me/address")
    public ResponseEntity<UserResponseDTO> updateAddress(
            Authentication authentication,
            @RequestBody @Valid UserAddressUpdateDTO dto
    ) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.updateAddress(user.getId(), dto));
    }

    /* ==============================
       ADMIN (mantido igual)
    ================================= */

    @PostMapping("/admin")
    public ResponseEntity<UserResponseDTO> createAdmin(
            @RequestBody @Valid UserAdminRequestDTO dto
    ) {
        return ResponseEntity.status(201).body(service.createAdmin(dto));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponseDTO> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid UserStatusUpdateDTO dto,
            Authentication authentication
    ) {
        User loggedUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                service.updateStatus(id, dto, loggedUser.getId())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}