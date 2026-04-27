package br.com.hazze.cury.marketplace.mappers;

import br.com.hazze.cury.marketplace.dto.request.CartRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CartResponseDTO;
import br.com.hazze.cury.marketplace.entities.Cart;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = CartItemMapper.class)
public interface CartMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "total", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "items", ignore = true)
    Cart toEntity(CartRequestDTO dto);

    @Mapping(source = "user.id", target = "userId")
    CartResponseDTO toResponse(Cart cart);

    List<CartResponseDTO> toResponseList(List<Cart> carts);
}
