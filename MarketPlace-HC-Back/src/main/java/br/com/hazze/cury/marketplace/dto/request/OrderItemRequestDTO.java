package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record OrderItemRequestDTO(

        @Schema(
                description = "ID do produto de alfaiataria incluído no pedido.",
                example = "1",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O ID do produto é obrigatório.")
        @Min(value = 1, message = "O ID do produto deve ser maior que zero.")
        Long productId,

        @Schema(
                description = "Quantidade do produto no pedido.",
                example = "2",
                requiredMode = REQUIRED
        )
        @NotNull(message = "A quantidade é obrigatória.")
        @Min(value = 1, message = "A quantidade deve ser no mínimo 1.")
        Integer quantity

) {}