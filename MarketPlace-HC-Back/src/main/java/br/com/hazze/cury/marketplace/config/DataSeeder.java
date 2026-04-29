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
                "899.90", 8, "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&q=80", ternos),

            produto("Terno Classic Cinza", "Terno clássico em lã fria, corte reto com caimento impecável.",
                "1190.00", 5, "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", ternos),

            produto("Terno Azul Marinho", "Terno azul marinho de dois botões, perfeito para ocasiões especiais.",
                "1350.00", 4, "https://images.unsplash.com/photo-1598808503746-f34cfba7ed71?w=800&q=80", ternos),

            produto("Terno Bege Verão", "Terno em tecido linho para o verão, leveza e elegância na medida certa.",
                "980.00", 6, "https://images.unsplash.com/photo-1555069519-127aadecd35e?w=800&q=80", ternos),

            // CAMISAS
            produto("Camisa Social Branca", "Camisa social em algodão egípcio, corte slim, punho duplo.",
                "189.90", 20, "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=800&q=80", camisas),

            produto("Camisa Social Azul Claro", "Camisa social azul claro, tecido maquinetado de alta qualidade.",
                "199.90", 15, "https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=800&q=80", camisas),

            produto("Camisa Listrada Cinza", "Camisa listrada em algodão premium, ideal para uso corporativo.",
                "219.90", 12, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", camisas),

            produto("Camisa Oxford Vinho", "Camisa Oxford vinho de corte italiano, elegância em cada detalhe.",
                "229.90", 10, "https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?w=800&q=80", camisas),

            // CALÇAS
            produto("Calça Social Preta", "Calça social em tecido de lã fria, corte slim com cós alto.",
                "349.90", 15, "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800&q=80", calcas),

            produto("Calça Social Cinza Chumbo", "Calça de alfaiataria cinza chumbo, perfeita para compor ternos ou looks casuais.",
                "369.90", 12, "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&q=80", calcas),

            produto("Calça Social Bege", "Calça bege em linho italiano, leve e elegante para o dia a dia.",
                "329.90", 10, "https://images.unsplash.com/photo-1519013816422-891c013d3a62?w=800&q=80", calcas),

            // GRAVATAS & ACESSÓRIOS
            produto("Gravata Seda Bordô", "Gravata em seda pura bordô, acabamento artesanal.",
                "129.90", 25, "https://images.unsplash.com/photo-1589756823695-278bc923f962?w=800&q=80", gravatas),

            produto("Gravata Listrada Azul", "Gravata listrada azul marinho e prata, clássica e versátil.",
                "119.90", 20, "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800&q=80", gravatas),

            produto("Lenço de Bolso Branco", "Lenço de bolso em algodão egipcio dobrado à mão.",
                "49.90", 40, "https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?w=800&q=80", gravatas),

            produto("Abotoaduras Prata", "Abotoaduras em prata 925 com acabamento fosco, elegância nos detalhes.",
                "189.90", 15, "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&q=80", gravatas),

            // BLAZERS
            produto("Blazer Azul Royal", "Blazer azul royal em lã italiana, corte slim moderno.",
                "749.90", 7, "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?w=800&q=80", blazers),

            produto("Blazer Preto Estruturado", "Blazer preto estruturado, versátil para looks formais e casuais.",
                "699.90", 8, "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80", blazers),

            produto("Blazer Xadrez Príncipe de Gales", "Blazer em tecido xadrez príncipe de Gales, sofisticação atemporal.",
                "829.90", 5, "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=800&q=80", blazers)
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