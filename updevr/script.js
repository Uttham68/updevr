// ===== EMAILJS INITIALIZATION =====
emailjs.init("OpYGMGSA0FSgkLTuv"); // Initialized with your Public Key

// ===== PAGE LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('page-loader').classList.add('hidden');
  }, 1500);
});

// ===== TYPEWRITER EFFECT =====
const words = ["Frontend Developer", "UI/UX Enthusiast", "Web Craftsman"];
let wordIdx = 0, charIdx = 0, isDeleting = false;
const typeTarget = document.getElementById('typewriter');

function type() {
  const currentWord = words[wordIdx];
  if (isDeleting) {
    typeTarget.textContent = currentWord.substring(0, charIdx - 1);
    charIdx--;
  } else {
    typeTarget.textContent = currentWord.substring(0, charIdx + 1);
    charIdx++;
  }

  let typeSpeed = isDeleting ? 50 : 100;
  if (!isDeleting && charIdx === currentWord.length) {
    typeSpeed = 2000;
    isDeleting = true;
  } else if (isDeleting && charIdx === 0) {
    isDeleting = false;
    wordIdx = (wordIdx + 1) % words.length;
    typeSpeed = 500;
  }
  setTimeout(type, typeSpeed);
}
if (typeTarget) type();

// ===== CUSTOM CURSOR =====
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

// ===== SCROLL UTILS =====
const progressBar = document.getElementById('progress-bar');
const btt = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  // Progress Bar
  const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (winScroll / height) * 100;
  if (progressBar) progressBar.style.width = scrolled + "%";

  // Back to Top
  if (btt) btt.classList.toggle('visible', window.scrollY > 500);
});

if (btt) {
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px'; dot.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a, button, .skill-card, .project-card, .tech-item, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
});

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('stuck', window.scrollY > 60);
  // Active link
  const sections = ['hero','about','skills','projects','experience','contact'];
  let current = '';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 120) current = id;
  });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

// ===== MOBILE NAV =====
const ham = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
function toggleMobileNav() {
  ham.classList.toggle('open');
  mobileNav.classList.toggle('open');
  document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
}
function closeMobileNav() {
  ham.classList.remove('open');
  mobileNav.classList.remove('open');
  document.body.style.overflow = '';
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
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== PROJECT MODAL LOGIC =====
const projectData = {
  'saas': {
    title: 'January Delight | FoodTruck Website',
    desc: 'January Delight is a gourmet food truck serving delicious comfort food and fusion cuisine in Beavercreek, Ohio. Order online or visit us for lunch, dinner, and snacks.',
    tags: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript'],
    live: 'https://www.januarydelight.com',
  },
  'ecommerce': {
    title: 'Kinnera Images | Business Website',
    desc: "Kinnera Images is Warangal's premier digital AI studio specializing in wedding photography, cinematic videography, and corporate portraits since 1991.",
    tags: ['Tailwind CSS', 'JavaScript', 'Mobile-First'],
    live: 'https://kinneraimages.netlify.app',
  },
  'analytics': {
    title: 'BingeHub | Your Ultimate Anime & TV Tracker',
    desc: 'Your Ultimate Anime & TV Tracker',
    tags: ['JavaScript', 'Data Viz', 'CSS Grid'],
    live: 'https://atvtracker.netlify.app/',
  },
  'portfolio': {
    title: 'Portfolio Template',
    desc: 'A clean, minimal template designed for high readability and professional impact. Built with a modular approach, allowing for easy customization of sections and color schemes.',
    tags: ['Bootstrap', 'Minimalism', 'Responsive'],
    live: '#',
    repo: '#'
  }
};

const projectModal = new bootstrap.Modal(document.getElementById('projectModal'));

document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Prevent modal if clicking direct links in the footer
    if (e.target.closest('.proj-footer')) return;

    const id = card.dataset.projectId;
    const data = projectData[id];
    if (!data) return;

    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalLiveLink').href = data.live;
    document.getElementById('modalRepoLink').href = data.repo;
    
    // Clone the thumbnail SVG for the modal
    const thumb = card.querySelector('.proj-thumb-inner').innerHTML;
    document.getElementById('modalImage').innerHTML = thumb;

    // Populate tags
    const tagsContainer = document.getElementById('modalTags');
    tagsContainer.innerHTML = data.tags.map(t => `<span class="proj-tag">${t}</span>`).join('');

    projectModal.show();
  });
});

// ===== SCROLL REVEAL =====
const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // Skill bars
      e.target.querySelectorAll('.skill-level-bar').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.sr, .sr-left, .sr-right').forEach(el => srObserver.observe(el));

// Also trigger skill bars that are in already-visible cards
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      skillObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('.skill-level-bar').forEach(b => skillObserver.observe(b));

// ===== COUNT UP =====
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.count;
    const suffix = target === 100 ? '%' : '+';
    let start = null;
    const dur = 1800;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
    countObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ===== CHAR COUNT =====
const msgArea = document.getElementById('message');
const charCount = document.getElementById('charCount');
if (msgArea) {
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

['fname','email','subject','message'].forEach(id => {
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
  if (!fname)              { showError('fname', true); valid = false; }
  if (!validateEmail(email)){ showError('email', true); valid = false; }
  if (!subject)            { showError('subject', true); valid = false; }
  if (message.length < 20) { showError('message', true); valid = false; }

  if (!valid) return;

  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');

  // Prepare the parameters for the email template
  const templateParams = {
    from_name: fname + (document.getElementById('lname').value ? " " + document.getElementById('lname').value : ""),
    from_email: email,
    subject: subject,
    message: message
  };

  // Send the email using EmailJS
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
  ['fname','lname','email','subject','message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = el.tagName === 'SELECT' ? '' : '';
    clearError(id);
  });
  if (charCount) charCount.textContent = '0 / 1000';
}