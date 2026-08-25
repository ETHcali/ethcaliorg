/**
 * Loads the shared navbar and footer partials and wires their behaviour.
 *
 * Vanilla, no jQuery. The old version used $.load(), which was the only reason
 * jQuery was on every page — 90KB to inject two HTML fragments.
 *
 * Partials are fetched rather than duplicated into each page so the nav has one
 * definition. That means the site must be served over HTTP; opening a page as a
 * file:// URL will leave the containers empty.
 */

async function injectPartial(containerId, url) {
  const container = document.getElementById(containerId);
  if (!container) return false;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    container.innerHTML = await res.text();
    return true;
  } catch (err) {
    // Leave the container empty rather than showing a broken shell. The page
    // content below it still reads fine without the chrome.
    console.error(`Could not load ${url}:`, err);
    return false;
  }
}

function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const toggle = document.querySelector('.mobile-menu-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('mobile-active');
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  if (navbar) {
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Mark the current page. Match on the full filename, not a substring: "events"
  // is contained in "events_locales", so a substring test lit up three links at
  // once. index/"" both mean the home page, which is ethcali.html.
  const file = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const current = (file === '' || file === 'index' || file === 'home') ? 'ethcali' : file;
  document.querySelectorAll('.nav-link[href]').forEach((link) => {
    const target = link.getAttribute('href').split('/').pop().replace(/\.html$/, '');
    if (target && target === current) link.classList.add('active');
  });

  // Dropdowns open on hover via CSS (:hover / :focus-within). Touch has neither,
  // so give the trigger an explicit tap toggle.
  document.querySelectorAll('.nav-dropdown').forEach((dropdown) => {
    const trigger = dropdown.querySelector('.dropdown-trigger');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const open = menu.classList.toggle('show');
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.dropdown-menu.show').forEach((m) => m.classList.remove('show'));
    if (links?.classList.contains('mobile-active')) {
      links.classList.remove('mobile-active');
      toggle?.classList.remove('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const [navLoaded] = await Promise.all([
    injectPartial('navbar-container', 'navbar.html'),
    injectPartial('footer-container', 'footer.html'),
  ]);
  if (navLoaded) initNavbar();
});
