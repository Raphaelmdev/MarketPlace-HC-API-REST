package br.com.hazze.cury.marketplace.dto.request;

import br.com.hazze.cury.marketplace.entities.OrderStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record OrderStatusUpdateDTO(

        @Schema(
                description = "Novo status do pedido (ex: PENDING, PAID, SHIPPED, DELIVERED, CANCELED).",
                example = "PAID",
                allowableValues = {"PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELED"},
                requiredMode = REQUIRED
        )
        @NotNull(message = "O status é obrigatório.")
        OrderStatus status

) {}