// Projects Index - Same visual style as main portfolio
const { useEffect, useState, useRef, createElement: h, Fragment } = React;

// SVG icon paths (same as main site)
const ICONS = {
  code: 'M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z',
  gamepad: 'M192 64C86 64 0 150 0 256S86 448 192 448l256 0c106 0 192-86 192-192s-86-192-192-192L192 64zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32z',
  cube: 'M234.5 5.7c13.9-5 29.1-5 43.1 0l192 68.3C495 83.4 512 107.5 512 134.6V377.4c0 27-17 51.2-42.5 60.3l-192 68.3c-13.9 5-29.1 5-43.1 0l-192-68.3C17 428.6 0 404.5 0 377.4V134.6c0-27 17-51.2 42.5-60.3l192-68.3zM256 66L96 123.2v245.6l160 56.8 160-56.8V123.2L256 66z',
};
const ICON_VIEWBOX = { code: '0 0 640 512', gamepad: '0 0 640 512', cube: '0 0 512 512' };

const useInView = (options) => {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, { threshold: options.threshold || 0 });
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [options.threshold]);
  return [ref, inView];
};

const ScrambledText = ({ text, phase }) => {
  const [displayText, setDisplayText] = useState(phase === 'start' ? '' : text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>';
  useEffect(() => {
    if (phase === 'start') { setDisplayText(''); return; }
    if (phase === 'done') { setDisplayText(text); return; }
    let iteration = 0;
    const maxIterations = 24;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((_char, index) => {
        if (index < Math.floor(iteration / (maxIterations / text.length))) return text[index];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      iteration++;
      if (iteration >= maxIterations) { clearInterval(interval); setDisplayText(text); }
    }, 50);
    return () => clearInterval(interval);
  }, [text, phase]);
  return h(Fragment, null, displayText);
};

// MonumentalLink - exact copy from main site
const MonumentalLink = ({ title, subtitle, link, index, color = "white", align = "left", subLinks, iconName, scrollY }) => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const containerRef = useRef(null);
  const [logoStyle, setLogoStyle] = useState({ opacity: 0 });

  useEffect(() => {
    if (!containerRef.current || !iconName) return;
    const id = requestAnimationFrame(() => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const screenCenterY = window.innerHeight / 2;
      const distance = Math.abs(elementCenterY - screenCenterY);
      const maxDistance = window.innerHeight / 1.2;
      let normalized = Math.max(0, 1 - (distance / maxDistance));
      const curved = Math.pow(normalized, 2);
      const opacity = curved * 0.2;
      setLogoStyle({ opacity });
    });
    return () => cancelAnimationFrame(id);
  }, [scrollY, iconName]);

  const direction = align === 'right' ? 1 : align === 'left' ? -1 : 0;
  const initialTranslateX = direction * 250;
  const initialTranslateY = align === 'center' ? 100 : 0;
  const activeColor = color === 'green' ? 'text-[#00ff66]' : 'text-white';
  const strokeColor = '2px #222';
  const labelColor = 'text-[#00ff66]';
  const flexAlign = align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const innerAlign = align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start';
  const subLinkJustify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  const setRefs = (el) => { ref.current = el; containerRef.current = el; };

  const iconEl = iconName && ICONS[iconName] && h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: ICON_VIEWBOX[iconName] || '0 0 512 512',
    fill: 'currentColor',
    className: 'absolute top-1/2 text-white z-[-2] pointer-events-none',
    style: {
      height: 'min(40vw, 400px)',
      opacity: logoStyle.opacity,
      [align === 'right' ? 'right' : 'left']: align === 'center' ? '50%' : '5%',
      transform: 'translate(' + (align === 'center' ? '-50%' : '0') + ', -50%)',
      willChange: 'opacity'
    }
  }, h('path', { d: ICONS[iconName] }));

  const titleStyle = {
    WebkitTextStroke: inView ? '0px transparent' : strokeColor,
    transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(' + initialTranslateX + 'px, ' + initialTranslateY + 'px, 0)',
    transitionProperty: 'color, -webkit-text-stroke, transform',
    willChange: 'transform'
  };
  const titleClass = 'text-[3.5rem] md:text-[6rem] lg:text-[8.5rem] uppercase tracking-tighter leading-[0.8] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] font-display block relative z-20';

  const titleEl = link
    ? h('a', { href: link, className: titleClass + ' cursor-pointer hover:opacity-70 ' + (inView ? activeColor : 'text-transparent'), style: titleStyle }, title)
    : h('span', { className: titleClass + ' cursor-default ' + (inView ? activeColor : 'text-transparent'), style: titleStyle }, title);

  const subtitleEl = h('div', { className: 'w-full max-w-3xl pt-2 flex flex-col relative z-20 ' + innerAlign },
    h('div', { className: 'transition-all duration-1000 ease-out delay-100 ' + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12') },
      h('span', { className: 'font-mono text-sm md:text-base mb-3 block font-bold ' + labelColor }, '> ', subtitle.label),
      h('p', { className: 'text-base md:text-xl text-gray-400 font-light leading-relaxed' }, subtitle.desc),
      subLinks && h('div', { className: 'flex flex-wrap items-center gap-6 mt-6 ' + subLinkJustify },
        subLinks.map((sl, idx) => h('a', {
          key: idx, href: sl.url, target: '_blank', rel: 'noreferrer',
          className: 'text-xs md:text-sm font-mono tracking-widest transition-colors border-b border-transparent pb-1 uppercase text-white hover:border-[#00ff66] hover:text-[#00ff66]'
        }, '[ ', sl.name, ' ]'))
      )
    )
  );

  return h('div', { ref: setRefs, className: 'flex flex-col ' + flexAlign + ' gap-4 md:gap-6 py-12 px-4 relative z-10 w-full' },
    iconEl, titleEl, subtitleEl
  );
};

// CSS - same as main site
const globalCSS = `
@font-face {
  font-family: 'Alibaba PuHuiTi';
  src: url('../HomePageAssets/AlibabaPuHuiTi-Light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
body {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  font-family: 'Alibaba PuHuiTi', system-ui, sans-serif;
}
.font-display { font-family: 'Anton', sans-serif; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #050505; }
::-webkit-scrollbar-thumb { background: #333; }
::-webkit-scrollbar-thumb:hover { background: #00ff66; }
.animate-brutal-glitch { animation: main-flash 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; backface-visibility: hidden; transform: translateZ(0); }
.animate-brutal-glitch::before, .animate-brutal-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; pointer-events: none; backface-visibility: hidden; }
.animate-brutal-glitch::before { left: 3px; text-shadow: -2px 0 #fff; animation: glitch-slice-1 0.2s infinite linear alternate-reverse; }
.animate-brutal-glitch::after { left: -3px; text-shadow: 2px 0 #00ff66; animation: glitch-slice-2 0.3s infinite linear alternate-reverse; z-index: -1; }
@keyframes main-flash { 0% { opacity: 0; color: #fff; } 10% { opacity: 1; color: transparent; -webkit-text-stroke: 3px #fff; } 25% { color: #00ff66; -webkit-text-stroke: 0px; } 40% { color: transparent; -webkit-text-stroke: 4px #fff; } 60% { color: #fff; -webkit-text-stroke: 0px transparent; } 80% { color: transparent; -webkit-text-stroke: 1px #00ff66; } 100% { color: #fff; } }
@keyframes glitch-slice-1 { 0% { clip-path: inset(20% 0 80% 0); transform: translateX(-10px); } 20% { clip-path: inset(40% 0 50% 0); transform: translateX(-10px); } 40% { clip-path: inset(10% 0 70% 0); transform: translateX(-10px); } 60% { clip-path: inset(70% 0 20% 0); transform: translateX(-10px); } 80% { clip-path: inset(50% 0 30% 0); transform: translateX(-10px); } 100% { clip-path: inset(15% 0 60% 0); transform: translateX(-10px); } }
@keyframes glitch-slice-2 { 0% { clip-path: inset(10% 0 60% 0); transform: translateX(10px); } 20% { clip-path: inset(70% 0 10% 0); transform: translateX(10px); } 40% { clip-path: inset(50% 0 30% 0); transform: translateX(10px); } 60% { clip-path: inset(80% 0 5% 0); transform: translateX(10px); } 80% { clip-path: inset(60% 0 10% 0); transform: translateX(10px); } 100% { clip-path: inset(10% 0 50% 0); transform: translateX(10px); } }
@keyframes bounce-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
.animate-bounce-down { animation: bounce-down 2s ease-in-out infinite; }
`;

// Main App
const ProjectsPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const lenisRef = useRef(null);
  const rafUpdateRef = useRef(null);

  const [introPhase, setIntroPhase] = useState('start');
  const [devTitleRef, devTitleInView] = useInView({ threshold: 0.8 });

  useEffect(() => { window.history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);

  // Lenis smooth scroll
  useEffect(() => {
    let lenisInstance; let reqId;
    import('https://esm.sh/lenis@1.1.18').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, smoothTouch: true });
      lenisInstance.on('scroll', (e) => {
        scrollYRef.current = e.scroll;
        if (!rafUpdateRef.current) {
          rafUpdateRef.current = requestAnimationFrame(() => { setScrollY(e.scroll); rafUpdateRef.current = null; });
        }
      });
      lenisRef.current = lenisInstance;
      function raf(time) { lenisInstance.raf(time); reqId = requestAnimationFrame(raf); }
      reqId = requestAnimationFrame(raf);
    }).catch(err => console.log("Lenis load failed.", err));
    return () => { if (reqId) cancelAnimationFrame(reqId); if (lenisInstance) lenisInstance.destroy(); if (rafUpdateRef.current) cancelAnimationFrame(rafUpdateRef.current); };
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setIntroPhase('animating'), 10);
    const t3 = setTimeout(() => setIntroPhase('done'), 1500);
    return () => { clearTimeout(t1); clearTimeout(t3); };
  }, []);

  return h('div', { className: 'min-h-screen bg-[#050505] text-[#f0f0f0] overflow-hidden selection:bg-[#00ff66] selection:text-black font-sans' },

    h('style', { dangerouslySetInnerHTML: { __html: globalCSS } }),

    // Fixed backgrounds
    h('div', { className: 'fixed inset-0 z-0 bg-cover bg-center grayscale contrast-[1.3] brightness-[0.25] pointer-events-none', style: { backgroundImage: 'url("../HomePageAssets/projects-bg-1.webp")' } }),
    h('div', { className: 'fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay', style: { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' } }),

    h('main', { className: 'relative z-10 w-full' },

      // Hero header
      h('header', { className: 'relative w-full h-screen flex flex-col items-center justify-center' },
        h('div', { className: 'text-center' },
          h('h1', {
            'data-text': 'PROJECTS',
            className: 'text-[5rem] sm:text-[8rem] md:text-[10rem] lg:text-[12rem] tracking-tighter uppercase leading-[0.8] text-white font-display transform-gpu relative ' + (introPhase !== 'done' ? 'animate-brutal-glitch' : ''),
            style: { willChange: 'transform' }
          }, h(ScrambledText, { text: 'PROJECTS', phase: introPhase })),
          h('p', { className: 'text-[#00ff66] tracking-[0.5em] text-xs md:text-sm font-mono mt-6 opacity-80' }, '// \u6210\u719F\u9879\u76EE'),
          h('p', { className: 'text-gray-500 text-sm mt-4 max-w-md mx-auto leading-relaxed' }, '\u5DF2\u5B8C\u6210\u7684\u6B63\u5F0F\u9879\u76EE\u5165\u53E3\u3002')
        ),
        // Scroll hint
        h('div', { className: 'absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500 ' + (scrollY > 50 ? 'opacity-0 pointer-events-none' : 'opacity-70') },
          h('span', { className: 'text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase hidden md:block' }, 'SCROLL'),
          h('svg', { className: 'w-4 h-4 md:w-5 md:h-5 text-[#00ff66] animate-bounce-down', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            h('path', { d: 'M7 13l5 5 5-5M7 6l5 5 5-5' })
          )
        )
      ),

      // === DEVELOPMENT WORKS — same as main site ===
      h('section', { className: 'relative w-full py-24 md:py-36 z-20 bg-[#020202]' },
        h('div', { className: 'max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'overflow-hidden mb-12 md:mb-20 pb-8 border-b border-[#111]' },
            h('h2', { ref: devTitleRef, className: 'text-[#00ff66] tracking-[0.4em] text-xs md:text-sm font-bold font-mono transition-all duration-[800ms] ease-out ' + (devTitleInView ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-16') }, '/// DEVELOPMENT WORKS')
          ),
          h('div', { className: 'flex flex-col gap-16 md:gap-32 w-full' },
            h(MonumentalLink, { scrollY, title: 'C. FORGE', subtitle: { label: 'lavro.org/Projects/CForge', desc: 'CharacterForge - \u89D2\u8272\u6784\u5EFA\u4E0E\u6570\u636E\u6838\u5FC3\u903B\u8F91' }, link: 'https://lavro.org/Projects/CForge/', index: 0, color: 'white', align: 'left', iconName: 'code' }),
            h(MonumentalLink, { scrollY, title: 'LIFE SIM.', subtitle: { label: 'lavro.org/Projects/LSimulator', desc: 'Life Simulator - \u6E38\u620F\u673A\u5236\u8BBE\u8BA1\u4E0E\u6570\u503C\u6A21\u62DF\u7CFB\u7EDF' }, link: 'https://lavro.org/Projects/LSimulator/', index: 1, color: 'green', align: 'right', iconName: 'gamepad' }),
            h(MonumentalLink, { scrollY, title: 'CARPET LIR', subtitle: { label: 'modrinth.com/mod/carpet-lir-addition', desc: "Lavro's Item Renewability Carpet Addition - Minecraft Carpet \u9644\u5C5E\u6A21\u7EC4" }, link: 'https://modrinth.com/mod/carpet-lir-addition', index: 2, color: 'white', align: 'left', iconName: 'cube', subLinks: [{ name: 'Modrinth', url: 'https://modrinth.com/mod/carpet-lir-addition' }, { name: 'GitHub', url: 'https://github.com/Lavr0v0/carpet-lir-addition' }] })
          )
        )
      ),

      // Footer
      h('section', { className: 'relative w-full bg-black z-20 pb-24 pt-12 border-t border-[#111]' },
        h('footer', { className: 'pt-8 flex flex-col items-center gap-8' },
          h('button', {
            onClick: () => { if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 2 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); },
            className: 'group flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:text-[#00ff66] text-gray-600'
          },
            h('svg', { className: 'w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              h('path', { d: 'M17 11l-5-5-5 5M17 18l-5-5-5 5' })
            ),
            h('span', { className: 'text-[10px] font-mono tracking-[0.4em] uppercase' }, 'BACK TO TOP')
          ),
          h('div', { className: 'w-24 h-px bg-gradient-to-r from-transparent via-[#00ff66]/30 to-transparent' }),
          h('a', { href: '/', className: 'font-mono text-xs tracking-[0.2em] text-gray-500 hover:text-[#00ff66] transition-colors duration-300 border border-[#1a1a1a] hover:border-[#00ff66] px-6 py-2' }, '[ BACK TO HOME ]'),
          h('p', { className: 'font-mono text-xs text-gray-600 mt-4' },
            'LAVRO.ORG \u00A9 ' + new Date().getFullYear() + ' // PROJECTS'
          )
        )
      )
    )
  );
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(ProjectsPage));
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    document.getElementById('root').style.transition = 'opacity 0.3s ease';
    document.getElementById('root').style.opacity = '1';
  });
});
