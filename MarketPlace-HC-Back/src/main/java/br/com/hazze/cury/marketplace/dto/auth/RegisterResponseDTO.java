package br.com.hazze.cury.marketplace.dto.auth;

import br.com.hazze.cury.marketplace.entities.Role;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record RegisterResponseDTO(
        @Schema(example = "1")
        Long id,

        @Schema(example = "Seu Nome")
        String name,

        @Schema(example = "seuemail@email.com")
        String email,

        @Schema(example = "11999999999")
        String phone,

        @Schema(example = "12345678901")
        String cpf,

        @Schema(example = "12345678")
        String cep,

        @Schema(example = "true")
        Boolean active,

        @Schema(example = "CLIENT")
        Role role,

        @Schema(example = "2026-04-21T10:30:00")
        LocalDateTime createdAt
) {
}