package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record ProductAdminRequestDTO(

        @Schema(
                description = "Nome do produto deaalfaiataria.",
                example = "Terno Slim Masculino",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O nome do produto é obrigatório.")
        @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
        String name,

        @Schema(
                description = "Descrição detalhada do produto.",
                example = "Terno slim sob medida em tecido Oxford premium."
        )
        @Size(max = 1000, message = "A descrição deve ter no máximo 1000 caracteres.")
        String description,

        @Schema(
                description = "Preço do produto.",
                example = "899.90",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O preço é obrigatório.")
        @DecimalMin(value = "0.01", message = "O preço deve ser maior que zero.")
        BigDecimal price,

        @Schema(
                description = "Quantidade disponível em estoque.",
                example = "10",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O estoque é obrigatório.")
        @PositiveOrZero(message = "O estoque deve ser zero ou maior.")
        Integer stock,

        @Schema(
                description = "Indica se o produto está ativo para venda.",
                example = "true",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O status ativo é obrigatório.")
        Boolean active,

        @Schema(
                description = "ID da categoria do produto.",
                example = "1",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O ID da categoria é obrigatório.")
        Long categoryId

) {}