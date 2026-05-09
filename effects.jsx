/* global React */
const { useEffect, useRef, useState } = React;

// ============ Custom cursor + mouse trail ============
function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const onMove = (e) => {
      mx = e.clientX; my = e.clientY;
      if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      spawnTrail(mx, my);
    };

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const onOver = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a,button,[data-cursor="hover"]')) {
        dotRef.current?.classList.add('hover');
        ringRef.current?.classList.add('hover');
      }
    };
    const onOut = (e) => {
      const t = e.target;
      if (t.closest && t.closest('a,button,[data-cursor="hover"]')) {
        dotRef.current?.classList.remove('hover');
        ringRef.current?.classList.remove('hover');
      }
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    tick();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </>
  );
}

let lastTrailTime = 0;
function spawnTrail(x, y) {
  const now = performance.now();
  if (now - lastTrailTime < 28) return;
  lastTrailTime = now;
  const el = document.createElement('div');
  el.className = 'trail';
  el.style.left = x + 'px';
  el.style.top = y + 'px';
  document.body.appendChild(el);
  const start = performance.now();
  const dur = 700;
  const dx = (Math.random() - 0.5) * 30;
  const dy = (Math.random() - 0.5) * 30;
  const animate = (t) => {
    const p = Math.min(1, (t - start) / dur);
    el.style.opacity = String(0.5 * (1 - p));
    el.style.transform = `translate(-50%,-50%) translate(${dx * p}px, ${dy * p}px) scale(${1 - p * 0.6})`;
    if (p < 1) requestAnimationFrame(animate);
    else el.remove();
  };
  requestAnimationFrame(animate);
}

// ============ Reveal on scroll ============
function useReveal(ref, { threshold = 0.18, once = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          el.classList.add('in');
          if (once) io.unobserve(el);
        } else if (!once) {
          el.classList.remove('in');
        }
      });
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold, once]);
}

function Reveal({ children, stagger = false, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  useReveal(ref);
  const cls = `${stagger ? 'reveal-stagger' : 'reveal'} ${className}`.trim();
  return <Tag ref={ref} className={cls} {...rest}>{children}</Tag>;
}

// ============ Magnetic hover ============
function Magnetic({ children, strength = 0.3, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    };
    const onLeave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [strength]);
  return <span ref={ref} className={className} data-magnetic>{children}</span>;
}

// ============ Parallax blob layer ============
function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const y = window.scrollY;
      const blobs = el.querySelectorAll('.blob');
      blobs.forEach((b, i) => {
        const speed = (i + 1) * 0.15;
        b.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
    };
    const onMouse = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      const blobs = el.querySelectorAll('.blob');
      blobs.forEach((b, i) => {
        const f = (i + 1) * 30;
        b.style.marginLeft = `${x * f}px`;
        b.style.marginTop = `${y * f}px`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMouse);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);
  return (
    <div ref={ref} className="hero-canvas">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
    </div>
  );
}

Object.assign(window, { Cursor, Reveal, Magnetic, HeroCanvas, useReveal });
