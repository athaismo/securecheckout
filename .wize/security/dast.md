---
phase: dast
owner: Natasha Romanoff
status: completed
findings_count: 2
---

# DAST (Dynamic Application Security Testing) — SecureCheckout

## 1. Escopo de Teste Dinâmico
* **URL Alvo:** `http://localhost:3000`
* **Portas / Protocolos:** HTTP / Porta 3000

---

## 2. Achados e Análise de Vulnerabilidades Dinâmicas

### Finding SEC-01: Ausência de Validação de Preços no Lado do Servidor (Client-Side Price Tampering)
* **Severidade:** **Média (Medium)** — *Inerente a frontends desacoplados sem backend*
* **Descrição:** O valor total do pedido, subtotal dos itens e custo do frete são calculados e gerenciados no objeto JavaScript em memória (`state`). Um usuário com conhecimento técnico pode abrir as Ferramentas de Desenvolvedor (F12 / Console) e manipular `state.shippingPrice = 0` ou `state.subtotal = 1.00` antes de clicar em "Finalizar Pedido".
* **Impacto:** Potencial fraude financeira se o payload for aceito cegamente por um backend desprotegido.
* **Recomendação de Remediação:**
  ```javascript
  // No backend de produção (Node.js/Python/Go):
  // NUNCA confie no valor total enviado pelo cliente.
  // Recalcule o total no servidor com base nos IDs dos produtos no banco de dados:
  const verifiedSubtotal = items.reduce((acc, item) => acc + (db.getProduct(item.id).price * item.quantity), 0);
  ```

### Finding SEC-02: Falta de Cabeçalhos de Segurança HTTP (HTTP Security Headers)
* **Severidade:** **Baixa (Low)**
* **Descrição:** O servidor HTTP embutido (`server.js`) entrega as páginas sem os cabeçalhos defensivos recomendados pela OWASP:
  - `Content-Security-Policy` (CSP)
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY` (Proteção contra Clickjacking)
  - `Strict-Transport-Security` (HSTS)
* **Impacto:** Menor resistência contra ataques de iframing e MIME-sniffing em navegadores antigos.
* **Recomendação de Remediação:**
  Adicionar os cabeçalhos de segurança na resposta HTTP do servidor ou configurar no proxy reverso/CDN de produção.

---

## 3. Teste de Comunicação Externa (API ViaCEP)
* **Endpoint:** `https://viacep.com.br/ws/{cep}/json/`
* **Transporte:** HTTPS (Criptografado TLS 1.3)
* **Privacidade:** Apenas o código numérico do CEP é transmitido; nenhum dado nominal (Nome, CPF ou Telefone) é compartilhado com o serviço público de CEP.
