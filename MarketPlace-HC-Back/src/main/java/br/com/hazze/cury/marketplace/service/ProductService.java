package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.request.ProductAdminRequestDTO;
import br.com.hazze.cury.marketplace.dto.request.ProductUpdatePriceDTO;
import br.com.hazze.cury.marketplace.dto.request.ProductUpdateStockDTO;
import br.com.hazze.cury.marketplace.dto.response.ProductResponseDTO;
import br.com.hazze.cury.marketplace.entities.Category;
import br.com.hazze.cury.marketplace.entities.Product;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.ProductMapper;
import br.com.hazze.cury.marketplace.repositories.CategoryRepository;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Transactional
    public ProductResponseDTO create(ProductAdminRequestDTO dto) {
        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        Product product = productMapper.toEntity(dto);
        product.setCategory(category);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO uploadImage(Long id, MultipartFile file) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        if (file == null || file.isEmpty()) {
            throw new BusinessException("Arquivo de imagem é obrigatório.");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BusinessException("O arquivo enviado deve ser uma imagem.");
        }

        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalName = file.getOriginalFilename();
            String extension = "";

            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf("."));
            }

            String fileName = UUID.randomUUID() + extension;
            Path filePath = uploadDir.resolve(fileName);

            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            product.setImageUrl("/uploads/" + fileName);

            return productMapper.toResponse(productRepository.save(product));

        } catch (IOException e) {
            throw new RuntimeException("Erro ao salvar a imagem do produto.", e);
        }
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAll() {
        return productMapper.toResponseList(productRepository.findAll());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findAllActive() {
        return productMapper.toResponseList(productRepository.findByActiveTrue());
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findWithFilters(
            String name,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Sort sort
    ) {
        return productMapper.toResponseList(
                productRepository.findWithFilters(name, categoryId, minPrice, maxPrice, sort)
        );
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findWithAdminFilters(
            String name,
            Long categoryId,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Sort sort
    ) {
        return productMapper.toResponseList(
                productRepository.findWithAdminFilters(name, categoryId, minPrice, maxPrice, sort)
        );
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO findById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        return productMapper.toResponse(product);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findByCategoryId(Long categoryId) {
        return productMapper.toResponseList(productRepository.findByCategoryId(categoryId));
    }

    @Transactional
    public ProductResponseDTO update(Long id, ProductAdminRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        Category category = categoryRepository.findById(dto.categoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoria não encontrada."));

        product.setName(dto.name());
        product.setDescription(dto.description());
        product.setPrice(dto.price());
        product.setStock(dto.stock());
        product.setActive(dto.active());
        product.setCategory(category);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO updatePrice(Long id, ProductUpdatePriceDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        product.setPrice(dto.price());

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponseDTO updateStock(Long id, ProductUpdateStockDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        product.setStock(dto.stock());

        return productMapper.toResponse(productRepository.save(product));
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        productRepository.delete(product);
    }
}
