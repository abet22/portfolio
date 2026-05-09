/* global React, Reveal, Magnetic, HeroCanvas, i18n */
const { useEffect, useRef, useState } = React;

// ============ Nav ============
function Nav({ data, locale, onLocaleChange }) {
  const t = k => i18n.t(k);
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-brand">{data.name} {data.surname}.</div>
        <div className="nav-links">
          <a href="#about">{t('nav.about')}</a>
          <a href="#skills">{t('nav.skills')}</a>
          <a href="#projects">{t('nav.work')}</a>
          <a href="#experience">{t('nav.experience')}</a>
          <a href="#contact">{t('nav.contact')}</a>
        </div>
        <div className="lang-switcher">
          {['en','es','ca'].map(l => (
            <button key={l} className={`lang-btn ${locale === l ? 'active' : ''}`} onClick={() => onLocaleChange(l)}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ============ Hero ============
function Hero({ data, locale }) {
  const t = k => i18n.t(k);
  return (
    <section className="hero">
      <HeroCanvas />
      <div className="hero-eyebrow">{i18n.tc(data.role)} · {data.location}</div>
      <h1 className="hero-title">
        <span className="word">{data.name}</span>{' '}
        <span className="word">{data.surname}.</span>
      </h1>
      <p className="hero-subtitle">{i18n.tc(data.tagline)}</p>
      <div className="hero-meta">
        <span><b>{t('hero.available')}</b> · {t('hero.available_for')}</span>
        <span><b>{t('hero.based')}</b> · {data.location}</span>
      </div>
      <div className="hero-scroll">{t('hero.scroll')}</div>
    </section>
  );
}

// ============ About ============
function About({ data, locale }) {
  const t = k => i18n.t(k);
  const paragraphs = i18n.tc(data.about);
  return (
    <section className="section" id="about">
      <Reveal>
        <div className="section-eyebrow">{t('about.eyebrow')}</div>
        <h2 className="section-title">{t('about.heading')}</h2>
      </Reveal>
      <div className="about-grid" style={{ marginTop: 60 }}>
        <Reveal as="div" className="about-text">
          {paragraphs.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </Reveal>
        <Reveal stagger className="about-stats">
          {data.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{i18n.tc(s.label)}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ============ Skills ============
function Skills({ data, locale }) {
  const t = k => i18n.t(k);
  const items = [...data.skillsMarquee, ...data.skillsMarquee];
  const catLabel = (label) => {
    const map = { 'Languages': t('skills.lang'), 'Frontend': t('skills.frontend'), 'Backend': t('skills.backend'), 'Cloud / DevOps': t('skills.cloud') };
    return map[label] ?? label;
  };
  return (
    <section className="skills-section" id="skills">
      <div className="section-head">
        <Reveal>
          <div className="section-eyebrow">{t('skills.eyebrow')}</div>
          <h2 className="section-title">{t('skills.heading')}</h2>
          <p className="section-lead">{t('skills.lead')}</p>
        </Reveal>
      </div>
      <div className="marquee-row">
        <div className="marquee">
          {items.map((s, i) => <span className="skill-chip" key={'a'+i}><span className="dot"/>{s}</span>)}
        </div>
      </div>
      <div className="marquee-row">
        <div className="marquee reverse">
          {items.map((s, i) => <span className="skill-chip" key={'b'+i}><span className="dot"/>{s}</span>)}
        </div>
      </div>
      <Reveal stagger className="skill-categories">
        {data.skillCategories.map((c, i) => (
          <div className="skill-cat" key={i}>
            <div className="skill-cat-label">{catLabel(c.label)}</div>
            <div className="skill-cat-list">
              {c.items.map((it, j) => <span key={j}>{it}</span>)}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// ============ Project mockup ============
function ProjectMock() {
  return (
    <div className="project-mock">
      <div className="mock-bar">
        <div className="mock-dot"/><div className="mock-dot"/><div className="mock-dot"/>
      </div>
      <div className="mock-body">
        <div className="mock-line l1"/><div className="mock-line l2"/><div className="mock-line l3"/>
        <div className="mock-grid">
          <div className="mock-tile accent"/><div className="mock-tile"/><div className="mock-tile"/>
          <div className="mock-tile"/><div className="mock-tile accent"/><div className="mock-tile"/>
        </div>
      </div>
    </div>
  );
}

// ============ Pinned scroll showcase ============
function PinnedShowcase({ data, locale }) {
  const t = k => i18n.t(k);
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const progRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const slides = data.projects.map((p, i) => ({
      label: `${t('work.featured')} · ${p.num}`,
      title: p.title,
      sub: i18n.tc(p.desc).split('.')[0] + '.',
      bg: [
        'linear-gradient(135deg,#0071e3,#0a4ad3)',
        'linear-gradient(135deg,#1d1d1f,#2d2d35)',
        'linear-gradient(135deg,#ff6b35,#f7931e)',
        'linear-gradient(135deg,#10b981,#047857)'
      ][i % 4]
    }));

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;
      const rot = (p - 0.5) * 14;
      const scale = 0.9 + Math.sin(p * Math.PI) * 0.12;
      card.style.transform = `perspective(1400px) rotateY(${rot}deg) scale(${scale})`;
      const idx = Math.min(slides.length - 1, Math.floor(p * slides.length));
      const slide = slides[idx];
      if (labelRef.current && labelRef.current.dataset.idx !== String(idx)) {
        labelRef.current.dataset.idx = String(idx);
        labelRef.current.textContent = slide.label;
        headlineRef.current.innerHTML = `${slide.title}<span>${slide.sub}</span>`;
        card.style.background = slide.bg;
      }
      if (progRef.current) progRef.current.textContent = `${String(idx+1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [locale]);

  return (
    <div ref={wrapperRef} className="showcase">
      <div className="showcase-sticky">
        <div ref={cardRef} className="showcase-card">
          <div ref={labelRef} className="showcase-label" data-idx="0">{t('work.featured')} · 01</div>
          <div ref={headlineRef} className="showcase-headline">
            {data.projects[0]?.title}<span>{i18n.tc(data.projects[0]?.desc).split('.')[0] + '.'}</span>
          </div>
          <div ref={progRef} className="showcase-progress">01 / 0{data.projects.length}</div>
        </div>
      </div>
    </div>
  );
}

// ============ Projects grid ============
function Projects({ data, locale }) {
  const t = k => i18n.t(k);
  return (
    <>
      <section className="section" id="projects" style={{ paddingBottom: 60 }}>
        <Reveal>
          <div className="section-eyebrow">{t('work.eyebrow')}</div>
          <h2 className="section-title">{t('work.heading')}</h2>
        </Reveal>
      </section>

      <PinnedShowcase data={data} locale={locale} />

      <section className="section" style={{ paddingTop: 80 }}>
        {data.projects.map((p, i) => (
          <Reveal key={i}>
            <article className="project-card">
              <div className="project-inner">
                <div className={`project-visual ${p.visual}`}>
                  {p.image
                    ? <img src={p.image} alt={p.title} className="project-img" />
                    : <ProjectMock />
                  }
                </div>
                <div className="project-info">
                  <div className="project-num">{p.num} · {p.year}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{i18n.tc(p.desc)}</p>
                  <div className="project-stack">
                    {p.stack.map((s, j) => <span key={j}>{s}</span>)}
                  </div>
                  <a href="#" className="project-link" data-cursor="hover">
                    {t('work.view')}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </section>
    </>
  );
}

// ============ Experience ============
function Experience({ data, locale }) {
  const t = k => i18n.t(k);
  return (
    <section className="section" id="experience">
      <Reveal>
        <div className="section-eyebrow">{t('exp.eyebrow')}</div>
        <h2 className="section-title">{t('exp.heading')}</h2>
      </Reveal>
      <Reveal stagger className="timeline">
        {data.experience.map((e, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-date">{i18n.formatDateRange(e.from, e.to)}</div>
            <h3 className="timeline-role">
              {i18n.tc(e.role)}{' '}
              <span className="timeline-company">
                {e.logo && <img src={e.logo} className="timeline-logo" alt={e.company} />}
                · {e.company}
              </span>
            </h3>
            <p className="timeline-desc">{i18n.tc(e.desc)}</p>
            <div className="timeline-tags">
              {e.tags.map((tag, j) => <span key={j}>{tag}</span>)}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// ============ Education + Awards ============
function EducationAwards({ data, locale }) {
  const t = k => i18n.t(k);
  return (
    <section className="section" id="education">
      <Reveal>
        <div className="section-eyebrow">{t('edu.eyebrow')}</div>
        <h2 className="section-title">{t('edu.heading')}</h2>
      </Reveal>
      <div className="split-grid" style={{ marginTop: 60 }}>
        <Reveal as="div" className="split-block">
          <div className="block-title">{t('edu.label')}</div>
          {data.education.map((e, i) => (
            <div className="edu-card" key={i}>
              {e.logo && <img src={e.logo} className="edu-logo" alt={e.school} />}
              <div className="edu-school">{e.school}</div>
              <div className="edu-degree">{i18n.tc(e.degree)}</div>
              <div className="edu-meta">{i18n.formatYearRange(e.from, e.to, e.ongoing)}</div>
            </div>
          ))}
        </Reveal>
        <Reveal as="div" className="split-block">
          <div className="block-title">{t('awards.label')}</div>
          {data.awards.map((a, i) => (
            <div className="award-card" key={i}>
              <div className="award-year">{a.year}</div>
              <div>
                <div className="award-title">{a.title}</div>
                <div className="award-org">{a.org}</div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ============ Contact ============
function Contact({ data, locale }) {
  const t = k => i18n.t(k);
  return (
    <section className="contact-section" id="contact">
      <Reveal>
        <div className="section-eyebrow">{t('contact.eyebrow')}</div>
        <h2 className="contact-title">
          <span className="line">{t('contact.line1')}</span>
          <span className="line">{t('contact.line2')}</span>
        </h2>
        <Magnetic strength={0.25}>
          <a className="contact-email" href={`mailto:${data.email}`} data-cursor="hover">{data.email}</a>
        </Magnetic>
        <div className="contact-links">
          <a className="contact-link" href={`https://${data.github}`} target="_blank" rel="noopener" data-cursor="hover">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.34-1.27-1.69-1.27-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.68.8.56 4.56-1.53 7.85-5.84 7.85-10.91C23.5 5.65 18.35.5 12 .5z"/></svg>
            GitHub
          </a>
          <a className="contact-link" href={`https://${data.linkedin}`} target="_blank" rel="noopener" data-cursor="hover">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45C23.2 24 24 23.23 24 22.28V1.72C24 .77 23.2 0 22.22 0z"/></svg>
            LinkedIn
          </a>
          <a className="contact-link" href={`mailto:${data.email}`} data-cursor="hover">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
            Email
          </a>
        </div>
      </Reveal>
    </section>
  );
}

Object.assign(window, { Nav, Hero, About, Skills, Projects, Experience, EducationAwards, Contact });
