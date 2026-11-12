# Spec 02 — Vagas e fila de espera

## Objetivo
O organizador acompanha quem está confirmado e quem aguarda uma vaga. Quando alguém desiste, a vaga é oferecida à próxima pessoa da fila, mantendo a contagem confiável.

## Regras de negócio
- **R5** A oficina tem 3 vagas. As 3 primeiras pessoas inscritas ficam confirmadas; as inscrições seguintes entram na fila de espera.
- **R6** A fila de espera segue a ordem de inscrição. Quando uma pessoa é promovida, as demais mantêm sua ordem.
- **R7** Quando uma pessoa confirmada desiste, a primeira pessoa da fila ocupa sua vaga; sem fila, a vaga fica disponível. Quando alguém da fila desiste, sai da fila sem alterar as confirmações.

## Cenários de aceite
**C1 (R5)** Dado que a oficina está vazia / Quando inscrevo quatro pessoas / Então as três primeiras ficam confirmadas e a quarta fica na fila de espera.

**C2 (R6)** Dado que quatro pessoas aguardam uma vaga / Quando libero uma vaga / Então a primeira pessoa da fila fica confirmada e as demais mantêm a ordem.

**C3 (R7)** Dado que a oficina está cheia e há pessoas na fila / Quando uma pessoa confirmada desiste / Então a primeira pessoa da fila ocupa a vaga e a lista de espera é atualizada.

**C4 (R7)** Dado que há pessoas na fila / Quando uma pessoa da fila desiste / Então ela sai da fila e as confirmações não mudam.

**C5 (R7)** Dado que a oficina está cheia e não há fila / Quando uma pessoa confirmada desiste / Então uma vaga fica disponível.

**C6 (R5, R6, R7)** Dado que os cenários do incremento 1 continuam valendo / Quando consulto as inscrições / Então todos os cenários de aceite do incremento 1 continuam valendo.

## Fora de escopo
- Alterar o número de vagas durante as inscrições.
- Definir lista de espera prioritária ou permitir reordená-la.
- Check-in ou registro de presença.
- Persistir inscrições depois que o servidor é desligado.

## Dúvidas resolvidas
| Dúvida | Decisão |
|---|---|
| Quantas vagas há na oficina? | Fixar a capacidade em 3 vagas. |
| Como ordenar a fila de espera? | Usar a ordem de inscrição; quem espera há mais tempo é promovido primeiro. |
| O que acontece se alguém da fila desiste? | Remover essa pessoa da fila, sem alterar as confirmações nem promover outra pessoa. |
