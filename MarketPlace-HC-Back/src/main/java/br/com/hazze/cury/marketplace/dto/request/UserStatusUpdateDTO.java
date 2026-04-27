package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record UserStatusUpdateDTO(

        @Schema(
                description = "Define se o usuário está ativo ou inativo no sistema.",
                example = "false",
                requiredMode = REQUIRED
        )
        @NotNull(message = "O status ativo é obrigatório.")
        Boolean active

) {}