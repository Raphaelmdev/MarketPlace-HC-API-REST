package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.request.CategoryAdminRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CategoryResponseDTO;
import br.com.hazze.cury.marketplace.entities.Category;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.CategoryMapper;
import br.com.hazze.cury.marketplace.repositories.CategoryRepository;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CategoryMapper categoryMapper;

    @Transactional
    public CategoryResponseDTO create(CategoryAdminRequestDTO dto) {
        if (categoryRepository.existsByName(dto.name())) {
            throw new BusinessException("Já existe uma categoria com esse nome.");
        }

        Category category = categoryMapper.toEntity(dto);
        Category savedCategory = categoryRepository.save(category);

        return categoryMapper.toResponse(savedCategory);
    }

    @Transactional(readOnly = true)
    public List<CategoryResponseDTO> findAll() {
        return categoryMapper.toResponseList(categoryRepository.findAll());
    }

    @Transactional(readOnly = true)
    public CategoryResponseDTO findById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        return categoryMapper.toResponse(category);
    }

    @Transactional
    public CategoryResponseDTO update(Long id, CategoryAdminRequestDTO dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        if (!category.getName().equals(dto.name()) && categoryRepository.existsByName(dto.name())) {
            throw new BusinessException("Já existe uma categoria com esse nome.");
        }

        category.setName(dto.name());
        category.setDescription(dto.description());

        return categoryMapper.toResponse(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        if (productRepository.existsByCategoryId(id)) {
            throw new BusinessException(
                    "Não é possível remover uma categoria que possui produtos vinculados."
            );
        }

        categoryRepository.delete(category);
    }
}