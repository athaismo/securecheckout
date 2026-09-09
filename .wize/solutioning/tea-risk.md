---
status: passed
owner: Hawkeye
created: 2026-09-09
project: modelo-checkout-loja
gate_decision: PASS
---

# Matriz de Risco e Testes (TEA) — SecureCheckout

> Documento de Engenharia de Testes e Qualidade elaborado por **Hawkeye** (`wize-agent-test-architect`). Mapeia os pontos críticos de risco e rastreabilidade com os Critérios de Aceitação (ACs) definidos no PRD da Maria Hill.

---

## 1. Perfil de Risco dos Componentes Críticos (Risk Matrix)

| # | Ponto Crítico | Probabilidade | Impacto | Risco Ponderado | Estratégia de Mitigação / Teste |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **R1** | Indisponibilidade ou Lentidão da API ViaCEP | Média | Alta | **Alto** | Timeout controlado com desbloqueio imediato para digitação manual sem travar o usuário. |
| **R2** | Falso-positivo ou falso-negativo na validação de CPF | Baixa | Alta | **Médio** | Algoritmo determinístico de validação por Módulo 11 testado contra suítes de CPFs válidos e inválidos. |
| **R3** | Vazamento de dados de cartão de crédito no cliente | Muito Baixa | Crítica | **Crítico** | Isolamento estrito de dados em memória volátil; proibição de gravação em `localStorage` ou `sessionStorage`. |
| **R4** | Expiração silenciosa do Pix sem aviso ao cliente | Média | Média | **Médio** | Cronômetro regressivo com contagem visual e desativação de botão pós-expiração. |
| **R5** | Quebra de layout em telas mobile estreitas (< 375px) | Média | Alta | **Alto** | Layout Mobile-First com colapso inteligente do resumo do pedido em *drawer*. |

---

## 2. Rastreabilidade de Testes e Critérios de Aceitação (AC Traceability)

| ID do Critério (PRD) | Descrição do Cenário | Tipo de Teste | Status de Validação |
| :--- | :--- | :---: | :---: |
| **AC-01-1** | Validação de formato de e-mail ao sair do campo (*blur*) | Unitário / DOM | ✅ **PASS** |
| **AC-01-2** | Validação matemática dos dígitos verificadores do CPF | Algorítmico | ✅ **PASS** |
| **AC-01-3** | Transição suave da Etapa 1 para Etapa 2 com dados válidos | Integração de Fluxo | ✅ **PASS** |
| **AC-02-1** | Consulta automática de CEP e preenchimento de endereço em < 1.2s | E2E / API | ✅ **PASS** |
| **AC-02-2** | Exibição de opções de frete com prazos e valores monetários | Interface | ✅ **PASS** |
| **AC-02-3** | Atualização em tempo real do total geral ao trocar modalidade de frete | Estado Financeiro | ✅ **PASS** |
| **AC-03-1** | Geração do código Pix Copia e Cola e acionamento do timer de 15 min | Integração | ✅ **PASS** |
| **AC-03-2** | Identificação dinâmica de bandeiras de cartão (Visa/Master/Elo) | Regex / Input | ✅ **PASS** |
| **AC-03-3** | Cálculo de parcelamento de 1x a 12x com juros | Matemática Financeira | ✅ **PASS** |
| **AC-04-1** | Aplicação do cupom `PRIMEIRACOMPRA` com 10% OFF no subtotal | Regra de Negócio | ✅ **PASS** |

---

## 3. Decisão de Portão (Gate Decision)

* **Veredito:** **PASS** (Aprovado sem bloqueios)
* **Parecer Técnico do Hawkeye:**
  1. *Finding:* Todas as 4 etapas atendem integralmente aos critérios de aceitação estipulados no PRD.
  2. *Impact:* A experiência de compra é resiliente, livre de fricção e cumpre os requisitos de segurança e LGPD.
  3. *Recommendation:* Pronto para homologação e deploy contínuo em produção.
