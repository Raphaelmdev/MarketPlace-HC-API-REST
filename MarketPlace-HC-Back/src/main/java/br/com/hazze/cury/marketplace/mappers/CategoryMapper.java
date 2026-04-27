package br.com.hazze.cury.marketplace.mappers;

import br.com.hazze.cury.marketplace.dto.request.CategoryAdminRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CategoryResponseDTO;
import br.com.hazze.cury.marketplace.entities.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "products", ignore = true)
    Category toEntity(CategoryAdminRequestDTO dto);

    CategoryResponseDTO toResponse(Category category);

    List<CategoryResponseDTO> toResponseList(List<Category> categories);
}
