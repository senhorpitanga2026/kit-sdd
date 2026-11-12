// Incremento 01 — cadastro e listagem. Um teste por cenário da spec (C1–C6).
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, postJson, getJson } = require('./helpers.js');

let srv;
beforeEach(async () => { srv = await startServer(); });
afterEach(async () => { await srv.close(); });

test('C1: lista começa vazia', async () => {
  const res = await getJson(srv.baseUrl, '/participants');
  assert.equal(res.status, 200);
  assert.deepEqual(res.json, []);
});

test('C2: cadastro válido aparece na lista', async () => {
  const created = await postJson(srv.baseUrl, '/participants', {
    name: 'Ana Lima',
    email: 'ana@mail.com',
  });
  assert.equal(created.status, 201);
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.status, 200);
  assert.deepEqual(list.json, [{ name: 'Ana Lima', email: 'ana@mail.com' }]);
});

test('C3: e-mail duplicado é recusado', async () => {
  await postJson(srv.baseUrl, '/participants', { name: 'Ana Lima', email: 'ana@mail.com' });
  const dup = await postJson(srv.baseUrl, '/participants', { name: 'Ana L.', email: ' Ana@Mail.com ' });
  assert.equal(dup.status, 409);
  assert.equal(dup.json.error, 'E-mail já cadastrado');
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.json.length, 1);
});

test('C4: nome inválido é recusado', async () => {
  const emptyName = await postJson(srv.baseUrl, '/participants', { name: '', email: 'ana@mail.com' });
  assert.equal(emptyName.status, 400);
  assert.equal(emptyName.json.error, 'Nome e e-mail são obrigatórios');
  const shortName = await postJson(srv.baseUrl, '/participants', { name: 'A', email: 'bia@mail.com' });
  assert.equal(shortName.status, 400);
  assert.equal(shortName.json.error, 'Nome e e-mail são obrigatórios');
  const list = await getJson(srv.baseUrl, '/participants');
  assert.deepEqual(list.json, []);
});

test('C5: e-mail é armazenado normalizado', async () => {
  const created = await postJson(srv.baseUrl, '/participants', { name: 'Bia', email: ' BIA@Mail.com ' });
  assert.equal(created.status, 201);
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.json[0].email, 'bia@mail.com');
});

test('C6: lista mantém a ordem de cadastro', async () => {
  await postJson(srv.baseUrl, '/participants', { name: 'Ana Lima', email: 'ana@mail.com' });
  await postJson(srv.baseUrl, '/participants', { name: 'Bia', email: 'bia@mail.com' });
  const list = await getJson(srv.baseUrl, '/participants');
  assert.deepEqual(list.json.map((participant) => participant.name), ['Ana Lima', 'Bia']);
});

test('C7: e-mail com máscara inválida é recusado', async () => {
  const invalid = await postJson(srv.baseUrl, '/participants', {
    name: 'Ana Lima',
    email: 'ana@mail',
  });
  assert.equal(invalid.status, 400);
  assert.equal(invalid.json.error, 'E-mail inválido');
  const list = await getJson(srv.baseUrl, '/participants');
  assert.deepEqual(list.json, []);
});
