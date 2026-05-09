/* global React, Reveal, Magnetic, HeroCanvas */
const { useEffect, useRef, useState } = React;

// ============ Nav ============
function Nav({ data }) {
  return (
    <nav className="nav">
      <div className="nav-inner">
        <div className="nav-brand">{data.name} {data.surname}.</div>
        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Work</a>
          <a href="#experience">Experience</a>
          <a href="#contact">Contact</a>
        </div>
      </div>
    </nav>
  );
}

// ============ Hero ============
function Hero({ data }) {
  return (
    <section className="hero">
      <HeroCanvas />
      <div className="hero-eyebrow">{data.role} · {data.location}</div>
      <h1 className="hero-title">
        <span className="word">{data.name}</span>{' '}
        <span className="word">{data.surname}.</span>
      </h1>
      <p className="hero-subtitle">{data.tagline}</p>
      <div className="hero-meta">
        <span><b>Available</b> · Graduate roles 2026</span>
        <span><b>Based</b> · {data.location}</span>
      </div>
      <div className="hero-scroll">Scroll</div>
    </section>
  );
}

// ============ About ============
function About({ data }) {
  return (
    <section className="section" id="about">
      <Reveal>
        <div className="section-eyebrow">About</div>
        <h2 className="section-title">Engineer who sweats the details.</h2>
      </Reveal>
      <div className="about-grid" style={{ marginTop: 60 }}>
        <Reveal as="div" className="about-text">
          {data.about.map((p, i) => (
            <p key={i} dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
          ))}
        </Reveal>
        <Reveal stagger className="about-stats">
          {data.stats.map((s, i) => (
            <div className="stat" key={i}>
              <div className="stat-num">{s.num}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

// ============ Skills ============
function Skills({ data }) {
  // Duplicate items so the marquee loops seamlessly
  const items = [...data.skillsMarquee, ...data.skillsMarquee];
  return (
    <section className="skills-section" id="skills">
      <div className="section-head">
        <Reveal>
          <div className="section-eyebrow">Toolkit</div>
          <h2 className="section-title">Stack I reach for.</h2>
          <p className="section-lead">From low-level C++ to cloud-native deployments — fluent in the full pipeline of building, shipping, and running modern software.</p>
        </Reveal>
      </div>

      <div className="marquee-row">
        <div className="marquee">
          {items.map((s, i) => (
            <span className="skill-chip" key={'a' + i}><span className="dot"/>{s}</span>
          ))}
        </div>
      </div>
      <div className="marquee-row">
        <div className="marquee reverse">
          {items.map((s, i) => (
            <span className="skill-chip" key={'b' + i}><span className="dot"/>{s}</span>
          ))}
        </div>
      </div>

      <Reveal stagger className="skill-categories">
        {data.skillCategories.map((c, i) => (
          <div className="skill-cat" key={i}>
            <div className="skill-cat-label">{c.label}</div>
            <div className="skill-cat-list">
              {c.items.map((it, j) => <span key={j}>{it}</span>)}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// ============ Project mockup (inside card) ============
function ProjectMock({ variant }) {
  return (
    <div className="project-mock">
      <div className="mock-bar">
        <div className="mock-dot" />
        <div className="mock-dot" />
        <div className="mock-dot" />
      </div>
      <div className="mock-body">
        <div className="mock-line l1" />
        <div className="mock-line l2" />
        <div className="mock-line l3" />
        <div className="mock-grid">
          <div className="mock-tile accent" />
          <div className="mock-tile" />
          <div className="mock-tile" />
          <div className="mock-tile" />
          <div className="mock-tile accent" />
          <div className="mock-tile" />
        </div>
      </div>
    </div>
  );
}

// ============ Pinned scroll showcase ============
function PinnedShowcase({ data }) {
  const wrapperRef = useRef(null);
  const cardRef = useRef(null);
  const labelRef = useRef(null);
  const headlineRef = useRef(null);
  const progRef = useRef(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const slides = [
      { label: "Featured · 01", title: "OneMore", sub: "Full-stack productivity, deployed on Azure", bg: "linear-gradient(135deg,#0071e3,#0a4ad3)" },
      { label: "Featured · 02", title: "Cloud Pipelines", sub: "Terraform-first, opinionated CI/CD", bg: "linear-gradient(135deg,#1d1d1f,#2d2d35)" },
      { label: "Featured · 03", title: "Engine Lab", sub: "A graphics rabbit hole in modern C++", bg: "linear-gradient(135deg,#ff6b35,#f7931e)" },
      { label: "Featured · 04", title: "Realtime Chat", sub: "SignalR, Redis, and a tidy React client", bg: "linear-gradient(135deg,#10b981,#047857)" }
    ];

    const onScroll = () => {
      const rect = wrapper.getBoundingClientRect();
      const total = wrapper.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = total > 0 ? scrolled / total : 0;

      // Card subtle scale + rotate
      const rot = (p - 0.5) * 14;
      const scale = 0.9 + Math.sin(p * Math.PI) * 0.12;
      card.style.transform = `perspective(1400px) rotateY(${rot}deg) scale(${scale})`;

      // Slide selection
      const i = Math.min(slides.length - 1, Math.floor(p * slides.length));
      const slide = slides[i];
      if (labelRef.current && labelRef.current.dataset.idx !== String(i)) {
        labelRef.current.dataset.idx = String(i);
        labelRef.current.textContent = slide.label;
        headlineRef.current.innerHTML = `${slide.title}<span>${slide.sub}</span>`;
        card.style.background = slide.bg;
      }
      if (progRef.current) {
        progRef.current.textContent = `${String(i + 1).padStart(2,'0')} / ${String(slides.length).padStart(2,'0')}`;
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={wrapperRef} className="showcase">
      <div className="showcase-sticky">
        <div ref={cardRef} className="showcase-card">
          <div ref={labelRef} className="showcase-label" data-idx="0">Featured · 01</div>
          <div ref={headlineRef} className="showcase-headline">
            OneMore<span>Full-stack productivity, deployed on Azure</span>
          </div>
          <div ref={progRef} className="showcase-progress">01 / 04</div>
        </div>
      </div>
    </div>
  );
}

// ============ Projects grid ============
function Projects({ data }) {
  return (
    <>
      <section className="section" id="projects" style={{ paddingBottom: 60 }}>
        <Reveal>
          <div className="section-eyebrow">Selected work</div>
          <h2 className="section-title">Things I built, end to end.</h2>
        </Reveal>
      </section>

      <PinnedShowcase data={data} />

      <section className="section" style={{ paddingTop: 80 }}>
        {data.projects.map((p, i) => (
          <Reveal key={i}>
            <article className="project-card">
              <div className="project-inner">
                <div className={`project-visual ${p.visual}`}>
                  <ProjectMock variant={p.visual} />
                </div>
                <div className="project-info">
                  <div className="project-num">{p.num} · {p.year}</div>
                  <h3 className="project-title">{p.title}</h3>
                  <p className="project-desc">{p.desc}</p>
                  <div className="project-stack">
                    {p.stack.map((s, j) => <span key={j}>{s}</span>)}
                  </div>
                  <a href="#" className="project-link" data-cursor="hover">
                    View case study
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
function Experience({ data }) {
  return (
    <section className="section" id="experience">
      <Reveal>
        <div className="section-eyebrow">Experience</div>
        <h2 className="section-title">Where I've shipped.</h2>
      </Reveal>
      <Reveal stagger className="timeline">
        {data.experience.map((e, i) => (
          <div className="timeline-item" key={i}>
            <div className="timeline-date">{e.date}</div>
            <h3 className="timeline-role">{e.role} <span className="timeline-company">· {e.company}</span></h3>
            <p className="timeline-desc">{e.desc}</p>
            <div className="timeline-tags">
              {e.tags.map((t, j) => <span key={j}>{t}</span>)}
            </div>
          </div>
        ))}
      </Reveal>
    </section>
  );
}

// ============ Education + Awards ============
function EducationAwards({ data }) {
  return (
    <section className="section" id="education">
      <Reveal>
        <div className="section-eyebrow">The paper trail</div>
        <h2 className="section-title">Education & recognition.</h2>
      </Reveal>
      <div className="split-grid" style={{ marginTop: 60 }}>
        <Reveal as="div" className="split-block">
          <div className="block-title">Education</div>
          {data.education.map((e, i) => (
            <div className="edu-card" key={i}>
              <div className="edu-school">{e.school}</div>
              <div className="edu-degree">{e.degree}</div>
              <div className="edu-meta">{e.meta}</div>
            </div>
          ))}
        </Reveal>
        <Reveal as="div" className="split-block">
          <div className="block-title">Awards & certifications</div>
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
function Contact({ data }) {
  return (
    <section className="contact-section" id="contact">
      <Reveal>
        <div className="section-eyebrow">Get in touch</div>
        <h2 className="contact-title">
          <span className="line">Let's build</span>
          <span className="line">something good.</span>
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
