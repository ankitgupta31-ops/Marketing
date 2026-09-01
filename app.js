const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
const languageToggle = document.querySelector('[data-language-toggle]');
const languageText = {
  en: { pay: 'Pay EMI', apply: 'Apply now', hero: 'Keep moving.', heroSecond: 'Keep earning.', eligibility: 'Check your eligibility', payment: 'Make an EMI payment', method: 'Payment method', continue: 'Continue to payment' },
  hi: { pay: 'EMI जमा करें', apply: 'अभी आवेदन करें', hero: 'चलते रहिए।', heroSecond: 'कमाते रहिए।', eligibility: 'अपनी पात्रता जांचें', payment: 'EMI भुगतान करें', method: 'भुगतान का तरीका', continue: 'भुगतान के लिए आगे बढ़ें' }
};
let currentLanguage = 'en';

languageToggle?.addEventListener('click', () => {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  const copy = languageText[currentLanguage];
  document.documentElement.lang = currentLanguage === 'hi' ? 'hi' : 'en';
  document.querySelector('.text-link').textContent = copy.pay;
  document.querySelector('.button-small').innerHTML = `${copy.apply} <span aria-hidden="true">↗</span>`;
  document.querySelector('.hero h1').innerHTML = `${copy.hero}<br><em>${copy.heroSecond}</em>`;
  document.querySelector('.hero-actions .button').innerHTML = `${copy.eligibility} <span aria-hidden="true">↗</span>`;
  document.querySelector('.payment-card h3').textContent = copy.payment;
  document.querySelector('.payment-methods legend').textContent = copy.method;
  document.querySelector('#payment-form button').innerHTML = `${copy.continue} <span aria-hidden="true">↗</span>`;
  languageToggle.textContent = currentLanguage === 'en' ? 'हिंदी' : 'English';
  languageToggle.setAttribute('aria-label', currentLanguage === 'en' ? 'Switch to Hindi' : 'Switch to English');
});

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
  );
});

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

function updateCalculator() {
  if (!calculatorForm) return;
  const amount = Number(document.querySelector('#calc-amount').value);
  const rate = Number(document.querySelector('#calc-rate').value);
  const months = Number(document.querySelector('#calc-tenure').value);
  const monthlyRate = rate / 1200;
  const reducingEmi = monthlyRate === 0 ? amount / months : amount * monthlyRate * ((1 + monthlyRate) ** months) / (((1 + monthlyRate) ** months) - 1);
  const flatInterest = amount * (rate / 100) * (months / 12);
  const flatEmi = (amount + flatInterest) / months;

  document.querySelector('#amount-output').textContent = formatCurrency(amount);
  document.querySelector('#rate-output').textContent = `${rate}%`;
  document.querySelector('#tenure-output').textContent = `${months} months`;
  document.querySelector('#reducing-emi').textContent = formatCurrency(reducingEmi);
  document.querySelector('#reducing-interest').textContent = formatCurrency((reducingEmi * months) - amount);
  document.querySelector('#flat-emi').textContent = formatCurrency(flatEmi);
  document.querySelector('#flat-interest').textContent = formatCurrency(flatInterest);
}

calculatorForm?.querySelectorAll('input').forEach((input) => input.addEventListener('input', updateCalculator));
updateCalculator();
