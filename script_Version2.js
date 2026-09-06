// Lightweight interactivity for nav, reveal animations, contact actions
document.addEventListener('DOMContentLoaded', () => {
  // footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navList = document.getElementById('primary-navigation');
  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
    // animate hamburger
    navToggle.classList.toggle('open');
    const ham = navToggle.querySelector('.hamburger');
    if (navToggle.classList.contains('open')) {
      ham.style.transform = 'rotate(45deg)';
      ham.style.background = 'transparent';
      ham.style.boxShadow = 'none';
      ham.style.transition = 'transform 220ms ease';
      ham.style.setProperty('--after','');
    } else {
      ham.style.transform = '';
      ham.style.background = '';
    }
  });

  // Close mobile nav on link click
  document.querySelectorAll('.nav-list a').forEach(a => {
    a.addEventListener('click', () => {
      navList.classList.remove('open');
      navToggle && navToggle.setAttribute('aria-expanded', 'false');
      navToggle && navToggle.classList.remove('open');
      const ham = document.querySelector('.nav-toggle .hamburger');
      if (ham) { ham.style.transform = ''; ham.style.background = ''; }
    });
  });

  // IntersectionObserver for reveal animations
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // optionally unobserve for performance
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));

  // Active nav highlighting using sections
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const sectionIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector('.nav-link[href="#' + id + '"]');
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-35% 0px -45% 0px', threshold: 0 });
  sections.forEach(s => sectionIO.observe(s));

  // Smooth scroll for CTAs (improve browser support)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Copy email to clipboard
  const copyBtn = document.getElementById('copy-email');
  const emailText = 'alizahid2710@gmail.com';
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(emailText);
        copyBtn.textContent = 'Copied!';
        copyBtn.disabled = true;
        setTimeout(() => {
          copyBtn.textContent = 'Copy Email';
          copyBtn.disabled = false;
        }, 2000);
      } catch (err) {
        // fallback
        const temp = document.createElement('input');
        document.body.appendChild(temp);
        temp.value = emailText;
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy Email', 2000);
      }
    });
  }

  // Contact form (client-side validation & simulated send)
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const clearBtn = document.getElementById('contact-clear');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = '';
      const name = form.querySelector('[name="name"]').value.trim();
      const email = form.querySelector('[name="email"]').value.trim();
      const message = form.querySelector('[name="message"]').value.trim();

      if (!name || !email || !message || !validateEmail(email)) {
        status.style.color = 'tomato';
        status.textContent = 'Please complete the form with a valid email.';
        return;
      }

      status.style.color = 'var(--muted)';
      status.textContent = 'Sending...';
      // Simulate send (replace with backend or service integration)
      setTimeout(() => {
        status.style.color = 'var(--accent-teal)';
        status.textContent = 'Message sent (simulated). Thank you — I will reply shortly.';
        form.reset();
      }, 900);
    });
  }

  clearBtn && clearBtn.addEventListener('click', () => {
    form && form.reset();
    status && (status.textContent = '');
  });

  // simple email regex
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
});