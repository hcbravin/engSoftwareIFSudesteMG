const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = 3000;
const MOCK_API_BASE_URL = 'http://localhost:3001'; // URL do nosso servidor mockado

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); 


// DB em Memória Simulado
let manutencoes = [
    { id: 1, data: "2025-09-20", quilometragem: 75000, servico: "Troca de óleo e filtro", codigoPeca: "1609428080", nomePeca: "Filtro de Óleo", custo: 350.50, observacoes: "Utilizado óleo Total 5W30." },
    { id: 2, data: "2025-09-22", quilometragem: 75250, servico: "Troca de Pastilhas de Freio", codigoPeca: "9815217480", nomePeca: "Pastilha de Freio Dianteira", custo: 480.00, observacoes: "Pastilhas originais." }
];
let nextId = 3; // Variável para gerar o próximo ID


// --------------------------------------------- ROTAS ---------------------------------------------

app.get('/', (req, res) => {
    // Renderiza o arquivo 'historico.ejs' e passa a lista de manutenções para ele
    res.render('historico', { manutencoes });
});

app.get('/novo', (req, res) => {
    // Apenas renderiza a página com o formulário
    res.render('formulario');
});

app.post('/novo', (req, res) => {
    const novaManutencao = {
        id: nextId++,
        data: req.body.data,
        quilometragem: parseInt(req.body.quilometragem),
        servico: req.body.servico,
        codigoPeca: req.body.codigoPeca,
        nomePeca: req.body.nomePeca, // O nome da peça já veio preenchido do front-end
        custo: parseFloat(req.body.custo),
        observacoes: req.body.observacoes
    };

    manutencoes.push(novaManutencao);
    console.log('[App Principal] Nova manutenção salva:', novaManutencao);

    // Redireciona o usuário de volta para a página inicial
    res.redirect('/');
});

// o front-end vai chamar para falar com a API Mockada
app.get('/api/peca/:codigo', async (req, res) => {
    const { codigo } = req.params;
    try {
        // A nossa aplicação principal chama a API Mockada
        const resposta = await axios.get(`${MOCK_API_BASE_URL}/api/pecas/${codigo}`);
        // E retorna a resposta da API Mockada para o front-end
        res.json(resposta.data);
    } catch (error) {
        res.status(404).json({ error: 'Peça não encontrada' });
    }
});

app.get('/manutencao/:id', (req, res) => {
    const id = parseInt(req.params.id); // Converte o ID da URL para número
    const manutencao = manutencoes.find(m => m.id === id); // Procura a manutenção pelo ID

    if (manutencao) {
        res.render('detalhes', { manutencao }); // Renderiza a página de detalhes
    } else {
        res.status(404).send('Manutenção não encontrada!'); // Retorna erro 404 se não encontrar
    }
});

app.get('/manutencao/:id/editar', (req, res) => {
    const id = parseInt(req.params.id);
    const manutencao = manutencoes.find(m => m.id === id);

    if (manutencao) {
        // Reutilizamos o mesmo formulário, mas passamos os dados existentes
        res.render('formulario', { manutencao });
    } else {
        res.status(404).send('Manutenção não encontrada!');
    }
});

app.post('/manutencao/:id/editar', (req, res) => {
    const id = parseInt(req.params.id);
    const index = manutencoes.findIndex(m => m.id === id); // Encontra o índice do item no array

    if (index !== -1) {
        // Atualiza o objeto no array com os novos dados do formulário
        manutencoes[index] = {
            id: id,
            data: req.body.data,
            quilometragem: parseInt(req.body.quilometragem),
            servico: req.body.servico,
            codigoPeca: req.body.codigoPeca,
            nomePeca: req.body.nomePeca,
            custo: parseFloat(req.body.custo),
            observacoes: req.body.observacoes
        };
        console.log('[App Principal] Manutenção atualizada:', manutencoes[index]);
        res.redirect(`/manutencao/${id}`); // Redireciona para a página de detalhes
    } else {
        res.status(404).send('Manutenção não encontrada!');
    }
});

app.post('/manutencao/:id/excluir', (req, res) => {
    const id = parseInt(req.params.id);
    // Filtra o array, mantendo todos os itens EXCETO o que tem o ID correspondente
    manutencoes = manutencoes.filter(m => m.id !== id);
    console.log(`[App Principal] Manutenção com ID ${id} excluída.`);

    res.redirect('/'); // Redireciona para a página inicial
});


// app.listen(PORT, () => {
//     console.log(`[App Principal] Servidor rodando em http://localhost:${PORT}`);
// });

module.exports = app;