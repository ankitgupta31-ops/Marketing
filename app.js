const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  nav?.classList.toggle('nav-open', !isOpen);
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle?.setAttribute('aria-expanded', 'false');
    nav?.classList.remove('nav-open');
  });
});

const submitFormToMail = async (form, successMessage, successButtonText) => {
  const formData = new FormData(form);
  formData.append('form_type', form.id);

  const submitButton = form.querySelector('button');
  const originalText = submitButton.textContent;
  const message = form.querySelector('.payment-message, .apply-message, #quote-message') || form.parentElement?.querySelector('[role="status"]');

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';

  try {
    const response = await fetch('forms-handler.php', {
      method: 'POST',
      body: formData
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok || result.status !== 'success') {
      throw new Error(result.message || 'Submission failed');
    }

    if (message) {
      message.textContent = successMessage;
    }
    submitButton.textContent = successButtonText;
    form.reset();
  } catch (error) {
    if (message) {
      message.textContent = 'There was a problem sending your form. Please email ankitgupta31@gmail.com directly.';
    }
    submitButton.disabled = false;
    submitButton.textContent = originalText;
  }
};


document.querySelector('#apply-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  await submitFormToMail(
    form,
    'Thanks. Your eligibility check has been started. Our team will call you shortly.',
    'Request received ✓'
  );
});

const quoteModal = document.querySelector('#quote-modal');
const quoteTriggers = document.querySelectorAll('a[href="#apply"]');
const closeQuoteModal = () => {
  if (!quoteModal) return;
  quoteModal.hidden = true;
  document.body.classList.remove('quote-modal-open');
};
const openQuoteModal = (event) => {
  event.preventDefault();
  if (!quoteModal) return;
  quoteModal.hidden = false;
  document.body.classList.add('quote-modal-open');
  quoteModal.querySelector('input')?.focus();
};

quoteTriggers.forEach((trigger) => trigger.addEventListener('click', openQuoteModal));
quoteModal?.querySelectorAll('[data-modal-close]').forEach((control) => control.addEventListener('click', closeQuoteModal));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && quoteModal && !quoteModal.hidden) closeQuoteModal();
});

quoteModal?.querySelector('#quote-form')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  await submitFormToMail(
    form,
    'Thanks. Your quote request has been started. Our team will call you shortly.',
    'Request received ✓'
  );
});

const calculatorForm = document.querySelector('#calculator-form');
const formatCurrency = (value) => `₹${Math.round(value).toLocaleString('en-IN')}`;

function updateCalculatorDisplay() {
  const amount = Number(document.querySelector('#calc-amount').value);
  const rate = Number(document.querySelector('#calc-rate').value);
  const months = Number(document.querySelector('#calc-tenure').value);

  const monthlyRate = rate / 1200;
  const emi = monthlyRate === 0
    ? amount / months
    : amount * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
  document.querySelector('#amount-output').textContent = formatCurrency(amount);
  document.querySelector('#rate-output').textContent = `${rate}% (per annum)`;
  document.querySelector('#tenure-output').textContent = `${months} months`;
  document.querySelector('#reducing-emi').textContent = formatCurrency(emi);
}

calculatorForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  updateCalculatorDisplay();
});

calculatorForm?.querySelectorAll('input').forEach((input) => {
  input.addEventListener('input', () => {
    document.querySelector('#amount-output').textContent = formatCurrency(Number(document.querySelector('#calc-amount').value));
    document.querySelector('#rate-output').textContent = `${Number(document.querySelector('#calc-rate').value)}% (per annum)`;
    document.querySelector('#tenure-output').textContent = `${Number(document.querySelector('#calc-tenure').value)} months`;
    updateCalculatorDisplay();
  });
});

updateCalculatorDisplay();

document.querySelector('#calculator-reset')?.addEventListener('click', () => {
  document.querySelector('#calc-amount').value = '20000';
  document.querySelector('#calc-tenure').value = '12';
  document.querySelector('#calc-rate').value = '12';
  updateCalculatorDisplay();
});

document.querySelector('#newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const message = document.querySelector('#newsletter-message');
  if (message) message.textContent = 'You are on the list. Thank you.';
  form.reset();
});
