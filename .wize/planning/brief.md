---
status: ready-for-prd
owner: Pepper Potts
created: 2026-09-09
---

# Brief — Modelo Checkout Loja

## Visão
Proporcionar uma experiência de compra ágil, segura e sem fricção por meio de um checkout transparente em múltiplas etapas guiadas (Identificação → Endereço/Frete → Pagamento → Confirmação), otimizado para o mercado brasileiro e com alta taxa de conversão em dispositivos móveis e desktop.

## Público-Alvo (Audience)
- **Primary:** Consumidor final de e-commerce que busca concluir suas compras rapidamente sem a barreira de criar senhas prévias (*Guest Checkout*), com transparência sobre os valores e métodos de pagamento locais instantâneos (Pix, Cartão de Crédito e Boleto).
- **Secondary:** Lojista / Administrador de E-commerce que necessita de uma interface de finalização de compras com alta taxa de conversão, baixo abandono de carrinho e fácil integração com gateways e transportadoras.
- **Stakeholders:** Thais Moura (Product Owner) e Time de Engenharia/Design.

## Critérios de Sucesso
1. **Velocidade de conclusão:** Tempo médio para preenchimento e conclusão do checkout inferior a 90 segundos em conexões móveis médias.
2. **Validação e Prevenção de Erros:** 100% dos campos críticos (CPF, CEP, Telefone, Cartão de Crédito) com máscaras inteligentes e validação em tempo real antes da submissão.
3. **Cobertura de Pagamento:** Suporte completo aos 3 principais métodos de pagamento brasileiros:
   - **Pix:** Geração de QR Code dinâmico + botão "Copiar Código Pix" + cronômetro de expiração.
   - **Cartão de Crédito:** Validação de bandeira, dados e seletor dinâmico de parcelamento com/sem juros.
   - **Boleto Bancário:** Geração de linha digitável copiável e visualização para impressão/download.
4. **Agilidade no Frete:** Consulta de endereço por CEP (ViaCEP) com preenchimento instantâneo (< 1.2s) e exibição das opções de entrega (PAC, SEDEX, Transportadora).
5. **Transparência e Fidelização:** Resumo do pedido dinâmico e visível em todas as etapas, com aplicação instantânea de cupons de desconto.

## Fora de Escopo (Non-goals)
- Catálogo de produtos, vitrine de loja e carrinho de compras inicial (o checkout recebe o estado do pedido pronto da loja).
- Sistema tradicional de login obrigatório com senhas complexas e recuperação de senha.
- Gestão interna de estoque, emissão de nota fiscal eletrônica (NF-e) ou ERP completo.
- Processamento financeiro direto de cartão sem intermediador/gateway seguro (respeitando escopo PCI).

## Restrições e Conformidade (Constraints)
- **Compliance:** Conformidade estrita com a LGPD (coleta mínima de dados para faturamento/entrega) e diretrizes de segurança PCI-DSS.
- **Integrações:** API ViaCEP para geolocalização e preenchimento de endereço; camada de pagamento pronta para integração com gateways (Mercado Pago / Pagar.me / Stripe).
- **Design & Performance:** Arquitetura Web responsiva (*Mobile-First*), interface moderna, limpa e com indicadores visuais de ambiente criptografado e seguro.

## Questões Abertas (Open Questions)
- [ ] **(important)** Qual gateway de pagamento será homologado para a produção (ex.: Mercado Pago, Pagar.me, Asaas ou Stripe)? — *owner: Thais Moura*
- [ ] **(nice-to-know)** As cotações de frete serão via contrato direto com Correios/Transportadora ou via agregador como Melhor Envio/Frenet? — *owner: Thais Moura*
