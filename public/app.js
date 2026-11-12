const form = document.getElementById('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const message = document.getElementById('message');
const confirmedList = document.getElementById('confirmed');
const waitlist = document.getElementById('waitlist');
const confirmedTitle = document.getElementById('confirmed-title');
const waitlistTitle = document.getElementById('waitlist-title');
const closeWorkshopButton = document.getElementById('close-workshop');
const presentCount = document.getElementById('stat-present');
const absentCount = document.getElementById('stat-absent');
const waitlistCount = document.getElementById('stat-waitlist');
let participants = [];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function initials(name) {
  return name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
}

function renderItem(participant) {
  const item = el('li', 'bd-list__item');
  item.appendChild(el('span', 'bd-avatar', initials(participant.name)));
  const body = el('div', 'bd-list__body bd-list__body--inline');
  body.appendChild(el('strong', '', participant.name));
  body.appendChild(el('span', '', `— ${participant.email}`));
  item.appendChild(body);
  const isConfirmed = participant.status !== 'waitlist';
  const attendance = participant.attendance;
  item.appendChild(el(
    'span',
    `bd-badge ${attendance === 'present'
      ? 'bd-badge--success'
      : attendance === 'absent'
        ? 'bd-badge--neutral'
        : isConfirmed
          ? 'bd-badge--info'
          : 'bd-badge--warning'}`,
    attendance === 'present'
      ? 'Presente'
      : attendance === 'absent'
        ? 'Ausente'
        : isConfirmed
          ? 'Confirmado'
          : 'Em espera',
  ));
  const actions = el('div', 'bd-list__actions');
  if (isConfirmed && !attendance) {
    const checkInButton = el('button', 'bd-btn bd-btn--sm bd-btn--success', 'Check-in');
    checkInButton.type = 'button';
    checkInButton.addEventListener('click', () => checkInParticipant(participant.email, checkInButton));
    actions.appendChild(checkInButton);
  }
  const cancelButton = el('button', 'bd-btn bd-btn--sm bd-btn--danger', 'Desistir');
  cancelButton.type = 'button';
  cancelButton.addEventListener('click', () => cancelParticipant(participant.email, cancelButton));
  actions.appendChild(cancelButton);
  item.appendChild(actions);
  return item;
}

function renderParticipants() {
  const confirmed = participants.filter((participant) => participant.status !== 'waitlist');
  const waiting = participants.filter((participant) => participant.status === 'waitlist');
  confirmedTitle.replaceChildren('Confirmados ', el('span', 'bd-count', String(confirmed.length)));
  waitlistTitle.replaceChildren('Lista de espera ', el('span', 'bd-count', String(waiting.length)));
  presentCount.textContent = String(confirmed.filter((participant) => participant.attendance === 'present').length);
  absentCount.textContent = String(confirmed.filter((participant) => participant.attendance === 'absent').length);
  waitlistCount.textContent = String(waiting.length);
  confirmedList.replaceChildren(...(
    confirmed.length
      ? confirmed.map(renderItem)
      : [el('li', 'bd-list__empty', 'Ninguém confirmado ainda.')]
  ));
  waitlist.replaceChildren(...(
    waiting.length
      ? waiting.map(renderItem)
      : [el('li', 'bd-list__empty', 'Ninguém na fila de espera.')]
  ));
}

async function responseData(response) {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível concluir a solicitação.');
  }
  return data;
}

async function loadParticipants() {
  try {
    const response = await fetch('/participants');
    participants = await responseData(response);
    renderParticipants();
  } catch (error) {
    message.textContent = error.message;
  }
}

async function cancelParticipant(email, button) {
  message.textContent = '';
  button.disabled = true;
  try {
    const response = await fetch(`/participants/${encodeURIComponent(email)}`, { method: 'DELETE' });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Não foi possível cancelar a inscrição.');
    }
    participants = participants.filter((participant) => participant.email !== email);
    renderParticipants();
    await loadParticipants();
  } catch (error) {
    message.textContent = error.message;
    button.disabled = false;
  }
}

async function checkInParticipant(email, button) {
  message.textContent = '';
  button.disabled = true;
  try {
    const response = await fetch(`/participants/${encodeURIComponent(email)}/check-in`, { method: 'POST' });
    const participant = await responseData(response);
    participants = participants.map((entry) => (
      entry.email === participant.email ? participant : entry
    ));
    renderParticipants();
  } catch (error) {
    message.textContent = error.message;
    button.disabled = false;
  }
}

async function closeWorkshop() {
  message.textContent = '';
  closeWorkshopButton.disabled = true;
  try {
    const response = await fetch('/workshop/close', { method: 'POST' });
    participants = await responseData(response);
    renderParticipants();
  } catch (error) {
    message.textContent = error.message;
    closeWorkshopButton.disabled = false;
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.textContent = '';

  try {
    const response = await fetch('/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: nameInput.value, email: emailInput.value }),
    });
    const participant = await responseData(response);
    participants.push(participant);
    renderParticipants();
    form.reset();
    await loadParticipants();
  } catch (error) {
    message.textContent = error.message;
  }
});

closeWorkshopButton.addEventListener('click', closeWorkshop);

renderParticipants();
loadParticipants();
