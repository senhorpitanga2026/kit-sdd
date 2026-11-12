# Plano 01 — Cadastro e listagem

## Endpoints
| Método | Rota | Entrada | Saída | Erros |
|---|---|---|---|---|
| GET | `/participants` | — | `200`: lista de inscritos na ordem de cadastro | — |
| POST | `/participants` | `{ "name": "...", "email": "..." }` | `201`: inscrito cadastrado | `400`: `{ "error": "Nome e e-mail são obrigatórios" }` ou `{ "error": "E-mail inválido" }`; `409`: `{ "error": "E-mail já cadastrado" }` |

## Modelo em memória
- `name`: string — nome aparado nas pontas.
- `email`: string — e-mail normalizado em minúsculas e sem espaços nas pontas.

## Tela
- Formulário com campos de nome e e-mail e ação para cadastrar (R1).
- Mensagem de erro para cadastro inválido ou repetido, sem alterar a lista (R4).
- Lista ordenada pela ordem de cadastro, exibindo nome e e-mail normalizado (R2, R3).

## Decisões técnicas
- Usar o array em memória existente; validar nome e e-mail obrigatórios antes do cadastro (R1).
- Validar o e-mail normalizado com uma máscara simples antes de aceitar o cadastro (R1, R4).
- Aparar o nome antes de validar seu comprimento e armazená-lo aparado (R1).
- Normalizar o e-mail antes de armazená-lo e verificar duplicidade sem diferenciar caixa ou espaços nas pontas (R2).
- Acrescentar cada cadastro ao fim do array e devolver a lista na ordem armazenada (R3).
- Recusar cadastro inválido com HTTP 400 e e-mail duplicado com HTTP 409, mantendo o array inalterado (R4).

## Dúvidas resolvidas
| Dúvida | Decisão |
|---|---|
| Como exibir espaços nas pontas do nome? | Aparar o nome ao salvar e exibi-lo aparado; a spec só exige aparar para validar (R1). |
| O que define uma máscara de e-mail válida? | Após remover espaços nas pontas, exigir um único `@`, texto antes e depois dele, e um ponto seguido de texto no domínio; não validar existência ou formato completo (R1). |
| Qual mensagem usar para e-mail com máscara inválida? | Retornar HTTP 400 com `E-mail inválido`; o cadastro não altera a lista (R4). |
