// Lavro Portfolio - Pre-compiled (no Babel needed)
const { useEffect, useState, useRef, createElement: h, Fragment } = React;

// SVG icon paths (replaces Font Awesome)
const ICONS = {
  code: 'M392.8 1.2c-17-4.9-34.7 5-39.6 22l-128 448c-4.9 17 5 34.7 22 39.6s34.7-5 39.6-22l128-448c4.9-17-5-34.7-22-39.6zm80.6 120.1c-12.5 12.5-12.5 32.8 0 45.3L562.7 256l-89.4 89.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l112-112c12.5-12.5 12.5-32.8 0-45.3l-112-112c-12.5-12.5-32.8-12.5-45.3 0zm-306.7 0c-12.5-12.5-32.8-12.5-45.3 0l-112 112c-12.5 12.5-12.5 32.8 0 45.3l112 112c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256l89.4-89.4c12.5-12.5 12.5-32.8 0-45.3z',
  gamepad: 'M192 64C86 64 0 150 0 256S86 448 192 448l256 0c106 0 192-86 192-192s-86-192-192-192L192 64zM496 168a40 40 0 1 1 0 80 40 40 0 1 1 0-80zM392 304a40 40 0 1 1 80 0 40 40 0 1 1 -80 0zM168 200c0-13.3 10.7-24 24-24s24 10.7 24 24l0 32 32 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-32 0 0 32c0 13.3-10.7 24-24 24s-24-10.7-24-24l0-32-32 0c-13.3 0-24-10.7-24-24s10.7-24 24-24l32 0 0-32z',
  dragon: 'M352 124.5l-51.9-13c-6.5-1.6-11.3-7.1-12-13.8s2.8-13.1 8.7-16.1l40.8-20.4L294.4 28.8c-5.5-4.1-7.8-11.3-5.6-17.9S297.1 0 304 0L416 0l32 0 16 0c30.2 0 58.7 14.2 76.8 38.4l57.6 76.8c6.2 8.3 9.6 18.4 9.6 28.8c0 26.5-21.5 48-48 48l-21.5 0c-17 0-33.3-6.7-45.3-18.7L480 160l-32 0 0 21.5c0 24.8 12.8 47.9 33.8 61.1l106.6 66.6c32.1 20.1 51.6 55.2 51.6 93.1C640 462.9 590.9 512 530.2 512L496 512l-64 0L32.3 512c-3.3 0-6.6-.4-9.6-1.4C13.5 507.8 6 501 2.4 492.1C1 488.7 .2 485.2 0 481.4c-.2-3.7 .3-7.3 1.3-10.7c2.8-9.2 9.6-16.7 18.6-20.4c3-1.2 6.2-2 9.5-2.2L433.3 412c8.3-.7 14.7-7.7 14.7-16.1c0-4.3-1.7-8.4-4.7-11.4l-44.4-44.4c-30-30-46.9-70.7-46.9-113.1l0-45.5 0-57zM512 72.3c0-.1 0-.2 0-.3s0-.2 0-.3l0 .6zm-1.3 7.4L464.3 68.1c-.2 1.3-.3 2.6-.3 3.9c0 13.3 10.7 24 24 24c10.6 0 19.5-6.8 22.7-16.3zM130.9 116.5c16.3-14.5 40.4-16.2 58.5-4.1l130.6 87 0 27.5c0 32.8 8.4 64.8 24 93l-232 0c-6.7 0-12.7-4.2-15-10.4s-.5-13.3 4.6-17.7L171 232.3 18.4 255.8c-7 1.1-13.9-2.6-16.9-9s-1.5-14.1 3.8-18.8L130.9 116.5z',
  envelope: 'M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z',
  github: 'M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z',
  discord: 'M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z',
  qq: 'M433.754 420.445c-11.526 1.393-44.86-52.741-44.86-52.741 0 31.345-16.136 72.247-51.051 101.786 16.842 5.192 54.843 19.167 45.803 34.421-7.316 12.343-125.51 7.881-159.632 4.037-34.122 3.844-152.316 8.306-159.632-4.037-9.045-15.25 28.918-29.214 45.783-34.415-34.92-29.539-51.059-70.445-51.059-101.792 0 0-33.334 54.134-44.859 52.741-5.37-.65-12.424-29.644 9.347-99.704 10.261-33.024 21.995-60.478 40.144-105.779C60.683 98.063 108.982.006 224 0c113.737.006 163.156 96.133 160.264 214.963 18.118 45.223 29.912 72.85 40.144 105.778 21.768 70.06 14.716 99.053 9.346 99.704z',
  steam: 'M496 256c0 137-111.2 248-248.4 248-113.8 0-209.6-76.3-239-180.4l95.2 39.3c6.4 32.1 34.9 56.4 68.9 56.4 39.2 0 71.9-32.4 70.2-73.5l84.5-60.2c52.1 1.3 95.8-40.9 95.8-93.5 0-51.6-42-93.5-93.7-93.5s-93.7 42-93.7 93.5v1.2L176.6 279c-15.5-.9-30.7 3.4-43.5 12.1L0 236.1C10.2 108.4 117.1 8 247.6 8 384.8 8 496 119 496 256zM155.7 384.3l-30.5-12.6a52.79 52.79 0 0 0 27.2 25.8c26.9 11.2 57.8-1.6 69-28.4 5.4-13 5.5-27.3.1-40.3-5.4-13-15.5-23.2-28.5-28.6-12.9-5.4-26.7-5.2-38.9-.6l31.5 13c19.8 8.2 29.2 30.9 20.9 50.7-8.3 19.9-31 29.2-50.8 21zm173.8-129.9c-34.4 0-62.4-28-62.4-62.3s28-62.3 62.4-62.3 62.4 28 62.4 62.3-27.9 62.3-62.4 62.3zm.1-15.6c25.9 0 46.9-21 46.9-46.8 0-25.9-21-46.8-46.9-46.8s-46.9 21-46.9 46.8c.1 25.8 21.1 46.8 46.9 46.8z',
};
const ICON_VIEWBOX = { code: '0 0 640 512', gamepad: '0 0 640 512', dragon: '0 0 640 512', envelope: '0 0 512 512', github: '0 0 496 512', discord: '0 0 640 512', qq: '0 0 448 512', steam: '0 0 496 512' };

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
    }, title, copied && h('span', { key: 'copied', className: 'text-[#00ff66] text-sm md:text-base font-mono ml-4 align-middle tracking-widest animate-fade-in-out' }, 'COPIED'));
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
@keyframes bounce-down { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(10px); } }
.animate-bounce-down { animation: bounce-down 2s ease-in-out infinite; }
@keyframes fade-in-out { 0% { opacity: 0; transform: translateY(4px); } 15% { opacity: 1; transform: translateY(0); } 85% { opacity: 1; transform: translateY(0); } 100% { opacity: 0; transform: translateY(-4px); } }
.animate-fade-in-out { animation: fade-in-out 2s ease forwards; }
@keyframes scroll-hint-fade { 0% { opacity: 0.7; } 100% { opacity: 0; } }
.animate-scroll-fade { animation: scroll-hint-fade 0.5s ease forwards; }
@keyframes rainbow-hue { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
html.rainbow-mode { animation: rainbow-hue 3s linear infinite; }
html.rainbow-mode .konami-toast { display: block; }
.konami-toast { display: none; position: fixed; top: 2rem; left: 50%; transform: translateX(-50%); z-index: 9999; font-family: 'Anton', monospace; font-size: 1rem; letter-spacing: 0.3em; color: #00ff66; background: rgba(0,0,0,0.85); border: 1px solid #00ff66; padding: 0.6rem 2rem; pointer-events: none; animation: toast-fade 3s ease forwards; }
@keyframes toast-fade { 0% { opacity: 0; transform: translateX(-50%) translateY(-10px); } 10% { opacity: 1; transform: translateX(-50%) translateY(0); } 80% { opacity: 1; } 100% { opacity: 0; } }
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
    h('div', { className: 'fixed inset-0 z-[1] pointer-events-none opacity-[0.05] mix-blend-overlay', style: { backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' } }),

    // Main content
    h('main', { className: 'relative z-10 w-full' },

      // Language switch (top-right)
      h('a', { href: '/en/', className: 'fixed top-6 right-6 z-50 text-xs tracking-[0.2em] text-[#00ff66] border border-[#00ff66] px-4 py-2 hover:bg-[#00ff66] hover:text-[#050505] transition-all duration-300 font-mono' }, 'EN'),

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
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs opacity-70' }, 'Fav.'),
                  h('span', null, 'GAMES & ACGN')
                ),
                h('div', { className: 'flex flex-col gap-1 w-full md:w-auto mt-2 md:mt-0' },
                  h('span', { className: 'text-[#00ff66] text-[10px] md:text-xs opacity-70' }, 'NOW PLAYING'),
                  h('span', { className: 'tracking-widest' }, 'MINECRAFT / VALORANT / APEX / OW')
                )
              )
            )
          )
        ),

        // Scroll hint arrow
        h('div', { className: 'absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 md:gap-2 transition-opacity duration-500 ' + (scrollY > 50 ? 'opacity-0 pointer-events-none' : 'opacity-70'), style: { transition: 'opacity 0.5s ease' } },
          h('span', { className: 'text-[10px] font-mono tracking-[0.3em] text-gray-400 uppercase hidden md:block' }, 'SCROLL'),
          h('svg', { className: 'w-4 h-4 md:w-5 md:h-5 text-[#00ff66] animate-bounce-down', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
            h('path', { d: 'M7 13l5 5 5-5M7 6l5 5 5-5' })
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
                    ['APEX\u82F1\u96C4','\u74E6\u6D1B\u5170\u7279','\u6211\u7684\u4E16\u754C','\u5B88\u671B\u5148\u950B','\u660E\u65E5\u65B9\u821F'].map((g,i) =>
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
            h(MonumentalLink, { scrollY, title: 'C. FORGE', subtitle: { label: 'lavro.org/Projects/CForge', desc: 'CharacterForge - \u89D2\u8272\u6784\u5EFA\u4E0E\u6570\u636E\u6838\u5FC3\u903B\u8F91' }, link: 'https://lavro.org/Projects/CForge/', index: 0, color: 'white', align: 'left', iconName: 'code' }),
            h(MonumentalLink, { scrollY, title: 'LIFE SIM.', subtitle: { label: 'lavro.org/Projects/LSimulator', desc: 'Life Simulator - \u6E38\u620F\u673A\u5236\u8BBE\u8BA1\u4E0E\u6570\u503C\u6A21\u62DF\u7CFB\u7EDF' }, link: 'https://lavro.org/Projects/LSimulator/', index: 1, color: 'green', align: 'right', iconName: 'gamepad' })
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
              subLinks: [{ name: 'ALBERINA', url: 'https://lavro.org/DnD/Alberina/' }, { name: 'FLAVILAR', url: 'https://lavro.org/DnD/Flavilar/' }]
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
            h(MonumentalLink, { scrollY, title: 'STEAM', subtitle: { label: 'Profile', desc: '\u6E38\u620F\u5E93\u4E0E\u8054\u673A\u72B6\u6001' }, link: 'https://steamcommunity.com/profiles/76561199125299095/', index: 8, color: 'green', align: 'left', iconName: 'steam' })
          )
        )
      ),

      // === FOOTER ===
      h('section', { className: 'relative w-full bg-black z-20 pb-24 pt-12 border-t border-[#111]' },
        h('footer', { className: 'pt-8 flex flex-col items-center gap-8' },
          // Back to top
          h('button', {
            onClick: () => { if (lenisRef.current) lenisRef.current.scrollTo(0, { duration: 2 }); else window.scrollTo({ top: 0, behavior: 'smooth' }); },
            className: 'group flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 hover:text-[#00ff66] text-gray-600'
          },
            h('svg', { className: 'w-4 h-4 transition-transform duration-300 group-hover:-translate-y-1', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: '2' },
              h('path', { d: 'M17 11l-5-5-5 5M17 18l-5-5-5 5' })
            ),
            h('span', { className: 'text-[10px] font-mono tracking-[0.4em] uppercase' }, 'BACK TO TOP')
          ),
          // Decorative line
          h('div', { className: 'w-24 h-px bg-gradient-to-r from-transparent via-[#00ff66]/30 to-transparent' }),
          // ASCII decoration
          // Copyright
          h('p', { className: 'font-mono text-xs text-gray-600' },
            'LAVRO.ORG \u00A9 ' + new Date().getFullYear() + ' // STAY ONLINE.'
          ),
          // Credits link
          h('a', { href: '/credits/', className: 'font-mono text-[10px] tracking-[0.3em] text-gray-500 hover:text-[#00ff66] transition-colors duration-300 mt-2' }, '[ CREDITS ]')
        )
      )
    ) // end main
  ); // end root div
};

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(h(LavroPortfolio));
// React 18 render 是异步的，等下一帧确保 DOM 已更新再显示
requestAnimationFrame(function() {
  requestAnimationFrame(function() {
    document.getElementById('root').style.transition = 'opacity 0.3s ease';
    document.getElementById('root').style.opacity = '1';
  });
});

// 彩蛋: 点击标题三下触发彩虹模式
requestAnimationFrame(function() {
  var clickCount = 0;
  var clickTimer = null;
  var toast = document.createElement('div');
  toast.className = 'konami-toast';
  toast.textContent = '\u2605 RAINBOW MODE ACTIVATED \u2605';
  document.body.appendChild(toast);

  var titleEl = document.querySelector('[data-text="LAVRO"]');
  if (!titleEl) return;
  titleEl.style.cursor = 'pointer';
  titleEl.style.userSelect = 'none';
  titleEl.style.webkitUserSelect = 'none';
  titleEl.addEventListener('mousedown', function(e) {
    e.preventDefault();
    clickCount++;
    clearTimeout(clickTimer);
    clickTimer = setTimeout(function() { clickCount = 0; }, 800);
    if (clickCount >= 3) {
      clickCount = 0;
      document.documentElement.classList.toggle('rainbow-mode');
      toast.style.animation = 'none';
      void toast.offsetWidth;
      toast.style.animation = '';
    }
  });
});
