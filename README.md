# Marketplace HazzeCury - API REST

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

Plataforma completa de marketplace desenvolvida como Trabalho de Conclusão de Curso (TCC), composta por uma **API REST** em Spring Boot e uma **interface web** em React.

---

## Sobre o Projeto

O HazzeCury é um marketplace fullstack com foco em:

- Experiência do usuário moderna e responsiva
- API REST robusta e segura
- Autenticação e autorização via JWT
- Controle de acesso baseado em roles (`CLIENT` e `ADMIN`)
- Separação clara entre áreas pública, cliente e administrador

---

## Repositórios

| Módulo | Descrição | Link |
|---|---|---|
| `hazzecury-frontend` | Interface web em React | [Acessar](https://github.com/NicholasPedroF/Marketplace-HC-Front.git) |
| `hazzecury-backend` | API REST em Spring Boot | [Acessar](https://github.com/Raphaelmdev/MarketPlace-HC-Back.git) |

---

## Arquitetura Geral

```
┌─────────────────────────────────────────────┐
│                   Cliente                    │
│           (Navegador / React App)            │
└───────────────────┬─────────────────────────┘
                    │ HTTP / REST
                    ▼
┌─────────────────────────────────────────────┐
│              API REST (Spring Boot)          │
│   Controller → Service → Repository         │
└───────────────────┬─────────────────────────┘
                    │ JPA / Hibernate
                    ▼
┌─────────────────────────────────────────────┐
│                   MySQL                      │
└─────────────────────────────────────────────┘
```

---

## Tecnologias

### Frontend
- React + Vite
- React Router DOM
- JavaScript (ES6+)
- CSS customizado
- Context API
- LocalStorage

### Backend
- Java 17+
- Spring Boot 3.x
- Spring Security
- JWT
- Spring Data JPA / Hibernate
- Lombok · MapStruct
- MySQL / H2 (testes)
- Maven · Swagger

---

## Segurança

- Autenticação via **JWT**
- Senhas criptografadas com **BCrypt**
- Controle de acesso por roles:

| Role | Permissões |
|---|---|
| `CLIENT` | Visualizar produtos, gerenciar carrinho, pedidos e perfil |
| `ADMIN` | CRUD de produtos, categorias, usuários e pedidos |

---

## Funcionalidades

### Cliente
- Cadastro e login
- Visualização e filtro de produtos
- Carrinho de compras
- Finalização e acompanhamento de pedidos
- Gerenciamento de perfil, endereço e lista de desejos

### Administrador
- CRUD de produtos e categorias
- Gerenciamento de usuários
- Controle de pedidos e estoque

---

## Principais Rotas da Aplicação

### Frontend

| Rota | Descrição |
|---|---|
| `/home` | Página inicial |
| `/products` | Vitrine de produtos |
| `/cart` | Carrinho |
| `/client/*` | Área do cliente |
| `/admin/*` | Painel administrativo |

### API REST

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Login |
| `POST` | `/auth/register` | Cadastro |
| `GET` | `/products` | Listar produtos |
| `POST` | `/cart` | Adicionar ao carrinho |
| `POST` | `/orders` | Criar pedido |

---

## Configuração do Ambiente

### Frontend — `.env`

```env
VITE_API_URL=http://localhost:8080
```

### Backend — `.env`

```env
DB_MYSQL_URL=
DB_MYSQL_USER=
DB_MYSQL_PASSWORD=
JWT_SECRET=
```

---

## Como Executar

### Backend

```bash
git clone https://github.com/seu-repo/hazzecury-backend.git
cd hazzecury-backend
./mvnw spring-boot:run
```

### Frontend

```bash
git clone https://github.com/seu-repo/hazzecury-frontend.git
cd hazzecury-frontend
npm install
npm run dev
```

> O frontend depende da API backend rodando em `http://localhost:8080`.

---

## Documentação da API

Disponível via Swagger após iniciar o backend:

```
http://localhost:8080/swagger-ui.html
```

---

## Identidade Visual

- **Azul escuro** — sofisticação
- **Dourado** — luxo / alfaiataria
- **Tipografia elegante** — ex: Cinzel

---

## Autores

**Raphael Martins Nascimento**

**Nicholas Ferreira**

**Miguel Solon**

**Reinaldo Campos**  

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) e portfólio pessoal.

---

## Licença

Este projeto é acadêmico e pode ser utilizado para fins de estudo.
