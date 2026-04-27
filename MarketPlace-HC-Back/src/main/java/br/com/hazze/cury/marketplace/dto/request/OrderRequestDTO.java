package br.com.hazze.cury.marketplace.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

import java.util.List;

import static io.swagger.v3.oas.annotations.media.Schema.RequiredMode.REQUIRED;

public record OrderRequestDTO(

        @Schema(
                description = "Lista de itens do pedido de produtos de alfaiataria.",
                requiredMode = REQUIRED,
                example = """
                [
                  {
                    "productId": 1,
                    "quantity": 2
                  }
                ]
                """
        )
        @NotEmpty(message = "O pedido deve ter pelo menos 1 item.")
        @Size(min = 1, message = "O pedido deve ter pelo menos 1 item.")
        List<@Valid OrderItemRequestDTO> items

) {}