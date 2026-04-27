package br.com.hazze.cury.marketplace.controller;

import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.ProductResponseDTO;
import br.com.hazze.cury.marketplace.entities.User;
import br.com.hazze.cury.marketplace.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Wishlist", description = "Lista de desejos do cliente")
@RestController
@RequestMapping("/client/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService service;

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Listar minha lista de desejos",
            description = "Retorna os produtos salvos na lista de desejos do cliente autenticado. Acesso: CLIENT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de desejos retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> findMyWishlist(Authentication authentication) {
        User user = (User) authentication.getPrincipal();

        return ResponseEntity.ok(service.findMyWishlist(user.getId()));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Adicionar produto à lista de desejos",
            description = "Adiciona um produto à lista de desejos do cliente autenticado. Acesso: CLIENT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Produto adicionado à lista de desejos",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Produto já está na lista ou regra de negócio inválida",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/items/{productId}")
    public ResponseEntity<ProductResponseDTO> addProduct(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        ProductResponseDTO response = service.addProduct(user.getId(), productId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Remover produto da lista de desejos",
            description = "Remove um produto da lista de desejos do cliente autenticado. Acesso: CLIENT"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Produto removido da lista de desejos"),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado na lista de desejos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/items/{productId}")
    public ResponseEntity<Void> removeProduct(
            @PathVariable Long productId,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        service.removeProduct(user.getId(), productId);

        return ResponseEntity.noContent().build();
    }
}