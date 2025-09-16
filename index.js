// mock_api.js
const express = require('express');
const path = require('path')
const app = express();
const PORT = 8080;

// Pagina Inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html/home.html'));
});


app.listen(PORT, () => console.log(`[Servidor] Rodando em http://localhost:${PORT}`));