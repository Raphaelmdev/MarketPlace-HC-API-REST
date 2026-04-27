# Marketplace API - HazzeCury

![Java](https://img.shields.io/badge/Java-17+-red)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.x-green)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Database](https://img.shields.io/badge/Database-MySQL-orange)
![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

API REST desenvolvida com **Spring Boot** para gerenciamento de um marketplace completo, incluindo autenticação, usuários, produtos, carrinho e pedidos.

---

## Tecnologias Utilizadas

### Backend
- Java 17+
- Spring Boot
- Spring Security
- JWT (JSON Web Token)
- Spring Data JPA
- Hibernate
- Lombok
- MapStruct

### Banco de Dados
- MySQL (principal)
- H2 (testes)

### Ferramentas
- Maven
- Swagger (OpenAPI)
- Postman

---

## Arquitetura

O projeto segue o padrão:

**MVC (Model-View-Controller)**

Com divisão em camadas:

- Controller → requisições HTTP  
- Service → regras de negócio  
- Repository → acesso ao banco  
- Entity → modelagem  
- DTO → transferência de dados  
- Mapper → conversão  

---

## Segurança

A aplicação utiliza múltiplas camadas de segurança:

### Autenticação
- JWT (JSON Web Token)
- Rotas protegidas exigem token válido

### Autorização
- Controle por roles:
  - CLIENT
  - ADMIN

### Proteção de Dados
- Senhas criptografadas com **BCrypt**

### Proteção de Recursos
- Usuários acessam apenas seus próprios dados

---

## Funcionalidades

- Autenticação com JWT  
- CRUD de usuários  
- CRUD de produtos  
- CRUD de categorias  
- Carrinho de compras  
- Sistema de pedidos  
- Controle de estoque  

---

## Padrão de Erros

| Código | Descrição |
|------|--------|
| 400 | Regra de negócio |
| 401 | Não autenticado |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro interno |

---

## Configuração

O projeto utiliza profiles:

- dev → desenvolvimento  
- test → testes (H2)  
- prod → produção  

Exemplo:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

api.security.token.secret=your-secret-here
```
```.env.example
DB_MYSQL_URL=
DB_MYSQL_USER=
DB_MYSQL_PASSWORD=
JWT_SECRET=

```
## Como Executar
```
git clone https://github.com/seu-repo.git
cd projeto
./mvnw spring-boot:run
```
## Autenticação
```
Authorization: Bearer {token}
```
## Documentação
- Swagger:
```
http://localhost:8080/swagger-ui.html
```
# Autor
### Raphael Martins
 - Projeto desenvolvido para TCC e portfólio.
