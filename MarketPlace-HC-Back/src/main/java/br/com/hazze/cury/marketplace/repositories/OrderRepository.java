package br.com.hazze.cury.marketplace.repositories;

import br.com.hazze.cury.marketplace.entities.Order;
import br.com.hazze.cury.marketplace.entities.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT o FROM orders o JOIN FETCH o.user")
    List<Order> findAll();

    @Query("SELECT o FROM orders o JOIN FETCH o.user WHERE o.user.id = :userId")
    List<Order> findByUserId(@Param("userId") Long userId);

    @Query("SELECT o FROM orders o JOIN FETCH o.user WHERE o.status = :status")
    List<Order> findByStatus(@Param("status") OrderStatus status);

    @Query("""
        SELECT o FROM orders o
        JOIN FETCH o.user u
        WHERE o.user.id = :userId
        AND o.status = :status
    """)
    List<Order> findByUserIdAndStatus(
            @Param("userId") Long userId,
            @Param("status") OrderStatus status
    );

    @Query("""
        SELECT o FROM orders o
        JOIN FETCH o.user u
        WHERE
            (:customer IS NULL OR :customer = '' OR
            LOWER(u.name) LIKE LOWER(CONCAT('%', :customer, '%')) OR
            LOWER(u.email) LIKE LOWER(CONCAT('%', :customer, '%')) OR
            u.cpf LIKE CONCAT('%', :customer, '%'))
    """)
    List<Order> findByCustomer(@Param("customer") String customer);
}