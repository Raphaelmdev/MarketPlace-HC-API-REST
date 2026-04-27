package br.com.hazze.cury.marketplace.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

public record RegisterRequestDTO(

        @Schema(example = "Seu Nome")
        @NotBlank(message = "O nome é obrigatório.")
        @Size(min = 3, max = 100, message = "O nome deve ter entre 3 e 100 caracteres.")
        String name,

        @Schema(example = "seuemail@email.com")
        @NotBlank(message = "O e-mail é obrigatório.")
        @Email(message = "O e-mail deve ser válido.")
        @Size(max = 150, message = "O e-mail deve ter no máximo 150 caracteres.")
        String email,

        @Schema(example = "abc123")
        @NotBlank(message = "A senha é obrigatória.")
        @Size(min = 6, max = 255, message = "A senha deve ter entre 6 e 255 caracteres.")
        @Pattern(
                regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$",
                message = "A senha deve conter pelo menos uma letra e um número."
        )
        String password,

        @Schema(example = "11999999999")
        @Pattern(
                regexp = "^$|^\\d{10,11}$",
                message = "O telefone deve conter 10 ou 11 números."
        )
        String phone,

        @Schema(example = "12345678901")
        @NotBlank(message = "O cpf é obrigatório")
        @Pattern(
                regexp = "^$|^\\d{11}$",
                message = "O CPF deve conter exatamente 11 números."
        )
        String cpf,

        @Schema(example = "12345678")
        @NotBlank(message = "O CEP é obrigatório.")
        @Pattern(
                regexp = "^\\d{8}$",
                message = "O CEP deve conter 8 números."
        )
        String cep,

        @Schema(example = "Rua Exemplo")
        @NotBlank(message = "A rua é obrigatória.")
        @Size(max = 150, message = "Rua deve ter no máximo 150 caracteres.")
        String street,

        @Schema(example = "123")
        @NotBlank(message = "O número é obrigatório.")
        @Pattern(
                regexp = "^\\d+[A-Za-z0-9-]*$",
                message = "Número inválido."
        )
        String number,

        @Schema(example = "Apto 12, Bloco B")
        @Size(max = 100, message = "Complemento deve ter no máximo 100 caracteres.")
        String complement,

        @Schema(example = "Centro")
        @NotBlank(message = "O bairro é obrigatório.")
        @Size(max = 100, message = "Bairro deve ter no máximo 100 caracteres.")
        String neighborhood,

        @Schema(example = "Rio de Janeiro")
        @NotBlank(message = "A cidade é obrigatória.")
        @Size(max = 100, message = "Cidade deve ter no máximo 100 caracteres.")
        String city,

        @Schema(example = "SP")
        @NotBlank(message = "A UF é obrigatória.")
        @Size(min = 2, max = 2)
        @Pattern(
                regexp = "^[A-Z]{2}$",
                message = "UF deve estar no formato SP, RJ, etc."
        )
        String state
) {}