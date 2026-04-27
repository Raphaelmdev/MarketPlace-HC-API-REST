package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record UserClientRequestDTO(

        @Schema(
                description = "Nome completo do cliente.",
                example = "Cliente Exemplo",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O nome é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String name,

        @Schema(
                description = "E-mail do cliente.",
                example = "cliente@email.com",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail deve ser válido.")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
        String email,

        @Schema(
                description = "Senha do cliente (mínimo 6 caracteres, com letras e números).",
                example = "Senha123",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A senha é obrigatória.")
        @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d)\\S{6,}$",
                message = "A senha deve conter no mínimo 6 caracteres, incluindo letras e números."
        )
        String password,

        @Schema(
                description = "Telefone do cliente (somente números).",
                example = "11999999999"
        )
        @Pattern(regexp = "^\\d{10,11}$", message = "O telefone deve conter 10 ou 11 números.")
        String phone,

        @Schema(
                description = "CPF do cliente (somente números).",
                example = "12345678901",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O CPF é obrigatório.")
        @Pattern(regexp = "^\\d{11}$", message = "O CPF deve conter exatamente 11 números.")
        String cpf,

        @Schema(
                description = "CEP do cliente (somente números).",
                example = "01001000",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O CEP é obrigatório.")
        @Pattern(regexp = "^\\d{8}$", message = "O CEP deve conter 8 números.")
        String cep,

        @Schema(
                description = "Rua do endereço.",
                example = "Rua das Flores",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A rua é obrigatória.")
        @Size(max = 150, message = "A rua deve ter no máximo 150 caracteres.")
        String street,

        @Schema(
                description = "Número do endereço.",
                example = "123",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O número é obrigatório.")
        @Pattern(regexp = "^\\d+[A-Za-z0-9-]*$", message = "Número inválido.")
        String number,

        @Schema(
                description = "Complemento do endereço.",
                example = "Apto 12, Bloco B"
        )
        @Size(max = 100, message = "O complemento deve ter no máximo 100 caracteres.")
        String complement,

        @Schema(
                description = "Bairro.",
                example = "Centro",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O bairro é obrigatório.")
        @Size(max = 100, message = "O bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(
                description = "Cidade.",
                example = "Rio de Janeiro",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A cidade é obrigatória.")
        @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres.")
        String city,

        @Schema(
                description = "Estado (UF).",
                example = "RJ",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A UF é obrigatória.")
        @Size(min = 2, max = 2, message = "A UF deve ter 2 caracteres.")
        @Pattern(regexp = "^[A-Z]{2}$", message = "A UF deve estar no formato RJ, SP, etc.")
        String state

) {}