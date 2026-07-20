/* ══════════════════════════════════════════════════════
   PROJECT PAGE — Shared JavaScript
   Self-contained: theme, scroll progress, lightbox,
   video player, scroll reveal, carousels
   ══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── 1. Theme Manager ─────────────────────────────── */
  const THEME_KEY = 'portfolio-theme';
  const html = document.documentElement;

  function getTheme() {
    return localStorage.getItem(THEME_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(t) {
    html.setAttribute('data-theme', t);
    localStorage.setItem(THEME_KEY, t);
    const btn = document.getElementById('proj-theme-btn');
    if (!btn) return;
    const sunIcon  = btn.querySelector('.sun-icon');
    const moonIcon = btn.querySelector('.moon-icon');
    if (sunIcon)  sunIcon.style.display  = t === 'dark' ? '' : 'none';
    if (moonIcon) moonIcon.style.display = t === 'light' ? '' : 'none';
  }

  function initTheme() {
    applyTheme(getTheme());
    const btn = document.getElementById('proj-theme-btn');
    if (btn) btn.addEventListener('click', () => {
      applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── 2. Scroll Progress ───────────────────────────── */
  function initScrollProgress() {
    const bar = document.getElementById('proj-scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = docH > 0 ? ((scrollTop / docH) * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── 3. Scroll Reveal ─────────────────────────────── */
  function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  }

  /* ── 4. Lightbox ──────────────────────────────────── */
  let lbImages = [];
  let lbIndex  = 0;

  function openLightbox(images, idx) {
    lbImages = images;
    lbIndex  = idx;
    showLbSlide();
    const lb = document.getElementById('proj-lightbox');
    if (lb) {
      lb.classList.add('open');
      lb.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeLightbox() {
    const lb = document.getElementById('proj-lightbox');
    if (lb) {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  function showLbSlide() {
    const img     = document.getElementById('proj-lb-img');
    const cap     = document.getElementById('proj-lb-caption');
    const counter = document.getElementById('proj-lb-counter');
    const item    = lbImages[lbIndex];
    if (!item || !img) return;
    img.src = item.src;
    img.alt = item.caption || '';
    if (cap)     cap.textContent = item.caption || '';
    if (counter) counter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
    const prevBtn = document.getElementById('proj-lb-prev');
    const nextBtn = document.getElementById('proj-lb-next');
    if (prevBtn) prevBtn.style.display = lbImages.length > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = lbImages.length > 1 ? '' : 'none';
  }

  function lbPrev() { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; showLbSlide(); }
  function lbNext() { lbIndex = (lbIndex + 1) % lbImages.length; showLbSlide(); }

  function initLightbox() {
    const lb    = document.getElementById('proj-lightbox');
    const close = document.getElementById('proj-lb-close');
    const prev  = document.getElementById('proj-lb-prev');
    const next  = document.getElementById('proj-lb-next');

    if (!lb) return;

    if (close) close.addEventListener('click', closeLightbox);
    if (prev)  prev.addEventListener('click', lbPrev);
    if (next)  next.addEventListener('click', lbNext);
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  lbPrev();
      if (e.key === 'ArrowRight') lbNext();
    });

    // Bind all gallery items
    document.querySelectorAll('.proj-gallery').forEach(gallery => {
      const items = gallery.querySelectorAll('.proj-gallery-item');
      const images = Array.from(items).map(item => ({
        src:     item.getAttribute('data-src') || item.querySelector('img')?.src || '',
        caption: item.getAttribute('data-caption') || item.querySelector('.proj-gallery-cap')?.textContent || ''
      }));
      items.forEach((item, idx) => {
        item.addEventListener('click', () => openLightbox(images, idx));
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(images, idx); }
        });
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
      });
    });
  }

  /* ── 5. Video Players ─────────────────────────────── */
  function formatTime(s) {
    const m = Math.floor(s / 60);
    return `${m}:${Math.floor(s % 60).toString().padStart(2, '0')}`;
  }

  function setupVideo(wrap) {
    const video    = wrap.querySelector('video');
    const playBtn  = wrap.querySelector('.vp-play-btn');
    const overlay  = wrap.querySelector('.vp-play-overlay');
    const progress = wrap.querySelector('.vp-progress');
    const fill     = wrap.querySelector('.vp-progress-fill');
    const timeEl   = wrap.querySelector('.vp-time');
    const fsBtn    = wrap.querySelector('.vp-fullscreen-btn');
    const playIcon = wrap.querySelector('.vp-play-icon');
    const pauseIcon= wrap.querySelector('.vp-pause-icon');
    if (!video) return;

    function updateIcon(playing) {
      if (playIcon)  playIcon.style.display = playing ? 'none' : '';
      if (pauseIcon) pauseIcon.style.display = playing ? '' : 'none';
    }

    function toggle() {
      if (video.paused) {
        video.play();
        if (overlay) overlay.classList.add('hidden');
      } else {
        video.pause();
        if (overlay) overlay.classList.remove('hidden');
      }
    }

    if (playBtn) playBtn.addEventListener('click', toggle);
    if (overlay) {
      overlay.addEventListener('click', toggle);
      overlay.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    }
    video.addEventListener('play',  () => updateIcon(true));
    video.addEventListener('pause', () => updateIcon(false));
    video.addEventListener('ended', () => { updateIcon(false); if (overlay) overlay.classList.remove('hidden'); });
    video.addEventListener('timeupdate', () => {
      if (!video.duration) return;
      const pct = (video.currentTime / video.duration) * 100;
      if (fill) fill.style.width = `${pct}%`;
      if (progress) progress.setAttribute('aria-valuenow', Math.round(pct));
      if (timeEl) timeEl.textContent = `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`;
    });
    video.addEventListener('loadedmetadata', () => {
      if (timeEl) timeEl.textContent = `0:00 / ${formatTime(video.duration)}`;
    });
    if (progress) {
      progress.addEventListener('click', e => {
        const rect = progress.getBoundingClientRect();
        video.currentTime = ((e.clientX - rect.left) / rect.width) * video.duration;
      });
    }
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) wrap.requestFullscreen().catch(() => {});
        else document.exitFullscreen().catch(() => {});
      });
    }
  }

  function initVideos() {
    document.querySelectorAll('.proj-video-wrap').forEach(setupVideo);
  }

  /* ── 6. Image Carousels ───────────────────────────── */
  function initCarousel(el) {
    const track   = el.querySelector('.car-track');
    const slides  = Array.from(el.querySelectorAll('.car-slide'));
    const dotsEl  = el.querySelector('.car-dots');
    const prev    = el.querySelector('.car-prev');
    const next    = el.querySelector('.car-next');
    if (!track || !slides.length) return;

    let cur = 0, timer = null;

    slides.forEach((_, i) => {
      const d = document.createElement('button');
      d.className = 'car-dot' + (i === 0 ? ' active' : '');
      d.setAttribute('aria-label', `Go to slide ${i + 1}`);
      d.addEventListener('click', () => { stop(); go(i); start(); });
      if (dotsEl) dotsEl.appendChild(d);
    });

    function go(idx) {
      if (idx < 0)             idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      cur = idx;
      track.style.transform = `translateX(-${cur * 100}%)`;
      el.querySelectorAll('.car-dot').forEach((d, i) => d.classList.toggle('active', i === cur));
    }

    function start() { timer = setInterval(() => go(cur + 1), 4000); }
    function stop()  { clearInterval(timer); }

    if (prev) prev.addEventListener('click', () => { stop(); go(cur - 1); start(); });
    if (next) next.addEventListener('click', () => { stop(); go(cur + 1); start(); });
    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    let tx = 0;
    el.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true });
    el.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - tx;
      if (Math.abs(dx) > 40) { stop(); go(dx < 0 ? cur + 1 : cur - 1); start(); }
    });
    start();
  }

  function initCarousels() {
    document.querySelectorAll('.proj-carousel').forEach(initCarousel);
  }

  /* ── 7. Skill Bar Animations ──────────────────────── */
  function initSkillBars() {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll('.skill-bar-fill[data-width]').forEach((fill, i) => {
            setTimeout(() => { fill.style.width = fill.getAttribute('data-width') + '%'; }, i * 120);
          });
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    document.querySelectorAll('.skill-category').forEach(c => obs.observe(c));
  }

  /* ── Boot ─────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollProgress();
    initScrollReveal();
    initLightbox();
    initVideos();
    initCarousels();
    initSkillBars();
  });

})();
