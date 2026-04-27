package br.com.hazze.cury.marketplace.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record CategoryResponseDTO(

        @Schema(
                description = "ID da categoria.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "Nome da categoria de alfaiataria.",
                example = "Ternos"
        )
        String name,

        @Schema(
                description = "Descrição da categoria.",
                example = "Categoria de ternos sob medida e modelos sociais."
        )
        String description

) {}