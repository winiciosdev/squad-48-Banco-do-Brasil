const express = require("express");
const cors = require('cors');
const path = require("path");
const app = express();
const port = process.env.PORT || 3001;

// Configurações essenciais
app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json()); // Habilita parsing de JSON
app.use(express.static(path.join(__dirname, "public"))); // Arquivos estáticos

// Rota principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// API de estações de carregamento (mockada)
const stations = [
  {
    id: 1,
    name: "RioMar Recife – Estacionamento Coberto",
    lat: -8.0856,
    lng: -34.8916,
    type: "Tipo 2 (AC)",
    speed: "Média (22kW)",
    power: 22,
    distance: 0.5,
    rating: 4.2,
    favorite: true,
    available: true,
  },
  {
    id: 2,
    name: "Shopping Recife – Edifício-Garagem B1",
    lat: -8.1192,
    lng: -34.9011,
    type: "Tipo 2 (AC)",
    speed: "Padrão (22kW)",
    power: 22,
    distance: 1.2,
    rating: 4.5,
    favorite: true,
    available: true,
  },
  {
    id: 3,
    name: "Eletroposto Estapar - Estacionamentos Aeroporto",
    lat: -8.1310,
    lng: -34.9172,
    type: "Conector Universal",
    speed: "Média (7kW)",
    power: 7,
    distance: 3.1,
    rating: 3.9,
    favorite: false,
    available: false,
  },
  {
    id: 4,
    name: "Eco Carga",
    lat: -8.1290,
    lng: -34.9125,
    type: "Tipo 2",
    speed: "Média (7kW)",
    power: 7,
    distance: 0.0,
    rating: 4.8,
    favorite: true,
    available: true,
  },
];

// Rota da API
app.get("/api/stations", (req, res) => {
  try {
    // Adicione headers para melhor compatibilidade
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Content-Type', 'application/json');
    res.json(stations);
  } catch (error) {
    console.error("Erro na API:", error);
    res.status(500).json({ error: "Erro ao carregar estações" });
  }
});

// Rota de health check para o Vercel
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Exporte o app para o Vercel
module.exports = app;

// Inicia o servidor apenas em desenvolvimento local
if (process.env.VERCEL !== "1") {
  app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
  });
}