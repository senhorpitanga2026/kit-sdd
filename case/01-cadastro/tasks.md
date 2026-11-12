# Tarefas 01 — Cadastro e listagem

- [x] **T1** (R3) Criar `GET /participants` para devolver a lista na ordem de cadastro — verificar: lista vazia quando não há inscritos e ordem preservada após cadastros.
- [ ] **T2** (R1, R4) Validar no `POST /participants` nome aparado com pelo menos 2 caracteres, e-mail não vazio e máscara simples válida — verificar: nome/e-mail ausente ou nome curto retorna HTTP 400 com `Nome e e-mail são obrigatórios`; e-mail com máscara inválida retorna HTTP 400 com `E-mail inválido`; a lista não muda.
- [x] **T3** (R2) Normalizar o e-mail e recusar duplicatas sem diferenciar caixa ou espaços nas pontas — verificar: e-mail salvo em minúsculas e duplicata retorna HTTP 409 com a mensagem especificada.
- [x] **T4** (R3) Adicionar cadastro válido ao array e responder com os dados do inscrito — verificar: Ana cadastrada antes de Bia permanece nessa ordem na lista.
- [x] **T5** (R1, R3) Criar formulário de nome e e-mail que envia cadastro para a API — verificar: cadastro válido aparece na lista.
- [x] **T6** (R3) Carregar e exibir a lista da API ao abrir a tela — verificar: lista vazia sem inscritos e nomes na ordem de cadastro.
- [x] **T7** (R4) Exibir erros da API na tela sem alterar a lista — verificar: cadastro inválido ou duplicado mostra a mensagem correspondente e mantém a lista.
- [ ] **T8** (R1, R4) Definir o campo de e-mail da tela como tipo e-mail — verificar: formato inválido é recusado antes do envio e não entra na lista.
- [ ] **T9** (todas) Rodar todos os cenários de aceite — verificar: C1–C6 passam na tela e, no P5, `npm test` termina com `fail 0`; máscara inválida também é recusada sem alterar a lista.
