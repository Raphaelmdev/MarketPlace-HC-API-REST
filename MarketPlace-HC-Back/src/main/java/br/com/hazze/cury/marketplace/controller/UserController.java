package br.com.hazze.cury.marketplace.controller;

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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Users", description = "Gerenciamento de usuários")
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService service;

    /* ==============================
       PRÓPRIO USUÁRIO
    ================================= */

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Buscar meu perfil",
            description = "Retorna os dados do usuário autenticado. Acesso: CLIENT ou ADMIN"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil retornado com sucesso",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/me")
    public ResponseEntity<UserResponseDTO> findMe(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.findById(user.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Atualizar meu perfil",
            description = "Atualiza dados pessoais do usuário autenticado. Acesso: CLIENT ou ADMIN"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Perfil atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou regra de negócio inválida",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
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

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Atualizar meu endereço",
            description = "Atualiza endereço do cliente autenticado. Acesso: CLIENT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Endereço atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
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
       ADMIN
    ================================= */

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Criar administrador", description = "Cria um novo usuário administrador. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Administrador criado com sucesso",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/admin")
    public ResponseEntity<UserResponseDTO> createAdmin(
            @RequestBody @Valid UserAdminRequestDTO dto
    ) {
        return ResponseEntity.status(201).body(service.createAdmin(dto));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Listar usuários", description = "Retorna todos os usuários. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Buscar usuário por ID", description = "Retorna um usuário específico. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário encontrado",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar status do usuário", description = "Ativa ou desativa um usuário. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Status atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = UserResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou regra de negócio inválida",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
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

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Remover usuário", description = "Remove um usuário. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Usuário removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
   @DeleteMapping("/{id}")
        public ResponseEntity<Void> delete(
                @PathVariable Long id,
                Authentication authentication
        ) {
        User loggedUser = (User) authentication.getPrincipal();

        service.delete(id, loggedUser.getId());

        return ResponseEntity.noContent().build();
}
    }
