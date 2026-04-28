package br.com.hazze.cury.marketplace.mappers;

import br.com.hazze.cury.marketplace.dto.request.*;
import br.com.hazze.cury.marketplace.dto.response.UserResponseDTO;
import br.com.hazze.cury.marketplace.entities.User;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "active", constant = "true")
    @Mapping(target = "role", expression = "java(br.com.hazze.cury.marketplace.entities.Role.CLIENT)")
    User toEntity(UserClientRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "phone", ignore = true)
    @Mapping(target = "cep", ignore = true)
    @Mapping(target = "cpf", ignore = true)
    @Mapping(target = "street", ignore = true)
    @Mapping(target = "neighborhood", ignore = true)
    @Mapping(target = "city", ignore = true)
    @Mapping(target = "state", ignore = true)
    @Mapping(target = "number", ignore = true)
    @Mapping(target = "complement", ignore = true)
    @Mapping(target = "active", ignore = true)
    @Mapping(target = "role", ignore = true)
    User toEntity(UserAdminRequestDTO dto);


    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateProfileFromDTO(UserClientUpdateDTO dto, @MappingTarget User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "cart", ignore = true)
    @Mapping(target = "orders", ignore = true)
    @Mapping(target = "role", ignore = true)
    @Mapping(target = "active", ignore = true)
    void updateAddressFromDTO(UserAddressUpdateDTO dto, @MappingTarget User user);

 
    UserResponseDTO toResponse(User user);

    List<UserResponseDTO> toResponseList(List<User> users);
}