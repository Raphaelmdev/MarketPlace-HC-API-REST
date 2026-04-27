package br.com.hazze.cury.marketplace.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductResponseDTO(

        @Schema(
                description = "ID do produto.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "Nome do produto de alfaiataria.",
                example = "Terno Slim Masculino"
        )
        String name,

        @Schema(
                description = "Descrição do produto.",
                example = "Terno slim sob medida em tecido Oxford premium."
        )
        String description,

        @Schema(
                description = "Preço do produto.",
                example = "899.90"
        )
        BigDecimal price,

        @Schema(
                description = "Quantidade disponível em estoque.",
                example = "10"
        )
        Integer stock,

        @Schema(
                description = "Indica se o produto está ativo.",
                example = "true"
        )
        Boolean active,

        @Schema(
                description = "URL da imagem do produto.",
                example = "https://site.com/imagens/terno-slim.png"
        )
        String imageUrl,

        @Schema(
                description = "ID da categoria do produto.",
                example = "1"
        )
        Long categoryId,

        @Schema(
                description = "Nome da categoria.",
                example = "Ternos"
        )
        String categoryName,

        @Schema(
                description = "Data e hora de criação do produto.",
                example = "2026-04-21T10:30:00"
        )
        LocalDateTime createdAt

) {}