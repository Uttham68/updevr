// ===== EMAILJS INITIALIZATION =====
emailjs.init("OpYGMGSA0FSgkLTuv"); // Initialized with your Public Key

// ===== LENIS SMOOTH INERTIAL SCROLL =====
let lenis = null;
if (typeof Lenis !== 'undefined') {
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1.1,
    touchMultiplier: 2,
    infinite: false,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Connect Lenis to GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }
}

// ===== GSAP & SCROLLTRIGGER REGISTRATION =====
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== PAGE LOADER & INITIALIZATION =====
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
      initHeroAnimations();
      initSectionScrollAnimations();
    }, 1000);
  } else {
    initHeroAnimations();
    initSectionScrollAnimations();
  }
});

// ===== HERO ENTRANCE TIMELINE =====
function initHeroAnimations() {
  if (typeof gsap === 'undefined') return;

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-eyebrow', 
    { y: -25, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.8, delay: 0.1 }
  )
  .fromTo('.hero-title .inner', 
    { y: 100, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.9, stagger: 0.12 }, 
    '-=0.5'
  )
  .fromTo('.hero-sub', 
    { y: 20, opacity: 0 }, 
    { y: 0, opacity: 1, duration: 0.7 }, 
    '-=0.5'
  )
  .fromTo('.hero-actions .btn-fill, .hero-actions .btn-ghost', 
    { y: 20, opacity: 0, scale: 0.95 }, 
    { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.12 }, 
    '-=0.4'
  )
  .fromTo('.hero-graphic', 
    { scale: 0.85, opacity: 0, y: 35, rotationX: 12 }, 
    { scale: 1, opacity: 1, y: 0, rotationX: 0, duration: 1.1, ease: 'back.out(1.4)' }, 
    '-=0.7'
  )
  .fromTo('.scroll-cue', 
    { opacity: 0, y: -10 }, 
    { opacity: 1, y: 0, duration: 0.6 }, 
    '-=0.3'
  );
}

// ===== SECTION-WISE SCROLL-TRIGGERED GSAP ANIMATIONS (BIDIRECTIONAL) =====
function initSectionScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    const srObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('.sr, .sr-left, .sr-right').forEach(el => srObserver.observe(el));
    return;
  }

  // Clear default static CSS hides so GSAP has full bidirectional control
  document.querySelectorAll('.sr, .sr-left, .sr-right').forEach(el => {
    el.classList.add('visible');
  });

  // 1. STATS STRIP (Bidirectional Staggered Pop-In)
  gsap.from('.stat-item', {
    scrollTrigger: {
      trigger: '.stats-strip',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse'
    },
    y: 40,
    opacity: 0,
    stagger: 0.12,
    duration: 0.8,
    ease: 'power3.out'
  });

  // Numeric stats countup with bidirectional re-trigger
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseFloat(el.dataset.target);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const decimals = parseInt(el.dataset.decimals) || 0;
    const countObj = { val: 0 };

    gsap.fromTo(countObj, 
      { val: 0 },
      {
        val: target,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'restart none restart none'
        },
        onUpdate: () => {
          el.textContent = `${prefix}${countObj.val.toFixed(decimals)}${suffix}`;
        }
      }
    );
  });

  // 2. ABOUT SECTION (Avatar from Left, Bio & Tech from Right)
  const aboutTl = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    }
  });

  aboutTl
    .from('#about .about-avatar', {
      x: -90,
      opacity: 0,
      scale: 0.9,
      rotationY: -14,
      duration: 1.1,
      ease: 'power3.out'
    })
    .from('#about .avatar-chip', {
      scale: 0,
      opacity: 0,
      stagger: 0.15,
      duration: 0.7,
      ease: 'back.out(1.8)'
    }, '-=0.5')
    .from('#about .col-lg-6 > *', {
      x: 70,
      opacity: 0,
      stagger: 0.12,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.8')
    .from('#about .tech-item', {
      scale: 0.75,
      opacity: 0,
      y: 20,
      stagger: 0.05,
      duration: 0.5,
      ease: 'back.out(1.6)'
    }, '-=0.4');

  // 3. SKILLS SECTION (Bidirectional Alternating Left & Right Cards)
  gsap.from('#skills .text-center > *', {
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse'
    },
    y: 35,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  });

  const skillCards = gsap.utils.toArray('#skills .skill-card');
  skillCards.forEach((card, i) => {
    const fromLeft = i % 2 === 0;
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play reverse play reverse'
      },
      x: fromLeft ? -80 : 80,
      rotationY: fromLeft ? -10 : 10,
      opacity: 0,
      scale: 0.92,
      duration: 0.9,
      ease: 'power3.out'
    });

    const bar = card.querySelector('.skill-level-bar');
    if (bar && bar.dataset.width) {
      gsap.fromTo(bar, 
        { width: '0%' },
        {
          width: `${bar.dataset.width}%`,
          duration: 1.3,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play reverse play reverse'
          }
        }
      );
    }
  });

  // 4. PROJECTS SECTION (Featured from Left, Side from Right, Cards Staggered)
  gsap.from('#projects .container > div:first-child > *', {
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.filter-wrap .filter-btn', {
    scrollTrigger: {
      trigger: '.filter-wrap',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse'
    },
    y: -20,
    opacity: 0,
    stagger: 0.08,
    duration: 0.6,
    ease: 'power2.out'
  });

  // Project 1 (January Delight Featured) from Left
  gsap.from('.project-card.featured', {
    scrollTrigger: {
      trigger: '.project-card.featured',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse'
    },
    x: -100,
    rotationY: -10,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out'
  });

  // Project 2 (Shiksha Guard) from Right
  gsap.from('.project-card.side', {
    scrollTrigger: {
      trigger: '.project-card.side',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse'
    },
    x: 100,
    rotationY: 10,
    opacity: 0,
    duration: 1.1,
    ease: 'power3.out'
  });

  // Project 3 & 4 (Halves) from Left and Right
  const halfCards = gsap.utils.toArray('.project-card.half');
  if (halfCards[0]) {
    gsap.from(halfCards[0], {
      scrollTrigger: {
        trigger: halfCards[0],
        start: 'top 85%',
        toggleActions: 'play reverse play reverse'
      },
      x: -80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  }
  if (halfCards[1]) {
    gsap.from(halfCards[1], {
      scrollTrigger: {
        trigger: halfCards[1],
        start: 'top 85%',
        toggleActions: 'play reverse play reverse'
      },
      x: 80,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.out'
    });
  }

  // Project 5 (BingeHub Full) from Bottom with 3D Scale
  gsap.from('.project-card.full', {
    scrollTrigger: {
      trigger: '.project-card.full',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse'
    },
    y: 75,
    scale: 0.92,
    opacity: 0,
    duration: 1,
    ease: 'power3.out'
  });

  // 5. EXPERIENCE & EDUCATION (Left column from Left, Timeline Items from Right)
  gsap.from('#experience .col-lg-4 > *', {
    scrollTrigger: {
      trigger: '#experience',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    },
    x: -85,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: 'power3.out'
  });

  gsap.from('.timeline .tl-item', {
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 75%',
      toggleActions: 'play reverse play reverse'
    },
    x: 85,
    opacity: 0,
    stagger: 0.2,
    duration: 0.9,
    ease: 'power3.out'
  });

  // 6. CONTACT SECTION (Info Items from Left, Form from Right)
  gsap.from('#contact .text-center > *', {
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 80%',
      toggleActions: 'play reverse play reverse'
    },
    y: 30,
    opacity: 0,
    stagger: 0.1,
    duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.contact-info-item', {
    scrollTrigger: {
      trigger: '.contact-info-items',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse'
    },
    x: -70,
    opacity: 0,
    stagger: 0.15,
    duration: 0.8,
    ease: 'power3.out'
  });

  gsap.from('.contact-form', {
    scrollTrigger: {
      trigger: '.contact-form',
      start: 'top 85%',
      toggleActions: 'play reverse play reverse'
    },
    x: 80,
    rotationY: 7,
    opacity: 0,
    scale: 0.95,
    duration: 1,
    ease: 'power3.out'
  });

  // Refresh ScrollTrigger calculations after full load
  ScrollTrigger.refresh();
}

// ===== INTERACTIVE HERO CANVAS (CYBER PLEXUS CONSTELLATION) =====
const canvas = document.getElementById('heroCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  let mouse = { x: null, y: null, radius: 180 };
  let isHeroVisible = true;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = canvas.parentElement ? canvas.parentElement.offsetHeight : window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      isHeroVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  }

  heroSection?.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  heroSection?.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.8;
      this.vy = (Math.random() - 0.5) * 0.8;
      this.radius = Math.random() * 2.2 + 1;
      this.colors = ['#ff6b35', '#4cc9f0', '#ffd166', '#98e06e'];
      this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
      this.baseAlpha = Math.random() * 0.55 + 0.25;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Cursor magnetic push
      if (mouse.x != null && mouse.y != null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          const dirX = dx / dist;
          const dirY = dy / dist;
          this.x -= dirX * force * 3.5;
          this.y -= dirY * force * 3.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.baseAlpha;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  // Create responsive particle array
  const particleCount = Math.min(Math.floor(window.innerWidth / 16), 85);
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function renderPlexus() {
    if (!isHeroVisible) {
      requestAnimationFrame(renderPlexus);
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#4cc9f0';
          ctx.globalAlpha = (1 - dist / 130) * 0.22;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(renderPlexus);
  }
  renderPlexus();
}

// ===== TYPEWRITER EFFECT =====
const words = [
  "Software Engineer",
  "Full-Stack Developer",
  "AI & Data Science Engineer",
  "Serverless Architect"
];
let wordIdx = 0, charIdx = 0, isDeleting = false;
const typeTarget = document.getElementById('typewriter');

function type() {
  if (!typeTarget) return;
  const currentWord = words[wordIdx];
  if (isDeleting) {
    typeTarget.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typeTarget.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 45 : 90;
  if (!isDeleting && charIdx === currentWord.length) {
    typeSpeed = 2200;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typeSpeed = 400;
  }
  setTimeout(type, typeSpeed);
}
if (typeTarget) type();

// ===== CUSTOM CURSOR WITH LERP =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (dot && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.16;
    ry += (my - ry) * 0.16;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .skill-card, .project-card, .tech-item, .filter-btn, .stat-item, .contact-info-item').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });
}

// ===== SCROLL UTILS (PROGRESS, BACK TO TOP & DYNAMIC MORPHS) =====
const progressBar = document.getElementById('progress-bar');
const btt = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";
  if (btt) btt.classList.toggle('visible', window.scrollY > 400);

  // Dynamic Scroll Morphing of Ambient Backdrop Blobs
  const scrollY = window.scrollY;
  const phase = scrollY * 0.003;
  const b1 = document.getElementById('morphBlob1');
  const b2 = document.getElementById('morphBlob2');
  const b3 = document.getElementById('morphBlob3');
  if (b1) b1.style.transform = `translate(${Math.sin(phase) * 45}px, ${Math.cos(phase * 0.8) * 40}px) rotate(${scrollY * 0.06}deg) scale(${1 + Math.sin(phase) * 0.12})`;
  if (b2) b2.style.transform = `translate(${Math.cos(phase) * -50}px, ${Math.sin(phase * 0.9) * -40}px) rotate(${-scrollY * 0.05}deg) scale(${1 + Math.cos(phase) * 0.14})`;
  if (b3) b3.style.transform = `translate(${Math.sin(phase * 1.2) * 35}px, ${Math.cos(phase * 1.1) * 35}px) scale(${1 + Math.sin(phase * 0.8) * 0.1})`;

  // Liquid Morphing of SVG Wave Transition Paths
  document.querySelectorAll('.morph-wave-path').forEach((path, idx) => {
    const p1 = 22 + Math.sin(phase + idx * 1.4) * 16;
    const p2 = 42 + Math.cos(phase * 1.1 + idx) * 14;
    const p3 = 18 + Math.sin(phase * 0.9 + idx * 2) * 15;
    path.setAttribute('d', `M0,${p1.toFixed(1)} C360,${p2.toFixed(1)} 720,${(48 - p1).toFixed(1)} 1080,${p3.toFixed(1)} C1260,${(52 - p2).toFixed(1)} 1380,${p1.toFixed(1)} 1440,${p2.toFixed(1)} L1440,50 L0,50 Z`);
  });

  // Animate Experience Timeline Progress Line & Milestone Dots
  const tlContainer = document.querySelector('.timeline');
  const tlLine = document.getElementById('tlProgressLine');
  if (tlContainer && tlLine) {
    const rect = tlContainer.getBoundingClientRect();
    const winH = window.innerHeight;
    if (rect.top < winH && rect.bottom > 0) {
      const totalH = rect.height;
      const visibleScrolled = Math.min(Math.max((winH * 0.7 - rect.top) / totalH, 0), 1);
      tlLine.style.transform = `scaleY(${visibleScrolled})`;

      // Light up milestone dots as the glowing tracer reaches them
      const items = tlContainer.querySelectorAll('.tl-item');
      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        if (itemRect.top < winH * 0.7) {
          item.classList.add('active-step');
        } else {
          item.classList.remove('active-step');
        }
      });
    }
  }
});

if (btt) {
  btt.addEventListener('click', () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// ===== NAVBAR SCROLL & ACTIVE LINK =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  if (navbar) navbar.classList.toggle('stuck', window.scrollY > 60);
  const sections = ['hero', 'about', 'skills', 'projects', 'experience', 'contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 140) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== MOBILE NAV =====
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
function toggleMobileNav() {
  ham?.classList.toggle('open');
  mobileNav?.classList.toggle('open');
  document.body.style.overflow = mobileNav?.classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav() {
  ham?.classList.remove('open');
  mobileNav?.classList.remove('open');
  document.body.style.overflow = '';
}

// ===== SPOTLIGHT MOUSE TRACKER ON GLASS CARDS =====
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});

// ===== MAGNETIC BUTTON EFFECT =====
document.querySelectorAll('.magnetic-btn, .nav-cta, .social-btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0px, 0px) scale(1)';
  });
});

// ===== INITIALIZE VANILLA-TILT 3D PHYSICS WITH MULTI-LAYER DEPTH =====
if (typeof VanillaTilt !== 'undefined') {
  VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
    max: 9,
    speed: 500,
    perspective: 1000,
    glare: true,
    'max-glare': 0.18,
    scale: 1.025,
    easing: 'cubic-bezier(.03,.98,.52,.99)'
  });
}

// ===== PROJECT FILTERING =====
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const tech = card.dataset.tech || '';
      if (filter === 'all' || tech.includes(filter)) {
        card.classList.remove('hidden');
        if (typeof gsap !== 'undefined') {
          gsap.fromTo(card, { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
        }
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== PROJECT MODAL LOGIC =====
const projectData = {
  'shiksha': {
    title: 'Shiksha Guard — AI School Infrastructure Validator',
    desc: 'Engineered frontend architecture and integrated REST APIs for a government-facing AI validation system under Samagra Shiksha, resulting in a live pitch to AiKosh officials. Recognized as a featured submission in the national India AI Innovation Challenge 2026.',
    tags: ['React.js', 'FastAPI Integration', 'REST APIs', 'India AI Challenge 2026'],
    live: 'https://shikshaguard-frontend.onrender.com/',
    repo: 'https://github.com/Uttham68/ShikshaGuard'
  },
  'saas': {
    title: 'January Delight Food Truck | Live Ordering Platform',
    desc: 'Architected a serverless ordering platform using Node.js on Cloudflare Workers and RESTful APIs maintaining 99.9% uptime. Features a real-time order pipeline with live admin panel synchronization (<500ms latency) and engineered security layers (XSS, CSRF prevention) safeguarding 100% of user sessions.',
    tags: ['Node.js', 'Cloudflare Workers', 'Python', 'Flask', 'REST APIs', 'Vanilla JS'],
    live: 'https://www.januarydelight.com/'
  },
  'meecrebit': {
    title: 'meeCrebit — Privacy-First Personal Finance App',
    desc: 'Programmed a privacy-first mobile web application featuring a custom on-device AI inference engine for automated financial insights, budgeting, and privacy-preserving analytics.',
    tags: ['React.js', 'Capacitor', 'Custom AI Engine', 'JavaScript'],
    repo: 'https://github.com/Uttham68/meeCrebit'
  },
  'ecommerce': {
    title: 'Kinnera Images | AI & Photography Studio Website',
    desc: "Digital platform for Warangal's premier digital AI studio specializing in wedding photography, cinematic videography, and corporate portraits. Optimized for mobile-first performance and responsive design.",
    tags: ['Tailwind CSS', 'JavaScript', 'Mobile-First', 'Performance'],
    live: 'https://kinneraimages.netlify.app/'
  },
  'analytics': {
    title: 'BingeHub | Anime & TV Tracker Web Application',
    desc: 'Feature-rich media and anime tracking web application with interactive search, status categorization, responsive CSS grid layouts, and client-side state storage.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'REST APIs'],
    live: 'https://bingehubz.netlify.app/'
  }
};

const projectModalEl = document.getElementById('projectModal');
const projectModal = projectModalEl ? new bootstrap.Modal(projectModalEl) : null;

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent modal if clicking direct links in the footer
    if (e.target.closest('.proj-footer')) return;

    const id = card.dataset.projectId;
    const data = projectData[id];
    if (!data || !projectModal) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;
    
    const liveLink = document.getElementById('modalLiveLink');
    const repoLink = document.getElementById('modalRepoLink');

    if (data.live) {
      liveLink.href = data.live;
      liveLink.style.display = 'inline-flex';
    } else {
      liveLink.style.display = 'none';
    }

    if (data.repo) {
      repoLink.href = data.repo;
      repoLink.style.display = 'inline-flex';
    } else {
      repoLink.style.display = 'none';
    }
    
    // Set image for the modal
    const img = card.querySelector('.proj-preview-img');
    if (img) {
      document.getElementById('modalImage').innerHTML = `<img src="${img.src}" alt="${data.title}" />`;
    } else {
      const thumb = card.querySelector('.proj-thumb-inner');
      document.getElementById('modalImage').innerHTML = thumb ? thumb.innerHTML : '';
    }

    // Populate tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = data.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');

    projectModal.show();
  });
});

// ===== CHAR COUNT =====
const msgArea = document.getElementById('message');
const charCount = document.getElementById('charCount');
if (msgArea && charCount) {
  msgArea.addEventListener('input', () => {
    const len = msgArea.value.length;
    charCount.textContent = len + ' / 1000';
    charCount.style.color = len > 900 ? 'var(--accent)' : 'var(--muted)';
  });
}

// ===== FORM VALIDATION & SUBMIT =====
function showError(id, show) {
  const el = document.getElementById(id + '-error');
  const input = document.getElementById(id);
  if (el) el.classList.toggle('visible', show);
  if (input) input.classList.toggle('error', show);
}
function clearError(id) { showError(id, false); }

['fname', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => clearError(id));
});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleSubmit() {
  const fname = document.getElementById('fname').value.trim();
  const email = document.getElementById('email').value.trim();
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value.trim();

  let valid = true;
  if (!fname) { showError('fname', true); valid = false; }
  if (!validateEmail(email)) { showError('email', true); valid = false; }
  if (!subject) { showError('subject', true); valid = false; }
  if (message.length < 20) { showError('message', true); valid = false; }

  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');

  const templateParams = {
    from_name: fname + (document.getElementById('lname').value ? " " + document.getElementById('lname').value : ""),
    from_email: email,
    subject: subject,
    message: message
  };

  emailjs.send("service_lpv5z6v", "template_xrmk6dc", templateParams)
    .then(() => {
      btn.classList.remove('loading');
      document.getElementById('formContent').style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
    })
    .catch((error) => {
      btn.classList.remove('loading');
      console.error("EmailJS Error:", error);
      alert("Oops! Something went wrong. Please try again later or contact me directly via email.");
    });
}

function resetForm() {
  document.getElementById('formContent').style.display = 'block';
  document.getElementById('formSuccess').classList.remove('visible');
  ['fname', 'lname', 'email', 'subject', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = el.tagName === 'SELECT' ? '' : '';
    clearError(id);
  });
  if (charCount) charCount.textContent = '0 / 1000';
}