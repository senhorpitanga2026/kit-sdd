// Incremento 03 — check-in e ausências. Um teste por cenário da spec (C1–C3).
const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { startServer, postJson, getJson } = require('./helpers.js');

let srv;
beforeEach(async () => { srv = await startServer(); });
afterEach(async () => { await srv.close(); });

async function register(name, email) {
  const response = await postJson(srv.baseUrl, '/participants', { name, email });
  assert.equal(response.status, 201);
  return response.json;
}

test('C1: chegada marcada como presente', async () => {
  await register('Ana', 'ana@mail.com');
  await register('Bia', 'bia@mail.com');
  const checkIn = await postJson(srv.baseUrl, '/participants/ana%40mail.com/check-in');
  assert.equal(checkIn.status, 200);
  assert.equal(checkIn.json.attendance, 'present');
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.status, 200);
  assert.equal(list.json.find((participant) => participant.email === 'ana@mail.com').attendance, 'present');
  assert.equal(list.json.find((participant) => participant.email === 'bia@mail.com').attendance, undefined);
});

test('C2: check-in repetido não duplica presença', async () => {
  await register('Ana', 'ana@mail.com');
  const path = '/participants/ana%40mail.com/check-in';
  const first = await postJson(srv.baseUrl, path);
  const repeated = await postJson(srv.baseUrl, path);
  assert.equal(first.status, 200);
  assert.equal(repeated.status, 200);
  assert.equal(repeated.json.attendance, 'present');
  const list = await getJson(srv.baseUrl, '/participants');
  assert.equal(list.json.filter((participant) => participant.attendance === 'present').length, 1);
});

test('C3: ao encerrar, confirmados sem chegada ficam ausentes', async () => {
  await register('Ana', 'ana@mail.com');
  await register('Bia', 'bia@mail.com');
  await register('Dora', 'dora@mail.com');
  await register('Caio', 'caio@mail.com');
  await postJson(srv.baseUrl, '/participants/ana%40mail.com/check-in');
  const close = await postJson(srv.baseUrl, '/workshop/close');
  assert.equal(close.status, 200);
  const ana = close.json.find((participant) => participant.email === 'ana@mail.com');
  const bia = close.json.find((participant) => participant.email === 'bia@mail.com');
  const caio = close.json.find((participant) => participant.email === 'caio@mail.com');
  assert.equal(ana.attendance, 'present');
  assert.equal(bia.attendance, 'absent');
  assert.equal(caio.status, 'waitlist');
  assert.equal(caio.attendance, undefined);
});
