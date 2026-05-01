package br.com.hazze.cury.marketplace.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "cart_items")
@Table(
        name = "cart_items",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_cart_item_cart_product",
                        columnNames = {"cart_id", "product_id"}
                )
        }
)
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal unitPrice;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    public void calculateSubtotal() {
        if (unitPrice == null || quantity == null) {
            this.subTotal = BigDecimal.ZERO;
            return;
        }

        this.subTotal = unitPrice.multiply(BigDecimal.valueOf(quantity));
    }

    public void setProduct(Product product) {
        this.product = product;

        if (product != null && product.getPrice() != null) {
            this.unitPrice = product.getPrice(); 
        }
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
        calculateSubtotal();
    }


    @PrePersist
    public void prePersist() {
        calculateSubtotal();
    }

    @PreUpdate
    public void preUpdate() {
        calculateSubtotal();
    }
}