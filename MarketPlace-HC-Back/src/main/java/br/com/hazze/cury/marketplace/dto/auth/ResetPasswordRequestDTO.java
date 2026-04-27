package br.com.hazze.cury.marketplace.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ResetPasswordRequestDTO(

        @Schema(
                description = "Token de redefinição de senha enviado ao usuário.",
                example = "abc123-token-reset",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O token é obrigatório.")
        String token,

        @Schema(
                description = "Nova senha do usuário (mínimo 6 caracteres, com letras e números).",
                example = "Senha123",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A nova senha é obrigatória.")
        @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)\\S{6,}$",
                message = "A senha deve conter no mínimo 6 caracteres, incluindo letras e números."
        )
        String newPassword

) {}