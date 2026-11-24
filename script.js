(() => {
  'use strict';
  const PHONE = '917387310212', EMAIL = 'aadityachavan.0212@gmail.com';
  const $ = (s, r = document) => r.querySelector(s);
  const wa = t => `https://wa.me/${PHONE}?text=${encodeURIComponent(t)}`;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#year').textContent = new Date().getFullYear();

  // Navigation
  const nav = $('#nav'), burger = $('#burger'), menu = $('#menu');
  const setMenu = open => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  menu.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  const onScroll = () => nav.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // Observers: reveal + active nav link
  const reveals = document.querySelectorAll('.reveal');
  const links = [...menu.querySelectorAll('a[href^="#"]:not(.btn)')];
  if ('IntersectionObserver' in window) {
    if (reduce) reveals.forEach(el => el.classList.add('in'));
    else {
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      }), { threshold: 0.12 });
      reveals.forEach(el => io.observe(el));
    }
    const so = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.getAttribute('href') === '#' + e.target.id ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current'));
    }), { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(a => { const s = $(a.getAttribute('href')); if (s) so.observe(s); });
  } else reveals.forEach(el => el.classList.add('in'));

  // Pricing buttons -> WhatsApp
  document.querySelectorAll('[data-plan]').forEach(b => b.addEventListener('click', () => {
    window.open(wa(`Hi codeX, I'm interested in the ${b.dataset.plan} website package. Could we discuss my project?`), '_blank', 'noopener');
  }));
  $('#waBtn').href = wa("Hi codeX, I'd like to discuss a website project.");

  // Contact form (client-side only, no server)
  const form = $('#form'), msg = $('#formMsg');
  const rules = {
    name: v => v.trim().length < 2 && 'Please enter your name.',
    email: v => !/^\S+@\S+\.\S+$/.test(v.trim()) && 'Please enter a valid email address.',
    details: v => v.trim().length < 10 && 'Please add a few details about your project (10+ characters).'
  };
  const check = el => {
    const rule = rules[el.name]; if (!rule) return true;
    const err = rule(el.value) || '';
    $('#err-' + el.name).textContent = err;
    el.setAttribute('aria-invalid', !!err);
    return !err;
  };
  const fields = [...form.querySelectorAll('input,textarea')];
  fields.forEach(el => el.addEventListener('blur', () => check(el)));
  fields.forEach(el => el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && check(el)));

  let via = 'wa';
  form.querySelectorAll('[data-via]').forEach(b => b.addEventListener('click', () => { via = b.dataset.via; }));
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = fields.filter(el => !check(el));
    if (bad.length) { bad[0].focus(); msg.textContent = 'Please fix the highlighted fields.'; return; }
    const d = Object.fromEntries(new FormData(form));
    const body = `Name: ${d.name.trim()}\nEmail: ${d.email.trim()}\nBusiness: ${d.biz.trim() || '-'}\nPackage: ${d.pkg}\n\nProject details:\n${d.details.trim()}`;
    if (via === 'wa') window.open(wa(`Hi codeX,\n\n${body}`), '_blank', 'noopener');
    else location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(`Website enquiry (${d.pkg}) from ${d.name.trim()}`)}&body=${encodeURIComponent(body)}`;
    msg.textContent = 'Opening your app. Press send there to deliver the message.';
  });
})();
