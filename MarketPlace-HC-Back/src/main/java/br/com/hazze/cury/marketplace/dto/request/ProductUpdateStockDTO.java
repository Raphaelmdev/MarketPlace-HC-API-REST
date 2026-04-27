package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ProductUpdateStockDTO(

        @Schema(
                description = "Nova quantidade em estoque do produto de alfaiataria.",
                example = "25",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O estoque é obrigatório.")
        @PositiveOrZero(message = "O estoque deve ser zero ou maior.")
        Integer stock

) {}