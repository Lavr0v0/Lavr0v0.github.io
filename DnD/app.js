// DnD Archives Index - Same visual style as Projects/Labs
const { useEffect, useState, useRef, createElement: h, Fragment } = React;

const ICONS = {
  dragon: 'M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L416 0l32 0 16 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7L480 160l-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512L496 512l-64 0L32.3 512c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-45.5 0-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3l0 .6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87 0 27.5c0 32.8 8.4 64.8 24 93l-232 0c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z',
};
const ICON_VIEWBOX = { dragon: '0 0 640 512' };

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
      setLogoStyle({ opacity: Math.pow(normalized, 2) * 0.2 });
    });
    return () => cancelAnimationFrame(id);
  }, [scrollY, iconName]);

  const direction = align === 'right' ? 1 : align === 'left' ? -1 : 0;
  const initialTranslateX = direction * 250;
  const initialTranslateY = align === 'center' ? 100 : 0;
  const activeColor = color === 'green' ? 'text-[#00ff66]' : 'text-white';
  const strokeColor = '2px #222';
  const flexAlign = align === 'right' ? 'items-end text-right' : align === 'center' ? 'items-center text-center' : 'items-start text-left';
  const innerAlign = align === 'right' ? 'items-end' : align === 'center' ? 'items-center' : 'items-start';
  const setRefs = (el) => { ref.current = el; containerRef.current = el; };

  const iconEl = iconName && ICONS[iconName] && h('svg', {
    xmlns: 'http://www.w3.org/2000/svg', viewBox: ICON_VIEWBOX[iconName] || '0 0 512 512',
    fill: 'currentColor', className: 'absolute top-1/2 text-white z-[-2] pointer-events-none',
    style: { height: 'min(40vw, 400px)', opacity: logoStyle.opacity,
      [align === 'right' ? 'right' : 'left']: align === 'center' ? '50%' : '5%',
      transform: 'translate(' + (align === 'center' ? '-50%' : '0') + ', -50%)', willChange: 'opacity' }
  }, h('path', { d: ICONS[iconName] }));

  const titleStyle = {
    WebkitTextStroke: inView ? '0px transparent' : strokeColor,
    transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(' + initialTranslateX + 'px, ' + initialTranslateY + 'px, 0)',
    transitionProperty: 'color, -webkit-text-stroke, transform', willChange: 'transform'
  };
  const titleClass = 'text-[3.5rem] md:text-[6rem] lg:text-[8.5rem] uppercase tracking-tighter leading-[0.8] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] font-display block relative z-20';

  const titleEl = link
    ? h('a', { href: link, className: titleClass + ' cursor-pointer hover:opacity-70 ' + (inView ? activeColor : 'text-transparent'), style: titleStyle }, title)
    : h('span', { className: titleClass + ' cursor-default ' + (inView ? activeColor : 'text-transparent'), style: titleStyle }, title);

  const subtitleEl = h('div', { className: 'w-full max-w-3xl pt-2 flex flex-col relative z-20 ' + innerAlign },
    h('div', { className: 'transition-all duration-1000 ease-out delay-100 ' + (inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12') },
      h('span', { className: 'font-mono text-sm md:text-base mb-3 block font-bold text-[#00ff66]' }, '> ', subtitle.label),
      h('p', { className: 'text-base md:text-xl text-gray-400 font-light leading-relaxed' }, subtitle.desc)
    )
  );

  return h('div', { ref: setRefs, className: 'flex flex-col ' + flexAlign + ' gap-4 md:gap-6 py-12 px-4 relative z-10 w-full' },
    iconEl, titleEl, subtitleEl
  );
};

const globalCSS = `
@font-face {
  font-family: 'Alibaba PuHuiTi';
  src: url('../HomePageAssets/AlibabaPuHuiTi-Light.woff2') format('woff2');
  font-weight: 300; font-style: normal; font-display: swap;
}
body {
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility; font-family: 'Alibaba PuHuiTi', system-ui, sans-serif;
}
.font-display { font-family: 'Anton', sans-serif; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #050505; }
::-webkit-scrollbar-thumb { background: #333; }
::-webkit-scrollbar-thumb:hover { background: #00ff66; }
.animate-brutal-glitch { animation: main-flash 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; backface-visibility: hidden; transform: translateZ(0); }
.animate-brutal-glitch::before, .animate-brutal-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; pointer-events: none; backface-visibility: hidden; }
.animate-brutal-glitch::before { left: 3px; text-shadow: -2px 0 #fff; animation: gs1 0.2s infinite linear alternate-reverse; }
.animate-brutal-glitch::after { left: -3px; text-shadow: 2px 0 #00ff66; animation: gs2 0.3s infinite linear alternate-reverse; z-index: -1; }
@keyframes main-flash { 0%{opacity:0;color:#fff}10%{opacity:1;color:transparent;-webkit-text-stroke:3px #fff}25%{color:#00ff66;-webkit-text-stroke:0}40%{color:transparent;-webkit-text-stroke:4px #fff}60%{color:#fff;-webkit-text-stroke:0 transparent}80%{color:transparent;-webkit-text-stroke:1px #00ff66}100%{color:#fff} }
@keyframes gs1 { 0%{clip-path:inset(20% 0 80% 0);transform:translateX(-10px)}50%{clip-path:inset(40% 0 50% 0);transform:translateX(-10px)}100%{clip-path:inset(15% 0 60% 0);transform:translateX(-10px)} }
@keyframes gs2 { 0%{clip-path:inset(10% 0 60% 0);transform:translateX(10px)}50%{clip-path:inset(50% 0 30% 0);transform:translateX(10px)}100%{clip-path:inset(10% 0 50% 0);transform:translateX(10px)} }
@keyframes bounce-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
.animate-bounce-down { animation: bounce-down 2s ease-in-out infinite; }
`;

const DnDPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const lenisRef = useRef(null);
  const rafUpdateRef = useRef(null);

  const [introPhase, setIntroPhase] = useState('start');
  const [sectionRef, sectionInView] = useInView({ threshold: 0.8 });

  useEffect(() => { window.history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);

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

    h('div', { className: 'fixed inset-0 z-0 bg-cover bg-center grayscale contrast-[1.3] brightness-[0.25] pointer-events-none', style: { backgroundImage: 'url("../HomePageAssets/bg.webp")' } }),
    h('div', { className: 'fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay', style: { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' } }),

    h('main', { className: 'relative z-10 w-full' },

      // Hero
      h('header', { className: 'relative w-full h-screen flex flex-col items-center justify-center' },
        h('div', { className: 'text-center' },
          h('h1', {
            'data-text': 'D&D ARCHIVES',
            className: 'text-[3.5rem] sm:text-[6rem] md:text-[8rem] lg:text-[10rem] tracking-tighter uppercase leading-[0.8] text-white font-display transform-gpu relative ' + (introPhase !== 'done' ? 'animate-brutal-glitch' : ''),
            style: { willChange: 'transform' }
          }, h(ScrambledText, { text: 'D&D ARCHIVES', phase: introPhase })),
          h('p', { className: 'text-[#00ff66] tracking-[0.5em] text-xs md:text-sm font-mono mt-6 opacity-80' }, '// \u540C\u4EBA\u81EA\u8BBE\u89D2\u8272\u6863\u6848'),
          h('p', { className: 'text-gray-500 text-sm mt-4 max-w-lg mx-auto leading-relaxed' }, '\u81EA\u8BBE\u7F51\u9875\u8BBE\u8BA1\u5B9E\u8DF5\u3002\u975E\u5B98\u65B9\u5185\u5BB9\u3002')
        ),
        h('div', { className: 'absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 transition-opacity duration-500 ' + (scrollY > 50 ? 'opacity-0 pointer-events-none' : 'opacity-70') },
          h('span', { className: 'text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase hidden md:block' }, 'SCROLL'),
          h('svg', { className: 'w-4 h-4 md:w-5 md:h-5 text-[#00ff66] animate-bounce-down', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            h('path', { d: 'M7 13l5 5 5-5M7 6l5 5 5-5' })
          )
        )
      ),

      // === CHARACTERS ===
      h('section', { className: 'relative w-full py-24 md:py-36 z-20 bg-[#020202]' },
        h('div', { className: 'max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'overflow-hidden mb-12 md:mb-20 pb-8 border-b border-[#111]' },
            h('h2', { ref: sectionRef, className: 'text-[#00ff66] tracking-[0.4em] text-xs md:text-sm font-bold font-mono transition-all duration-[800ms] ease-out ' + (sectionInView ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-16') }, '/// CHARACTERS')
          ),
          h('div', { className: 'flex flex-col gap-16 md:gap-32 w-full' },
            h(MonumentalLink, { scrollY, title: 'ALBERINA', subtitle: { label: 'High Elf Wizard', desc: '\u9AD8\u7CBE\u7075\u6CD5\u5E08\uFF0C\u98CE\u82C7\u65C5\u884C\u8005\u56E2' }, link: 'https://lavro.org/DnD/Alberina/', index: 0, color: 'white', align: 'left', iconName: 'dragon' }),
            h(MonumentalLink, { scrollY, title: 'FLAVILAR', subtitle: { label: 'Dragonborn Barbarian', desc: '\u9F99\u88D4\u4EBA\u91CE\u86EE\u4EBA\uFF0C\u98CE\u82C7\u65C5\u884C\u8005\u56E2' }, link: 'https://lavro.org/DnD/Flavilar/', index: 1, color: 'green', align: 'right', iconName: 'dragon' })
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
            'LAVRO.ORG \u00A9 ' + new Date().getFullYear() + ' // D&D ARCHIVES'
          ),
          h('p', { className: 'font-mono text-[10px] text-gray-700 mt-2 max-w-md text-center leading-relaxed' },
            '\u540C\u4EBA\u81EA\u8BBE\u5185\u5BB9\uFF0C\u4E0E Wizards of the Coast \u65E0\u5173\u3002D&D \u662F Wizards of the Coast \u7684\u6CE8\u518C\u5546\u6807\u3002'
          )
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(DnDPage));
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    document.getElementById('root').style.transition = 'opacity 0.3s ease';
    document.getElementById('root').style.opacity = '1';
  });
});
