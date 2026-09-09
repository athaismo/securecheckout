/**
 * LOJA MODELO - CHECKOUT INTERACTIVE LOGIC
 * Full-lifecycle client logic with zero external dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    currentStep: 1,
    subtotal: 239.80,
    shippingPrice: 14.90,
    shippingName: 'Econômico (PAC)',
    shippingEta: '4 a 6 dias úteis',
    discountPercent: 0,
    couponCode: '',
    paymentMethod: 'pix', // 'pix', 'card', 'boleto'
    customer: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: ''
    },
    pixTimerInterval: null
  };

  // DOM Elements
  const stepPanels = {
    1: document.getElementById('step-panel-1'),
    2: document.getElementById('step-panel-2'),
    3: document.getElementById('step-panel-3'),
    4: document.getElementById('step-panel-4')
  };

  const stepNodes = {
    1: document.getElementById('step-node-1'),
    2: document.getElementById('step-node-2'),
    3: document.getElementById('step-node-3'),
    4: document.getElementById('step-node-4')
  };

  const stepLines = {
    1: document.getElementById('line-1-2'),
    2: document.getElementById('line-2-3'),
    3: document.getElementById('line-3-4')
  };

  // Step 1 Inputs
  const inputName = document.getElementById('input-name');
  const inputEmail = document.getElementById('input-email');
  const inputPhone = document.getElementById('input-phone');
  const inputCpf = document.getElementById('input-cpf');

  // Step 2 Inputs
  const inputCep = document.getElementById('input-cep');
  const inputStreet = document.getElementById('input-street');
  const inputNumber = document.getElementById('input-number');
  const inputComplement = document.getElementById('input-complement');
  const inputNeighborhood = document.getElementById('input-neighborhood');
  const inputCity = document.getElementById('input-city');
  const inputState = document.getElementById('input-state');
  const cepSpinner = document.getElementById('cep-spinner');
  const successCep = document.getElementById('success-cep');
  const errorCep = document.getElementById('error-cep');

  // Step 3 Inputs & Card Preview
  const tabPix = document.getElementById('tab-pix');
  const tabCard = document.getElementById('tab-card');
  const tabBoleto = document.getElementById('tab-boleto');
  const panelPix = document.getElementById('panel-pix');
  const panelCard = document.getElementById('panel-card');
  const panelBoleto = document.getElementById('panel-boleto');

  const cardNumber = document.getElementById('card-number');
  const cardName = document.getElementById('card-name');
  const cardExpiry = document.getElementById('card-expiry');
  const cardCvv = document.getElementById('card-cvv');
  const cardInstallments = document.getElementById('card-installments');

  const displayCardNumber = document.getElementById('display-card-number');
  const displayCardName = document.getElementById('display-card-name');
  const displayCardExpiry = document.getElementById('display-card-expiry');
  const displayCardBrand = document.getElementById('card-brand-logo');
  const inputBrandBadge = document.getElementById('input-brand-badge');

  // Summary Elements
  const summarySubtotal = document.getElementById('summary-subtotal');
  const summaryDiscount = document.getElementById('summary-discount');
  const rowDiscount = document.getElementById('row-discount');
  const summaryShipping = document.getElementById('summary-shipping');
  const summaryShippingName = document.getElementById('summary-shipping-name');
  const summaryGrandTotal = document.getElementById('summary-grand-total');
  const summaryInstallmentsPreview = document.getElementById('summary-installments-preview');
  const mobileTotalPreview = document.getElementById('mobile-total-preview');

  // Coupon
  const inputCoupon = document.getElementById('input-coupon');
  const btnApplyCoupon = document.getElementById('btn-apply-coupon');
  const couponFeedback = document.getElementById('coupon-feedback');

  // Mobile drawer toggle
  const btnToggleSummary = document.getElementById('btn-toggle-summary');
  const orderSummaryCard = document.getElementById('order-summary-card');

  // ==========================================
  // FORMATTING & MASK UTILITIES
  // ==========================================

  const formatCurrency = (val) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const maskPhone = (val) => {
    let digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
    }
    return digits.replace(/^(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim().replace(/-$/, '');
  };

  const maskCPF = (val) => {
    let digits = val.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
      .trim();
  };

  const maskCEP = (val) => {
    let digits = val.replace(/\D/g, '').slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2').trim();
  };

  const maskCardNumber = (val) => {
    let digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})/g, '$1 ').trim();
  };

  const maskExpiry = (val) => {
    let digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 2) {
      return digits.slice(0, 2) + '/' + digits.slice(2);
    }
    return digits;
  };

  // Algorithmic CPF Validation
  const validateCPF = (cpf) => {
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11 || /^(\d)\1+$/.test(clean)) return false;

    let sum = 0, rest;
    for (let i = 1; i <= 9; i++) sum += parseInt(clean.substring(i - 1, i)) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(clean.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(clean.substring(i - 1, i)) * (12 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(clean.substring(10, 11))) return false;

    return true;
  };

  // Card Brand Detection
  const detectCardBrand = (number) => {
    const clean = number.replace(/\D/g, '');
    if (/^4/.test(clean)) return { brand: 'visa', name: 'Visa' };
    if (/^(5[1-5]|2[2-7])/.test(clean)) return { brand: 'mastercard', name: 'Mastercard' };
    if (/^(4011|4389|4514|4576|5041|5066|5090|6277|6362|6363)/.test(clean)) return { brand: 'elo', name: 'Elo' };
    if (/^3[47]/.test(clean)) return { brand: 'amex', name: 'Amex' };
    if (/^6(011|5)/.test(clean)) return { brand: 'discover', name: 'Discover' };
    return { brand: '', name: 'Cartão' };
  };

  // ==========================================
  // STEP NAVIGATION & ANIMATION
  // ==========================================

  const goToStep = (stepNumber) => {
    if (stepNumber < 1 || stepNumber > 4) return;
    state.currentStep = stepNumber;

    // Update panels visibility
    Object.keys(stepPanels).forEach((k) => {
      const panel = stepPanels[k];
      if (parseInt(k) === stepNumber) {
        panel.hidden = false;
        panel.classList.add('active');
      } else {
        panel.hidden = true;
        panel.classList.remove('active');
      }
    });

    // Update stepper nodes & lines
    for (let i = 1; i <= 4; i++) {
      const node = stepNodes[i];
      node.classList.remove('active', 'completed');

      if (i === stepNumber) {
        node.classList.add('active');
      } else if (i < stepNumber) {
        node.classList.add('completed');
      }
    }

    for (let i = 1; i <= 3; i++) {
      const line = stepLines[i];
      if (line) {
        if (i < stepNumber) {
          line.classList.add('completed');
        } else {
          line.classList.remove('completed');
        }
      }
    }

    // Scroll to top of checkout smoothly
    window.scrollTo({ top: 120, behavior: 'smooth' });

    // Step-specific initializations
    if (stepNumber === 4) {
      handleOrderConfirmation();
    }
  };

  // Allow clicking on completed steps in progress bar
  Object.keys(stepNodes).forEach((stepKey) => {
    const node = stepNodes[stepKey];
    node.addEventListener('click', () => {
      const targetStep = parseInt(stepKey);
      if (targetStep < state.currentStep) {
        goToStep(targetStep);
      }
    });
  });

  // ==========================================
  // TOTALS & INSTALLMENTS RECALCULATION
  // ==========================================

  const updateFinancials = () => {
    const discountAmount = state.subtotal * (state.discountPercent / 100);
    const grandTotal = Math.max(0, state.subtotal - discountAmount + state.shippingPrice);

    // Update DOM
    summarySubtotal.textContent = formatCurrency(state.subtotal);
    summaryShipping.textContent = state.shippingPrice === 0 ? 'Grátis' : formatCurrency(state.shippingPrice);
    summaryShippingName.textContent = state.shippingName.split(' ')[0];

    if (state.discountPercent > 0) {
      rowDiscount.hidden = false;
      summaryDiscount.textContent = `- ${formatCurrency(discountAmount)}`;
    } else {
      rowDiscount.hidden = true;
    }

    summaryGrandTotal.textContent = formatCurrency(grandTotal);
    mobileTotalPreview.textContent = formatCurrency(grandTotal);

    const maxFreeInstallments = 6;
    const freeInstallmentValue = grandTotal / maxFreeInstallments;
    summaryInstallmentsPreview.textContent = `ou até ${maxFreeInstallments}x de ${formatCurrency(freeInstallmentValue)} sem juros`;

    // Recalculate card installments select box
    if (cardInstallments) {
      cardInstallments.innerHTML = '';
      for (let i = 1; i <= 12; i++) {
        const option = document.createElement('option');
        option.value = i;
        if (i <= 6) {
          const installmentVal = grandTotal / i;
          option.textContent = `${i}x de ${formatCurrency(installmentVal)} sem juros`;
        } else {
          // 1.99% monthly compound interest
          const rate = 0.0199;
          const installmentVal = (grandTotal * (rate * Math.pow(1 + rate, i))) / (Math.pow(1 + rate, i) - 1);
          option.textContent = `${i}x de ${formatCurrency(installmentVal)} com juros (1.99% a.m.)`;
        }
        cardInstallments.appendChild(option);
      }
    }
  };

  // ==========================================
  // INPUT MASKS & EVENT LISTENERS
  // ==========================================

  // Step 1 Inputs
  inputPhone.addEventListener('input', (e) => {
    e.target.value = maskPhone(e.target.value);
    clearError('phone');
  });

  inputCpf.addEventListener('input', (e) => {
    e.target.value = maskCPF(e.target.value);
    clearError('cpf');
  });

  inputName.addEventListener('input', () => clearError('name'));
  inputEmail.addEventListener('input', () => clearError('email'));

  const setError = (field, msg) => {
    const el = document.getElementById(`input-${field}`);
    const err = document.getElementById(`error-${field}`);
    if (el) el.classList.add('is-invalid');
    if (err) err.textContent = msg;
  };

  const clearError = (field) => {
    const el = document.getElementById(`input-${field}`);
    const err = document.getElementById(`error-${field}`);
    if (el) el.classList.remove('is-invalid');
    if (err) err.textContent = '';
  };

  // Step 1 Validation & Submission
  const formStep1 = document.getElementById('form-step-1');
  formStep1.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    // Validate Name
    if (!inputName.value.trim() || inputName.value.trim().split(' ').length < 2) {
      setError('name', 'Digite seu nome completo (nome e sobrenome).');
      hasError = true;
    }

    // Validate Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(inputEmail.value.trim())) {
      setError('email', 'Digite um endereço de e-mail válido.');
      hasError = true;
    }

    // Validate Phone
    const cleanPhone = inputPhone.value.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('phone', 'Informe um telefone com DDD válido.');
      hasError = true;
    }

    // Validate CPF
    if (!validateCPF(inputCpf.value)) {
      setError('cpf', 'CPF inválido. Verifique os números informados.');
      hasError = true;
    }

    if (hasError) return;

    // Save to state
    state.customer.name = inputName.value.trim();
    state.customer.email = inputEmail.value.trim();
    state.customer.phone = inputPhone.value.trim();
    state.customer.cpf = inputCpf.value.trim();

    goToStep(2);
  });

  // Step 2: CEP Search via ViaCEP
  inputCep.addEventListener('input', async (e) => {
    e.target.value = maskCEP(e.target.value);
    clearError('cep');
    successCep.hidden = true;

    const cleanCep = e.target.value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      // Trigger ViaCEP API
      cepSpinner.hidden = false;
      errorCep.textContent = '';
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        cepSpinner.hidden = true;

        if (data.erro) {
          setError('cep', 'CEP não encontrado. Digite o endereço manualmente.');
          return;
        }

        // Fill form fields
        inputStreet.value = data.logradouro || '';
        inputNeighborhood.value = data.bairro || '';
        inputCity.value = data.localidade || '';
        inputState.value = data.uf || '';
        successCep.hidden = false;

        // Focus next needed field
        inputNumber.focus();
      } catch (err) {
        cepSpinner.hidden = true;
        setError('cep', 'Erro ao consultar CEP. Preencha manualmente.');
      }
    }
  });

  // Shipping Selection
  const shippingCards = document.querySelectorAll('.shipping-card');
  shippingCards.forEach((card) => {
    card.addEventListener('click', () => {
      shippingCards.forEach((c) => c.classList.remove('selected'));
      card.classList.add('selected');
      const radio = card.querySelector('input[type="radio"]');
      radio.checked = true;

      state.shippingPrice = parseFloat(radio.dataset.price);
      state.shippingName = radio.dataset.name;
      state.shippingEta = radio.dataset.days;

      updateFinancials();
    });
  });

  // Step 2 Form Submission
  const formStep2 = document.getElementById('form-step-2');
  formStep2.addEventListener('submit', (e) => {
    e.preventDefault();
    let hasError = false;

    if (!inputCep.value || inputCep.value.replace(/\D/g, '').length < 8) {
      setError('cep', 'Informe um CEP válido de 8 dígitos.');
      hasError = true;
    }
    if (!inputStreet.value.trim()) {
      setError('street', 'Informe a rua / logradouro.');
      hasError = true;
    }
    if (!inputNumber.value.trim()) {
      setError('number', 'Informe o número.');
      hasError = true;
    }
    if (!inputNeighborhood.value.trim()) {
      setError('neighborhood', 'Informe o bairro.');
      hasError = true;
    }
    if (!inputCity.value.trim()) {
      setError('city', 'Informe a cidade.');
      hasError = true;
    }
    if (!inputState.value.trim()) {
      setError('state', 'Informe a UF.');
      hasError = true;
    }

    if (hasError) return;

    state.customer.cep = inputCep.value.trim();
    state.customer.street = inputStreet.value.trim();
    state.customer.number = inputNumber.value.trim();
    state.customer.complement = inputComplement.value.trim();
    state.customer.neighborhood = inputNeighborhood.value.trim();
    state.customer.city = inputCity.value.trim();
    state.customer.state = inputState.value.trim();

    goToStep(3);
  });

  document.getElementById('btn-back-to-step-1').addEventListener('click', () => goToStep(1));
  document.getElementById('btn-back-to-step-2').addEventListener('click', () => goToStep(2));

  // ==========================================
  // PAYMENT TABS & CARD PREVIEW
  // ==========================================

  const switchPaymentTab = (method) => {
    state.paymentMethod = method;

    [tabPix, tabCard, tabBoleto].forEach((btn) => btn.classList.remove('active'));
    [panelPix, panelCard, panelBoleto].forEach((p) => {
      p.hidden = true;
      p.classList.remove('active');
    });

    if (method === 'pix') {
      tabPix.classList.add('active');
      panelPix.hidden = false;
      panelPix.classList.add('active');
    } else if (method === 'card') {
      tabCard.classList.add('active');
      panelCard.hidden = false;
      panelCard.classList.add('active');
    } else if (method === 'boleto') {
      tabBoleto.classList.add('active');
      panelBoleto.hidden = false;
      panelBoleto.classList.add('active');
    }
  };

  tabPix.addEventListener('click', () => switchPaymentTab('pix'));
  tabCard.addEventListener('click', () => switchPaymentTab('card'));
  tabBoleto.addEventListener('click', () => switchPaymentTab('boleto'));

  // Live Card Preview
  cardNumber.addEventListener('input', (e) => {
    e.target.value = maskCardNumber(e.target.value);
    displayCardNumber.textContent = e.target.value || '•••• •••• •••• ••••';

    const { brand, name } = detectCardBrand(e.target.value);
    displayCardBrand.textContent = name;
    inputBrandBadge.textContent = brand ? name : '';
  });

  cardName.addEventListener('input', (e) => {
    displayCardName.textContent = e.target.value.toUpperCase() || 'NOME COMPLETO';
  });

  cardExpiry.addEventListener('input', (e) => {
    e.target.value = maskExpiry(e.target.value);
    displayCardExpiry.textContent = e.target.value || 'MM/AA';
  });

  // Finish Order Button
  const btnFinishOrder = document.getElementById('btn-finish-order');
  btnFinishOrder.addEventListener('click', () => {
    if (state.paymentMethod === 'card') {
      let cardError = false;
      const cleanNum = cardNumber.value.replace(/\D/g, '');
      if (cleanNum.length < 15) {
        document.getElementById('error-card-number').textContent = 'Número de cartão incompleto.';
        cardNumber.classList.add('is-invalid');
        cardError = true;
      }
      if (!cardName.value.trim()) {
        document.getElementById('error-card-name').textContent = 'Digite o nome impresso no cartão.';
        cardName.classList.add('is-invalid');
        cardError = true;
      }
      if (!cardExpiry.value || cardExpiry.value.length < 5) {
        document.getElementById('error-card-expiry').textContent = 'Data inválida (MM/AA).';
        cardExpiry.classList.add('is-invalid');
        cardError = true;
      }
      if (!cardCvv.value || cardCvv.value.length < 3) {
        document.getElementById('error-card-cvv').textContent = 'CVV inválido.';
        cardCvv.classList.add('is-invalid');
        cardError = true;
      }

      if (cardError) return;
    }

    goToStep(4);
  });

  // ==========================================
  // STEP 4: ORDER CONFIRMATION
  // ==========================================

  const handleOrderConfirmation = () => {
    // Generate Order Code
    const randomCode = '#PED-' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('confirmed-order-number').textContent = randomCode;
    document.getElementById('confirmed-customer-name').textContent = state.customer.name.split(' ')[0] || 'Cliente';

    // Set Shipping Info
    const fullAddress = `${state.customer.street}, ${state.customer.number}${state.customer.complement ? ' (' + state.customer.complement + ')' : ''} - ${state.customer.neighborhood} - ${state.customer.city} / ${state.customer.state} - CEP ${state.customer.cep}`;
    document.getElementById('confirmed-shipping-address').textContent = fullAddress;
    document.getElementById('confirmed-shipping-method').textContent = `${state.shippingName} (${state.shippingEta})`;

    // Display Appropriate Payment Panel
    const confirmedPixBox = document.getElementById('confirmed-pix-box');
    const confirmedCardBox = document.getElementById('confirmed-card-box');
    const confirmedBoletoBox = document.getElementById('confirmed-boleto-box');

    confirmedPixBox.hidden = true;
    confirmedCardBox.hidden = true;
    confirmedBoletoBox.hidden = true;

    if (state.paymentMethod === 'pix') {
      confirmedPixBox.hidden = false;
      startPixTimer();
    } else if (state.paymentMethod === 'card') {
      confirmedCardBox.hidden = false;
      const lastDigits = cardNumber.value.replace(/\D/g, '').slice(-4) || '4242';
      document.getElementById('confirmed-card-digits').textContent = lastDigits;
      const selectedOption = cardInstallments.options[cardInstallments.selectedIndex];
      document.getElementById('confirmed-card-installments').textContent = selectedOption ? selectedOption.textContent : '1x de ' + summaryGrandTotal.textContent;
    } else if (state.paymentMethod === 'boleto') {
      confirmedBoletoBox.hidden = false;
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 3);
      document.getElementById('boleto-due-date').textContent = dueDate.toLocaleDateString('pt-BR');
    }
  };

  // Pix Countdown Timer
  const startPixTimer = () => {
    if (state.pixTimerInterval) clearInterval(state.pixTimerInterval);

    let timeLeft = 15 * 60; // 15 minutes in seconds
    const countdownEl = document.getElementById('pix-countdown');

    state.pixTimerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(state.pixTimerInterval);
        countdownEl.textContent = 'Expirado';
        return;
      }
      const mins = Math.floor(timeLeft / 60);
      const secs = timeLeft % 60;
      countdownEl.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }, 1000);
  };

  // Copy Pix Button
  const btnCopyPix = document.getElementById('btn-copy-pix');
  const pixCodeString = document.getElementById('pix-code-string');
  const toastPix = document.getElementById('toast-pix');

  btnCopyPix.addEventListener('click', () => {
    pixCodeString.select();
    navigator.clipboard.writeText(pixCodeString.value).then(() => {
      toastPix.hidden = false;
      btnCopyPix.classList.add('btn-success');
      document.getElementById('copy-pix-label').textContent = 'Copiado!';
      setTimeout(() => {
        toastPix.hidden = true;
        btnCopyPix.classList.remove('btn-success');
        document.getElementById('copy-pix-label').textContent = 'Copiar Chave Pix';
      }, 3500);
    });
  });

  // Copy Boleto Button
  const btnCopyBoleto = document.getElementById('btn-copy-boleto');
  const boletoLine = document.getElementById('boleto-line');
  btnCopyBoleto.addEventListener('click', () => {
    boletoLine.select();
    navigator.clipboard.writeText(boletoLine.value).then(() => {
      btnCopyBoleto.textContent = 'Copiado!';
      btnCopyBoleto.classList.add('btn-success');
      setTimeout(() => {
        btnCopyBoleto.textContent = 'Copiar Código';
        btnCopyBoleto.classList.remove('btn-success');
      }, 3000);
    });
  });

  // Start New Order Button
  document.getElementById('btn-new-order').addEventListener('click', () => {
    if (state.pixTimerInterval) clearInterval(state.pixTimerInterval);
    formStep1.reset();
    formStep2.reset();
    if (document.getElementById('form-card-payment')) document.getElementById('form-card-payment').reset();
    state.discountPercent = 0;
    state.couponCode = '';
    goToStep(1);
    updateFinancials();
  });

  // ==========================================
  // COUPON CODE VALIDATION
  // ==========================================

  btnApplyCoupon.addEventListener('click', () => {
    const code = inputCoupon.value.trim().toUpperCase();
    couponFeedback.hidden = false;

    if (code === 'PRIMEIRACOMPRA') {
      state.discountPercent = 10;
      state.couponCode = code;
      couponFeedback.textContent = '✓ Cupom PRIMEIRACOMPRA aplicado (10% de desconto)!';
      couponFeedback.className = 'coupon-feedback success';
      updateFinancials();
    } else if (!code) {
      couponFeedback.textContent = 'Digite um cupom antes de aplicar.';
      couponFeedback.className = 'coupon-feedback error';
    } else {
      couponFeedback.textContent = 'Cupom inválido ou expirado.';
      couponFeedback.className = 'coupon-feedback error';
    }
  });

  // Mobile Drawer Summary Toggle
  btnToggleSummary.addEventListener('click', () => {
    const isExpanded = btnToggleSummary.getAttribute('aria-expanded') === 'true';
    btnToggleSummary.setAttribute('aria-expanded', !isExpanded);
    orderSummaryCard.classList.toggle('mobile-open');
    document.getElementById('toggle-summary-text').textContent = !isExpanded 
      ? 'Ocultar resumo do pedido' 
      : 'Ver resumo do pedido (2 itens)';
  });

  // Initial Calculation
  updateFinancials();
});
