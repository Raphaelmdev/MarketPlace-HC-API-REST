package br.com.hazze.cury.marketplace.dto.auth;

import br.com.hazze.cury.marketplace.entities.Role;
import io.swagger.v3.oas.annotations.media.Schema;

public record LoginResponseDTO(

        @Schema(example = "eyJhbGciOiJIUzI1NiJ9...")
        String token,

        @Schema(example = "Bearer")
        String type,

        @Schema(example = "1")
        Long id,

        @Schema(example = "Seu Nome")
        String name,

        @Schema(example = "seuemail@email.com")
        String email,

        @Schema(example = "CLIENT")
        Role role
) {
}