document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const form = document.querySelector('.contact');
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const revealItems = document.querySelectorAll('.reveal');
  const counters = document.querySelectorAll('[data-counter]');
  const typeTarget = document.getElementById('type-target');
  const themeToggle = document.getElementById('theme-toggle');

  const words = ['extraordinary', 'futuristic', 'legendary'];
  let wordIndex = 0;

  const animateWord = () => {
    if (!typeTarget) return;
    wordIndex = (wordIndex + 1) % words.length;
    typeTarget.textContent = words[wordIndex];
  };
  setInterval(animateWord, 1800);

  const setActiveLink = () => {
    const scrollPosition = window.scrollY + 130;
    let currentId = sections[0]?.id;

    sections.forEach((section) => {
      if (scrollPosition >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${currentId}`;
      link.classList.toggle('active', isActive);
    });
  };

  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach((item) => revealObserver.observe(item));

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter || 0);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 40));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = String(target);
          clearInterval(timer);
          return;
        }
        el.textContent = String(current);
      }, 22);

      observer.unobserve(el);
    });
  }, { threshold: 0.55 });

  counters.forEach((counter) => countObserver.observe(counter));

  const applyTheme = (theme) => {
    document.body.classList.toggle('light', theme === 'light');
    themeToggle.textContent = theme === 'light' ? '☀️' : '🌙';
  };

  const storedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(storedTheme);

  themeToggle?.addEventListener('click', () => {
    const next = document.body.classList.contains('light') ? 'dark' : 'light';
    localStorage.setItem('theme', next);
    applyTheme(next);
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      form.querySelector('.form-note')?.remove();
      const note = document.createElement('p');
      note.className = 'form-note';
      note.textContent = 'Transmission received. We will contact you shortly.';
      form.appendChild(note);
      form.reset();
    });
  }

  window.addEventListener('scroll', () => {
    header?.classList.toggle('scrolled', window.scrollY > 12);
    setActiveLink();
  });

  setActiveLink();
});
