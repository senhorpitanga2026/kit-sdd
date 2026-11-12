# Spec 03 — Check-in e ausências

## Objetivo
No dia da oficina, o organizador marca a chegada das pessoas confirmadas e, ao fim, identifica quem não compareceu.

## Regras de negócio
- **R8** O organizador pode marcar como presente uma pessoa confirmada que chegou à oficina.
- **R9** Marcar novamente como presente alguém que já chegou não altera sua situação nem cria uma nova presença.
- **R10** Ao fim da oficina, pessoas confirmadas sem chegada registrada são consideradas ausentes; pessoas na fila de espera não são consideradas ausentes.

## Cenários de aceite
**C1 (R8)** Dado que Ana e Bia estão confirmadas / Quando marco a chegada de Ana / Então Ana fica presente e Bia continua sem chegada registrada.

**C2 (R9)** Dado que Ana já está marcada como presente / Quando marco sua chegada novamente / Então Ana continua presente sem duplicação.

**C3 (R10)** Dado que Ana e Bia estão confirmadas, Ana chegou e Bia não, e Caio está na fila / Quando encerro a oficina / Então Ana aparece presente, Bia aparece ausente e Caio não é contado como ausente.

**C4 (R8, R9, R10)** Dado que os cenários dos incrementos 1 e 2 continuam valendo / Quando consulto as inscrições / Então todos os cenários de aceite dos incrementos 1 e 2 continuam valendo.

## Fora de escopo
- Marcar presença de pessoas que não estão confirmadas.
- Alterar inscrições, capacidade ou ordem da fila durante o check-in.
- Persistir inscrições depois que o servidor é desligado.

## Dúvidas resolvidas
| Dúvida | Decisão |
|---|---|
| Quem pode ter a chegada marcada? | Somente pessoas confirmadas; quem está na fila não é contado como presente ou ausente. |
| O que acontece ao marcar a chegada mais de uma vez? | Não há erro nem duplicação; a pessoa permanece presente. |
| Quem é considerado ausente ao fim da oficina? | Toda pessoa confirmada sem chegada registrada; a fila de espera não conta como ausência. |
