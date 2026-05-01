package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record UserClientUpdateDTO(

        @Schema(
                description = "Nome completo do cliente.",
                example = "Seu Nome",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O nome é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String name,

        @Schema(
                description = "E-mail do cliente.",
                example = "seuemail@email.com",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail deve ser válido.")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
        String email,

        @Schema(
                description = "Telefone do cliente somente com números.",
                example = "11999999999"
        )
        @Pattern(regexp = "^$|^\\d{10,11}$", message = "O telefone deve conter 10 ou 11 números.")
        String phone,

        @Schema(
                description = "Nova senha do cliente. Envie apenas se quiser alterar a senha.",
                example = "abc123"
        )
        @Size(min = 6, message = "A senha deve ter no mínimo 6 caracteres.")
        String password

) {}