package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.request.CartItemRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CartItemResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.CartResponseDTO;
import br.com.hazze.cury.marketplace.entities.*;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.CartItemMapper;
import br.com.hazze.cury.marketplace.mappers.CartMapper;
import br.com.hazze.cury.marketplace.repositories.CartItemRepository;
import br.com.hazze.cury.marketplace.repositories.CartRepository;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartMapper cartMapper;
    private final CartItemMapper cartItemMapper;

    @Transactional
    public CartResponseDTO create(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        if (cartRepository.findByUserId(userId).isPresent()) {
            throw new BusinessException("Esse usuário já possui um carrinho.");
        }

        Cart cart = createCartEntity(user);
        return cartMapper.toResponse(cartRepository.save(cart));
    }

    @Transactional(readOnly = true)
    public CartResponseDTO findByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado para esse usuário."));

        return cartMapper.toResponse(cart);
    }

    @Transactional(readOnly = true)
    public CartResponseDTO findById(Long id, Long loggedUserId) {
        Cart cart = cartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        validateCartOwner(cart, loggedUserId);

        return cartMapper.toResponse(cart);
    }

    @Transactional(readOnly = true)
    public List<CartItemResponseDTO> findItemsByUserId(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        return cartItemMapper.toResponseList(cartItemRepository.findByCartId(cart.getId()));
    }

    @Transactional(readOnly = true)
    public List<CartItemResponseDTO> findItemsByCartId(Long cartId, Long loggedUserId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        validateCartOwner(cart, loggedUserId);

        return cartItemMapper.toResponseList(cartItemRepository.findByCartId(cartId));
    }

    @Transactional
    public CartItemResponseDTO addItemByUser(CartItemRequestDTO dto, Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartIfNotExists(userId));

        return addItem(cart.getId(), dto, userId);
    }

    @Transactional
    public CartItemResponseDTO addItem(Long cartId, CartItemRequestDTO dto, Long loggedUserId) {
        validateQuantity(dto.quantity());

        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        validateCartOwner(cart, loggedUserId);

        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        validateProductAvailable(product);

        CartItem cartItem = cartItemRepository.findByCartIdAndProductId(cartId, dto.productId())
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setCart(cart);
                    newItem.setProduct(product);
                    newItem.setQuantity(0);
                    newItem.setUnitPrice(product.getPrice());
                    newItem.setSubTotal(BigDecimal.ZERO);
                    return newItem;
                });

        int newQuantity = cartItem.getQuantity() + dto.quantity();

        validateStock(product, newQuantity);

        cartItem.setProduct(product);
        cartItem.setQuantity(newQuantity);
        cartItem.setUnitPrice(product.getPrice());
        calculateItemSubTotal(cartItem);

        CartItem savedItem = cartItemRepository.save(cartItem);

        recalculateCartTotal(cart);

        return cartItemMapper.toResponse(savedItem);
    }

    @Transactional
    public CartItemResponseDTO updateItemQuantity(Long cartItemId, CartItemRequestDTO dto, Long loggedUserId) {
        validateQuantity(dto.quantity());

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item do carrinho não encontrado."));

        validateCartOwner(cartItem.getCart(), loggedUserId);

        if (!cartItem.getProduct().getId().equals(dto.productId())) {
            throw new BusinessException("O produto do item não pode ser alterado.");
        }

        Product product = productRepository.findById(dto.productId())
                .orElseThrow(() -> new ResourceNotFoundException("Produto não encontrado."));

        validateProductAvailable(product);
        validateStock(product, dto.quantity());

        cartItem.setProduct(product);
        cartItem.setQuantity(dto.quantity());
        cartItem.setUnitPrice(product.getPrice());
        calculateItemSubTotal(cartItem);

        CartItem updatedItem = cartItemRepository.save(cartItem);

        recalculateCartTotal(cartItem.getCart());

        return cartItemMapper.toResponse(updatedItem);
    }

    @Transactional
    public void removeItem(Long cartItemId, Long loggedUserId) {
        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new ResourceNotFoundException("Item do carrinho não encontrado."));

        validateCartOwner(cartItem.getCart(), loggedUserId);

        Cart cart = cartItem.getCart();

        cartItemRepository.delete(cartItem);
        cartItemRepository.flush();

        recalculateCartTotal(cart);
    }

    @Transactional
    public void clearCartByUser(Long userId) {
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createCartIfNotExists(userId));

        clearCart(cart.getId(), userId);
    }

    @Transactional
    public void clearCart(Long cartId, Long loggedUserId) {
        Cart cart = cartRepository.findById(cartId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        validateCartOwner(cart, loggedUserId);

        List<CartItem> items = cartItemRepository.findByCartId(cartId);

        cartItemRepository.deleteAll(items);
        cartItemRepository.flush();

        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);
    }

    private Cart createCartIfNotExists(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Cart cart = createCartEntity(user);

        return cartRepository.save(cart);
    }

    private Cart createCartEntity(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setStatus(CartStatus.ACTIVE);
        cart.setTotal(BigDecimal.ZERO);
        return cart;
    }

    private void validateQuantity(Integer quantity) {
        if (quantity == null || quantity <= 0) {
            throw new BusinessException("Quantidade deve ser maior que zero.");
        }
    }

    private void validateProductAvailable(Product product) {
        if (product.getActive() == null || !product.getActive()) {
            throw new BusinessException("Produto inativo.");
        }
    }

    private void validateStock(Product product, Integer quantity) {
        if (product.getStock() == null || product.getStock() < quantity) {
            throw new BusinessException("Estoque insuficiente.");
        }
    }

    private void validateCartOwner(Cart cart, Long loggedUserId) {
        if (!cart.getUser().getId().equals(loggedUserId)) {
            throw new AccessDeniedException("Você não tem permissão para acessar este carrinho.");
        }
    }

    private void calculateItemSubTotal(CartItem cartItem) {
        BigDecimal unitPrice = cartItem.getUnitPrice() != null
                ? cartItem.getUnitPrice()
                : BigDecimal.ZERO;

        Integer quantity = cartItem.getQuantity() != null
                ? cartItem.getQuantity()
                : 0;

        cartItem.setSubTotal(unitPrice.multiply(BigDecimal.valueOf(quantity)));
    }

    private void recalculateCartTotal(Cart cart) {
        List<CartItem> items = cartItemRepository.findByCartId(cart.getId());

        BigDecimal total = items.stream()
                .map(item -> {
                    BigDecimal unitPrice = item.getUnitPrice() != null
                            ? item.getUnitPrice()
                            : BigDecimal.ZERO;

                    Integer quantity = item.getQuantity() != null
                            ? item.getQuantity()
                            : 0;

                    return unitPrice.multiply(BigDecimal.valueOf(quantity));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotal(total);
        cartRepository.save(cart);
    }
}