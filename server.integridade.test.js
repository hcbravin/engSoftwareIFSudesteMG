const request = require('supertest');
const app = require('./server'); // Importamos nosso app Express

describe('Testes de Integração para as Rotas', () => {

    it('GET / - deve retornar status 200 e o título da página principal', async () => {
        const response = await request(app).get('/');

        // Verifica se a resposta HTTP teve sucesso
        expect(response.statusCode).toBe(200);

        // Verifica se o HTML da resposta contém o título esperado
        expect(response.text).toContain('Histórico de Manutenção - C4 Cactus');
    });

    it('GET /manutencao/:id - deve retornar os detalhes de uma manutenção existente', async () => {
        const response = await request(app).get('/manutencao/1');

        expect(response.statusCode).toBe(200);
        // Verifica se os detalhes do primeiro item do nosso "banco de dados" estão na página
        expect(response.text).toContain('Troca de óleo e filtro');
    });

    it('GET /manutencao/:id - deve retornar 404 para uma manutenção inexistente', async () => {
        const response = await request(app).get('/manutencao/999');

        expect(response.statusCode).toBe(404);
    });

    // NOVO TESTE PARA CRIAR UMA MANUTENÇÃO
    it('POST /novo - deve criar uma nova manutenção e redirecionar', async () => {
        const novaManutencao = {
            data: "2025-10-01",
            quilometragem: 80000,
            servico: "Troca do filtro de ar",
            codigoPeca: "1610940380",
            nomePeca: "Filtro de Ar do Motor",
            custo: 150.00,
            observacoes: "Peça original."
        };

        const response = await request(app)
            .post('/novo')
            .send(novaManutencao); // .send() envia os dados no corpo da requisição

        // Após criar, a aplicação redireciona para a home, então o status é 302
        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/'); // Verifica se o redirecionamento foi para a raiz

        // Agora, vamos verificar se o item foi realmente adicionado
        const getResponse = await request(app).get('/');
        expect(getResponse.text).toContain("Troca do filtro de ar");
    });

    // NOVO TESTE PARA ATUALIZAR UMA MANUTENÇÃO
    it('POST /manutencao/:id/editar - deve atualizar uma manutenção existente', async () => {
        const dadosAtualizados = {
            data: "2025-09-20",
            quilometragem: 75100, // KM atualizada
            servico: "Troca de óleo e filtro de motor", // Serviço atualizado
            codigoPeca: "1609428080",
            nomePeca: "Filtro de Óleo",
            custo: 350.50,
            observacoes: "Utilizado óleo Total 5W30."
        };

        const response = await request(app)
            .post('/manutencao/1/editar')
            .send(dadosAtualizados);

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/manutencao/1');

        const getResponse = await request(app).get('/manutencao/1');
        expect(getResponse.text).toContain("Troca de óleo e filtro de motor");
        expect(getResponse.text).toContain("75.100 km");
    });

    // NOVO TESTE PARA EXCLUIR UMA MANUTENÇÃO
    it('POST /manutencao/:id/excluir - deve excluir uma manutenção', async () => {
        // Vamos excluir o item com id=2
        const response = await request(app)
            .post('/manutencao/2/excluir');

        expect(response.statusCode).toBe(302);
        expect(response.headers.location).toBe('/');

        const getResponse = await request(app).get('/');
        // Verifica se o item com id=2 NÃO está mais na página
        expect(getResponse.text).not.toContain("Pastilha de Freio Dianteira");
    });

     // NOVO TESTE PARA A ROTA AUXILIAR DA API
    it('GET /api/peca/:codigo - deve retornar os dados da peça do mock', async () => {
        const response = await request(app).get('/api/peca/1609428080');

        expect(response.statusCode).toBe(200);
        // Verifica se a resposta é um JSON com o nome da peça
        expect(response.body.nome).toBe('Filtro de Óleo');
    });

    it('POST /manutencao/:id/editar - deve retornar 404 ao tentar editar um ID inexistente', async () => {
        const dadosAtualizados = {
            data: "2025-09-20",
            quilometragem: 75100,
            servico: "Qualquer serviço",
            custo: 100
        };

        // Tenta editar o ID 999, que não existe
        const response = await request(app)
            .post('/manutencao/999/editar')
            .send(dadosAtualizados);

        expect(response.statusCode).toBe(404);
    });

    it('GET /manutencao/:id/editar - deve retornar 404 ao tentar carregar a página de edição de um ID inexistente', async () => {
        const response = await request(app).get('/manutencao/999/editar');
        expect(response.statusCode).toBe(404);
    });

});

describe('Testes para cenários de falha (Not Found)', () => {
    
    it('GET /manutencao/:id - deve retornar 404 ao buscar um ID inexistente', async () => {
        const response = await request(app).get('/manutencao/999');
        expect(response.statusCode).toBe(404);
    });

    it('GET /manutencao/:id/editar - deve retornar 404 ao tentar carregar a página de edição de um ID inexistente', async () => {
        const response = await request(app).get('/manutencao/999/editar');
        expect(response.statusCode).toBe(404);
    });

    it('POST /manutencao/:id/editar - deve retornar 404 ao tentar atualizar um ID inexistente', async () => {
        const response = await request(app)
            .post('/manutencao/999/editar')
            .send({ data: '2025-01-01', servico: 'teste', quilometragem: 1, custo: 1 }); // Dados de exemplo
        
        expect(response.statusCode).toBe(404);
    });

});