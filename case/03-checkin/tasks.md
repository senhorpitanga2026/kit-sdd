# Tarefas 03 — Check-in e ausências

- [x] **T1** (R8, R9, R10) Incluir a situação de presença ao consultar inscrições — verificar: cada pessoa confirmada mostra chegada registrada ou sem registro.
- [x] **T2** (R8) Criar ação de check-in para pessoa confirmada — verificar: a chegada é registrada; pessoa não confirmada recebe erro e não muda.
- [x] **T3** (R9) Tornar repetido o check-in da mesma pessoa sem efeito adicional — verificar: a pessoa continua presente sem duplicação.
- [x] **T4** (R10) Criar ação para encerrar a oficina e marcar ausentes as pessoas confirmadas sem chegada — verificar: pessoas da fila não são marcadas ausentes.
- [x] **T5** (R8, R9) Exibir presença e ação de check-in para pessoas confirmadas — verificar: após a chegada, a pessoa aparece presente e não há nova presença ao repetir a ação.
- [x] **T6** (R10) Exibir ausências ao encerrar a oficina — verificar: confirmados sem chegada aparecem ausentes e a fila não entra na contagem.
- [x] **T7** (todas) Rodar todos os cenários de aceite — verificar: C1–C3 e os cenários dos incrementos 1 e 2 passam na tela e, no P5, `npm test` termina com `fail 0`.
