# Tarefas 02 — Vagas e fila de espera

- [x] **T1** (R5, R6) Atualizar `GET /participants` para devolver a situação de cada inscrição sem mudar a ordem de cadastro — verificar: confirmados e fila mantêm suas posições relativas.
- [x] **T2** (R5, R6) Atualizar `POST /participants` para confirmar até 3 pessoas e colocar as demais no fim da fila — verificar: ao inscrever quatro pessoas, três ficam confirmadas e a quarta aguarda.
- [x] **T3** (R7) Implementar desistência de pessoa da fila — verificar: a inscrição removida deixa a fila e as confirmações não mudam.
- [x] **T4** (R6, R7) Implementar desistência de pessoa confirmada — verificar: a primeira pessoa da fila ocupa a vaga e as demais mantêm a ordem.
- [x] **T5** (R5, R7) Manter vaga disponível quando uma pessoa confirmada desiste sem haver fila — verificar: a próxima inscrição é confirmada.
- [x] **T6** (R5, R6) Exibir grupos de confirmados e de espera, preservando a ordem — verificar: cada pessoa aparece no grupo correspondente à sua situação.
- [x] **T7** (R7) Adicionar ação de desistência nas inscrições — verificar: ao desistir, as listas são atualizadas conforme a situação da pessoa.
- [x] **T8** (todas) Rodar todos os cenários de aceite — verificar: C1–C6 e os cenários do incremento 1 passam na tela e, no P5, `npm test` termina com `fail 0`.
