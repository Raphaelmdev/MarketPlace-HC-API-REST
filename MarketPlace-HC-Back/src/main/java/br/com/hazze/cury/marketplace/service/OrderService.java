package br.com.hazze.cury.marketplace.service;

import br.com.hazze.cury.marketplace.dto.request.OrderStatusUpdateDTO;
import br.com.hazze.cury.marketplace.dto.response.OrderResponseDTO;
import br.com.hazze.cury.marketplace.entities.*;
import br.com.hazze.cury.marketplace.exceptions.BusinessException;
import br.com.hazze.cury.marketplace.exceptions.ResourceNotFoundException;
import br.com.hazze.cury.marketplace.mappers.OrderMapper;
import br.com.hazze.cury.marketplace.repositories.CartItemRepository;
import br.com.hazze.cury.marketplace.repositories.CartRepository;
import br.com.hazze.cury.marketplace.repositories.OrderItemRepository;
import br.com.hazze.cury.marketplace.repositories.OrderRepository;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;
import br.com.hazze.cury.marketplace.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderMapper orderMapper;

    @Transactional
    public OrderResponseDTO createFromCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Carrinho não encontrado."));

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());

        if (cartItems.isEmpty()) {
            throw new BusinessException("Carrinho vazio.");
        }

        Order order = new Order();
        order.setUser(user);
        order.setStatus(OrderStatus.PENDING);
        order.setTotal(BigDecimal.ZERO);

        Order savedOrder = orderRepository.save(order);

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal total = BigDecimal.ZERO;

        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();

            if (!product.getActive()) {
                throw new BusinessException("Produto inativo: " + product.getName());
            }

            if (product.getStock() < cartItem.getQuantity()) {
                throw new BusinessException("Estoque insuficiente para o produto: " + product.getName());
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(product);
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(product.getPrice());

            BigDecimal subTotal = product.getPrice()
                    .multiply(BigDecimal.valueOf(cartItem.getQuantity()));

            orderItem.setSubTotal(subTotal);

            orderItems.add(orderItem);
            total = total.add(subTotal);

            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        orderItemRepository.saveAll(orderItems);

        savedOrder.setItems(orderItems);
        savedOrder.setTotal(total);

        cartItemRepository.deleteAll(cartItems);
        cart.setTotal(BigDecimal.ZERO);
        cartRepository.save(cart);

        return orderMapper.toResponse(orderRepository.save(savedOrder));
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> findAll() {
        return orderMapper.toResponseList(orderRepository.findAll());
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO findByIdForAdmin(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> findAllAdmin(String customer) {
        return orderMapper.toResponseList(
                orderRepository.findByCustomer(customer)
        );
    }

    @Transactional(readOnly = true)
    public OrderResponseDTO findByIdForUser(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("Você não tem permissão para acessar este pedido.");
        }

        return orderMapper.toResponse(order);
    }

    @Transactional(readOnly = true)
    public List<OrderResponseDTO> findByUserId(Long userId) {
        return orderMapper.toResponseList(orderRepository.findByUserId(userId));
    }

    @Transactional
    public OrderResponseDTO cancelOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        if (!order.getUser().getId().equals(userId)) {
            throw new BusinessException("Você não tem permissão para cancelar este pedido.");
        }

        if (order.getStatus() == OrderStatus.CANCELED) {
            throw new BusinessException("Este pedido já está cancelado.");
        }

        if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.PAID) {
            throw new BusinessException("Este pedido não pode ser cancelado.");
        }

        order.setStatus(OrderStatus.CANCELED);

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public OrderResponseDTO updateStatus(Long id, OrderStatusUpdateDTO dto) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        order.setStatus(dto.status());

        return orderMapper.toResponse(orderRepository.save(order));
    }

    @Transactional
    public void delete(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado."));

        List<OrderItem> items = orderItemRepository.findByOrderId(id);
        orderItemRepository.deleteAll(items);

        orderRepository.delete(order);
    }
}