package br.com.hazze.cury.marketplace.mappers;

import br.com.hazze.cury.marketplace.dto.request.OrderItemRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.OrderItemResponseDTO;
import br.com.hazze.cury.marketplace.entities.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderItemMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    @Mapping(target = "subTotal", ignore = true)
    OrderItem toEntity(OrderItemRequestDTO dto);

    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    OrderItemResponseDTO toResponse(OrderItem orderItem);

    List<OrderItemResponseDTO> toResponseList(List<OrderItem> orderItems);
}
