package br.com.hazze.cury.marketplace.controller;

import br.com.hazze.cury.marketplace.dto.request.ProductAdminRequestDTO;
import br.com.hazze.cury.marketplace.dto.request.ProductUpdatePriceDTO;
import br.com.hazze.cury.marketplace.dto.request.ProductUpdateStockDTO;
import br.com.hazze.cury.marketplace.dto.response.ErrorResponseDTO;
import br.com.hazze.cury.marketplace.dto.response.ProductResponseDTO;
import br.com.hazze.cury.marketplace.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;

@Tag(name = "Products", description = "Gerenciamento de produtos")
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService service;

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Criar produto", description = "Cadastra um novo produto. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Produto criado com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Categoria não encontrada",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })

    @PostMapping
    public ResponseEntity<ProductResponseDTO> create(@RequestBody @Valid ProductAdminRequestDTO dto) {
        ProductResponseDTO response = service.create(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Upload de imagem do produto", description = "Envia a imagem de um produto. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Imagem enviada com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Arquivo inválido",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PostMapping("/{id}/image")
    public ResponseEntity<ProductResponseDTO> uploadImage(@PathVariable Long id,
                                                          @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(service.uploadImage(id, file));
    }

    @Operation(summary = "Listar produtos", description = "Retorna apenas produtos ativos. Acesso: PÚBLICO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> findAll() {
        return ResponseEntity.ok(service.findAllActive());
    }


    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Listar todos os produtos", description = "Retorna produtos ativos e inativos. Acesso: ADMIN")
    @GetMapping("/admin")
    public ResponseEntity<List<ProductResponseDTO>> findAllAdmin() {
        return ResponseEntity.ok(service.findAll());
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(
            summary = "Filtrar produtos para administração",
            description = """
        Retorna produtos ativos e inativos com base em filtros opcionais.
        Acesso: ADMIN.

        Exemplos de uso:
        - /products/admin/filter?name=terno
        - /products/admin/filter?categoryId=1
        - /products/admin/filter?minPrice=300&maxPrice=1200
        - /products/admin/filter?name=terno&sort=price,desc
        """
    )
    @ApiResponses({
            @ApiResponse(
                    responseCode = "200",
                    description = "Lista de produtos retornada com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Parâmetros inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))
            ),
            @ApiResponse(
                    responseCode = "403",
                    description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))
            )
    })
    @GetMapping("/admin/filter")
    public ResponseEntity<List<ProductResponseDTO>> findWithAdminFilters(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "id,asc") String sort
    ) {
        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        String sortDirection = sortParams.length > 1 ? sortParams[1] : "asc";

        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sortObj = Sort.by(direction, sortField);

        return ResponseEntity.ok(
                service.findWithAdminFilters(name, categoryId, minPrice, maxPrice, sortObj)
        );
    }

    @Operation(
            summary = "Filtrar produtos",
            description = """
        Retorna produtos ativos com base em filtros opcionais. Acesso: PÚBLICO.

        Exemplos de uso:
        - /products/filter?name=terno
        - /products/filter?categoryId=1
        - /products/filter?minPrice=300&maxPrice=1200
        - /products/filter?name=terno&sort=price,desc
        """
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de produtos retornada com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Parâmetros inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/filter")
    public ResponseEntity<List<ProductResponseDTO>> findWithFilters(

            @Parameter(
                    description = "Nome do produto (busca parcial)",
                    example = "terno"
            )
            @RequestParam(required = false) String name,

            @Parameter(
                    description = "ID da categoria",
                    example = "1"
            )
            @RequestParam(required = false) Long categoryId,

            @Parameter(
                    description = "Preço mínimo",
                    example = "300"
            )
            @RequestParam(required = false) BigDecimal minPrice,

            @Parameter(
                    description = "Preço máximo",
                    example = "1200"
            )
            @RequestParam(required = false) BigDecimal maxPrice,

            @Parameter(
                    description = "Ordenação no formato campo,direção (ex: price,asc ou price,desc)",
                    example = "price,desc"
            )
            @RequestParam(defaultValue = "id,asc") String sort

    ) {

        String[] sortParams = sort.split(",");
        String sortField = sortParams[0];
        String sortDirection = sortParams.length > 1 ? sortParams[1] : "asc";

        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        Sort sortObj = Sort.by(direction, sortField);

        return ResponseEntity.ok(
                service.findWithFilters(name, categoryId, minPrice, maxPrice, sortObj)
        );
    }

    @Operation(summary = "Buscar produto por ID", description = "Retorna um produto específico. Acesso: PÚBLICO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto encontrado",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Erro na requisição",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @Operation(summary = "Listar produtos por categoria", description = "Retorna produtos vinculados a uma categoria. Acesso: PÚBLICO")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductResponseDTO>> findByCategoryId(@PathVariable Long categoryId) {
        return ResponseEntity.ok(service.findByCategoryId(categoryId));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar produto", description = "Atualiza os dados de um produto. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Produto atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto ou categoria não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> update(@PathVariable Long id, @RequestBody @Valid ProductAdminRequestDTO dto) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar preço do produto", description = "Atualiza apenas o preço. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Preço atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PatchMapping("/{id}/price")
    public ResponseEntity<ProductResponseDTO> updatePrice(@PathVariable Long id, @RequestBody @Valid ProductUpdatePriceDTO dto) {
        return ResponseEntity.ok(service.updatePrice(id, dto));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Atualizar estoque do produto", description = "Atualiza apenas o estoque. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Estoque atualizado com sucesso",
                    content = @Content(schema = @Schema(implementation = ProductResponseDTO.class))),
            @ApiResponse(responseCode = "400", description = "Dados inválidos",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @PatchMapping("/{id}/stock")
    public ResponseEntity<ProductResponseDTO> updateStock(@PathVariable Long id, @RequestBody @Valid ProductUpdateStockDTO dto) {
        return ResponseEntity.ok(service.updateStock(id, dto));
    }

    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Remover produto", description = "Remove um produto. Acesso: ADMIN")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Produto removido com sucesso"),
            @ApiResponse(responseCode = "400", description = "Erro na requisição",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "404", description = "Produto não encontrado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class))),
            @ApiResponse(responseCode = "403", description = "Acesso negado",
                    content = @Content(schema = @Schema(implementation = ErrorResponseDTO.class)))
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
