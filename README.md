# ProdSync - Sistema de Controle de Estoque e Produção

![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)
![Deploy](https://img.shields.io/badge/Deploy-Vercel-black)

## 📖 Sobre o Projeto

O *ProdSync* é uma aplicação web desenvolvida para gerenciar o ciclo produtivo de ponta a ponta, com foco central na *rastreabilidade de lotes*. O sistema permite o controle rigoroso desde a entrada da matéria-prima até a expedição do produto finalizado, garantindo a qualidade e a segurança da informação (genealogia do lote).

A aplicação está estruturada em dois módulos principais:
- *Frontend:* Interface de usuário interativa para gestão de ordens e estoques.
- *Backend:* API RESTful para regras de negócio e persistência de dados.

## ✨ Funcionalidades Principais

### 🏭 Controle de Produção
- *Ordens de Produção (OP):* Criação e acompanhamento de OPs.
- *Consumo de Materiais:* Baixa automática de estoque baseada na produção.
- *Registro de Produto Acabado:* Entrada automática de produtos finalizados no estoque.

### 📦 Gestão de Estoque
- *Entrada de Insumos:* Cadastro de matérias-primas com identificação de lote e validade.
- *Movimentações:* Transferências, ajustes e inventário.
- *Níveis de Estoque:* Monitoramento de quantidades mínimas e máximas.

### 🔍 Rastreabilidade (Traceability)
- *Rastreamento de Lote:* Visualização completa do ciclo de vida de um lote.
- *Genealogia (Upstream/Downstream):*
  - Origem: Dado um produto final, saber quais lotes de matéria-prima foram usados.
  - Destino: Dado um lote de matéria-prima, saber em quais produtos finais ele foi utilizado.

## 🛠️ Tecnologias Utilizadas

O projeto utiliza a seguinte stack tecnológica:

### Frontend
- *JavaScript*
- *React.js*
- *Vite.js*
- *CSS*
- *Axios*

### Backend
- *Node.js*
- *Express*
- *PostgreSQL*
- *Prisma ORM*
- *JWT (JSON Web Token)*

## 🏗️ Arquitetura do Projeto (C4 Model)

A documentação arquitetural segue o modelo C4 para descrever o software em diferentes níveis de abstração.

### Nível 1: Diagrama de Contexto
Visão macro do sistema. Mostra como o *ProdSync* se comunica com os usuários.

![Diagrama de Contexto do ProdSync](https://www.plantuml.com/plantuml/svg/TPFFRXen4CRlVeefbu94GQeuLbNubuI8aWrBcYCQl9EDMzQcjfU4L7sOg8UUUghw1BnOnxkmGANSl9vlPdxpUVRCURG-pvOGMPF46osXRxH7fSd2G65gCHFYBOoqNEOA43AKra12Hx9-HxnH8Swt7_gTThyphu8VXNWWJ5WrsVvUqnBU2w_yalQryRJKkmf3Y8YiCxgUaYNjQIwRKBiepo4dwFBjh-rFK-D0Lv9p26k5qBFcqP6jDVO5o7dpBLSyQ55ZM7s-cYZYZVEKpNicrmdQJNt5pHn3pHUx6ywi_2h5jGPy5zKWzKTQp76rOjsvvKlI2SHHDtIS4ahVXC_AK_WSST3Ue-IX3EGktxvOPK2YjPHYWg0DQ5o7ix4jA0oG38ivr_HAOc41r4DdUl8D8605-wsUMUHWjNr9bKRN2cCTy72bTdWzb5y3NJSQ1Po9IQZrnJLX-BIoR4tXKJI2wJ2UtUVBLl2zj8pvB3VWfz2KRlz8PPh_KrtTpPWdtJCdF8Chh8wiSXcUCWqMzGGzBj0HznpiZg5_P9nFBSKtuuB6PlXCUb-E-z_kN6FgOYjyE8sD9yVTFvcroXWg8FsbqWVnGuWfBOzNw_1UjwvOZClPB8fP77Id6_IgjD1MqOF5Kmh9gWI0g_XwKcMrpydBXrsRAkF8Xp4fdrji3vsqgbpPMJzg1o_2dbvUtyt7mulXP51lY3D-H_wJ_m40)



### Nível 2: Diagrama de Container
Visão das aplicações e serviços.

- *Frontend SPA:* Interface construída com React/Vite.
- *Backend API:* Servidor Node.js/Express.
- *Database:* Banco relacional PostgreSQL.

![Diagrama de Container](https://editor.plantuml.com/uml/TPFFRXen4CRlVeefbu94GQeuLbNubuI8aWrBcYCQl9EDMzQcjfU4L7sOg8UUUghw1BnOnxkmGANSl9vlPdxpUVRCURG-pvOGMPF46osXRxH7fSd2G65gCHFYBOoqNEOA43AKra12Hx9-HxnH8Swt7_gTThyphu8VXNWWJ5WrsVvUqnBU2w_yalQryRJKkmf3Y8YiCxgUaYNjQIwRKBiepo4dwFBjh-rFK-D0Lv9p26k5qBFcqP6jDVO5o7dpBLSyQ55ZM7s-cYZYZVEKpNicrmdQJNt5pHn3pHUx6ywi_2h5jGPy5zKWzKTQp76rOjsvvKlI2SHHDtIS4ahVXC_AK_WSST3Ue-IX3EGktxvOPK2YjPHYWg0DQ5o7ix4jA0oG38ivr_HAOc41r4DdUl8D8605-wsUMUHWjNr9bKRN2cCTy72bTdWzb5y3NJSQ1Po9IQZrnJLX-BIoR4tXKJI2wJ2UtUVBLl2zj8pvB3VWfz2KRlz8PPh_KrtTpPWdtJCdF8Chh8wiSXcUCWqMzGGzBj0HznpiZg5_P9nFBSKtuuB6PlXCUb-E-z_kN6FgOYjyE8sD9yVTFvcroXWg8FsbqWVnGuWfBOzNw_1UjwvOZClPB8fP77Id6_IgjD1MqOF5Kmh9gWI0g_XwKcMrpydBXrsRAkF8Xp4fdrji3vsqgbpPMJzg1o_2dbvUtyt7mulXP51lY3D-H_wJ_m40)


### Nível 3: Diagrama de Componentes

#### 3.1 Backend API
Detalhe interno da API. Segue o padrão Controller-Service-Repository, utilizando Prisma para acesso a dados.

mermaid
C4Component
    title Diagrama de Componentes - Backend API

    Container(web_app, "Frontend", "React", "Cliente HTTP")
    ContainerDb(database, "PostgreSQL", "Banco de Dados")

    Container_Boundary(api, "Backend Application") {
        
        Component(auth_middleware, "Auth Middleware", "Middleware", "Intercepta requisições para validar JWT.")
        
        Component(routes, "Routes", "Express Router", "Roteamento: /auth, /materia-prima, /producao, /produto")

        Boundary(controllers, "Controllers Layer") {
            Component(auth_ctrl, "Auth Controller", "Controller", "Trata request/response de login")
            Component(mp_ctrl, "MateriaPrima Controller", "Controller", "Trata request/response de insumos")
            Component(prod_ctrl, "Producao Controller", "Controller", "Trata request/response de OPs")
        }

        Boundary(services, "Services Layer") {
            Component(auth_svc, "Auth Service", "Service", "Lógica de autenticação")
            Component(mp_svc, "MateriaPrima Service", "Service", "Regras de negócio de MP")
            Component(prod_svc, "Producao Service", "Service", "Regras de produção e consumo")
            Component(prisma_client, "Prisma Client", "ORM", "Configuração de conexão")
        }

        Boundary(repos, "Repositories Layer") {
            Component(mp_repo, "MateriaPrima Repository", "Repository", "Abstração de banco para MP")
            Component(prod_repo, "Producao Repository", "Repository", "Abstração de banco para Produção")
        }
    }

    Rel(web_app, routes, "JSON")
    Rel(routes, auth_middleware, "Verifica")
    Rel(auth_middleware, auth_ctrl, "Passa")
    Rel(auth_middleware, mp_ctrl, "Passa")
    Rel(auth_middleware, prod_ctrl, "Passa")

    Rel(auth_ctrl, auth_svc, "Chama")
    Rel(mp_ctrl, mp_svc, "Chama")
    Rel(prod_ctrl, prod_svc, "Chama")

    Rel(mp_svc, mp_repo, "Usa")
    Rel(prod_svc, prod_repo, "Usa")

    Rel(mp_repo, prisma_client, "Query")
    Rel(prod_repo, prisma_client, "Query")
    Rel(prisma_client, database, "SQL")


#### 3.2 Frontend SPA
Estrutura de pastas e gerenciamento de estado no React/Vite.

mermaid
C4Component
    title Diagrama de Componentes - Frontend SPA

    Container(api, "Backend API", "Node.js", "Servidor")

    Container_Boundary(spa, "Frontend Application") {
        
        Component(app_entry, "App / Main", "React Entry Point", "Inicializa rotas e provedores.")
        
        Component(auth_context, "Auth Context", "Context API", "Gerencia estado global do usuário e token.")
        
        Component(private_route, "Private Route", "Component", "Protege páginas que exigem login.")

        Boundary(pages, "Pages") {
            Component(login_page, "Login Page", "Page", "Tela de acesso.")
            Component(dashboard, "Dashboard Proto", "Page", "Tela principal de gestão.")
        }

        Component(api_service, "API Service", "Axios/Fetch (api.js)", "Centraliza configurações de chamadas HTTP.")
    }

    Rel(app_entry, auth_context, "Prover estado")
    Rel(app_entry, private_route, "Renderiza")
    
    Rel(private_route, auth_context, "Verifica autenticação")
    Rel(private_route, dashboard, "Renderiza se logado")
    
    Rel(dashboard, api_service, "Busca dados")
    Rel(login_page, api_service, "Envia credenciais")
    Rel(login_page, auth_context, "Atualiza token")

    Rel(api_service, api, "HTTPS / JSON")


## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando via docker

### 1. Configuração do Backend

bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env na pasta backend com o seguinte conteúdo:
# DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
# JWT_SECRET="sua_chave_secreta"

# Rodar migrações do Prisma (criar tabelas no banco)
npx prisma migrate dev --name init

# Iniciar o servidor
npm start
# O backend rodará na porta definida (ex: 3000)


### 2. Configuração do Frontend

bash
cd frontend

# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento (Vite)
npm run dev

# Acesse o link mostrado no terminal (geralmente http://localhost:5173)
