# squad-48-Banco-do-Brasil

Projeto desenvolvido durante a **Residência Tecnológica do Porto Digital** em parceria com o **Banco do Brasil**.

Squad 48

---

# 📋 Descrição Geral do Sistema

**Charging Planner** é um sistema web desenvolvido para **planejamento de rotas para veículos elétricos**, com foco em **visualizar, localizar e filtrar estações de recarga disponíveis** no trajeto do usuário. A aplicação fornece uma interface amigável e responsiva que integra **geolocalização, roteamento dinâmico e dados simulados de estações de carregamento elétrico**, oferecendo uma experiência completa de navegação e planejamento de viagem para motoristas de veículos elétricos (EVs).

---

## 🚀 Funcionalidades

- **Visualização no Mapa (Leaflet.js)**: Exibe estações de carregamento com ícones personalizados indicando disponibilidade.

- **Pesquisa de Rotas**: Usuário informa origem e destino e o sistema calcula a melhor rota com sugestão de estações ao longo do caminho.

- **Sistema de Favoritos**: Usuários podem marcar estações como favoritas para acesso rápido.

- **Filtros Avançados**: Modal para filtrar estações por tipo de carregador, velocidade e disponibilidade.

- **Modo Escuro/Claro**: Alternância de tema visual para maior acessibilidade.

- **Painel lateral com informações do veículo**: Mostra nível da bateria, tipo de conector e autonomia estimada.

---

## 🛠️ Tecnologias Utilizadas

### Frontend
- HTML5
- CSS3
- JavaScript
- [Leaflet.js](https://leafletjs.com) – Mapa interativo
- FontAwesome – Ícones

### Backend
- Node.js
- Express
- API de estações simuladas via rota `/api/stations`

### Integrações Externas
- Nominatim – Geocodificação de endereços
- OSRM – Cálculo de rotas
- Photon (Komoot) – Autocompletar endereços
---


# 📦 Charging Planner - Instruções de Implantação do MVP

Logo abaixo descrevemos o **passo a passo completo para implantação do MVP do projeto Charging Planner**, permitindo que qualquer pessoa possa rodar a aplicação do zero, em um novo ambiente.

---

## ✅ Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 16 ou superior)
- [Git](https://git-scm.com/) (opcional, para clonar o repositório)
- Navegador web moderno (Google Chrome, Firefox, etc.)

---
## 📁 Estrutura do Projeto

```bash

squad-48-Banco-do-Brasil/
├── public/
│   ├── index.html
├── css/
│   └── styles.css
├── js/
│   └── scripts.js
├── assets/
│   └── dolphin.png
│   └── circle-user-solid.svg
├── package.json
└── README.md
└── server.js
└── vercel.json
```

> Se você não possui esses arquivos ainda, copie-os ou clone o repositório fornecido pela squad.

---

## 🚀 Etapas de Instalação e Execução

### 1. Clone ou copie os arquivos do projeto

Você pode clonar via Git:

```bash
git clone https://github.com/seu-usuario/charging-planner.git
cd charging-planner
```
### 2.  Instale as dependências do projeto
```bash
npm install
```
#### Isso instalará as bibliotecas necessárias, como:

- **express** (servidor web)

- **cors** (controle de acesso)

- **body-parser** (interpretação de requisições JSON)

- **nodemon** (opcional, para ambiente de desenvolvimento)

### 3. Estrutura de arquivos estáticos
>Verifique se os arquivos index.html, styles.css e scripts.js estão dentro de uma pasta chamada public/. Essa pasta será servida automaticamente pelo servidor Express.

### 4.Inicie o servidor local

#### Para ambiente de produção ou testes:

```bash
npm start
```
#### Para ambiente de desenvolvimento (com recarregamento automático):

```bash
npm run dev
```

### 5. Acesse o sistema no navegador

```arduino
http://localhost:3001
```
> Você verá a interface principal do Charging Planner, com mapa, pesquisa de rota, estações de carregamento e painéis laterais.

## 🧪 Teste a aplicação

### Você pode testar funcionalidades como:

- Cálculo de rotas entre dois endereços (usa OSRM + Nominatim)

- Estações carregadas a partir da rota /api/stations com dados simulados

- Filtros de estações via modal (tipo, velocidade e disponibilidade)

- Marcadores personalizados no mapa

- Alternância de tema claro/escuro

- Favoritar estações

## 🧯 Solução de Problemas

### O mapa não aparece?

- Verifique se há conexão com a internet (usa Leaflet e APIs externas).

- Confirme que os arquivos estão dentro da pasta public/.

### A API /api/stations não responde?

- Certifique-se de que o servidor Express está rodando corretamente (npm start).

- Acesse diretamente http://localhost:3001/api/stations e veja se há resposta JSON.

## 📌 Observações Finais

Este projeto foi desenvolvido com fins acadêmicos e de aprendizado, com foco em promover soluções sustentáveis e tecnológicas para o setor de mobilidade elétrica.

Sinta-se à vontade para explorar, adaptar e evoluir esta aplicação conforme suas necessidades.

---

**© 2025 Charging Planner**