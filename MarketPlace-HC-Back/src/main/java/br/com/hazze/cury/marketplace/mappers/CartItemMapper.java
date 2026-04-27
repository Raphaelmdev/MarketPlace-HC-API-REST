package br.com.hazze.cury.marketplace.mappers;

import br.com.hazze.cury.marketplace.dto.request.CartItemRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CartItemResponseDTO;
import br.com.hazze.cury.marketplace.entities.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CartItemMapper {

        @Mapping(target = "id", ignore = true)
        @Mapping(target = "cart", ignore = true)
        @Mapping(target = "product", ignore = true)
        @Mapping(target = "unitPrice", ignore = true)
        @Mapping(target = "subTotal", ignore = true)
        CartItem toEntity(CartItemRequestDTO dto);

        @Mapping(source = "product.id", target = "productId")
        @Mapping(source = "product.name", target = "productName")
        CartItemResponseDTO toResponse(CartItem cartItem);

        List<CartItemResponseDTO> toResponseList(List<CartItem> cartItems);
}

