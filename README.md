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

![Diagrama de Contexto do ProdSync](https://www.plantuml.com/plantuml/svg/PLB1JW8n4BttAqOkGe8I4ux6a0114qK21uzas8xOfBkLQPU8VsCyUE9a_8BzCQUxx88nsSEqy-QzUQyxy04vvAc56Jkzs6K935qMw2t0oE2QCLNg7EwonEO6459Cs86c6kHWsE_AhV70RfKB6Mno0XFncdAswknGm_MmtnlsbuV16wLU23KnJ8lzbYnSgM22fLeL_uXSDDifDIFsBcklYKcwNMXDgYeEH5HUV1MVhbKt4eFWM5Fc8-2r0NI1qGScN1bhj6m214mMG_7DnldBLgTM8X_S9ZVYJJZ7pI4gp0cjUPTOtDQaiWGAzG-LId9YrDZpMEmrGinaAtV5Xx17ShNO-K1fEsxanPYmDIzGjQB0miIg2OETBNrMMyILZuuXSIaykyG1fV-yoMTTeDAMcfCzndUYt-HrJ4dW4NqQmSd0GsqRAW2LlcuVdvRtuybuEcftr80oBN_NBm00)



### Nível 2: Diagrama de Container
Visão das aplicações e serviços.

- *Frontend SPA:* Interface construída com React/Vite.
- *Backend API:* Servidor Node.js/Express.
- *Database:* Banco relacional PostgreSQL.

![Diagrama de Container](https://www.plantuml.com/plantuml/svg/TPFFRXen4CRlVeefbu94GQeuLbNubuI8aWrBcYCQl9EDMzQcjfU4L7sOg8UUUghw1BnOnxkmGANSl9vlPdxpUVRCURG-pvOGMPF46osXRxH7fSd2G65gCHFYBOoqNEOA43AKra12Hx9-HxnH8Swt7_gTThyphu8VXNWWJ5WrsVvUqnBU2w_yalQryRJKkmf3Y8YiCxgUaYNjQIwRKBiepo4dwFBjh-rFK-D0Lv9p26k5qBFcqP6jDVO5o7dpBLSyQ55ZM7s-cYZYZVEKpNicrmdQJNt5pHn3pHUx6ywi_2h5jGPy5zKWzKTQp76rOjsvvKlI2SHHDtIS4ahVXC_AK_WSST3Ue-IX3EGktxvOPK2YjPHYWg0DQ5o7ix4jA0oG38ivr_HAOc41r4DdUl8D8605-wsUMUHWjNr9bKRN2cCTy72bTdWzb5y3NJSQ1Po9IQZrnJLX-BIoR4tXKJI2wJ2UtUVBLl2zj8pvB3VWfz2KRlz8PPh_KrtTpPWdtJCdF8Chh8wiSXcUCWqMzGGzBj0HznpiZg5_P9nFBSKtuuB6PlXCUb-E-z_kN6FgOYjyE8sD9yVTFvcroXWg8FsbqWVnGuWfBOzNw_1UjwvOZClPB8fP77Id6_IgjD1MqOF5Kmh9gWI0g_XwKcMrpydBXrsRAkF8Xp4fdrji3vsqgbpPMJzg1o_2dbvUtyt7mulXP51lY3D-H_wJ_m40)


### Nível 3: Diagrama de Componentes

#### 3.1 Backend API
Detalhe interno da API. Segue o padrão Controller-Service-Repository, utilizando Prisma para acesso a dados.

![Diagrama de Componentes](https://www.plantuml.com/plantuml/svg/dLNDJjj04BxxARQvD4ZG7CgfgYh0eGMK49E4ShGcwo6iQdlTtNKWGdsQ7dhg2VK9ycATNV_c1rg15B4_ttmpyysCzqWRK2PFOXOe6KsMAMSdmBzX6Z5V9fbCCJMQzGNC5IIUzvQTfppE1GEM05UIHTZWK3F_q7iZB8BEF_g7FVymhAy_UTuTGeIANQv-Bp1cxpqZJ8mLEsoI7TIX70VddkVBr818KNNlSHP2beMSmE5idtK-AxeZO8VMOmHkxCAFXULXPzDfqDbhpFkpRWG6Pg2nOGYaDdE5awk1DJs1bBlS-X19JSQDTNWYypG2jUn29Xoq337BOi7129bszjYZjIWpwK9kxi94H56Czw2GZ8xfX0th4-joVNTEWIkEcG6cy7ikj5ZzMlqXJJ9Gm1OG2mg1NTnCtnN1LQwKp4avgu9RMAhJXqoXrioTAAUGD0W9mUK7rhF1xRDU0dGfu21J8W7QPzGDEGTPBOsqZkhSEScXP1oZiixyPiS6i2GlLW56VniYSAFYAlt6gBD6ONTJ1MNcg4sFmYSIZROWiPmB4dY3d8fOKW-BF0ARnYjTY5JdYQlwkXEhG-KcAELvfOjHOEb_j0JLg1Q2kz9DokNBKke5hvGi3JgDhLqELazpQaZhZWp8ZZRKH3_bBlKAjZNnThEEaKPLMz8KvwidBjoO38FTQXMqjLZ_edITvc9aoAZ5R1rs40kTGCZTT3jsksV5j5k-qNXOrk9Mp7DL96tfYH4V2W7QqYlCf1iP-ryOgSGBsfDM5hyfLcsxxBIPtEvufaqhYfdxjhWvVawsqaEjs-lOWrhD8c7x6sEyzVMilnaNaz4bGIscEjl-T7sbf6-fbKhW5g0zvm5e_IomcTaNOMjJLm8RP77H6WZ_ZXwIaglsK3Tu-xP5tEhL2b4HkDEcwDTwpTpTjajshTl6nU5cmrxbIALhiVmFRErk-_coxnRvdPoDRiB1wPVJotvtppkYTubUzhy0)


#### 3.2 Frontend SPA
Estrutura de pastas e gerenciamento de estado no React/Vite.

![Diagrama de Componentes](https://www.plantuml.com/plantuml/svg/RLHDSzCm4BtxLoovqCn0Uw17XccQfXzC2Pwu0qUFAcyTWICPISwqCFoOJW-SEF8ByiTuQoTfOl15MldjUwlTPv-4g7ni5XMbtXNPWzLqxfsDR0iQkqNjBDiOwCoeqgj5ahoaAwkhnf2YXTBUKS7FE0uqFavU647W_Etu-6Xyd6zVlqkIEQk2FKrNlvTSqPiacbZnXbtroLu_rvAbeoGP8r36iZzGjSaraFdTAngSAlrLCAFqQe1mwWe-_19acx5VciBvmN0dEJzrZIsKVpW8jG9egp6gwyfe5OspWo7za9HrBT2hSwp-0NZ0w8W-W4iaPgnqf8cyezGP6-NmoXfjL6M-A_8kga1CjNTBHYaS3hjgjjHDdECkAE4-2Zj26dUXKAstcyjTi6SBRc8Chd1KLkvMLOHT4vhLepSEMj6X7psPsfkbYfnxrqG6KTh5D9Eu4rf31-rR5xb4rQl7qbXSu5l3nFUcv0LL3aSj-xQHjIevI9giRUy8pxDucv8B2g1h2KYWWtMAh3TSjVDNcaDmGhzFKQWmltNA5y2URVPYskZ-eS5TqQDQ-iA4YkBggMNykJzIamVnXvQYq5xAkaXeHlV6XQDpZdfEWeIVXcsJn0JTO36oErCsNgr-hVx0h93ISvWOXTBbpKtQTaWaPrpj-gStxrHyuTVZH4eFtH_R34Pb3trX5smFq6F_1EmTF2tdOCGErJvjT7gvkotUwb1WcNXNN9kr0zlluMaJe5G06jO2ktFVnqxi4YRMdelMpkQ_6Rql8pPTvrjxRwhPeztxBSWGCdofxxEFKq5dbny_vzUJYydqx62OdE22-Etz1G00)

## 🚀 Como Executar Localmente

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando via docker

## 1. Configuração do Backend

```bash
cd backend
```

### Instalar dependências
```bash
npm install
```

## Configurar variáveis de ambiente
### Crie um arquivo .env na pasta backend com o seguinte conteúdo:
```bash
DATABASE_URL="postgresql://SEU_USUARIO:SUA_SENHA@localhost:5432/NOME_DO_BANCO?schema=public"
JWT_SECRET="sua_chave_secreta"
```

## Rodar migrações do Prisma (criar tabelas no banco)
```bash
npx prisma migrate dev --name init
```

## Iniciar o servidor
```bash
npm start
```
## O backend rodará na porta definida (ex: 3000)


## 2. Configuração do Frontend

```bash
cd frontend
```

## Instalar dependências
```bash
npm install
```

## Iniciar o servidor de desenvolvimento (Vite)
```bash
npm run dev
```

## Acesse o link mostrado no terminal (geralmente http://localhost:5173)
