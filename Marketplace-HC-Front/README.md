# Marketplace HazzeCury Front-End

Interface web do marketplace **HazzeCury**, desenvolvida com **React**, consumindo uma API REST para gerenciamento completo de usuários, produtos, carrinho e pedidos.

---

## Sobre o Projeto

O frontend do HazzeCury foi desenvolvido com foco em:

- Experiência do usuário moderna e responsiva
- Separação clara entre áreas públicas, cliente e administrador
- Integração completa com API REST
- Controle de autenticação e autorização via JWT

---

## Tecnologias Utilizadas

- React (Vite)
- React Router DOM
- JavaScript (ES6+)
- CSS (customizado com identidade visual própria)
- Context API (gerenciamento de estado do carrinho)
- LocalStorage (persistência de sessão e dados)

---

## Estrutura do Projeto

```
src/
├── components/   # Componentes reutilizáveis (Header, etc)
├── pages/
│   ├── public/   # Login, Register, Home
│   ├── client/   # Área do cliente
│   ├── admin/    # Área administrativa
│   └── shop/     # Produtos e carrinho
├── routes/       # Proteção de rotas
├── services/     # Integração com API
├── context/      # Estado global (carrinho)
├── utils/        # Funções auxiliares (formatadores)
└── styles/       # Estilos globais
```

---

## Autenticação e Segurança

- Autenticação via **JWT**
- Token armazenado no `localStorage`
- Controle de acesso baseado em roles:
  - `CLIENT`
  - `ADMIN`

### Proteção de Rotas

| Componente | Função |
|---|---|
| `ProtectedRoute` | Bloqueia rotas privadas para usuários não autenticados |
| `PublicRoute` | Impede acesso a telas públicas quando o usuário já está logado |

---

## Rotas da Aplicação

### Públicas

| Rota | Descrição |
|---|---|
| `/home` | Página inicial |
| `/login` | Login |
| `/register` | Cadastro |
| `/forgot-password` | Recuperação de senha |
| `/reset-password` | Redefinição de senha |
| `/products` | Vitrine de produtos |

### Cliente

| Rota | Descrição |
|---|---|
| `/client` | Área do cliente |
| `/client/orders` | Pedidos |
| `/client/profile` | Perfil |
| `/client/address` | Endereços |
| `/client/wishlist` | Lista de desejos |
| `/cart` | Carrinho |

### Admin

| Rota | Descrição |
|---|---|
| `/admin` | Painel administrativo |
| `/admin/products` | Gerenciar produtos |
| `/admin/categories` | Categorias |
| `/admin/users` | Usuários |
| `/admin/orders` | Pedidos |
| `/admin/create-admin` | Criar administrador |

---

## Funcionalidades

### Cliente

- Cadastro e login
- Visualização de produtos
- Filtro de produtos (nome, preço, categoria)
- Adição ao carrinho
- Finalização de pedido
- Acompanhamento de pedidos
- Gerenciamento de perfil e endereço

### Administrador

- CRUD de produtos
- CRUD de categorias
- Gerenciamento de usuários
- Controle de pedidos

---

## Gerenciamento de Estado

- Carrinho controlado via `CartContext`
- Persistência no `localStorage`
- Evento customizado `cartUpdated` para sincronização entre telas

---

## Identidade Visual

O sistema segue uma identidade baseada em:

- **Azul escuro** — sofisticação
- **Dourado** — luxo / alfaiataria
- **Tipografia elegante** — ex: Cinzel

---

## Integração com API

Todas as requisições são feitas via `fetch`:

```js
const API_URL = import.meta.env.VITE_API_URL;
```

Headers padrão:

```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer TOKEN"
}
```

---

## Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=http://localhost:8080
```

---

## Como Executar o Projeto

```bash
# Instalar dependências
npm install

# Rodar projeto
npm run dev
```

## Build para Produção

```bash
npm run build
```

---

## Observações

- O frontend depende da API backend rodando corretamente
- O sistema utiliza autenticação JWT, sendo necessário login para acessar rotas protegidas
- Algumas funcionalidades podem ser expandidas futuramente (ex: wishlist completa)

---

## Autores

**Raphael Martins Nascimento**
**Nicholas Pedro**
Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) e portfólio pessoal.

---

## Licença

Este projeto é acadêmico e pode ser utilizado para fins de estudo.