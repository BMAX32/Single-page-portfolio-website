(() => {
  'use strict';

  /* ========== 1. Project pop-ups (moved here from CSS :target) ========== */
  const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';
  let openModal = null;
  let lastTrigger = null;

  function open(id, trigger) {
    const modal = document.getElementById(id);
    if (!modal) return;
    if (openModal) close();
    lastTrigger = trigger;
    openModal = modal;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden'; // stop the page scrolling behind the pop-up
    modal.querySelector('.modal__close').focus();
  }

  function close() {
    if (!openModal) return;
    openModal.classList.remove('is-open');
    openModal = null;
    document.body.style.overflow = '';
    if (lastTrigger) lastTrigger.focus(); // give focus back to the card
  }

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-modal-open]');
    if (opener) return open(opener.dataset.modalOpen, opener);
    if (e.target.closest('[data-modal-close]')) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!openModal) return;
    if (e.key === 'Escape') return close();
    if (e.key === 'Tab') { // keep keyboard focus inside the pop-up
      const items = [...openModal.querySelectorAll(FOCUSABLE)];
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ========== 2. Typewriter effect in the hero title ========== */
  const el = document.getElementById('typed');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (el && !reduceMotion) {
    const phrases = [
      'Software and Hardware!',
      'Robotics and IoT!',
      'Python and AI!',
      'Autonomous Cars!'
    ];
    const TYPE_MS = 80, DELETE_MS = 40, HOLD_MS = 1800, GAP_MS = 400;

    const cursor = document.createElement('span');
    cursor.className = 'typed-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.after(cursor);

    let phraseIndex = 0;
    let count = phrases[0].length; // start from the text already in the page
    let deleting = false;

    function tick() {
      const phrase = phrases[phraseIndex];
      let delay;

      if (!deleting) {
        if (count < phrase.length) { count++; delay = TYPE_MS; }
        else { deleting = true; delay = HOLD_MS; }
      } else {
        if (count > 0) { count--; delay = DELETE_MS; }
        else { deleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; delay = GAP_MS; }
      }

      el.textContent = phrases[phraseIndex].slice(0, count) || '\u200B'; // zero-width space keeps the line height
      setTimeout(tick, delay);
    }

    setTimeout(tick, HOLD_MS);
  }
})();