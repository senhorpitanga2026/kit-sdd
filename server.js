// Esqueleto do case "Inscrições da Oficina".
// Os incrementos da spec vão adicionar rotas aqui. Não mude a porta nem a estrutura.
const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Dados em memória. Um array, nada mais.
let participants = [];

function resetData() {
  participants = [];
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.get('/participants', (req, res) => {
  res.json(participants.map((participant) => (
    participant.status === 'waitlist'
      ? participant
      : participant.attendance
        ? { name: participant.name, email: participant.email, attendance: participant.attendance }
        : { name: participant.name, email: participant.email }
  )));
});

app.post('/participants', (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body)
    ? req.body
    : {};
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';

  if (name.length < 2 || !email) {
    return res.status(400).json({ error: 'Nome e e-mail são obrigatórios' });
  }

  if (!/^[^@\s]+@[^@\s.]+(?:\.[^@\s.]+)+$/.test(email)) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  if (participants.some((participant) => participant.email === email)) {
    return res.status(409).json({ error: 'E-mail já cadastrado' });
  }

  const confirmedCount = participants.filter((participant) => participant.status === 'confirmed').length;
  const participant = {
    name,
    email,
    status: confirmedCount < 3 ? 'confirmed' : 'waitlist',
  };
  participants.push(participant);
  return res.status(201).json(participant);
});

app.delete('/participants/:email', (req, res) => {
  const email = req.params.email.trim().toLowerCase();
  const index = participants.findIndex((participant) => participant.email === email);

  if (index === -1) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }

  const [participant] = participants.splice(index, 1);
  if (participant.status === 'confirmed') {
    const nextInLine = participants.find((entry) => entry.status === 'waitlist');
    if (nextInLine) nextInLine.status = 'confirmed';
  }

  return res.status(204).end();
});

app.post('/participants/:email/check-in', (req, res) => {
  const email = req.params.email.trim().toLowerCase();
  const participant = participants.find((entry) => entry.email === email);

  if (!participant) {
    return res.status(404).json({ error: 'Inscrição não encontrada' });
  }

  if (participant.status !== 'confirmed') {
    return res.status(409).json({ error: 'Pessoa não confirmada' });
  }

  if (participant.attendance === 'absent') {
    return res.status(409).json({ error: 'Oficina encerrada' });
  }

  participant.attendance = 'present';
  return res.json({
    name: participant.name,
    email: participant.email,
    status: participant.status,
    attendance: participant.attendance,
  });
});

app.post('/workshop/close', (req, res) => {
  participants.forEach((participant) => {
    if (participant.status === 'confirmed' && !participant.attendance) {
      participant.attendance = 'absent';
    }
  });

  return res.json(participants);
});

module.exports = { app, resetData };

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Inscrições da Oficina rodando em http://localhost:3000');
  });
}
