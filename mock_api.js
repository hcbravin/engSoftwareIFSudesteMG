// mock_api.js
const express = require('express');
const app = express();
const PORT = 3001;

// "Banco de dados" falso de peças do C4 Cactus
const pecasMock = {
  "1609428080": { nome: "Filtro de Óleo" },
  "9815217480": { nome: "Pastilha de Freio Dianteira" },
  "1610940380": { nome: "Filtro de Ar do Motor" },
  "2378154690": { nome: "Amortecedor Dianteiro" },
  "5689231470": { nome: "Bomba de Combustível" },
  "3498765120": { nome: "Correia Dentada" },
  "7123456890": { nome: "Velas de Ignição" },
  "8956234170": { nome: "Radiador" },
  "1239874560": { nome: "Disco de Freio Traseiro" },
  "4567891230": { nome: "Sensor de Oxigênio" },
  "7891234560": { nome: "Bobina de Ignição" },
  "2345678910": { nome: "Termostato" },
  "5678912340": { nome: "Bomba de Água" },
  "8912345670": { nome: "Junta do Cabeçote" },
  "3456789120": { nome: "Cabo de Vela" },
  "6789123450": { nome: "Filtro de Combustível" },
  "9123456780": { nome: "Lâmpada Farol Dianteiro" },
  "4321876590": { nome: "Embreagem Completa" },
  "7654321890": { nome: "Sensor de Temperatura" },
  "1987654320": { nome: "Bieleta da Suspensão" },
  "5432198760": { nome: "Mangueira do Radiador" },
  "8765432190": { nome: "Rolamento da Roda" },
  "2198765430": { nome: "Correia do Alternador" },
  "6543219870": { nome: "Filtro de Ar do Habitáculo" },
  "9876543210": { nome: "Limpador de Para-brisa" },
  "3219876540": { nome: "Bomba de Direção Hidráulica" },
  "6549873210": { nome: "Coxim do Motor" },
  "9873216540": { nome: "Sensor ABS" },
  "1472583690": { nome: "Vela de Glow" },
  "2583691470": { nome: "Intercooler" },
  "3691472580": { nome: "Turbina" },
  "4715826930": { nome: "Catalisador" },
  "5826934710": { nome: "Módulo de Injeção" },
  "6934715820": { nome: "Reservatório de Óleo" },
  "8147259360": { nome: "Bomba de Vacuo" },
  "9258361470": { nome: "Sensor de Pressão do Óleo" },
  "1369472580": { nome: "Radiador de Óleo" },
  "2471583690": { nome: "Válvula Termostática" },
  "3582691470": { nome: "Bomba de Freio" },
  "4693715820": { nome: "Cilindro Mestre" },
  "5714826930": { nome: "Lanterna Traseira" },
  "6825937140": { nome: "Farol de Neblina" },
  "7936148250": { nome: "Motor de Arranque" },
  "8147259361": { nome: "Alternador" },
  "9258361472": { nome: "Compressor de Ar Condicionado" },
  "1369472583": { nome: "Condensador" },
  "2471583694": { nome: "Evaporador" },
  "3582691475": { nome: "Válvula EGR" },
  "4693715826": { nome: "Sensor de Posição do Virabrequim" },
  "5714826937": { nome: "Sensor de Posição do Comando" },
  "6825937148": { nome: "Atuador VVT" },
  "7936148259": { nome: "Corpo de Borboleta" },
  "1846372950": { nome: "Módulo de Controle do Motor" },
  "2957483610": { nome: "Radiador de Direção" },
  "3618594720": { nome: "Bomba de Óleo" },
  "4729615830": { nome: "Reservatório de Água" },
  "5831726940": { nome: "Suporte do Motor" },
  "6942837150": { nome: "Bucha da Suspensão" },
  "7153948260": { nome: "Barra Estabilizadora" },
  "8264159370": { nome: "Pivô da Suspensão" },
  "9375261480": { nome: "Mola Helicoidal" },
  "1486372590": { nome: "Amortecedor Traseiro" }
};

app.get('/api/pecas/:codigo', (req, res) => {
  const { codigo } = req.params;
  const peca = pecasMock[codigo];

  if (peca) {
    res.status(200).json(peca);
  } else {
    res.status(404).json({ error: 'Peça não encontrada no catálogo mockado' });
  }
});

app.listen(PORT, () => console.log(`[Mock API] Rodando em http://localhost:${PORT}`));