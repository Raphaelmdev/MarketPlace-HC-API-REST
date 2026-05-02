package br.com.hazze.cury.marketplace.config;

import br.com.hazze.cury.marketplace.entities.Category;
import br.com.hazze.cury.marketplace.entities.Product;
import br.com.hazze.cury.marketplace.repositories.CategoryRepository;
import br.com.hazze.cury.marketplace.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements ApplicationRunner {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(ApplicationArguments args) {
        if (categoryRepository.count() > 0) return;

        // CATEGORIAS
        Category ternos = new Category();
        ternos.setName("Ternos");
        ternos.setDescription("Ternos sob medida e prontos para homens de presença");

        Category camisas = new Category();
        camisas.setName("Camisas");
        camisas.setDescription("Camisas sociais e de alfaiataria");

        Category calcas = new Category();
        calcas.setName("Calças");
        calcas.setDescription("Calças sociais e de alfaiataria");

        Category gravatas = new Category();
        gravatas.setName("Gravatas & Acessórios");
        gravatas.setDescription("Gravatas, lenços e acessórios masculinos");

        Category blazers = new Category();
        blazers.setName("Blazers");
        blazers.setDescription("Blazers e sacôs masculinos");

        categoryRepository.saveAll(List.of(ternos, camisas, calcas, gravatas, blazers));

        // PRODUTOS
        List<Product> produtos = List.of(

            // TERNOS
           produto("Terno Slim Preto", "Terno slim fit em tecido Oxford premium. Ideal para eventos formais e corporativos.",
            "899.90", 8, "https://img.elo7.com.br/product/685x685/4CC3701/terno-slim-oxford-masculino-preto-terno-preco.jpg", ternos),

            produto("Terno Classic Cinza", "Terno clássico em lã fria, corte reto com caimento impecável.",
            "1190.00", 5, "https://img.irroba.com.br/fit-in/2189x3284/filters:format(webp):fill(fff):quality(80)/lojadiod/catalog/ensaio-2025/ensaio-modelo/000a1909.jpg", ternos),

            produto("Terno Azul Marinho", "Terno azul marinho de dois botões, perfeito para ocasiões especiais.",
            "1350.00", 4, "https://i.pinimg.com/1200x/80/24/e8/8024e8862e76f952d22a60159488e6b2.jpg", ternos),

            produto("Terno Bege Verão", "Terno em tecido linho para o verão, leveza e elegância na medida certa.",
            "980.00", 6, "https://www.hollomen.com/cdn/shop/files/beige-seersucker-casual-suit-528720.jpg?v=1751332589&width=823", ternos),

            // CAMISAS
            produto("Camisa Social Branca", "Camisa social em algodão egípcio, corte slim, punho duplo.",
            "189.90", 20, "https://usecigno.com.br/cdn/shop/files/lookbook_cigno6040.jpg?v=1727096096&width=600", camisas),

            produto("Camisa Social Azul Claro", "Camisa social azul claro, tecido maquinetado de alta qualidade.",
            "199.90", 15, "https://ciaoformen.com/wp-content/uploads/2020/04/38-38.02.jpg", camisas),

            produto("Camisa Listrada Cinza", "Camisa listrada em algodão premium, ideal para uso corporativo.",
            "219.90", 12, "https://acdn-us.mitiendanube.com/stores/002/062/773/products/tmp_b64_531c1114-9c4f-4fbe-b183-0b57f9823f84_2062773_2306560-646ecf98624c67295817626263084738-1024-1024.webp", camisas),

            produto("Camisa Oxford Vinho", "Camisa Oxford vinho de corte italiano, elegância em cada detalhe.",
            "229.90", 10, "https://aviator.vteximg.com.br/arquivos/ids/325092-1600-1975/03706990053_1.jpg?v=638787942188230000", camisas),

            // CALÇAS
            produto("Calça Social Preta", "Calça social em tecido de lã fria, corte slim com cós alto.",
                "349.90", 15, "https://mrmaximus.com.br/cdn/shop/files/S916922d1ba0f4a84bea07273fe2157a7w.webp?v=1719672642&width=800", calcas),

            produto("Calça Social Cinza Chumbo", "Calça de alfaiataria cinza chumbo, perfeita para compor ternos ou looks casuais.",
                "369.90", 12, "https://dashuniformes.com.br/cdn/shop/files/08_46_10_40_8_3_3_341_clm0024czcorpo.jpg?v=1774527779&width=2500", calcas),

            produto("Calça Social Bege", "Calça bege em linho italiano, leve e elegante para o dia a dia.",
                "329.90", 10, "https://torratorra.vteximg.com.br/arquivos/ids/2103150-960-1200/28251000208503.jpg?v=638745443875100000", calcas),
            
            produto("Calça Social Azul Marinho", "Calça social azul marinho em lã fria premium, corte slim e acabamento refinado.",
                "359.90", 14, "https://acdn-us.mitiendanube.com/stores/003/058/627/products/zarref-3576302451-15068-calca-alfaiataria-masculina-social-esporte-fino-premium-azul-escuro-95a9559e228e1372ff17208873736587-1024-1024.webp", calcas),

            // GRAVATAS & ACESSÓRIOS
            produto("Gravata Seda Bordô", "Gravata em seda pura bordô, acabamento artesanal.",
                "129.90", 25, "https://gravatariafratelli.com.br/cdn/shop/files/Bordo_d399ee69-910e-41e6-840e-ca0efff6d141_700x.jpg?v=1737511762", gravatas),

            produto("Gravata Listrada Azul", "Gravata listrada azul marinho e prata, clássica e versátil.",
                "119.90", 20, "https://croats.cdn.magazord.com.br/img/2025/07/produto/30291/gravata-listrada-azul-marinho-uspif6-1.png?ims=600x600", gravatas),

            produto("Lenço de Bolso Branco", "Lenço de bolso em algodão egipcio dobrado à mão.",
                "49.90", 40, "https://http2.mlstatic.com/D_NQ_NP_2X_812483-MLA101797104925_122025-F.webp", gravatas),

            produto("Abotoaduras Prata", "Abotoaduras em prata 925 com acabamento fosco, elegância nos detalhes.",
                "189.90", 15, "https://http2.mlstatic.com/D_NQ_NP_2X_832507-MLM99634891355_112025-F.webp", gravatas),

            // BLAZERS
            produto("Blazer Azul Royal", "Blazer azul royal em lã italiana, corte slim moderno.",
                "749.90", 7, "https://sergiok.vtexassets.com/arquivos/ids/197191/06.03.0020-040-1.jpg?v=639118568045500000", blazers),

            produto("Blazer Preto Estruturado", "Blazer preto estruturado, versátil para looks formais e casuais.",
                "699.90", 8, "https://hmbrasil.vtexassets.com/arquivos/ids/8227062-1440-auto/1306173001-1.webp?v=639131276788670000&quality=8", blazers),

            produto("Blazer Xadrez Príncipe de Gales", "Blazer em tecido xadrez príncipe de Gales, sofisticação atemporal.",
                "829.90", 5, "https://acdn-us.mitiendanube.com/stores/002/130/801/products/whatsapp-image-2025-02-28-at-16-09-30-1-92cfde790fdb0c764517407699098067-1024-1024.webp", blazers),
                
            produto("Blazer Marrom Café", "Blazer marrom café em tecido premium, corte moderno com caimento sofisticado","789.90", 6, "https://vertsophistique.com.br/wp-content/uploads/2024/07/087A3378.jpg", blazers)
                
        );

        productRepository.saveAll(produtos);
    }

    private Product produto(String name, String description, String price, int stock, String imageUrl, Category category) {
        Product p = new Product();
        p.setName(name);
        p.setDescription(description);
        p.setPrice(new BigDecimal(price));
        p.setStock(stock);
        p.setActive(true);
        p.setImageUrl(imageUrl);
        p.setCategory(category);
        return p;
    }
}