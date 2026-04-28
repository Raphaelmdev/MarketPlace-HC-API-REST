package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record UserAddressUpdateDTO(

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
                example = "Apto 12"
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
                example = "São Paulo",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A cidade é obrigatória.")
        @Size(max = 100, message = "A cidade deve ter no máximo 100 caracteres.")
        String city,

        @Schema(
                description = "Estado (UF).",
                example = "SP",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "A UF é obrigatória.")
        @Size(min = 2, max = 2, message = "A UF deve ter 2 caracteres.")
        @Pattern(regexp = "^[A-Z]{2}$", message = "A UF deve estar no formato RJ, SP, etc.")
        String state

) {}