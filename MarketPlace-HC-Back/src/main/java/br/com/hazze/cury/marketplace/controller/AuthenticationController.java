package br.com.hazze.cury.marketplace.controller;

import br.com.hazze.cury.marketplace.dto.auth.AuthenticationRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.LoginResponseDTO;
import br.com.hazze.cury.marketplace.dto.auth.RegisterRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.RegisterResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.CheckEmailResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "Autenticação e cadastro")
@RequiredArgsConstructor
@RestController
@RequestMapping("auth")
public class AuthenticationController {

    private final AuthService authService;

    @Operation(
            summary = "Verificar email cadastrado",
            description = "Verifica se um email já existe no sistema. Usado para direcionar o usuário para login ou cadastro. Acesso: PÚBLICO"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Verificação realizada com sucesso",
                    content = @Content(schema = @Schema(implementation = CheckEmailResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Email inválido ou parâmetro ausente",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @GetMapping("/check-email")
    public ResponseEntity<CheckEmailResponseDTO> checkEmail(@RequestParam String email) {
        boolean exists = authService.checkEmailExists(email);
        return ResponseEntity.ok(new CheckEmailResponseDTO(exists));
    }

    @Operation(summary = "Realizar login", description = "Autentica o usuário e retorna o token JWT. Acesso: PÚBLICO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login realizado com sucesso",
                    content = @Content(schema = @Schema(implementation = LoginResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Credenciais inválidas",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid AuthenticationRequestDTO data) {
        return ResponseEntity.ok(authService.login(data));
    }

    @Operation(summary = "Cadastrar usuário", description = "Cria um novo usuário no sistema. Acesso: PÚBLICO")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário criado com sucesso",
                    content = @Content(schema = @Schema(implementation = RegisterResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/register")
    public ResponseEntity<RegisterResponseDTO> register(@RequestBody @Valid RegisterRequestDTO data) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(authService.register(data));
    }
}