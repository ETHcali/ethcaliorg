/**
 * Home page behaviour: metric counters and the two hero dropdowns.
 *
 * Was ~100 lines inline in <head> of ethcali.html, where it ran before the DOM
 * existed and could not be cached. Vanilla — jQuery is gone from the site.
 */

/** Counts an element up to its data-target. Respects reduced-motion. */
function animateCounter(el, target, duration = 2200) {
  const start = Number(el.textContent.replace(/\D/g, '')) || 0;
  const t0 = performance.now();
  const eased = (t) => 1 - Math.pow(1 - t, 3);

  function frame(now) {
    const progress = Math.min((now - t0) / duration, 1);
    const value = Math.round(start + (target - start) * eased(progress));
    el.textContent = value.toLocaleString('es-CO');
    if (progress < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function initMetrics() {
  const numbers = document.querySelectorAll('.metric-number');
  if (!numbers.length) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const reveal = (el) => {
    const target = Number(el.dataset.target);
    if (!Number.isFinite(target) || el.dataset.animated) return;
    el.dataset.animated = 'true';
    if (reduced) {
      el.textContent = target.toLocaleString('es-CO');
      return;
    }
    // A beat of delay lets Safari/iOS finish layout before the count starts.
    setTimeout(() => animateCounter(el, target), 120);
  };

  if (!('IntersectionObserver' in window)) {
    numbers.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.35 });

  numbers.forEach((el) => observer.observe(el));
}

function initHeroDropdowns() {
  const triggers = [...document.querySelectorAll('.hero-cta-main[aria-controls]')];
  if (!triggers.length) return;

  const closeAll = () => triggers.forEach((t) => {
    t.setAttribute('aria-expanded', 'false');
    document.getElementById(t.getAttribute('aria-controls'))?.classList.remove('open');
  });

  triggers.forEach((trigger) => {
    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
    if (!menu) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = trigger.getAttribute('aria-expanded') !== 'true';
      closeAll();
      if (willOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        menu.classList.add('open');
      }
    });
    menu.addEventListener('click', (e) => e.stopPropagation());
  });

  document.addEventListener('click', closeAll);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });
}

document.addEventListener('DOMContentLoaded', () => {
  initMetrics();
  initHeroDropdowns();
});
