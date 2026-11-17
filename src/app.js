const path = require('path');
const express = require('express');
const client = require('prom-client');
const { version } = require('../package.json');

const app = express();

const APP_VERSION = process.env.APP_VERSION || version;
const GIT_COMMIT = process.env.GIT_COMMIT || 'local';
const CLIENTE = process.env.CLIENTE || 'cliente-demo';
const REPOSITORIO = process.env.REPOSITORIO || 'https://github.com/luccasamuel/seminario-cicd';
const INICIADO_EM = new Date().toISOString();

const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total de requisições HTTP',
  labelNames: ['method', 'route', 'status'],
  registers: [register],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequests.inc({ method: req.method, route: req.path, status: res.statusCode });
  });
  next();
});

app.get('/', (req, res) => {
  if (req.accepts(['json', 'html']) === 'html') {
    return res.sendFile(path.join(__dirname, 'public', 'index.html'));
  }
  res.json({
    mensagem: 'Seminário CI/CD funcionando!',
    cliente: CLIENTE,
    versao: APP_VERSION,
    commit: GIT_COMMIT,
    iniciadoEm: INICIADO_EM,
    repositorio: REPOSITORIO,
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/soma', (req, res) => {
  const a = Number(req.query.a);
  const b = Number(req.query.b);
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ erro: 'Parâmetros a e b devem ser números' });
  }
  res.json({ resultado: a + b });
});

app.get('/sobre', (req, res) => {
  const sobre = { projeto: 'Seminário CI/CD', equipe: 'Lucca, Ketlen, Enio e Leonardo' };

  if (req.accepts(['json', 'html']) === 'html') {
    return res.sendFile(path.join(__dirname, 'public', 'sobre.html'));
  }
  const membros = sobre.equipe.split(/\s*,\s*|\s+e\s+/).filter(Boolean);
  res.json({ ...sobre, membros });
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

module.exports = app;
