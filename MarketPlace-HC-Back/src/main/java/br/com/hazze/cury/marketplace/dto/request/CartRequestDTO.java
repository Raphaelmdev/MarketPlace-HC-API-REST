package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;

public record CartRequestDTO(

        @Schema(
                description = "Carrinho do usuário autenticado. O usuário é obtido automaticamente pelo token JWT."
        )
        String info // opcional, pode até remover o DTO inteiro

) {}