// Incremento 02 — vagas e fila de espera. Um teste por cenário da spec (C1–C5).
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, postJson, getJson, del } = require('./helpers.js');

let srv;
beforeEach(async () => { srv = await startServer(); });
afterEach(async () => { await srv.close(); });

async function register(number) {
  return postJson(srv.baseUrl, '/participants', {
    name: `Pessoa ${number}`,
    email: `pessoa${number}@mail.com`,
  });
}

test('C1: três pessoas confirmadas e as demais aguardam', async () => {
  const statuses = [];
  for (let number = 1; number <= 4; number += 1) {
    const response = await register(number);
    assert.equal(response.status, 201);
    statuses.push(response.json.status);
  }
  assert.deepEqual(statuses, ['confirmed', 'confirmed', 'confirmed', 'waitlist']);
});

test('C2: fila mantém a ordem após liberar uma vaga', async () => {
  for (let number = 1; number <= 7; number += 1) await register(number);
  const removed = await del(srv.baseUrl, '/participants/pessoa1%40mail.com');
  assert.equal(removed.status, 204);
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.status, 200);
  assert.deepEqual(
    list.json.filter((participant) => participant.status === 'waitlist').map((participant) => participant.name),
    ['Pessoa 5', 'Pessoa 6', 'Pessoa 7'],
  );
  assert.ok(list.json.findIndex((participant) => participant.name === 'Pessoa 4')
    < list.json.findIndex((participant) => participant.name === 'Pessoa 5'));
});

test('C3: desistência de pessoa confirmada promove a próxima da fila', async () => {
  for (let number = 1; number <= 4; number += 1) await register(number);
  const removed = await del(srv.baseUrl, '/participants/pessoa1%40mail.com');
  assert.equal(removed.status, 204);
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.status, 200);
  assert.ok(list.json.some((participant) => participant.name === 'Pessoa 4'));
  assert.equal(list.json.some((participant) => participant.status === 'waitlist'), false);
});

test('C4: desistência de pessoa da fila não altera as confirmações', async () => {
  for (let number = 1; number <= 5; number += 1) await register(number);
  const removed = await del(srv.baseUrl, '/participants/pessoa4%40mail.com');
  assert.equal(removed.status, 204);
  const list = await getJson(srv.baseUrl, '/participants');
  assert.deepEqual(
    list.json.filter((participant) => participant.status === 'waitlist').map((participant) => participant.name),
    ['Pessoa 5'],
  );
  assert.deepEqual(
    list.json.filter((participant) => participant.status !== 'waitlist').map((participant) => participant.name),
    ['Pessoa 1', 'Pessoa 2', 'Pessoa 3'],
  );
});

test('C5: desistência sem fila libera vaga para nova inscrição', async () => {
  for (let number = 1; number <= 3; number += 1) await register(number);
  const removed = await del(srv.baseUrl, '/participants/pessoa2%40mail.com');
  assert.equal(removed.status, 204);
  const created = await register(4);
  assert.equal(created.status, 201);
  assert.equal(created.json.status, 'confirmed');
});
