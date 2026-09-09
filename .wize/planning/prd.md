---
status: ready-for-validation
owner: Maria Hill
created: 2026-09-09
---

# PRD — Modelo Checkout Loja

## Visão Geral e Metas (Goals)
1. **Redução de Fricção:** Permitir que o comprador finalize o pedido em menos de 90 segundos em dispositivos móveis através de um fluxo guiado em 4 etapas (*Guest Checkout*).
2. **Prevenção de Erros em Tempo Real:** 100% dos campos de entrada (CPF, CEP, Telefone, Cartão) validados instantaneamente com máscaras antes do envio.
3. **Conversão por Meios de Pagamento Locais:** Oferecer suporte nativo e transparente para Pix (com QR Code dinâmico, código Copia e Cola e temporizador), Cartão de Crédito (com parcelamento dinâmico em até 12x) e Boleto Bancário.
4. **Agilidade no Frete:** Consulta de endereço por CEP com autopreenchimento em < 1.2 segundos via integração com ViaCEP.
5. **Transparência de Valores:** Resumo do pedido dinâmico com fotos, itens, cálculo de frete e aplicação imediata de cupons de desconto.

---

## Escopo (Scope)

### No Escopo (In Scope)
- **Etapa 1: Identificação (Guest Checkout):**
  - Coleta simplificada: Nome Completo, E-mail, Telefone (WhatsApp) e CPF.
  - Validação estrita de formato de e-mail e algoritmo do dígito verificador do CPF.
  - Nenhum requisito de criação de senha para desbloquear a compra.
- **Etapa 2: Entrega e Frete:**
  - Campo de CEP com máscara `00000-000` e gatilho de busca automática.
  - Autopreenchimento de Logradouro, Bairro, Cidade e UF via API ViaCEP.
  - Campos manuais para Número e Complemento / Ponto de Referência.
  - Seletor de modalidade de frete (Econômico/PAC, Expresso/SEDEX, Transportadora) com prazo em dias e valor monetário.
- **Etapa 3: Pagamento:**
  - Seletor de abas intuitivo entre: Pix, Cartão de Crédito e Boleto.
  - **Pix:** Instruções objetivas, geração de chave de pagamento copia e cola, QR Code visual e timer de 15 minutos.
  - **Cartão de Crédito:** Número do cartão (com máscara e identificação de bandeira Visa/Master/Elo), Nome impresso, Validade (MM/AA), Código de Segurança (CVV) e seletor de parcelas (1x sem juros até 12x com juros).
  - **Boleto Bancário:** Linha digitável com botão de cópia rápida e instruções de compensação bancária.
- **Etapa 4: Confirmação do Pedido:**
  - Tela de sucesso com número único do pedido (`#PED-XXXXXX`).
  - Resumo final da entrega e dados do pagamento selecionado.
- **Resumo Lateral do Pedido (Order Summary):**
  - Lista de itens do carrinho com miniatura, título, quantidade e preço.
  - Campo para inserção e validação de cupom de desconto promocional.
  - Totalizadores dinâmicos: Subtotal + Frete selecionado - Desconto = Total Geral.
  - Responsividade: card fixo na lateral no Desktop; drawer colapsável ou barra flutuante no Mobile.
- **Indicadores de Segurança:** Selos visuais de SSL 256-bit, Compra Segura e Proteção de Dados LGPD.

### Fora de Escopo (Out of Scope - Non-goals)
- Catálogo navegável de produtos e página inicial da loja (o checkout recebe o pedido já montado).
- Sistema de autenticação com login tradicional por senha e recuperação de credenciais (*motivo: priorizar velocidade de compra*).
- Gestão de estoque, controle de logística física ou ERP (*motivo: responsabilidade da plataforma de e-commerce*).
- Emissão fiscal de NF-e (*motivo: responsabilidade do backend/ERP*).

---

## Estrutura de Histórias de Usuário (Backbone)
- **E01 — Identificação Rápida:** Como comprador, quero me identificar com meus dados básicos sem criar senha, para agilizar minha compra com segurança.
- **E02 — Preenchimento de Endereço por CEP:** Como comprador, quero digitar meu CEP e ter meu endereço preenchido automaticamente, para não precisar digitar rua, bairro e cidade manualmente.
- **E03 — Escolha de Frete:** Como comprador, quero visualizar opções de entrega com prazo e preço claros, para escolher a que melhor atende à minha necessidade.
- **E04 — Cupom de Desconto:** Como comprador, quero aplicar um cupom de desconto no resumo do pedido, para economizar na minha compra.
- **E05 — Pagamento Multimeios:** Como comprador, quero escolher entre Pix, Cartão ou Boleto de forma transparente, para pagar com comodidade e confiança.
- **E06 — Confirmação e Próximos Passos:** Como comprador, quero receber a confirmação clara com o resumo do pedido e código de pagamento, para acompanhar a entrega.

---

## Critérios de Aceitação (Acceptance Criteria)

### E01 — Identificação Rápida
- **AC-01-1:** Dado o campo de E-mail, Quando o usuário digitar um valor sem formato válido e mudar de campo (*blur*), Então exibe a mensagem de erro *"Digite um e-mail válido"* em menos de 200ms.
- **AC-01-2:** Dado o campo de CPF, Quando o usuário digitar os 11 dígitos, Então o sistema valida os dois dígitos verificadores; se for inválido, exibe *"CPF inválido"*; se for válido, aplica a máscara `000.000.000-00`.
- **AC-01-3:** Dado que Nome, E-mail, Telefone e CPF estão válidos, Quando o usuário clica em *"Ir para a Entrega"*, Então avança para a Etapa 2 e exibe a barra de progresso no passo correspondente.

### E02 — Endereço e Frete
- **AC-02-1:** Dado que o usuário preencheu os 8 dígitos do CEP, Quando a máscara `00000-000` é concluída, Então dispara requisição à API ViaCEP (`https://viacep.com.br/ws/{cep}/json/`) e preenche Logradouro, Bairro, Cidade e UF em até 1.2s, posicionando o foco no campo "Número".
- **AC-02-2:** Dado que o endereço foi localizado, Quando as opções de frete são calculadas, Então exibe pelo menos 2 modalidades (ex.: Econômico/PAC e Expresso/SEDEX) com valor e prazo em dias úteis.
- **AC-02-3:** Dado a seleção de uma modalidade de frete, Quando o usuário altera a opção selecionada, Então o valor do frete e o total final no Resumo do Pedido são atualizados em tempo real (< 100ms).

### E03 — Pagamento
- **AC-03-1 (Pix):** Dado que o usuário selecionou a aba Pix e clicou em *"Finalizar Compra"*, Então gera o código de pagamento "Pix Copia e Cola", exibe o QR Code dinâmico e inicia um cronômetro regressivo de 15:00 minutos com botão *"Copiar Código Pix"*.
- **AC-03-2 (Cartão):** Dado que o usuário digita o número do cartão, Quando os primeiros 4 dígitos são informados, Então identifica e exibe o logotipo da bandeira correspondente (Visa, Mastercard ou Elo).
- **AC-03-3 (Parcelamento):** Dado um valor total do pedido, Quando o usuário abre o seletor de parcelas do cartão, Então exibe as opções de 1x a 12x, detalhando valores de cada parcela e identificando opções sem juros.
- **AC-03-4 (Boleto):** Dado que a opção Boleto foi finalizada, Quando exibida a confirmação, Então apresenta a linha digitável com botão de cópia rápida e informa prazo de compensação de até 3 dias úteis.

### E04 — Resumo do Pedido e Cupom
- **AC-04-1:** Dado o código promocional `PRIMEIRACOMPRA` inserido no campo de cupom, Quando clicado em *"Aplicar"*, Então aplica 10% de desconto sobre o subtotal dos produtos, destaca o valor descontado em verde e atualiza o total final.
- **AC-04-2:** Dado um cupom inexistente, Quando clicado em *"Aplicar"*, Então exibe aviso *"Cupom inválido ou expirado"* sem alterar os valores do carrinho.
- **AC-04-3 (Mobile):** Em telas com largura inferior a 768px, o resumo do pedido deve possuir um cabeçalho colapsável no topo com valor total visível, permitindo expandir para conferir os itens.

---

## Restrições e Suposições (Constraints & Assumptions)
- **Compliance:** Conformidade com a LGPD (dados de clientes não são enviados para terceiros não autorizados) e diretrizes PCI-DSS (dados sensíveis de cartão não são salvos em texto puro).
- **Suposição Técnica:** Uso da API pública e gratuita ViaCEP para busca de CEPs brasileiros.
- **Tecnologias:** Vanilla HTML5, CSS3 moderno com design system proprietário (tipografia elegante, micro-animações, estados de foco e paleta moderna) e JavaScript puro (ES6+), garantindo carregamento instantâneo sem dependências pesadas.

---

## Questões Abertas (Open Questions)
- [ ] **(important)** Qual gateway de produção será conectado ao backend no futuro (Mercado Pago, Stripe ou Pagar.me)? — *owner: Thais Moura*
- [ ] **(nice-to-know)** Deseja incluir produtos de exemplo pré-carregados para facilitar a demonstração do checkout? — *owner: Thais Moura*
