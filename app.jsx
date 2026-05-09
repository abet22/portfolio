/* global React, ReactDOM, PORTFOLIO_DATA, i18n, Nav, Hero, About, Skills, Projects, Experience, EducationAwards, Contact, useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSelect */
const { useEffect, useState } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#0071e3",
  "font": "Inter",
  "showGrid": false
}/*EDITMODE-END*/;

const ACCENT_OPTIONS = ["#0071e3", "#ff6b35", "#a78bfa", "#10b981", "#1d1d1f"];
const FONT_OPTIONS = [
  { label: "Inter",          value: "Inter" },
  { label: "Manrope",        value: "Manrope" },
  { label: "Space Grotesk",  value: "Space Grotesk" },
  { label: "JetBrains Mono", value: "JetBrains Mono" }
];

function App() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [locale, setLocale] = useState(i18n.current);

  const changeLocale = (l) => {
    i18n.set(l);
    setLocale(l);
  };

  useEffect(() => {
    document.documentElement.dataset.theme = tweaks.theme;
  }, [tweaks.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', tweaks.accent);
    document.documentElement.style.setProperty('--accent-hover', tweaks.accent);
  }, [tweaks.accent]);

  useEffect(() => {
    document.body.style.fontFamily = `'${tweaks.font}', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', sans-serif`;
  }, [tweaks.font]);

  const p = { data: PORTFOLIO_DATA, locale };

  return (
    <>
      {tweaks.showGrid && <div className="bg-grid" />}
      <Nav {...p} onLocaleChange={changeLocale} />
      <main>
        <Hero {...p} />
        <About {...p} />
        <Skills {...p} />
        <Projects {...p} />
        <Experience {...p} />
        <EducationAwards {...p} />
        <Contact {...p} />
      </main>
      <footer className="footer">{i18n.t('footer')}</footer>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Appearance">
          <TweakRadio
            label="Theme"
            value={tweaks.theme}
            onChange={(v) => setTweak('theme', v)}
            options={[{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }]}
          />
          <TweakColor
            label="Accent"
            value={tweaks.accent}
            onChange={(v) => setTweak('accent', v)}
            options={ACCENT_OPTIONS}
          />
          <TweakSelect
            label="Font"
            value={tweaks.font}
            onChange={(v) => setTweak('font', v)}
            options={FONT_OPTIONS}
          />
        </TweakSection>
        <TweakSection title="Effects">
          <TweakToggle
            label="Background grid"
            value={tweaks.showGrid}
            onChange={(v) => setTweak('showGrid', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
