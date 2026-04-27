package br.com.hazze.cury.marketplace.repositories;

import br.com.hazze.cury.marketplace.entities.Order;
import br.com.hazze.cury.marketplace.entities.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserId(Long userId);


    List<Order> findByStatus(OrderStatus status);


    List<Order> findByUserIdAndStatus(Long userId, OrderStatus status);

    @Query("""
    SELECT o FROM orders o
    JOIN o.user u
    WHERE
        (:customer IS NULL OR
        LOWER(u.name) LIKE LOWER(CONCAT('%', :customer, '%')) OR
        LOWER(u.email) LIKE LOWER(CONCAT('%', :customer, '%')) OR
        u.cpf LIKE CONCAT('%', :customer, '%'))
""")
    List<Order> findByCustomer(String customer);
}
