/* ═════════════════════════════════════
   ESSENZA — HIPRO  |  script.js v2
   ═════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initParticles();
  initCounters();
  initScrollAnimations();
  initIndicacoesTabs();
  initHamburger();
  initGaleria();
});

/* ── Cursor ── */
function initCursor() {
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mX = 0, mY = 0, fX = 0, fY = 0;

  document.addEventListener('mousemove', e => {
    mX = e.clientX; mY = e.clientY;
    gsap.to(cursor, { x: mX - 4, y: mY - 4, duration: .06 });
  });

  (function animF() {
    fX += (mX - fX - 16) * .1;
    fY += (mY - fY - 16) * .1;
    follower.style.transform = `translate(${fX}px,${fY}px)`;
    requestAnimationFrame(animF);
  })();

  document.querySelectorAll('a, button, .fcard, .ben-card, .tec__step, .gal-item, .ad-item, .dep-video-card')
    .forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
      });
    });
}

/* ── Nav scroll ── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const t = document.querySelector(link.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      const y = t.getBoundingClientRect().top + window.scrollY - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    });
  });
}

/* ── Hamburger ── */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  const openMenu = () => {
    btn.classList.add('open');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeMenu = () => {
    btn.classList.remove('open');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Toggle: mesmo botão abre e fecha
  btn.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Fechar pelos links do menu
  document.querySelectorAll('.mob-link').forEach(l => {
    l.addEventListener('click', () => {
      closeMenu();
    });
  });
}

/* ── Particles ── */
function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = Array.from({ length: 55 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    r: Math.random() * 1.4 + .3,
    a: Math.random() * .35 + .08,
  }));

  (function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(189,181,164,${(1 - d / 110) * .07})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
    pts.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,184,158,${p.a})`;
      ctx.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
    requestAnimationFrame(draw);
  })();
}

/* ── Counters ── */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = +el.getAttribute('data-count');
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        gsap.to({ v: 0 }, {
          v: target, duration: 2, ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(this.targets()[0].v); }
        });
      }
    });
  });
}

/* ── Scroll Animations ── */
function initScrollAnimations() {
  // Service cards
  gsap.utils.toArray('.srv-card').forEach((c, i) => {
    gsap.fromTo(c, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: .8, delay: i * .1, ease: 'power3.out',
      scrollTrigger: { trigger: '.srv__grid', start: 'top 88%', once: true }
    });
  });

  // Generic fade-up for section labels
  gsap.utils.toArray('.section-label').forEach(el => {
    gsap.fromTo(el, { opacity: 0, x: -16 }, {
      opacity: 1, x: 0, duration: .7, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  // Section titles
  gsap.utils.toArray('.section-title').forEach(el => {
    gsap.fromTo(el, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  // Feature cards
  gsap.utils.toArray('.fcard').forEach((c, i) => {
    gsap.fromTo(c, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: .8, delay: i * .1, ease: 'power3.out',
      scrollTrigger: { trigger: c, start: 'top 90%', once: true }
    });
  });

  // Sobre text
  gsap.utils.toArray('.sobre__text').forEach((t, i) => {
    gsap.fromTo(t, { opacity: 0, y: 20 }, {
      opacity: 1, y: 0, duration: .8, delay: i * .1, ease: 'power2.out',
      scrollTrigger: { trigger: t, start: 'top 90%', once: true }
    });
  });

  // Benefit cards
  gsap.utils.toArray('.ben-card').forEach((c, i) => {
    gsap.fromTo(c, { opacity: 0, y: 36 }, {
      opacity: 1, y: 0, duration: .8, delay: (i % 3) * .12, ease: 'power3.out',
      scrollTrigger: { trigger: c, start: 'top 90%', once: true }
    });
  });

  // Tech steps
  gsap.utils.toArray('.tec__step').forEach((s, i) => {
    gsap.fromTo(s, { opacity: 0, y: 28 }, {
      opacity: 1, y: 0, duration: .8, delay: i * .14, ease: 'power3.out',
      scrollTrigger: { trigger: '.tec__steps', start: 'top 85%', once: true }
    });
  });

  // Skin layers
  gsap.utils.toArray('.layer').forEach((l, i) => {
    gsap.fromTo(l, { opacity: 0, x: -18 }, {
      opacity: 1, x: 0, duration: .6, delay: i * .09, ease: 'power2.out',
      scrollTrigger: { trigger: '.skin-layers', start: 'top 85%', once: true }
    });
  });

  // Tech badges
  gsap.utils.toArray('.tbadge').forEach((b, i) => {
    gsap.fromTo(b, { opacity: 0, scale: .92 }, {
      opacity: 1, scale: 1, duration: .7, delay: i * .12, ease: 'back.out(1.5)',
      scrollTrigger: { trigger: '.tec__visual', start: 'top 85%', once: true }
    });
  });

  // Ind items
  gsap.utils.toArray('.ind__item').forEach((item, i) => {
    gsap.fromTo(item, { opacity: 0, x: -18 }, {
      opacity: 1, x: 0, duration: .55, delay: i * .07, ease: 'power2.out',
      scrollTrigger: { trigger: item, start: 'top 92%', once: true }
    });
  });

  // Ind photo
  gsap.fromTo('.ind__photo-wrap', { opacity: 0, scale: .97 }, {
    opacity: 1, scale: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.ind__photo-wrap', start: 'top 85%', once: true }
  });

  // Galeria items
  gsap.utils.toArray('.gal-item').forEach((g, i) => {
    gsap.fromTo(g, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: .9, delay: i * .1, ease: 'power3.out',
      scrollTrigger: { trigger: '.galeria__grid', start: 'top 85%', once: true }
    });
  });

  // Perks
  gsap.utils.toArray('.perk').forEach((p, i) => {
    gsap.fromTo(p, { opacity: 0, x: -28 }, {
      opacity: 1, x: 0, duration: .8, delay: i * .14, ease: 'power3.out',
      scrollTrigger: { trigger: p, start: 'top 90%', once: true }
    });
  });

  // Finance card
  gsap.fromTo('.finance-card', { opacity: 0, scale: .95, y: 20 }, {
    opacity: 1, scale: 1, y: 0, duration: .9, ease: 'back.out(1.4)',
    scrollTrigger: { trigger: '.finance-card', start: 'top 86%', once: true }
  });

  // Antes e depois carousel fade-in
  gsap.fromTo('.ad-carousel', { opacity: 0 }, {
    opacity: 1, duration: 1, ease: 'power2.out',
    scrollTrigger: { trigger: '.ad-carousel', start: 'top 88%', once: true }
  });

  // Dep-video cards
  gsap.utils.toArray('.dep-video-card').forEach((c, i) => {
    gsap.fromTo(c, { opacity: 0, y: 28, scale: .97 }, {
      opacity: 1, y: 0, scale: 1, duration: .8, delay: i * .12, ease: 'power3.out',
      scrollTrigger: { trigger: '.dep-video__grid', start: 'top 85%', once: true }
    });
  });

  // Video section
  gsap.fromTo('.video-wrapper', { opacity: 0, y: 30, scale: .97 }, {
    opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out',
    scrollTrigger: { trigger: '.video-wrapper', start: 'top 85%', once: true }
  });

  // Contato CTA
  gsap.fromTo('.contato__actions', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: .9, ease: 'power3.out',
    scrollTrigger: { trigger: '.contato__actions', start: 'top 88%', once: true }
  });

  // Parallax hero grid
  gsap.to('.hero__grid', {
    yPercent: -25, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
    }
  });

  // Hero device subtle float on scroll
  gsap.to('.hero__image-wrap', {
    yPercent: -8, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true
    }
  });
}

/* ── Indicações tabs ── */
function initIndicacoesTabs() {
  const tabs = document.querySelectorAll('.ind__tab');
  const lists = document.querySelectorAll('.ind__list');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      lists.forEach(l => l.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (!target) return;
      target.classList.add('active');
      gsap.fromTo(target.querySelectorAll('.ind__item'),
        { opacity: 0, x: -14 },
        { opacity: 1, x: 0, duration: .4, stagger: .07, ease: 'power2.out' }
      );
    });
  });
}

/* ── Galeria hover ── */
function initGaleria() {
  // Marquee pause on hover
  const track = document.querySelector('.marquee-track');
  if (track) {
    track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
  }
}
