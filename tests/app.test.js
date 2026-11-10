const request = require('supertest');
const app = require('../src/app');

describe('API do Seminário CI/CD', () => {
  test('GET / retorna mensagem e versão', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body.mensagem).toBeDefined();
    expect(res.body.versao).toBeDefined();
  });

  test('GET / no navegador retorna o painel visual', async () => {
    const res = await request(app).get('/').set('Accept', 'text/html');
    expect(res.status).toBe(200);
    expect(res.text).toContain('<title>Seminário CI/CD</title>');
  });

  test('GET /health retorna ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  test('GET /soma soma dois números', async () => {
    const res = await request(app).get('/soma?a=2&b=3');
    expect(res.status).toBe(200);
    expect(res.body.resultado).toBe(5);
  });

  test('GET /soma recusa parâmetros inválidos', async () => {
    const res = await request(app).get('/soma?a=x&b=3');
    expect(res.status).toBe(400);
  });

  test('GET /sobre retorna informações do projeto', async () => {
    const res = await request(app).get('/sobre');
    expect(res.status).toBe(200);
    expect(res.body.projeto).toBe('Seminário CI/CD');
  });

  test('GET /metrics expõe métricas para o Prometheus', async () => {
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('http_requests_total');
  });
});
