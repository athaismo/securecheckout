# 🛍️ ModelStore — Checkout Minimalista & Sofisticado

> **Modelo de checkout transparente, ágil e em etapas guiadas com estética minimalista e elegante.** Otimizado para alta conversão no mercado brasileiro com suporte nativo a Pix, Cartão de Crédito e Boleto. Desenvolvido utilizando o ciclo de engenharia orientada a agentes do **Wize Dev Kit**.

[![Status](https://img.shields.io/badge/status-concluído-success.svg)](#)
[![Stack](https://img.shields.io/badge/stack-HTML5%20%7C%20CSS3%20%7C%20JavaScript-blue.svg)](#)
[![Wize Dev Kit](https://img.shields.io/badge/powered%20by-Wize%20Dev%20Kit-indigo.svg)](https://github.com/qwize-br/wize-development-kit)
[![Design](https://img.shields.io/badge/design-Mobile--First-purple.svg)](#)
[![Licença](https://img.shields.io/badge/licença-MIT-green.svg)](LICENSE)

---

## 📌 Visão Geral

O **SecureCheckout** é uma solução de finalização de compras (*checkout transparente*) construída para eliminar o atrito no e-commerce. Adota o modelo de **Guest Checkout** (sem exigência de criação de senha) e conduz o usuário por um fluxo intuitivo em 4 passos:

1. **Identificação Pessoal:** Coleta ágil com validação algorítmica de CPF e máscaras em tempo real.
2. **Entrega & Frete:** Busca instantânea de endereço por CEP integrada com a API do **ViaCEP** e escolha de modalidades de frete (PAC, SEDEX e Transportadora).
3. **Pagamento Multimeios:** Suporte a **Pix** (QR Code + Copia e Cola + Timer de 15 min), **Cartão de Crédito** (com espelho visual dinâmico, detecção de bandeira e parcelamento até 12x) e **Boleto Bancário**.
4. **Confirmação:** Tela de sucesso com código do pedido (`#PED-XXXXXX`), comprovante e resumo completo da entrega.

---

## ✨ Principais Funcionalidades

- ⚡ **Guest Checkout (Sem Fricção):** O cliente finaliza a compra em menos de 90 segundos sem precisar criar senhas ou preencher cadastros burocráticos.
- 📍 **Endereço Inteligente (ViaCEP):** Preenchimento automático de logradouro, bairro, cidade e UF ao digitar o CEP, com foco automático no campo número.
- 🚚 **Cálculo Dinâmico de Frete:** Recálculo imediato do valor total do pedido conforme a modalidade de envio escolhida.
- 💳 **Espelho Virtual de Cartão:** Prévia visual interativa do cartão com atualização em tempo real do número, nome, data de validade e detecção automática de bandeiras (*Visa, Mastercard, Elo, Amex*).
- ⚡ **Pix Dinâmico com Contador:** Geração de código Pix Copia e Cola com botão de cópia de 1 clique, feedback visual (*toast*) e temporizador de expiração de 15:00 minutos.
- 🏷️ **Cupom de Desconto Funcional:** Campo interativo de cupom promocional no resumo lateral (utilize `PRIMEIRACOMPRA` para 10% de desconto imediato).
- 📱 **Mobile-First & Responsivo:** Experiência fluida em smartphones com resumo do pedido em *drawer* colapsável no topo.
- 🔒 **Conformidade e Segurança:** Embasado nas diretrizes da LGPD e boas práticas de PCI-DSS, acompanhado de selos visuais de ambiente criptografado SSL 256-bit.

---

## 📋 Ciclo de Planejamento (Wize Dev Kit)

Este projeto foi planejado e documentado através dos agentes especialistas do **Wize Dev Kit**:

- 📝 **[Product Brief (.wize/planning/brief.md)](.wize/planning/brief.md):** Especificação inicial de visão, público-alvo, critérios de sucesso e restrições conduzida pela **Pepper Potts** (`wize-product-brief`).
- 📑 **[PRD (.wize/planning/prd.md)](.wize/planning/prd.md):** Documento de Requisitos de Produto, metas observáveis, *in/out of scope* e critérios de aceitação (ACs) estruturados pela **Maria Hill** (`wize-agent-pm`).
- 🤖 **[AGENTS.md](AGENTS.md):** Catálogo completo dos 10 agentes e personas do ciclo de vida Wize.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5:** Semântica estrita, acessibilidade (ARIA) e marcação otimizada.
- **Vanilla CSS3:** *Design tokens* com variáveis CSS, layout híbrido (Flexbox e CSS Grid), micro-interações, elevações e tipografia do Google Fonts (*Inter* e *Outfit*).
- **Vanilla JavaScript (ES6+):** Arquitetura orientada a estado, validações algorítmicas puras e zero dependências pesadas de runtime.
- **API ViaCEP:** Integração REST pública para consulta de CEPs brasileiros.
- **Node.js (Opcional):** Servidor HTTP estático nativo para desenvolvimento local.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Um navegador web moderno (Chrome, Edge, Firefox, Safari ou Brave).
- Opcional: **Node.js** (versão 18+) para rodar o servidor local embutido.

### 1. Clonar o repositório
```bash
git clone https://github.com/athaismo/securecheckout.git
cd securecheckout
```

### 2. Iniciar o projeto

#### Opção A (Com Node.js):
Execute o servidor embutido:
```bash
node server.js
```
Abra no seu navegador: **`http://localhost:3000`**

#### Opção B (Sem dependências):
Basta dar um duplo clique no arquivo **`index.html`** ou abri-lo diretamente em qualquer navegador!

---

## 🧪 Dados para Demonstração e Testes

Para testar o fluxo completo de checkout:

| Campo | Dado Sugerido |
| :--- | :--- |
| **Nome** | Ana Silva Oliveira |
| **E-mail** | ana.silva@exemplo.com |
| **Telefone** | (11) 98765-4321 |
| **CPF** | `111.444.777-05` (ou qualquer CPF válido) |
| **CEP** | `01310-100` *(Av. Paulista, São Paulo - preenche automaticamente)* |
| **Cupom** | **`PRIMEIRACOMPRA`** *(Aplica 10% OFF no subtotal)* |

---

## 📁 Estrutura de Arquivos

```plaintext
securecheckout/
├── .wize/
│   ├── config/              # Configurações do projeto e usuário Wize
│   └── planning/
│       ├── brief.md         # Product Brief oficial (Pepper Potts)
│       └── prd.md           # PRD com regras e critérios de aceitação (Maria Hill)
├── AGENTS.md                # Roteador de agentes do Wize Dev Kit
├── index.html               # Interface web do checkout (4 etapas)
├── style.css                # Estilos e design system moderno
├── app.js                   # Lógica reativa, máscaras e integrações
├── server.js                # Servidor HTTP local (Node.js)
└── README.md                # Documentação do projeto
```

---

## 👤 Autoria

Projeto desenvolvido por **Thais Moura**.  
- Repositório: [github.com/athaismo/securecheckout](https://github.com/athaismo/securecheckout)

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT — consulte o arquivo [LICENSE](LICENSE) para obter mais detalhes.
