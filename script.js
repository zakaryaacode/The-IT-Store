
    // ─────────────────────────────────────────────────────
    // GSAP Plugin Registration
    // ─────────────────────────────────────────────────────
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // ─────────────────────────────────────────────────────
    // CUSTOM CURSOR
    // ─────────────────────────────────────────────────────
    const cursor     = document.getElementById('cursor');
    const cursorTrail = document.getElementById('cursor-trail');

    document.addEventListener('mousemove', (e) => {
      // Snap cursor dot directly
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      // Lag trail for ghost effect
      gsap.to(cursorTrail, { x: e.clientX, y: e.clientY, duration: 0.15, ease: 'power2.out' });
    });

    // Expand trail on interactive elements
    document.querySelectorAll('a, button, .card-hover, .nav-link, .footer-col li').forEach(el => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursorTrail, { width: 50, height: 50, opacity: 0.6, duration: 0.3 });
        gsap.to(cursor, { scale: 1.8, duration: 0.3 });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursorTrail, { width: 30, height: 30, opacity: 1, duration: 0.3 });
        gsap.to(cursor, { scale: 1, duration: 0.3 });
      });
    });

    // ─────────────────────────────────────────────────────
    // SCROLL PROGRESS BAR
    // ─────────────────────────────────────────────────────
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      gsap.set(progressBar, { width: pct + '%' });
    });

    // ─────────────────────────────────────────────────────
    // LOADING SCREEN — animated bar then fade out
    // ─────────────────────────────────────────────────────
    const loadingBar = document.getElementById('loading-bar');

    function startLoadingAnimation() {
      // Animate the loading bar from 0 → 100% over ~800ms
      gsap.to(loadingBar, {
        width: '100%',
        duration: 0.8,
        ease: 'power2.inOut',
        onComplete: () => {
          // Fade out loading screen
          gsap.to('#loading-screen', {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
              const screen = document.getElementById('loading-screen');
              if (screen) screen.remove();
              // Fire hero entrance only after loading screen is gone
              playHeroEntrance();
            }
          });
        }
      });
    }

    window.addEventListener('load', () => {
      // Slight delay so the spinner has a moment to show
      setTimeout(startLoadingAnimation, 300);
    });

    // ─────────────────────────────────────────────────────
    // HERO ENTRANCE ANIMATION
    // ─────────────────────────────────────────────────────
    function playHeroEntrance() {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Nav slides down
      tl.from('#main-nav', { y: -80, opacity: 0, duration: 0.6 })

      // Badge pops in with a bounce
        .from('#hero-badge', { scale: 0.5, opacity: 0, duration: 0.5, ease: 'back.out(1.7)' }, '-=0.2')

      // Title slides up with a slight stagger per line (word-level requires plugin; use whole element)
        .from('#hero-title', { y: 60, opacity: 0, duration: 0.7 }, '-=0.2')

      // Subtitle
        .from('#hero-sub', { y: 40, opacity: 0, duration: 0.6 }, '-=0.4')

      // Buttons stagger
        .from('#hero-buttons .btn-primary, #hero-buttons .btn-neon', {
          y: 30, opacity: 0, duration: 0.5, stagger: 0.15
        }, '-=0.3')

      // Stats cards stagger up
        .from('#stats-grid .stat-box', {
          y: 40, opacity: 0, duration: 0.5, stagger: 0.12
        }, '-=0.2');

      // Counter animation on stat numbers
      tl.add(() => animateCounters(), '-=0.2');

      // Floating particles entrance
      tl.from('.particle', { opacity: 0, scale: 0, stagger: 0.05, duration: 0.5 }, '-=0.5');

      // Circuit path draw effect
      const path = document.getElementById('circuit-path');
      if (path) {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        tl.to(path, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' }, 0.5);
      }

      // Circuit dots pulse
      tl.from('.circuit-dot', { scale: 0, opacity: 0, stagger: 0.3, duration: 0.4, ease: 'back.out(2)' }, 1.5);
    }

    // ─────────────────────────────────────────────────────
    // COUNTER ANIMATION (stats)
    // ─────────────────────────────────────────────────────
    function animateCounters() {
      document.querySelectorAll('.stat-num[data-target]').forEach(el => {
        const target = parseInt(el.getAttribute('data-target'));
        const suffix = el.getAttribute('data-suffix') || '';
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.5,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; }
        });
      });
    }

    // ─────────────────────────────────────────────────────
    // HERO PARALLAX on mouse move
    // ─────────────────────────────────────────────────────
    document.getElementById('hero').addEventListener('mousemove', (e) => {
      const rect = document.getElementById('hero').getBoundingClientRect();
      const cx   = (e.clientX - rect.left) / rect.width  - 0.5;  // -0.5 to 0.5
      const cy   = (e.clientY - rect.top)  / rect.height - 0.5;
      gsap.to('#hero-content', { x: cx * 20, y: cy * 10, duration: 0.8, ease: 'power2.out' });
      gsap.to('.circuit-svg',  { x: cx * -15, y: cy * -8,  duration: 1,   ease: 'power2.out' });
    });
    document.getElementById('hero').addEventListener('mouseleave', () => {
      gsap.to('#hero-content', { x: 0, y: 0, duration: 0.8 });
      gsap.to('.circuit-svg',  { x: 0, y: 0, duration: 0.8 });
    });

    // ─────────────────────────────────────────────────────
    // PARTICLE CREATION (keep original logic)
    // ─────────────────────────────────────────────────────
    const container = document.getElementById('particles-container');
    for (let i = 0; i < 20; i++) {
      const p    = document.createElement('div');
      p.className = 'particle';
      const size = Math.random() * 4 + 2;
      p.style.cssText = `
        left:${Math.random()*100}%;
        top:${Math.random()*100}%;
        width:${size}px;
        height:${size}px;
        animation:particleFloat ${Math.random()*10+20}s infinite;
        animation-delay:${Math.random()*5}s;
      `;
      container.appendChild(p);
    }

    // ─────────────────────────────────────────────────────
    // GSAP ScrollTrigger — helper for section reveals
    // ─────────────────────────────────────────────────────
    function revealOnScroll(targets, options = {}) {
      const defaults = { y: 50, opacity: 0, duration: 0.7, ease: 'power3.out', stagger: 0.15 };
      const vars     = Object.assign({}, defaults, options);
      gsap.from(targets, {
        scrollTrigger: {
          trigger: typeof targets === 'string' ? targets : targets[0],
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        ...vars
      });
    }

    // ─────────────────────────────────────────────────────
    // ABOUT SECTION
    // ─────────────────────────────────────────────────────
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to('#about-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
          .to('#about-text',   { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .to('#icon-grid .gsap-hidden', {
            opacity: 1, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)'
          }, '-=0.4')
          .from('#bullet-list li', { x: -30, opacity: 0, stagger: 0.1, duration: 0.4 }, '-=0.8');
      }
    });
    // Set starting states for about elements
    gsap.set('#about-header', { opacity: 0, y: 40 });
    gsap.set('#about-text',   { opacity: 0, x: -60 });
    gsap.set('#icon-grid .gsap-hidden', { opacity: 0, scale: 0.8 });

    // ─────────────────────────────────────────────────────
    // SERVICES SECTION
    // ─────────────────────────────────────────────────────
    gsap.set('#services-header', { opacity: 0, y: 40 });
    gsap.set('#services-grid .gsap-hidden', { opacity: 0, y: 60 });

    ScrollTrigger.create({
      trigger: '#services',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('#services-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.to('#services-grid .gsap-hidden', {
          opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out', delay: 0.2
        });
      }
    });

    // Service card icon wiggle on hover
    document.querySelectorAll('.service-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('svg'), { rotation: 15, scale: 1.2, duration: 0.3, ease: 'back.out(2)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('svg'), { rotation: 0, scale: 1, duration: 0.3 });
      });
    });

    // ─────────────────────────────────────────────────────
    // PROJECT SECTION
    // ─────────────────────────────────────────────────────
    gsap.set('#project-header', { opacity: 0, y: 40 });
    gsap.set('#project-info',   { opacity: 0, x: -60 });
    gsap.set('#iframe-wrap',    { opacity: 0, x:  60 });

    ScrollTrigger.create({
      trigger: '#project',
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to('#project-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
          .to('#project-info',   { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
          .to('#iframe-wrap',    { opacity: 1, x: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
          .from('#check-list li', { x: -20, opacity: 0, stagger: 0.1, duration: 0.4 }, '-=0.6');
      }
    });

    // ─────────────────────────────────────────────────────
    // WHY CHOOSE US SECTION
    // ─────────────────────────────────────────────────────
    gsap.set('#why-header', { opacity: 0, y: 40 });
    gsap.set('#why-list .gsap-hidden', { opacity: 0, x: -50 });

    ScrollTrigger.create({
      trigger: '#why-section',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('#why-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.to('#why-list .gsap-hidden', {
          opacity: 1, x: 0, duration: 0.55, stagger: 0.1, ease: 'power3.out', delay: 0.2
        });
      }
    });

    // Check-circle pulse on hover
    document.querySelectorAll('.why-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card.querySelector('.check-circle'), { scale: 1.3, rotation: 10, duration: 0.3, ease: 'back.out(2)' });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card.querySelector('.check-circle'), { scale: 1, rotation: 0, duration: 0.3 });
      });
    });

    // ─────────────────────────────────────────────────────
    // TESTIMONIALS SECTION
    // ─────────────────────────────────────────────────────
    gsap.set('#testimonials-header', { opacity: 0, y: 40 });
    gsap.set('#testimonials-grid .gsap-hidden', { opacity: 0, y: 50, rotationY: 10 });

    ScrollTrigger.create({
      trigger: '#testimonials-section',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('#testimonials-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
        gsap.to('#testimonials-grid .gsap-hidden', {
          opacity: 1, y: 0, rotationY: 0, duration: 0.65, stagger: 0.15, ease: 'power3.out', delay: 0.2
        });
      }
    });

    // Stars sparkle on hover
    document.querySelectorAll('.testimonial-card').forEach(card => {
      const stars = card.querySelector('.stars');
      card.addEventListener('mouseenter', () => {
        gsap.fromTo(stars, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1 });
      });
    });

    // ─────────────────────────────────────────────────────
    // CONTACT SECTION
    // ─────────────────────────────────────────────────────
    gsap.set('#contact-header',  { opacity: 0, y: 40 });
    gsap.set('#contact-form',    { opacity: 0, y: 40 });
    gsap.set('#contact-grid .gsap-hidden', { opacity: 0, scale: 0.9 });

    ScrollTrigger.create({
      trigger: '#contact',
      start: 'top 80%',
      onEnter: () => {
        const tl = gsap.timeline();
        tl.to('#contact-header', { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' })
          .to('#contact-form',   { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3')
          .to('#contact-grid .gsap-hidden', { opacity: 1, scale: 1, stagger: 0.15, duration: 0.5, ease: 'back.out(1.4)' }, '-=0.2');
      }
    });

    // Input focus glow animation
    document.querySelectorAll('.input-neon').forEach(input => {
      input.addEventListener('focus', () => {
        gsap.to(input, { boxShadow: '0 0 25px rgba(0,255,255,0.4)', duration: 0.3 });
      });
      input.addEventListener('blur', () => {
        gsap.to(input, { boxShadow: 'none', duration: 0.3 });
      });
    });

    // ─────────────────────────────────────────────────────
    // FOOTER ENTRANCE
    // ─────────────────────────────────────────────────────
    gsap.from('#main-footer', {
      scrollTrigger: { trigger: '#main-footer', start: 'top 90%' },
      opacity: 0, y: 30, duration: 0.7, ease: 'power3.out'
    });

    // ─────────────────────────────────────────────────────
    // NAV SCROLL — shrink & highlight effect
    // ─────────────────────────────────────────────────────
    ScrollTrigger.create({
      start: 100,
      onUpdate: (self) => {
        if (self.scroll() > 100) {
          gsap.to('nav', { background: 'rgba(0,0,0,0.85)', duration: 0.3 });
        } else {
          gsap.to('nav', { background: 'rgba(0,0,0,0.3)', duration: 0.3 });
        }
      }
    });

    // ─────────────────────────────────────────────────────
    // BUTTON CLICK RIPPLE
    // ─────────────────────────────────────────────────────
    function addRipple(btn) {
      btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect   = this.getBoundingClientRect();
        const size   = Math.max(rect.width, rect.height) * 2;
        ripple.style.cssText = `
          position:absolute; border-radius:50%; pointer-events:none;
          background:rgba(0,255,255,0.3);
          width:${size}px; height:${size}px;
          left:${e.clientX - rect.left - size/2}px;
          top:${e.clientY - rect.top  - size/2}px;
          transform:scale(0); opacity:1;
        `;
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        gsap.to(ripple, {
          scale: 1, opacity: 0, duration: 0.6, ease: 'power2.out',
          onComplete: () => ripple.remove()
        });
      });
    }
    document.querySelectorAll('.btn-primary, .btn-neon').forEach(addRipple);

    // ─────────────────────────────────────────────────────
    // SMOOTH SCROLL (uses GSAP ScrollToPlugin)
    // ─────────────────────────────────────────────────────
    function smoothScrollTo(id) {
      const el = document.getElementById(id);
      if (el) {
        gsap.to(window, {
          duration: 1,
          scrollTo: { y: el, offsetY: 80 },
          ease: 'power3.inOut'
        });
      }
    }

    // ─────────────────────────────────────────────────────
    // MOBILE MENU (unchanged logic, just kept here)
    // ─────────────────────────────────────────────────────
    let menuOpen = false;
    function toggleMobileMenu() {
      menuOpen = !menuOpen;
      const menu      = document.getElementById('mobile-menu');
      const menuIcon  = document.getElementById('menu-icon');
      const closeIcon = document.getElementById('close-icon');
      menu.style.display = menuOpen ? 'block' : 'none';
      menuIcon.style.display  = menuOpen ? 'none'  : 'block';
      closeIcon.style.display = menuOpen ? 'block' : 'none';
      if (menuOpen) {
        gsap.from('#mobile-menu a', { x: -20, opacity: 0, stagger: 0.08, duration: 0.3 });
      }
    }
    function closeMobileMenu() {
      menuOpen = false;
      document.getElementById('mobile-menu').style.display  = 'none';
      document.getElementById('menu-icon').style.display    = 'block';
      document.getElementById('close-icon').style.display   = 'none';
    }

    // ─────────────────────────────────────────────────────
    // FORM SUBMIT
    // ─────────────────────────────────────────────────────
    function handleFormSubmit(btn) {
      // Animate button before alert
      gsap.to(btn, {
        scale: 0.95, duration: 0.1, yoyo: true, repeat: 1,
        onComplete: () => {
          alert("Thank you for your message! We'll get back to you shortly.");
        }
      });
    }

    // ─────────────────────────────────────────────────────
    // LOGO hover wiggle
    // ─────────────────────────────────────────────────────
    const logo = document.getElementById('nav-logo');
    logo.addEventListener('mouseenter', () => {
      gsap.to(logo, { skewX: -5, duration: 0.2, ease: 'power2.out' });
    });
    logo.addEventListener('mouseleave', () => {
      gsap.to(logo, { skewX: 0, duration: 0.3, ease: 'elastic.out(1, 0.5)' });
    });

    // ─────────────────────────────────────────────────────
    // Continuous ambient pulse on neon-glow badge
    // ─────────────────────────────────────────────────────
    gsap.to('#hero-badge .neon-glow', {
      boxShadow: '0 0 40px rgba(0,255,255,0.9), 0 0 80px rgba(0,100,200,0.6), inset 0 0 30px rgba(0,255,255,0.2)',
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut'
    });

  