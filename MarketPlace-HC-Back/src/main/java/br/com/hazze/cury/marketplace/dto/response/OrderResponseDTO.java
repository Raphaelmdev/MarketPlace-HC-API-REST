package br.com.hazze.cury.marketplace.dto.response;

import br.com.hazze.cury.marketplace.entities.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(

        @Schema(
                description = "ID do pedido.",
                example = "1"
        )
        Long id,

        @Schema(
                description = "Valor total do pedido.",
                example = "1799.80"
        )
        BigDecimal total,

        @Schema(
                description = "Status atual do pedido.",
                example = "PENDING"
        )
        OrderStatus status,

        @Schema(
                description = "ID do usuário que realizou o pedido.",
                example = "1"
        )
        Long userId,

        @Schema(
                description = "Lista de itens do pedido."
        )
        List<OrderItemResponseDTO> items,

        @Schema(
                description = "Data e hora de criação do pedido.",
                example = "2026-04-21T10:30:00"
        )
        LocalDateTime createdAt

) {}