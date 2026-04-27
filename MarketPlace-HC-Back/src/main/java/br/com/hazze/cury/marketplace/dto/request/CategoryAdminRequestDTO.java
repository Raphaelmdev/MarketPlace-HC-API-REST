package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record CategoryAdminRequestDTO(

        @Schema(
                description = "Nome da categoria de produtos de alfaiataria.",
                example = "Ternos",
                requiredMode = REQUIRED
        )
        @NotBlank(message = "O nome da categoria é obrigatório.")
        @Size(min = 2, max = 100, message = "O nome deve ter entre 2 e 100 caracteres.")
        String name,

        @Schema(
                description = "Descrição da categoria.",
                example = "Categoria de ternos sob medida e modelos sociais."
        )
        @Size(max = 255, message = "A descrição deve ter no máximo 255 caracteres.")
        String description

) {}