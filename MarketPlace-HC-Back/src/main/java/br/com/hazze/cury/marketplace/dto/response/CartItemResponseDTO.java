package br.com.hazze.cury.marketplace.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public record CartItemResponseDTO(

        @Schema(
                description = "ID do item do carrinho.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "ID do produto de alfaiataria.",
                example = "1"
        )
        Long productId,

        @Schema(
                description = "Nome do produto.",
                example = "Terno Slim Masculino"
        )
        String productName,

        @Schema(
                description = "Quantidade do produto no carrinho.",
                example = "2"
        )
        Integer quantity,

        @Schema(
                description = "Preço unitário do produto.",
                example = "899.90"
        )
        BigDecimal unitPrice,

        @Schema(
                description = "Subtotal do item (quantidade x preço).",
                example = "1799.80"
        )
        BigDecimal subTotal

) {}