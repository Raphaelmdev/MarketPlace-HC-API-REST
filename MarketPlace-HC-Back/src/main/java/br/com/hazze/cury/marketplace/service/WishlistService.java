package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.response.ProductResponseDTO;
import br.com.hazze.cury.marketplace.entities.Product;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.entities.WishlistItem;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.ProductMapper;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import br.com.hazze.cury.marketplace.repositories.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> findMyWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .stream()
                .map(WishlistItem::getProduct)
                .map(productMapper::toResponse)
                .toList();
    }

    @Transactional
    public ProductResponseDTO addProduct(Long userId, Long productId) {
        if (wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new BusinessException("Produto já está na lista de desejos.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        if (Boolean.FALSE.equals(product.getActive())) {
            throw new BusinessException("Produto inativo não pode ser adicionado à lista de desejos.");
        }

        WishlistItem item = new WishlistItem();
        item.setUser(user);
        item.setProduct(product);

        wishlistRepository.save(item);

        return productMapper.toResponse(product);
    }

    @Transactional
    public void removeProduct(Long userId, Long productId) {
        if (!wishlistRepository.existsByUserIdAndProductId(userId, productId)) {
            throw new ResourceNotFoundException("Produto não encontrado na lista de desejos.");
        }

        wishlistRepository.deleteByUserIdAndProductId(userId, productId);
    }
}