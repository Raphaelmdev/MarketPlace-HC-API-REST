package br.com.hazze.cury.marketplace.dto.response;

import br.com.hazze.cury.marketplace.entities.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record UserResponseDTO(

        @Schema(
                description = "ID do usuário.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "Nome do usuário.",
                example = "Cliente Exemplo"
        )
        String name,

        @Schema(
                description = "E-mail do usuário.",
                example = "cliente@email.com"
        )
        String email,

        @Schema(
                description = "Telefone do usuário (somente números).",
                example = "11999999999"
        )
        String phone,

        @Schema(
                description = "CPF do usuário (somente números).",
                example = "12345678901"
        )
        String cpf,

        @Schema(
                description = "CEP do usuário (somente números).",
                example = "01001000"
        )
        String cep,

        @Schema(
                description = "Rua do endereço.",
                example = "Rua das Flores"
        )
        String street,

        @Schema(
                description = "Número do endereço.",
                example = "123"
        )
        String number,

        @Schema(
                description = "Complemento do endereço.",
                example = "Apto 12, Bloco B"
        )
        String complement,

        @Schema(
                description = "Bairro.",
                example = "Centro"
        )
        String neighborhood,

        @Schema(
                description = "Cidade.",
                example = "Rio de Janeiro"
        )
        String city,

        @Schema(
                description = "Estado (UF).",
                example = "RJ"
        )
        String state,

        @Schema(
                description = "Indica se o usuário está ativo.",
                example = "true"
        )
        Boolean active,

        @Schema(
                description = "Papel do usuário (ADMIN ou CLIENT).",
                example = "CLIENT"
        )
        Role role,

        @Schema(
                description = "Data e hora de criação do usuário.",
                example = "2026-04-21T10:30:00"
        )
        LocalDateTime createdAt

) {}