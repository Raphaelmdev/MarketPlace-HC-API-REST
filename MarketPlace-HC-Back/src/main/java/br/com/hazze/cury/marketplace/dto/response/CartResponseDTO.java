package br.com.hazze.cury.marketplace.dto.response;

import br.com.hazze.cury.marketplace.entities.CartStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

public record CartResponseDTO(

        @Schema(
                description = "ID do carrinho.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "Valor total do carrinho.",
                example = "1799.80"
        )
        BigDecimal total,

        @Schema(
                description = "Status atual do carrinho.",
                example = "ACTIVE"
        )
        CartStatus status,

        @Schema(
                description = "ID do usuário dono do carrinho.",
                example = "1"
        )
        Long userId,

        @Schema(
                description = "Lista de itens adicionados ao carrinho."
        )
        List<CartItemResponseDTO> items

) {}