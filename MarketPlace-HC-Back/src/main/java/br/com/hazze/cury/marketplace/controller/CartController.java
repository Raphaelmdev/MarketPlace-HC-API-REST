package br.com.hazze.cury.marketplace.controller;

import br.com.hazze.cury.marketplace.dto.request.CartItemRequestDTO;
import br.com.hazze.cury.marketplace.dto.response.CartItemResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.CartResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Cart", description = "Carrinho de compras")
@RestController
@RequestMapping("/carts")
@RequiredArgsConstructor
public class CartController {

    private final CartService service;

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Criar carrinho", description = "Cria um carrinho para o usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Carrinho criado",
                    content = @Content(schema = @Schema(implementation = CartResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping
    public ResponseEntity<CartResponseDTO> create(Authentication authentication) {
        User loggedUser = (User) authentication.getPrincipal();
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(loggedUser.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Buscar meu carrinho", description = "Retorna o carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Carrinho encontrado",
                    content = @Content(schema = @Schema(implementation = CartResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Carrinho não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/me")
    public ResponseEntity<CartResponseDTO> getMyCart(Authentication authentication) {
        User loggedUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.findByUserId(loggedUser.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Listar itens do meu carrinho", description = "Retorna os itens do carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Itens retornados com sucesso"),
            @ApiResponse(responseCode = "404", description = "Carrinho não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/me/items")
    public ResponseEntity<List<CartItemResponseDTO>> findMyItems(Authentication authentication) {
        User loggedUser = (User) authentication.getPrincipal();
        return ResponseEntity.ok(service.findItemsByUserId(loggedUser.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Adicionar item ao meu carrinho", description = "Adiciona um produto ao carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Item adicionado com sucesso",
                    content = @Content(schema = @Schema(implementation = CartItemResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Estoque insuficiente ou regra inválida",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Carrinho ou produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/me/items")
    public ResponseEntity<CartItemResponseDTO> addItem(
            @RequestBody @Valid CartItemRequestDTO dto,
            Authentication authentication) {

        User loggedUser = (User) authentication.getPrincipal();

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(service.addItemByUser(dto, loggedUser.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar quantidade do item do carrinho", description = "Atualiza a quantidade de um item do carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Quantidade atualizada com sucesso",
                    content = @Content(schema = @Schema(implementation = CartItemResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Estoque insuficiente ou regra inválida",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Item ou produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/items/{cartItemId}")
    public ResponseEntity<CartItemResponseDTO> updateItem(
            @PathVariable Long cartItemId,
            @RequestBody @Valid CartItemRequestDTO dto,
            Authentication authentication) {

        User loggedUser = (User) authentication.getPrincipal();

        return ResponseEntity.ok(
                service.updateItemQuantity(cartItemId, dto, loggedUser.getId())
        );
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Remover item do carrinho", description = "Remove um item específico do carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Item removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Item não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/items/{cartItemId}")
    public ResponseEntity<Void> removeItem(
            @PathVariable Long cartItemId,
            Authentication authentication) {

        User loggedUser = (User) authentication.getPrincipal();
        service.removeItem(cartItemId, loggedUser.getId());

        return ResponseEntity.noContent().build();
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Limpar meu carrinho", description = "Remove todos os itens do carrinho do usuário autenticado. Acesso: CLIENT")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Carrinho limpo com sucesso"),
            @ApiResponse(responseCode = "404", description = "Carrinho não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/me/items")
    public ResponseEntity<Void> clearMyCart(Authentication authentication) {
        User loggedUser = (User) authentication.getPrincipal();
        service.clearCartByUser(loggedUser.getId());

        return ResponseEntity.noContent().build();
    }
}