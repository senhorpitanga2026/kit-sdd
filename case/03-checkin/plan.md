# Plano 03 — Check-in e ausências

## Endpoints
| Método | Rota | Entrada | Saída | Erros |
|---|---|---|---|---|
| POST | `/participants/:email/check-in` | E-mail normalizado na rota | `200`: inscrição com presença registrada | `404`: inscrição não encontrada; `409`: pessoa não confirmada |
| POST | `/workshop/close` | — | `200`: inscrições com presenças e ausências atualizadas | — |
| GET | `/participants` | — | `200`: inscrições com situação e presença | — |

## Modelo em memória
- `status`: string — `confirmed` ou `waitlist`; situação mantida do incremento 2.
- `attendance`: string ou `null` — `present`, `absent` ou sem registro (novo).

## Tela
- Inscrições confirmadas em `.bd-list`, com badge `--success` para presente e `--neutral` para ausente.
- Ação de check-in em cada pessoa confirmada ainda sem chegada registrada.
- Botão para encerrar a oficina e exibir ausências; inscrições em espera continuam fora da contagem.

## Decisões técnicas
- Usar o e-mail normalizado para localizar a inscrição e recusar check-in se a pessoa não estiver confirmada (R8).
- Registrar a presença uma única vez; novo check-in mantém a situação atual (R9).
- Ao encerrar a oficina, marcar como ausentes as pessoas confirmadas sem presença; não alterar a fila de espera (R10).
- Manter os dados de inscrição e fila dos incrementos anteriores; só acrescentar o registro de presença (R8, R9, R10).

## Dúvidas resolvidas
| Dúvida | Decisão |
|---|---|
| Como indicar que chegou o momento de apurar ausências? | O organizador aciona “Encerrar oficina”; a ação calcula as ausências uma vez (R10). |
