package br.com.hazze.cury.marketplace.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AuthenticationRequestDTO(

        @Schema(example = "seuemail@email.com")
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail deve ser válido.")
        String email,

        @Schema(example = "abc123")
        @NotBlank(message = "A senha é obrigatória.")
        String password
) {
}