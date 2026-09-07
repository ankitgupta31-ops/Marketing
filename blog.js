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

const applicationUrl = 'https://vridoracapital.roopya.money/customer/personal_loan/a4e692d6381b9b3e0a1830a6c4f7581b6089aa571a8c70dd5f9ea22d3ce3181a/eb27b624defa133f8cc53a14f0de5beb65acaf1b0adde6f87955280afadc10fd';
document.querySelectorAll('a[href*="#apply"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    window.open(applicationUrl, '_blank', 'noopener');
  });
});
