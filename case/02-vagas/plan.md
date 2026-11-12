# Plano 02 — Vagas e fila de espera

## Endpoints
| Método | Rota | Entrada | Saída | Erros |
|---|---|---|---|---|
| GET | `/participants` | — | `200`: inscritos na ordem de cadastro, com situação | — |
| POST | `/participants` | `{ "name": "...", "email": "..." }` | `201`: inscrito com situação confirmada ou em espera | `400`: entrada inválida; `409`: e-mail já cadastrado |
| DELETE | `/participants/:email` | E-mail normalizado na rota | `204`: inscrição removida | `404`: inscrição não encontrada |

## Modelo em memória
- `name`: string — nome aparado nas pontas.
- `email`: string — e-mail normalizado, identificador único da inscrição.
- `status`: string — `confirmed` ou `waitlist`; indica confirmação ou fila de espera (novo).

## Tela
- Lista de confirmados em `.bd-list`, com badge de confirmação.
- Lista de espera em `.bd-list`, com badge `--warning` e ordem de espera.
- Ação de desistência em cada inscrição.

## Decisões técnicas
- Manter as inscrições no array em ordem de cadastro e atualizar a situação sem reordená-lo (R5, R6).
- Confirmar a inscrição quando houver menos de 3 pessoas confirmadas; caso contrário, colocá-la no fim da fila (R5, R6).
- Na desistência de pessoa confirmada, promovê-la primeira da fila; ao remover alguém da fila, manter os demais na ordem (R6, R7).
- Identificar a inscrição pelo e-mail normalizado; responder 404 quando não houver correspondência (R2, R7).
- A remoção de pessoa confirmada sem fila libera uma vaga para a próxima inscrição (R5, R7).

## Dúvidas resolvidas
| Dúvida | Decisão |
|---|---|
| O que ocorre se alguém se inscrever enquanto há uma vaga disponível? | Confirmar essa inscrição diretamente, até completar as 3 vagas (R5). |
