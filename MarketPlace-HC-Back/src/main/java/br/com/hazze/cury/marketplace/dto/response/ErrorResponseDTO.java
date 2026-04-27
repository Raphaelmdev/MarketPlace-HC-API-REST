package br.com.hazze.cury.marketplace.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

public record ErrorResponseDTO(

        @Schema(
                description = "Código HTTP do erro.",
                example = "400"
        )
        int status,

        @Schema(
                description = "Tipo do erro.",
                example = "Bad Request"
        )
        String error,

        @Schema(
                description = "Mensagem detalhada do erro.",
                example = "email: O e-mail deve ser válido."
        )
        String message,

        @Schema(
                description = "Caminho da requisição que gerou o erro.",
                example = "/auth/login"
        )
        String path

) {}