package br.com.hazze.cury.marketplace.controller;

import br.com.hazze.cury.marketplace.dto.auth.ForgotPasswordRequestDTO;
import br.com.hazze.cury.marketplace.dto.auth.ResetPasswordRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.service.PasswordResetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class PasswordResetController {

    private final PasswordResetService service;

    @Operation(
            summary = "Solicitar recuperação de senha",
            description = "Gera um link temporário para redefinição de senha. " +
                    "Por segurança, a resposta não informa se o email está cadastrado. " +
                    "Se existir uma conta vinculada, o link será retornado para fins de demonstração. Acesso: PÚBLICO"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Solicitação processada com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(
            @RequestBody @Valid ForgotPasswordRequestDTO dto
    ) {
        String resetLink = service.forgotPassword(dto);

        if (resetLink == null) {
            return ResponseEntity.ok(Map.of(
                    "message", "Se houver uma conta vinculada a este email, o link será exibido abaixo."
            ));
        }

        return ResponseEntity.ok(Map.of(
                "message", "Link de recuperação gerado com sucesso.",
                "link", resetLink
        ));
    }

    @Operation(
            summary = "Redefinir senha",
            description = "Redefine a senha do usuário utilizando um token temporário válido. Acesso: PÚBLICO"
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Senha redefinida com sucesso"
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Token inválido, expirado ou dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            @RequestBody @Valid ResetPasswordRequestDTO dto
    ) {
        service.resetPassword(dto);

        return ResponseEntity.ok(Map.of(
                "message", "Senha redefinida com sucesso."
        ));
    }
}