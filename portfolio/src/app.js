import {
  PERSONA,
  NAV,
  HERO,
  SKILLS,
  EXPERIENCE,
  PROJECTS,
  EDUCATION,
  CONTACT,
} from './content.js';

function el(tagName, attrs = {}, children = []) {
  const node = document.createElement(tagName);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.classList.add(...v.split(' '));
    else if (k === 'dataset') {
      for (const [dk, dv] of Object.entries(v)) node.dataset[dk] = dv;
    } else if (k === 'style') node.setAttribute('style', v);
    else node.setAttribute(k, v);
  }
  for (const child of children) {
    node.append(typeof child === 'string' ? document.createTextNode(child) : child);
  }
  return node;
}

function sectionLabel(text) {
  return el('span', {
    class: 'section-label',
  }, [text]);
}

function heading(level, text, attrs = {}) {
  return el(`h${level}`, { class: 'section-heading', ...attrs }, [text]);
}

function navLink(link) {
  const a = el('a', {
    href: link.href,
    class: 'nav-link',
    'aria-label': `Go to ${link.label}`,
  }, [link.label]);
  return a;
}

function nav() {
  const nav = el('nav', { class: 'nav' });
  const list = el('ul', { class: 'nav-links' });
  for (const link of NAV) list.append(navLink(link));
  nav.append(
    el('div', { class: 'nav-brand' }, [el('span', { class: 'nav-logo' }, [PERSONA.name[0].toUpperCase()])]),
    list,
  );
  return nav;
}

function hero() {
  const section = el('section', { class: 'hero', id: 'hero' });
  const eyebrow = el('span', { class: 'eyebrow' }, [HERO.eyebrow]);
  const pretitle = el('p', { class: 'hero-pretitle' }, [HERO.pretitle]);
  const headline = el('h1', { class: 'hero-headline' });
  const nameSpan = el('span', { class: 'name' }, [HERO.headline]);
  headline.append(nameSpan);
  const subtitle = el('p', { class: 'hero-subtitle' }, [HERO.subtitle]);
  const cta = el('div', { class: 'hero-cta' });
  HERO.cta.forEach((link, i) => {
    cta.append(
      el('a', {
        href: link.href,
        class: i === 0 ? 'btn btn-primary' : 'btn btn-ghost',
      }, [link.label]),
    );
  });
  const highlights = el('ul', { class: 'hero-highlights' });
  for (const item of HERO.highlight) {
    highlights.append(
      el('li', { class: 'highlight-item' }, [
        el('span', { class: 'highlight-dot' }),
        item,
      ]),
    );
  }

  section.append(
    el('div', { class: 'hero-inner' }, [
      eyebrow,
      pretitle,
      headline,
      subtitle,
      cta,
      el('div', { class: 'hero-image-wrap' }, [
        el('div', { class: 'hero-avatar' }, [
          el('img', {
            src: PERSONA.photo,
            alt: `Portrait of ${PERSONA.name}`,
            loading: 'eager',
            style: 'background: radial-gradient(circle at 30% 30%, #3b2a6b, #15122a);',
          }),
        ]),
      ]),
      highlights,
    ]),
  );
  return section;
}

function skillGroup(group, index) {
  const card = el('div', { class: 'skill-card', style: `--i:${index}` });
  card.append(
    el('div', { class: 'skill-card-title' }, [group.name]),
    el('ul', { class: 'skill-list' }, group.items.map((item) => el('li', {}, [item]))),
  );
  return card;
}

function skills() {
  const section = el('section', { class: 'section', id: 'skills' });
  const label = sectionLabel('Skill set');
  const headingEl = heading(2, 'What I work with');
  const grid = el('div', { class: 'skills-grid' });
  SKILLS.groups.forEach((group, i) => grid.append(skillGroup(group, i)));

  section.append(
    el('div', { class: 'section-inner' }, [label, headingEl, grid]),
  );
  return section;
}

function job(job, index) {
  const card = el('div', { class: 'resume-card', style: `--i:${index}` });
  const meta = el('div', { class: 'resume-card-meta' }, [
    el('div', { class: 'resume-card-role' }, [job.role]),
    el('div', { class: 'resume-card-sep' }),
    el('div', { class: 'resume-card-org' }, [job.company]),
    el('div', { class: 'resume-card-period' }, [job.period]),
  ]);
  if (job.location) meta.append(el('div', { class: 'resume-card-loc' }, [job.location]));

  const list = el('ul', { class: 'resume-card-list' });
  for (const h of job.highlights) list.append(el('li', {}, [h]));

  card.append(meta, list);
  return card;
}

function resume() {
  const section = el('section', { class: 'section', id: 'resume' });
  const label = sectionLabel('Track record');
  const headingEl = heading(2, 'Experience');
  const stack = el('div', { class: 'resume-stack' });
  EXPERIENCE.forEach((item, i) => stack.append(job(item, i)));

  const limits = el('div', { class: 'resume-limits' });
  ['Ownership', 'Clear communication', 'Measurable impact'].forEach((label) => {
    limits.append(el('span', { class: 'resume-limit' }, [label]));
  });

  section.append(
    el('div', { class: 'section-inner' }, [
      label,
      headingEl,
      stack,
      el('div', { class: 'resume-range' }, ['Reliability', 'Growth', 'Initiative']),
      limits,
    ]),
  );
  return section;
}

function project(p, index) {
  const card = el('article', { class: 'project-card', style: `--i:${index}` });
  const tags = el('div', { class: 'project-tags' });
  for (const t of p.tags) tags.append(el('span', { class: 'project-tag' }, [t]));
  const link = el('a', {
    href: p.link,
    class: 'project-link',
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `View ${p.title}`,
  }, ['View project →']);
  card.append(
    el('div', { class: 'project-card-inner' }, [
      el('div', { class: 'project-card-eyebrow' }),
      el('h3', { class: 'project-title' }, [p.title]),
      el('p', { class: 'project-subtitle' }, [p.subtitle]),
      p.description ? el('p', { class: 'project-desc' }, [p.description]) : null,
      tags,
      p.link ? link : el('span', { class: 'project-link placeholder' }, ['Link pending']),
    ]),
  );
  return card;
}

function work() {
  const section = el('section', { class: 'section', id: 'work' });
  const label = sectionLabel('Selected work');
  const headingEl = heading(2, 'Projects & experience highlights');
  const grid = el('div', { class: 'projects-grid' });
  PROJECTS.forEach((p, i) => grid.append(project(p, i)));

  section.append(
    el('div', { class: 'section-inner' }, [label, headingEl, grid]),
  );
  return section;
}

function educationItem(e, index) {
  const card = el('div', { class: 'edu-card', style: `--i:${index}` });
  card.append(
    el('div', { class: 'edu-card-title' }, [e.institution]),
    el('div', { class: 'edu-card-sep' }, ['✦']),
    el('div', { class: 'edu-card-degree' }, [e.degree]),
    el('div', { class: 'edu-card-period' }, [e.period]),
    e.notes ? el('p', { class: 'edu-card-notes' }, [e.notes]) : null,
  );
  return card;
}

function resumeEdu() {
  const section = el('section', { class: 'section', id: 'resume-edu' });
  const label = sectionLabel('Background');
  const headingEl = heading(2, 'Education');
  const grid = el('div', { class: 'edu-grid' });
  EDUCATION.forEach((e, i) => grid.append(educationItem(e, i)));

  section.append(
    el('div', { class: 'section-inner' }, [label, headingEl, grid]),
  );
  return section;
}

function contactCard(link) {
  return el('a', {
    href: link.href,
    class: 'contact-link',
    'aria-label': link.label,
  }, [
    el('span', { class: 'contact-link-icon' }),
    el('span', { class: 'contact-link-label' }, [link.label]),
    el('span', { class: 'contact-link-value' }, [
      link.label === 'Email' ? PERSONA.email : link.href,
    ]),
  ]);
}

function contact() {
  const section = el('section', { class: 'section', id: 'contact', 'data-contact': '' });
  const label = sectionLabel('Get in touch');
  const headingEl = heading(2, 'Let’s work together');
  const intro = el('p', { class: 'contact-intro' }, [CONTACT.intro]);
  const links = el('div', { class: 'contact-links' });
  for (const link of CONTACT.links) links.append(contactCard(link));

  section.append(
    el('div', { class: 'section-inner contact-inner' }, [
      label,
      headingEl,
      intro,
      links,
    ]),
  );
  return section;
}

function footer() {
  return el('footer', { class: 'footer' }, [
    el('div', { class: 'footer-inner' }, [
      el('span', { class: 'footer-brand' }, [PERSONA.name]),
      el('span', { class: 'footer-sep' }),
      el('span', { class: 'footer-tag' }, ['Built & designed with care']),
      el('a', {
        href: 'mailto:' + PERSONA.email,
        class: 'footer-email',
        'aria-label': 'Email ' + PERSONA.name,
      }, ['✉ ' + PERSONA.email]),
    ]),
  ]);
}

function canvasBg() {
  const canvas = el('canvas', { class: 'bg-canvas' });
  return canvas;
}

export function mount(root) {
  root.append(canvasBg());
  root.append(nav());
  // Set base UI font class on html for consistency
  document.documentElement.classList.add('font-loaded');
  const main = el('main', { class: 'main' });
  main.append(
    hero(),
    skills(),
    resume(),
    work(),
    resumeEdu(),
    contact(),
    footer(),
  );
  root.append(main);

  // Scroll-driven reveal using IntersectionObserver
  const revealTargets = root.querySelectorAll('.section, .hero-highlights, .resume-stack, .projects-grid, .skills-grid, .edu-grid, .contact-links');
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18, rootMargin: '0px 0px -8% 0px' },
  );
  for (const t of revealTargets) observer.observe(t);

  // Smooth scroll for nav links
  root.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href').slice(1);
      const target = root.querySelector(`#${id}`);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Header background on scroll
  const navEl = root.querySelector('.nav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        navEl.style.setProperty('--nav-y', y);
        const scrolled = y > 40;
        navEl.classList.toggle('scrolled', scrolled);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}
