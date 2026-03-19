// Lavro Portfolio - Pre-compiled (no Babel needed)
const { useEffect, useState, useRef, createElement: h, Fragment } = React;

// SVG icon paths (replaces Font Awesome)
const ICONS = {
  code: 'M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z',
  gamepad: 'M480 96H160A160 160 0 1 0 274.2 368h91.5A160 160 0 1 0 480 96zM248 268a12 12 0 0 1-12 12h-52v52a12 12 0 0 1-12 12h-24a12 12 0 0 1-12-12v-52H84a12 12 0 0 1-12-12v-24a12 12 0 0 1 12-12h52v-52a12 12 0 0 1 12-12h24a12 12 0 0 1 12 12v52h52a12 12 0 0 1 12 12zm216 76a40 40 0 1 1 40-40 40 40 0 0 1-40 40zm64-96a40 40 0 1 1 40-40 40 40 0 0 1-40 40z',
  dragon: 'M278.6 3.8c-9.4-5.1-20.8-5.1-30.2 0L20.4 144.4C7.6 151.3 0 164.7 0 179.1V320c0 88.4 71.6 160 160 160h48v-40c0-13.3 10.7-24 24-24s24 10.7 24 24v40h48c88.4 0 160-71.6 160-160V179.1c0-14.4-7.6-27.8-20.4-34.7L278.6 3.8zM160 256a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm192-32a32 32 0 1 0-64 0 32 32 0 1 0 64 0z',
  envelope: 'M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z',
  github: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.8-14.1-112.8-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z',
  discord: 'M524.5 69.8a1.5 1.5 0 0 0-.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0-1.9.9 337.5 337.5 0 0 0-14.9 30.6 447.8 447.8 0 0 0-134.4 0 309.5 309.5 0 0 0-15.1-30.6 1.9 1.9 0 0 0-1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0-.8.7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0-1-2.6 321.2 321.2 0 0 1-45.9-21.9 1.9 1.9 0 0 1-.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9.2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1-.1 3.1 301.4 301.4 0 0 1-45.9 21.8 1.9 1.9 0 0 0-1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1.7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.6-23.4 59.2-52.8 59.2zm195.4 0c-29 0-52.8-26.6-52.8-59.2s23.4-59.2 52.8-59.2c29.7 0 53.3 26.8 52.8 59.2 0 32.6-23.1 59.2-52.8 59.2z',
  qq: 'M395.9 320.2c-4.2-17.4-14.5-33.8-14.5-33.8s5.6-8.5 10.2-24.8c5.5-19.3 4.7-42.4 4.7-42.4C396.3 98.5 329 0 248 0S99.7 98.5 99.7 219.2c0 0-.8 23.1 4.7 42.4 4.6 16.3 10.2 24.8 10.2 24.8s-10.3 16.4-14.5 33.8c-4.7 19.4-1.3 30.7-1.3 30.7 14.1-5.3 35.5-20.5 35.5-20.5 0 27.7 23.9 54.8 66.2 66.5-7.4 4.2-13.5 10.6-13.5 21.2 0 0 .4 16.1 17.2 16.1 0 0 15.5-3.8 29.8-15.7 14.3 11.9 29.8 15.7 29.8 15.7 16.8 0 17.2-16.1 17.2-16.1 0-10.6-6.1-17-13.5-21.2 42.3-11.7 66.2-38.8 66.2-66.5 0 0 21.4 15.2 35.5 20.5 0 0 3.4-11.3-1.3-30.7z',
  steam: 'M496 256c0 137-111.2 248-248.4 248-113.3 0-209.2-75.5-240-178.9l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.1-32.4 70.8-72.1l84.1-61.2c44.6.5 81.2-36.1 81.2-80.6 0-44.8-36.4-81.1-81.2-81.1-44.6 0-80.8 36.3-81.2 80.6l-60.1 85.1c-13.2-.5-25.6 3.2-35.8 9.9L0 191.1C25.8 83.7 127.4 0 247.6 0 384.8 0 496 119 496 256z'
};
const ICON_VIEWBOX = { code: '0 0 640 512', gamepad: '0 0 560 512', dragon: '0 0 512 512', envelope: '0 0 512 512', github: '0 0 496 512', discord: '0 0 640 512', qq: '0 0 496 448', steam: '0 0 496 512' };

// ==========================================
// 自定义 Hook：滚动视口检测
// ==========================================
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

// ==========================================
// 乱码打字机特效组件
// ==========================================
const ScrambledText = ({ text, phase }) => {
  const [displayText, setDisplayText] = useState(phase === 'start' ? '' : text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3';
  useEffect(() => {
    if (phase === 'start') { setDisplayText(''); return; }
    if (phase === 'done') { setDisplayText(text); return; }
    let iteration = 0;
    const maxIterations = 24;
    const interval = setInterval(() => {
      setDisplayText(text.split('').map((char, index) => {
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

// ==========================================
// 核心子组件：纪念碑式物理交互链接
// ==========================================
const MonumentalLink = ({ title, subtitle, link, copyText, index, color = "white", align = "left", subLinks, iconName, scrollY }) => {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [logoStyle, setLogoStyle] = useState({ opacity: 0 });

  useEffect(() => {
    if (!containerRef.current || !iconName) return;
    // 延迟到下一帧读取布局，避免强制重排
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

  // Icon watermark
  const iconEl = iconName && ICONS[iconName] && h('svg', {
    xmlns: 'http://www.w3.org/2000/svg',
    viewBox: ICON_VIEWBOX[iconName] || '0 0 512 512',
    fill: 'currentColor',
    className: 'absolute top-1/2 text-white z-[-2] pointer-events-none',
    style: {
      width: 'min(40vw, 400px)',
      height: 'min(40vw, 400px)',
      opacity: logoStyle.opacity,
      [align === 'right' ? 'right' : 'left']: align === 'center' ? '50%' : '5%',
      transform: 'translate(' + (align === 'center' ? '-50%' : '0') + ', -50%)',
      willChange: 'opacity'
    }
  }, h('path', { d: ICONS[iconName] }));

  // Title element
  const titleStyle = {
    WebkitTextStroke: inView ? '0px transparent' : strokeColor,
    transform: inView ? 'translate3d(0, 0, 0)' : 'translate3d(' + initialTranslateX + 'px, ' + initialTranslateY + 'px, 0)',
    transitionProperty: 'color, -webkit-text-stroke, transform',
    willChange: 'transform'
  };
  const titleClass = 'text-[3.5rem] md:text-[6rem] lg:text-[8.5rem] uppercase tracking-tighter leading-[0.8] duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] font-display block relative z-20';

  let titleEl;
  if (copyText) {
    titleEl = h('span', {
      onClick: () => {
        navigator.clipboard.writeText(copyText).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
      className: titleClass + ' cursor-pointer hover:opacity-70 ' + (inView ? activeColor : 'text-transparent'),
      style: titleStyle
    }, title, copied && h('span', { className: 'text-[#00ff66] text-sm md:text-base font-mono ml-4 align-middle tracking-widest' }, 'COPIED'));
  } else if (link) {
    titleEl = h('a', {
      href: link,
      target: (link.startsWith('http') || link.startsWith('mailto')) ? '_blank' : '_self',
      rel: 'noreferrer',
      className: titleClass + ' cursor-pointer hover:opacity-70 ' + (inView ? activeColor : 'text-transparent'),
      style: titleStyle
    }, title);
  } else {
    titleEl = h('span', {
      className: titleClass + ' cursor-default ' + (inView ? activeColor : 'text-transparent'),
      style: titleStyle
    }, title);
  }

  // Subtitle + sublinks
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

// ==========================================
// CSS 样式字符串
// ==========================================
const globalCSS = `
@font-face {
  font-family: 'Alibaba PuHuiTi';
  src: url('./HomePageAssets/AlibabaPuHuiTi-Light-subset.woff2') format('woff2');
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
@keyframes marquee-x { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
@keyframes marquee-x-reverse { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
.animate-marquee { animation: marquee-x 40s linear infinite; display: flex; width: max-content; }
.animate-marquee-reverse { animation: marquee-x-reverse 45s linear infinite; display: flex; width: max-content; }
.animate-brutal-glitch { animation: main-flash 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both; backface-visibility: hidden; transform: translateZ(0); }
.animate-brutal-glitch::before, .animate-brutal-glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: transparent; pointer-events: none; backface-visibility: hidden; }
.animate-brutal-glitch::before { left: 3px; text-shadow: -2px 0 #fff; animation: glitch-slice-1 0.2s infinite linear alternate-reverse; }
.animate-brutal-glitch::after { left: -3px; text-shadow: 2px 0 #00ff66; animation: glitch-slice-2 0.3s infinite linear alternate-reverse; z-index: -1; }
@keyframes main-flash { 0% { opacity: 0; color: #fff; } 10% { opacity: 1; color: transparent; -webkit-text-stroke: 3px #fff; } 25% { color: #00ff66; -webkit-text-stroke: 0px; } 40% { color: transparent; -webkit-text-stroke: 4px #fff; } 60% { color: #fff; -webkit-text-stroke: 0px transparent; } 80% { color: transparent; -webkit-text-stroke: 1px #00ff66; } 100% { color: #fff; } }
@keyframes glitch-slice-1 { 0% { clip-path: inset(20% 0 80% 0); transform: translateX(-10px); } 10% { clip-path: inset(60% 0 10% 0); transform: translateX(10px); } 20% { clip-path: inset(40% 0 50% 0); transform: translateX(-10px); } 30% { clip-path: inset(80% 0 5% 0); transform: translateX(10px); } 40% { clip-path: inset(10% 0 70% 0); transform: translateX(-10px); } 50% { clip-path: inset(30% 0 40% 0); transform: translateX(10px); } 60% { clip-path: inset(70% 0 20% 0); transform: translateX(-10px); } 70% { clip-path: inset(5% 0 80% 0); transform: translateX(10px); } 80% { clip-path: inset(50% 0 30% 0); transform: translateX(-10px); } 90% { clip-path: inset(90% 0 5% 0); transform: translateX(10px); } 100% { clip-path: inset(15% 0 60% 0); transform: translateX(-10px); } }
@keyframes glitch-slice-2 { 0% { clip-path: inset(10% 0 60% 0); transform: translateX(10px); } 10% { clip-path: inset(30% 0 20% 0); transform: translateX(-10px); } 20% { clip-path: inset(70% 0 10% 0); transform: translateX(10px); } 30% { clip-path: inset(20% 0 50% 0); transform: translateX(-10px); } 40% { clip-path: inset(50% 0 30% 0); transform: translateX(10px); } 50% { clip-path: inset(5% 0 80% 0); transform: translateX(-10px); } 60% { clip-path: inset(80% 0 5% 0); transform: translateX(10px); } 70% { clip-path: inset(40% 0 40% 0); transform: translateX(-10px); } 80% { clip-path: inset(60% 0 10% 0); transform: translateX(10px); } 90% { clip-path: inset(20% 0 70% 0); transform: translateX(-10px); } 100% { clip-path: inset(10% 0 50% 0); transform: translateX(10px); } }
`;

// ==========================================
// 主应用：Lavro Portfolio
// ==========================================
const LavroPortfolio = () => {
  const [scrollY, setScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const lenisRef = useRef(null);
  const rafUpdateRef = useRef(null);

  const heroContentRef = useRef(null);
  const heroFadeRef1 = useRef(null);
  const heroFadeRef2 = useRef(null);
  const heroTitleRef = useRef(null);
  const clipBackdropRef = useRef(null);
  const clipLineRef = useRef(null);
  const bgTextRef = useRef(null);
  const aboutParallaxRef = useRef(null);
  const hobbyParallaxRef = useRef(null);

  const updateParallax = (scroll) => {
    const heroTextTranslateY = scroll * 0.25;
    const scrollFadeOpacity = Math.max(0, 1 - scroll / 250);
    const heroTitleScale = 1 + scroll * 0.0004;
    const clipTop = Math.max(0, 55 - scroll * 0.015);
    const clipBottom = Math.max(0, 35 - scroll * 0.02);
    const bgTextTranslateX = scroll * -0.15;
    const contentParallax1 = scroll * -0.015;
    const hobbyParallax = scroll * 0.03;
    if (heroContentRef.current) heroContentRef.current.style.transform = 'translate3d(0, ' + heroTextTranslateY + 'px, 0)';
    if (heroFadeRef1.current) heroFadeRef1.current.style.opacity = scrollFadeOpacity;
    if (heroFadeRef2.current) heroFadeRef2.current.style.opacity = scrollFadeOpacity;
    if (heroTitleRef.current) heroTitleRef.current.style.transform = 'scale(' + heroTitleScale + ') translateZ(0)';
    if (clipBackdropRef.current) clipBackdropRef.current.style.clipPath = 'polygon(' + clipTop + '% 0, 100% 0, 100% 100%, ' + clipBottom + '% 100%)';
    if (clipLineRef.current) { clipLineRef.current.setAttribute('x1', clipTop + '%'); clipLineRef.current.setAttribute('x2', clipBottom + '%'); }
    if (bgTextRef.current) bgTextRef.current.style.transform = 'translate3d(' + bgTextTranslateX + 'px, 0, 0)';
    if (aboutParallaxRef.current) aboutParallaxRef.current.style.transform = 'translate3d(0, ' + contentParallax1 + 'px, 0)';
    if (hobbyParallaxRef.current) hobbyParallaxRef.current.style.transform = 'translate3d(0, ' + hobbyParallax + 'px, 0)';
    setScrollY(scroll);
  };

  const [introPhase, setIntroPhase] = useState('start');
  const [linePhase, setLinePhase] = useState('start');
  const [aboutTitleRef, aboutTitleInView] = useInView({ threshold: 0.2 });
  const [hobbyTitleRef, hobbyTitleInView] = useInView({ threshold: 0.2 });
  const [devTitleRef, devTitleInView] = useInView({ threshold: 0.8 });
  const [designTitleRef, designTitleInView] = useInView({ threshold: 0.8 });
  const [contactTitleRef, contactTitleInView] = useInView({ threshold: 0.8 });

  const gameImages = [
    './HomePageAssets/Games/games-1.webp','./HomePageAssets/Games/games-2.webp','./HomePageAssets/Games/games-3.webp','./HomePageAssets/Games/games-4.webp',
    './HomePageAssets/Games/games-5.webp','./HomePageAssets/Games/games-6.webp','./HomePageAssets/Games/games-7.webp','./HomePageAssets/Games/games-8.webp',
    './HomePageAssets/Games/games-9.webp','./HomePageAssets/Games/games-10.webp','./HomePageAssets/Games/games-11.webp','./HomePageAssets/Games/games-12.webp',
    './HomePageAssets/Games/games-13.webp','./HomePageAssets/Games/games-14.webp','./HomePageAssets/Games/games-15.webp','./HomePageAssets/Games/games-16.webp',
    './HomePageAssets/Games/games-17.webp'
  ];
  const animeImages = [
    './HomePageAssets/Anime/anime-1.webp','./HomePageAssets/Anime/anime-2.webp','./HomePageAssets/Anime/anime-3.webp','./HomePageAssets/Anime/anime-4.webp',
    './HomePageAssets/Anime/anime-5.webp','./HomePageAssets/Anime/anime-6.webp','./HomePageAssets/Anime/anime-7.webp','./HomePageAssets/Anime/anime-8.webp',
    './HomePageAssets/Anime/anime-9.webp','./HomePageAssets/Anime/anime-10.webp'
  ];

  useEffect(() => { window.history.scrollRestoration = 'manual'; window.scrollTo(0, 0); }, []);

  // Lenis smooth scroll
  useEffect(() => {
    let lenisInstance; let reqId;
    import('https://esm.sh/lenis@1.1.18').then(({ default: Lenis }) => {
      lenisInstance = new Lenis({ duration: 1.5, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, smoothTouch: true });
      lenisInstance.on('scroll', (e) => {
        scrollYRef.current = e.scroll;
        if (!rafUpdateRef.current) {
          rafUpdateRef.current = requestAnimationFrame(() => { updateParallax(e.scroll); rafUpdateRef.current = null; });
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
    const t2 = setTimeout(() => setLinePhase('in'), 800);
    const t3 = setTimeout(() => setIntroPhase('done'), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Helper: create marquee image row (offset = start index for stagger)
  const marqueeRow = (images, cls, offset) => {
    const staggered = [...images.slice(offset % images.length), ...images.slice(0, offset % images.length)];
    return h('div', { className: cls + ' gap-3' },
      [...staggered, ...staggered].map((img, i) => h('div', { key: i, className: 'w-[36vw] md:w-[13.5vw] aspect-[3/4] flex-shrink-0 bg-cover bg-center rounded-sm bg-[#111]', style: { backgroundImage: 'url(' + img + ')' } }))
    );
  };

  const introTransition = (delay) => ({
    opacity: introPhase === 'done' ? 1 : 0,
    transform: introPhase === 'done' ? 'translateY(0)' : 'translateY(20px)',
    transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1) ' + delay + 's, transform 1s cubic-bezier(0.16,1,0.3,1) ' + delay + 's'
  });

  // ==========================================
  // RENDER
  // ==========================================
  return h('div', { className: 'min-h-screen bg-[#050505] text-[#f0f0f0] overflow-hidden selection:bg-[#00ff66] selection:text-black font-sans' },

    // Global CSS
    h('style', { dangerouslySetInnerHTML: { __html: globalCSS } }),

    // Fixed backgrounds
    h('div', { className: 'fixed inset-0 z-0 bg-cover bg-center grayscale contrast-[1.3] brightness-[0.25] pointer-events-none', style: { backgroundImage: 'url("./HomePageAssets/bg.webp")' } }),
    h('div', { className: 'fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay', style: { backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' } }),

    // Main content
    h('main', { className: 'relative z-10 w-full' },

      // === 01. HERO ===
      h('header', { className: 'relative w-full h-screen flex items-center justify-center' },
        h('div', { ref: heroContentRef, className: 'absolute inset-0 z-20 w-full max-w-[100rem] mx-auto px-6 flex flex-col items-start justify-center', style: { willChange: 'transform' } },
          // Portfolio label
          h('div', { ref: heroFadeRef1, style: { willChange: 'opacity' } },
            h('div', { style: introTransition(0.1) },
              h('h2', { className: 'text-[#00ff66] tracking-[0.3em] uppercase text-xs md:text-sm mb-8 font-bold opacity-80 font-mono' }, 'LAVRO.ORG // PORTFOLIO')
            )
          ),
          // LAVRO title
          h('h1', {
            ref: heroTitleRef, 'data-text': 'LAVRO',
            className: 'text-[6rem] sm:text-[10rem] md:text-[14rem] lg:text-[18rem] tracking-tighter uppercase leading-[0.8] text-white font-display transform-gpu relative ' + (introPhase !== 'done' ? 'animate-brutal-glitch' : ''),
            style: { transformOrigin: 'left center', willChange: 'transform' }
          }, h(ScrambledText, { text: 'LAVRO', phase: introPhase })),
          // Subtitle area
          h('div', { ref: heroFadeRef2, className: 'w-full', style: { willChange: 'opacity' } },
            h('div', { style: introTransition(0.3) },
              h('h2', { className: 'text-base md:text-2xl tracking-[0.5em] md:tracking-[1em] text-gray-200 mt-6 md:mt-8 ml-2 font-light relative z-20' }, '\u56FD\u9645\u5B66\u751F / \u5E73\u9762\u8BBE\u8BA1 / \u521B\u610F\u5F00\u53D1')
            ),
            h('div', { className: 'w-full max-w-4xl', style: introTransition(0.5) },
              h('div', { className: 'flex flex-wrap gap-x-12 gap-y-6 mt-12 md:mt-16 text-xs md:text-sm tracking-[0.1em] md:tracking-[0.2em] font-mono font-bold text-white relative z-20' },
                h('div', { className: 'flex flex-col gap-1' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs opacity-70' }, 'MBTI'),
                  h('span', null, 'INTP-A')
                ),
                h('div', { className: 'flex flex-col gap-1' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs opacity-70' }, 'STATUS'),
                  h('span', null, 'OTAKU')
                ),
                h('div', { className: 'flex flex-col gap-1 w-full md:w-auto mt-2 md:mt-0' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs opacity-70' }, '\u5E38\u73A9\u6E38\u620F'),
                  h('span', { className: 'tracking-widest' }, 'MINECRAFT / VALORANT / APEX / OW')
                )
              )
            )
          )
        ),
        // Invert clip layer
        h('div', { className: 'absolute inset-0 z-30 pointer-events-none ' + (linePhase === 'start' ? 'translate-x-[100vw]' : 'transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] translate-x-0') },
          h('div', { ref: clipBackdropRef, className: 'absolute inset-0', style: { backdropFilter: 'invert(100%) hue-rotate(180deg)', WebkitBackdropFilter: 'invert(100%) hue-rotate(180deg)', clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%)' } }),
          h('svg', { className: 'absolute inset-0 w-full h-full drop-shadow-[0_0_15px_rgba(0,255,102,0.3)]' },
            h('line', { ref: clipLineRef, x1: '55%', y1: '0', x2: '35%', y2: '100%', stroke: '#00ff66', strokeWidth: '4' })
          )
        )
      ),

      // === 02. ABOUT / TIMEZONE ===
      h('section', { className: 'relative w-full min-h-screen flex flex-col justify-center py-24 md:py-40 z-10 overflow-hidden' },
        h('div', { className: 'absolute inset-0 bg-[#050505]/80 z-0 border-t border-[#111]' }),
        h('div', { className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300vw] pointer-events-none opacity-[0.03] z-0 flex justify-center' },
          h('h2', { ref: bgTextRef, className: 'text-[40vw] md:text-[30vw] leading-none whitespace-nowrap text-white font-display tracking-tighter ease-out transform-gpu' },
            'SYNCING \u00A0 SYNCING \u00A0 SYNCING \u00A0 SYNCING \u00A0 SYNCING')
        ),
        h('div', { className: 'relative z-10 max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'flex flex-col lg:flex-row gap-12 lg:gap-32' },
            h('div', { className: 'w-full lg:w-5/12 py-4', ref: aboutTitleRef },
              h('h3', { className: 'text-[4rem] md:text-[6rem] lg:text-[8rem] uppercase text-white leading-[0.9] tracking-tighter font-display transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ' + (aboutTitleInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-32') },
                'ONLINE ', h('br'), h('span', { className: 'text-transparent', style: { WebkitTextStroke: '2px #00ff66' } }, 'ROUTINE.'), h('br'), 'UTC SYNC.'
              ),
              h('div', { className: 'mt-8 w-16 h-1 bg-[#00ff66] transition-all duration-1000 delay-300 ' + (aboutTitleInView ? 'opacity-100' : 'opacity-0') })
            ),
            h('div', { ref: aboutParallaxRef, className: 'w-full lg:w-7/12 flex flex-col justify-end pb-4 space-y-8', style: { willChange: 'transform' } },
              h('p', { className: 'text-base md:text-xl text-gray-300 leading-loose tracking-wide font-light max-w-2xl' },
                '\u6211\u662F\u4E00\u540D\u5B66\u751F\uFF0C\u4E3B\u653B\u5E73\u9762\u8BBE\u8BA1\u4E0E\u521B\u610F\u5F00\u53D1\u3002\u5728\u8FD9\u91CC\uFF0C\u6CA1\u6709\u592A\u591A\u5B8F\u5927\u7684\u5546\u4E1A\u5BA3\u8A00\u3002\u5DE5\u4F5C\u4E4B\u5916\uFF0C\u6211\u662F\u4E00\u540D\u7EDD\u5BF9\u7684 OTAKU\uFF0C\u6C89\u6D78\u4E8E\u5404\u7C7B\u6E38\u620F\u4E16\u754C\u4E4B\u4E2D\u3002\u751F\u6D3B\u4E0E\u8BBE\u8BA1\u7684\u7075\u611F\uFF0C\u5F80\u5F80\u5C31\u5728\u8FD9\u4E9B\u7EAF\u7CB9\u7684\u5A31\u4E50\u4E0E\u521B\u4F5C\u8FB9\u754C\u4EA4\u7EC7\u5904\u53D1\u751F\u3002'
              ),
              h('div', { className: 'flex flex-col md:flex-row gap-8 max-w-2xl my-4 py-6 border-t border-[#333]/40' },
                h('div', { className: 'flex flex-col gap-2' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs font-mono tracking-widest opacity-80' }, 'UTC-8 ACTIVE'),
                  h('span', { className: 'text-white text-lg md:text-xl font-bold font-mono tracking-wider' }, '17:00 - 00:00')
                ),
                h('div', { className: 'flex flex-col gap-2' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs font-mono tracking-widest opacity-80' }, 'UTC+8 ACTIVE'),
                  h('span', { className: 'text-white text-lg md:text-xl font-bold font-mono tracking-wider' }, '09:00 - 16:00')
                )
              ),
              h('div', { className: 'pt-2' },
                h('p', { className: 'text-sm md:text-base text-gray-400 leading-relaxed tracking-wide font-light max-w-2xl' },
                  '\u5982\u679C\u4F60\u60F3\u627E\u6211\u804A\u804A\u9879\u76EE\u3001\u63A2\u8BA8\u8BBE\u8BA1\uFF0C\u6216\u8005\u5355\u7EAF\u60F3\u62C9\u4E0A\u6211\u8054\u673A\u6253\u6E38\u620F\uFF0C\u53EA\u8981\u6CA1\u5728\u7761\u89C9\u6216\u4E0A\u8BFE\uFF0C\u6211\u901A\u5E38\u90FD\u5728\u8D5B\u535A\u7A7A\u95F4\u3002')
              )
            )
          )
        )
      ),

      // === 03. FAVORITES & INTERESTS ===
      h('section', { className: 'relative w-full min-h-screen py-24 md:py-40 z-10 overflow-hidden flex items-center border-t border-[#111]' },
        // Marquee poster wall
        h('div', { ref: hobbyParallaxRef, className: 'absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-[0.35] overflow-hidden transform-gpu', style: { willChange: 'transform' } },
          h('div', { className: 'absolute top-1/2 left-1/2 w-[140vw] h-[140vh] -translate-x-1/2 -translate-y-1/2 -rotate-[15deg] scale-110 flex flex-col gap-3 justify-center grayscale-[40%]' },
            marqueeRow(gameImages, 'animate-marquee', 0),
            marqueeRow(animeImages, 'animate-marquee-reverse', 4),
            marqueeRow([...gameImages].reverse(), 'animate-marquee', 8)
          )
        ),
        h('div', { className: 'absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-[#050505] z-0 pointer-events-none' }),
        h('div', { className: 'relative z-10 max-w-[100rem] mx-auto px-6 w-full', ref: hobbyTitleRef },
          h('div', { className: 'flex flex-col md:flex-row items-start md:items-center gap-12 lg:gap-24' },
            h('div', { className: 'w-full md:w-4/12' },
              h('h2', { className: 'text-[#00ff66] tracking-[0.4em] text-xs md:text-sm font-bold font-mono opacity-80 mb-6 transition-all duration-700 ' + (hobbyTitleInView ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0') }, '/// HOBBIES & INTERESTS'),
              h('h3', { className: 'text-[4rem] md:text-[6rem] lg:text-[7.5rem] uppercase text-white leading-[0.9] tracking-tighter font-display transition-all duration-1000 delay-100 ' + (hobbyTitleInView ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0') },
                'GAMES & ', h('br'), ' ', h('span', { className: 'text-transparent', style: { WebkitTextStroke: '2px #00ff66' } }, 'ANIME.')
              )
            ),
            h('div', { className: 'w-full md:w-8/12 border-l-[3px] border-[#00ff66] pl-6 md:pl-12 transition-all duration-1000 delay-300 ' + (hobbyTitleInView ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0') },
              h('p', { className: 'text-base md:text-xl text-gray-200 leading-loose tracking-wide font-light' },
                '\u5E73\u65F6\u5927\u90E8\u5206\u65F6\u95F4\u90FD\u6D3B\u8DC3\u5728\u5404\u7C7B\u6E38\u620F\u4E0E\u756A\u5267\u7684\u5E73\u884C\u4E16\u754C\u4E2D\u3002\u5BF9\u6211\u800C\u8A00\uFF0C\u8FD9\u4E9B\u4E0D\u4EC5\u662F\u7B80\u5355\u7684\u6D88\u9063\uFF0C\u66F4\u662F\u7EF4\u6301\u521B\u9020\u529B\u3001\u5BA1\u7F8E\u76F4\u89C9\u4EE5\u53CA\u4FDD\u6301\u70ED\u7231\u7684\u6700\u4F73\u65B9\u5F0F\u3002'
              ),
              h('div', { className: 'grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 mt-10 pt-8 border-t border-[#333]/50' },
                h('div', null,
                  h('h4', { className: 'text-[#00ff66] text-xs font-mono mb-4 tracking-widest opacity-80' }, '>> CURRENTLY PLAYING / \u6E38\u620F'),
                  h('ul', { className: 'space-y-3 font-mono text-sm tracking-wider text-white' },
                    ['APEX LEGENDS','VALORANT','MINECRAFT','OVERWATCH','ARKNIGHTS'].map((g,i) =>
                      h('li', { key: i, className: 'flex items-center gap-3' }, h('span', { className: 'text-[#333]' }, '-'), ' ', g)
                    )
                  )
                ),
                h('div', null,
                  h('h4', { className: 'text-[#00ff66] text-xs font-mono mb-4 tracking-widest opacity-80' }, '>> MANGA & ANIME / \u756A\u5267\u4E0E\u6F2B\u753B'),
                  h('ul', { className: 'space-y-3 font-mono text-sm tracking-wider text-white' },
                    ['\u5951\u7EA6\u4E4B\u543B','\u65E0\u804C\u8F6C\u751F','\u9882\u4E50\u4EBA\u5076','\u91D1\u724C\u5F97\u4E3B','\u5800\u4E0E\u5BAB\u6751'].map((a,i) =>
                      h('li', { key: i, className: 'flex items-center gap-3' }, h('span', { className: 'text-[#333]' }, '-'), ' ', a)
                    )
                  )
                )
              )
            )
          )
        )
      ),

      // === 04. PROJECTS: DEVELOPMENT ===
      h('section', { className: 'relative w-full min-h-screen py-24 md:py-40 z-20 bg-[#020202]' },
        h('div', { className: 'max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'overflow-hidden mb-24 md:mb-32 pb-8 border-b border-[#111]' },
            h('h2', { ref: devTitleRef, className: 'text-[#00ff66] tracking-[0.4em] text-xs md:text-sm font-bold font-mono transition-all duration-[800ms] ease-out ' + (devTitleInView ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-16') }, '/// 01. DEVELOPMENT WORKS')
          ),
          h('div', { className: 'flex flex-col gap-16 md:gap-32 w-full' },
            h(MonumentalLink, { scrollY, title: 'C. FORGE', subtitle: { label: 'lavro.org/CForge', desc: 'CharacterForge - \u89D2\u8272\u6784\u5EFA\u4E0E\u6570\u636E\u6838\u5FC3\u903B\u8F91' }, link: 'https://lavro.org/CForge', index: 0, color: 'white', align: 'left', iconName: 'code' }),
            h(MonumentalLink, { scrollY, title: 'LIFE SIM.', subtitle: { label: 'lavro.org/LSimulator', desc: 'Life Simulator - \u6E38\u620F\u673A\u5236\u8BBE\u8BA1\u4E0E\u6570\u503C\u6A21\u62DF\u7CFB\u7EDF' }, link: 'https://lavro.org/LSimulator', index: 1, color: 'green', align: 'right', iconName: 'gamepad' })
          )
        )
      ),

      // === PROJECTS: DESIGN ===
      h('section', { className: 'relative w-full min-h-screen py-24 md:py-40 z-20 border-t border-[#111]' },
        h('div', { className: 'absolute inset-0 bg-[#050505]/95 z-0' }),
        h('div', { className: 'relative z-10 max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'overflow-hidden mb-24 md:mb-32 pb-8 border-b border-[#222]' },
            h('h2', { ref: designTitleRef, className: 'text-white tracking-[0.4em] text-xs md:text-sm font-bold font-mono transition-all duration-[800ms] ease-out ' + (designTitleInView ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-16') }, '/// 02. DESIGN AESTHETICS')
          ),
          h('div', { className: 'flex flex-col gap-16 md:gap-32' },
            h(MonumentalLink, { scrollY, title: 'D&D ARCHIVES', subtitle: { label: 'Dungeons & Dragons', desc: 'D&D\u89D2\u8272\u8BBE\u8BA1\u7F51\u9875\u5C55\u793A\u53CA\u89C6\u89C9\u5305\u88C5\u5B9E\u8DF5' }, link: null, index: 2, color: 'white', align: 'center', iconName: 'dragon',
              subLinks: [{ name: 'ALBERINA', url: 'https://lavro.org/DnD/Alberina' }, { name: 'FLAVILAR', url: 'https://lavro.org/DnD/Flavilar' }]
            })
          )
        )
      ),

      // === CONTACT NETWORK ===
      h('section', { id: 'contact-section', className: 'relative w-full py-24 md:py-40 z-10 bg-[#000]' },
        h('div', { className: 'relative z-10 max-w-[100rem] mx-auto px-6 w-full' },
          h('div', { className: 'overflow-hidden mb-20 md:mb-32 pb-6 md:pb-8 border-b border-[#111]' },
            h('h2', { ref: contactTitleRef, className: 'text-[#00ff66] tracking-[0.4em] text-xs md:text-sm font-bold font-mono transition-all duration-[800ms] ease-out ' + (contactTitleInView ? 'opacity-80 translate-x-0' : 'opacity-0 -translate-x-16') }, '/// 03. CONTACT NETWORK')
          ),
          h('div', { className: 'flex flex-col gap-12 md:gap-24 relative z-10' },
            h(MonumentalLink, { scrollY, title: 'EMAIL', subtitle: { label: 'Lavro@lavro.org', desc: '\u4E3B\u7EBF\u8054\u7CFB\u65B9\u5F0F\uFF0C\u5904\u7406\u91CD\u8981\u4E8B\u52A1\u4E0E\u9879\u76EE' }, link: 'mailto:Lavro@lavro.org', index: 4, align: 'left', iconName: 'envelope' }),
            h(MonumentalLink, { scrollY, title: 'GITHUB', subtitle: { label: 'Lavr0v0', desc: '\u4EE3\u7801\u7684\u9AA8\u67B6\u4E0E\u5F00\u6E90\u8BB0\u5F55\uFF0C\u5E95\u5C42\u903B\u8F91\u5B58\u653E\u5904' }, link: 'https://github.com/Lavr0v0', index: 5, align: 'right', iconName: 'github' }),
            h(MonumentalLink, { scrollY, title: 'DISCORD', subtitle: { label: 'lavro_', desc: '\u65E5\u5E38\u5439\u6C34\u3001\u7EC4\u6392\u4E0A\u5206\uFF0C\u6216\u8005\u8D5B\u535A\u7A7A\u95F4\u7684\u5FEB\u901F\u53EC\u5524' }, copyText: 'lavro_', index: 6, color: 'green', align: 'left', iconName: 'discord' }),
            h(MonumentalLink, { scrollY, title: 'QQ', subtitle: { label: '1041022220', desc: '\u56FD\u5185\u5E38\u7528\u5373\u65F6\u901A\u8BAF' }, copyText: '1041022220', index: 7, align: 'right', iconName: 'qq' }),
            h(MonumentalLink, { scrollY, title: 'STEAM', subtitle: { label: 'Profile', desc: '\u6E38\u620F\u5E93\u4E0E\u8054\u673A\u72B6\u6001\uFF0C\u6765\u6253\u6D3E\u6D3E\u6216\u8005\u74E6\uFF01' }, link: 'https://steamcommunity.com/profiles/76561199125299095/', index: 8, color: 'green', align: 'left', iconName: 'steam' })
          )
        )
      ),

      // === FOOTER ===
      h('section', { className: 'relative w-full bg-black z-20 pb-24 pt-12 border-t border-[#111]' },
        h('footer', { className: 'pt-8 text-center font-mono text-xs text-gray-600' },
          'LAVRO.ORG \u00A9 ' + new Date().getFullYear() + ' // STAY ONLINE.'
        )
      )
    ) // end main
  ); // end root div
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(LavroPortfolio));
document.getElementById('root').style.opacity = '1';
document.getElementById('root').style.transition = 'opacity 0.3s ease';
