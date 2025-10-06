const request = require('supertest');
const app = require('./server');
const axios = require('axios');

jest.mock('axios');

describe('Testes da aplicação principal com API mockada', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET / - deve retornar status 200 e o título da página principal', async () => {
        const res = await request(app).get('/');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Histórico de Manutenção');
    });

    it('GET /manutencao/:id - deve retornar os detalhes de uma manutenção existente', async () => {
        const res = await request(app).get('/manutencao/1');
        expect(res.statusCode).toBe(200);
        expect(res.text).toContain('Troca de óleo e filtro');
    });

    it('GET /manutencao/:id - deve retornar 404 para manutenção inexistente', async () => {
        const res = await request(app).get('/manutencao/999');
        expect(res.statusCode).toBe(404);
    });

    it('POST /novo - deve criar uma nova manutenção e redirecionar', async () => {
        const nova = {
            data: "2025-10-01",
            quilometragem: 80000,
            servico: "Troca do filtro de ar",
            codigoPeca: "1610940380",
            nomePeca: "Filtro de Ar do Motor",
            custo: 150.00,
            observacoes: "Peça original."
        };
        const res = await request(app).post('/novo').send(nova);
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
        const getRes = await request(app).get('/');
        expect(getRes.text).toContain("Troca do filtro de ar");
    });

    it('POST /manutencao/:id/editar - deve atualizar manutenção existente', async () => {
        const dados = {
            data: "2025-09-21",
            quilometragem: 75200,
            servico: "Troca de óleo e filtro de motor",
            codigoPeca: "1609428080",
            nomePeca: "Filtro de Óleo",
            custo: 370.00,
            observacoes: "Óleo sintético."
        };
        const res = await request(app).post('/manutencao/1/editar').send(dados);
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/manutencao/1');
        const getRes = await request(app).get('/manutencao/1');
        expect(getRes.text).toContain("Troca de óleo e filtro de motor");
        expect(getRes.text).toContain("75.200 km");
    });

    it('POST /manutencao/:id/editar - deve retornar 404 se o ID não existir', async () => {
        const res = await request(app).post('/manutencao/999/editar').send({ servico: "teste" });
        expect(res.statusCode).toBe(404);
    });

    it('POST /manutencao/:id/excluir - deve excluir uma manutenção existente', async () => {
        const res = await request(app).post('/manutencao/2/excluir');
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
        const getRes = await request(app).get('/');
        expect(getRes.text).not.toContain("Pastilha de Freio Dianteira");
    });

    it('POST /novo - deve lidar com dados incompletos (branch de fallback)', async () => {
        const res = await request(app).post('/novo').send({
            servico: "Serviço sem dados completos"
        });
        expect(res.statusCode).toBe(302);
        expect(res.headers.location).toBe('/');
    });

    it('POST /manutencao/:id/editar - deve lidar com corpo vazio e manter dados antigos', async () => {
        const res = await request(app).post('/manutencao/1/editar').send({});
        expect(res.statusCode).toBe(302);
        const getRes = await request(app).get('/manutencao/1');
        expect(getRes.statusCode).toBe(200);
    });

    it('GET /manutencao/:id/editar - deve retornar 404 ao tentar editar ID inexistente', async () => {
        const res = await request(app).get('/manutencao/999/editar');
        expect(res.statusCode).toBe(404);
        expect(res.text).toContain('Manutenção não encontrada');
    });

    describe('API Mockada - /api/peca/:codigo', () => {

        it('deve retornar os dados da peça simulada (mock)', async () => {
            const mockData = { nome: "Filtro de Óleo", codigo: "1609428080", preco: 80.50 };
            axios.get.mockResolvedValue({ data: mockData });

            const res = await request(app).get('/api/peca/1609428080');

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(mockData);
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('/api/pecas/1609428080'));
        });

        it('deve retornar 404 se o mock lançar erro (peça inexistente)', async () => {
            axios.get.mockRejectedValue(new Error('Peça não encontrada'));

            const res = await request(app).get('/api/peca/000000');

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Peça não encontrada');
        });

        it('GET /api/peca/:codigo - deve retornar 404 se axios lançar erro inesperado', async () => {
            axios.get.mockImplementation(() => { throw new Error('Erro de rede'); });
            const res = await request(app).get('/api/peca/123456');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Peça não encontrada');
        });

        it('GET /api/peca/:codigo - deve retornar 404 se a API mockada lançar rejeição com objeto error', async () => {
            axios.get.mockRejectedValueOnce({ response: { status: 500 } });
            const res = await request(app).get('/api/peca/999999');
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Peça não encontrada');
        });
    });
});
