package br.com.hazze.cury.marketplace.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ForgotPasswordRequestDTO(

        @Schema(
                description = "E-mail do usuário para envio do link de redefinição de senha.",
                example = "cliente@email.com",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "E-mail inválido.")
        String email

) {}