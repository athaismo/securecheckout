# ADR-001: Adoção de Zero-Runtime Framework (Vanilla Web)

* **Status:** Aprovado
* **Decisor:** Tony Stark (`wize-agent-architect`)
* **Data:** 2026-09-09

## Contexto
Um checkout de e-commerce é uma das páginas mais sensíveis a desempenho da web. Cada 100ms a mais de atraso no carregamento de um checkout pode representar até 1% de queda na taxa de conversão de compras no varejo online, especialmente em dispositivos móveis e redes celulares no Brasil.

## Decisão
Optamos por implementar o SecureCheckout utilizando **Vanilla HTML5, CSS3 moderno (com variáveis CSS e Flexbox/Grid) e JavaScript ES6+ nativo**, sem dependência de frameworks pesados de cliente (como React, Angular ou Vue).

## Consequências
- **Positivas:**
  - Peso do bundle inicial mínimo (menos de 40 KB total).
  - TTI (Time to Interactive) inferior a 500ms em conexões móveis.
  - Compatibilidade universal para ser plugado em qualquer plataforma de e-commerce (Shopify, WooCommerce, VTEX, Magento ou sistemas proprietários).
  - Zero risco de quebra por incompatibilidade de versão de bibliotecas de terceiros.
- **Negativas:**
  - A manipulação de reatividade na DOM precisa ser coordenada de maneira explícita no código (`app.js`).
