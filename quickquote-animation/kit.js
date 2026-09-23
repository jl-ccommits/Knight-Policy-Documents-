/* CARMA sketch kit: drawing primitives, the CARMA critter, props and the render runtime shared by
   the concept cuts (western.html, desk.html, vending.html). Each scene hands run() a pure
   draw(t) so render.mjs can step it frame by frame. */
'use strict';
const NS = 'http://www.w3.org/2000/svg';
const W = 1920, H = 1080;
const INK = '#2B211D', CORAL = '#E8735F', CORAL_DK = '#C9564A', BRAND = '#EC5F59', GREEN = '#5E8C61', GREEN_DK = '#4E7A51',
  GREEN_LT = '#7DAA7C', MUSTARD = '#E9B949', SKY = '#7FA9DA', PAPER = '#FFFDF8', BLUSH = '#F3A59A', TAN = '#C99A63';

// ---------- math ----------
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const P = (t, a, b) => clamp((t - a) / (b - a));
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
const inCubic = (x) => x * x * x;
const inOut = (x) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const outBack = (x, s = 1.9) => 1 + (s + 1) * Math.pow(x - 1, 3) + s * Math.pow(x - 1, 2);
const outElastic = (x) => (x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * (2 * Math.PI) / 3) + 1);
const bump = (t, c, d = 0.35, amp = 1) => (t >= c && t <= c + d ? Math.sin(Math.PI * (t - c) / d) * amp : 0);
const hop = (t, c, d, h) => (t >= c && t <= c + d ? h * 4 * ((t - c) / d) * (1 - (t - c) / d) : 0);
function rng(seed) { return () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
const f1 = (v) => v.toFixed(1);
function lerpColor(a, b, k) {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16)), pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(lerp(v, pb[i], clamp(k))).toString(16).padStart(2, '0')).join('');
}
// piecewise keyframes: [[t, ...values]] eased with inOut between keys
function keys(list, t) {
  if (t <= list[0][0]) return list[0].slice(1);
  for (let i = 0; i < list.length - 1; i++) {
    const a = list[i], b = list[i + 1];
    if (t <= b[0]) { const k = inOut(P(t, a[0], b[0])); return a.slice(1).map((v, j) => lerp(v, b[j + 1], k)); }
  }
  return list[list.length - 1].slice(1);
}

// ---------- SVG + sketchy shapes ----------
function el(tag, attrs = {}, parent) {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
let seedCounter = 100;
function rrPath(x, y, w, h, r, j, rnd) {
  const J = () => (rnd() - 0.5) * 2 * j;
  const p = [[x + r + J(), y + J()], [x + w - r + J(), y + J()], [x + w + J(), y + r + J()], [x + w + J(), y + h - r + J()],
    [x + w - r + J(), y + h + J()], [x + r + J(), y + h + J()], [x + J(), y + h - r + J()], [x + J(), y + r + J()]];
  const c = [[x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  let d = `M${f1(p[0][0])},${f1(p[0][1])}`;
  for (let e = 0; e < 4; e++) {
    const a = p[e * 2], b = p[e * 2 + 1], n = p[(e * 2 + 2) % 8];
    d += ` Q${f1((a[0] + b[0]) / 2 + J())},${f1((a[1] + b[1]) / 2 + J())} ${f1(b[0])},${f1(b[1])}`;
    d += ` Q${c[e][0]},${c[e][1]} ${f1(n[0])},${f1(n[1])}`;
  }
  return d + 'Z';
}
function ellPath(cx, cy, rx, ry, j, rnd, n = 40) {
  let d = '';
  const ph = rnd() * 6.28, amp = j / Math.max(rx, ry);
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2, k = 1 + Math.sin(a * 3 + ph) * amp + (rnd() - 0.5) * amp * 0.4;
    d += (i ? 'L' : 'M') + f1(cx + Math.cos(a) * rx * k) + ',' + f1(cy + Math.sin(a) * ry * k);
  }
  return d + 'Z';
}
function polyPath(pts, j, rnd, close = false) {
  return 'M' + pts.map(([x, y]) => `${f1(x + (rnd() - 0.5) * j)},${f1(y + (rnd() - 0.5) * j)}`).join(' L') + (close ? 'Z' : '');
}
// offset colored-pencil fill + main ink line + a faint second pencil pass
function sketch(parent, d1, d2, fill, { sw = 4.5, stroke = INK, hatch = true, fillOpacity = 1 } = {}) {
  const g = el('g', {}, parent);
  if (fill) {
    el('path', { d: d1, fill, 'fill-opacity': fillOpacity, transform: 'translate(2.5 2)' }, g);
    if (hatch) el('path', { d: d1, fill: 'url(#hatch)', transform: 'translate(2.5 2)' }, g);
  }
  if (stroke) {
    el('path', { d: d1, fill: 'none', stroke, 'stroke-width': sw, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    if (d2) el('path', { d: d2, fill: 'none', stroke, 'stroke-width': sw * 0.45, opacity: 0.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  }
  return g;
}
const rrect = (parent, x, y, w, h, r, fill, o = {}) => { const rnd = rng(o.seed ?? seedCounter++); const j = o.j ?? 2; return sketch(parent, rrPath(x, y, w, h, r, j, rnd), o.single ? null : rrPath(x, y, w, h, r, j * 1.6, rnd), fill, o); };
const ell = (parent, cx, cy, rx, ry, fill, o = {}) => { const rnd = rng(o.seed ?? seedCounter++); const j = o.j ?? 2; return sketch(parent, ellPath(cx, cy, rx, ry, j, rnd), o.single ? null : ellPath(cx, cy, rx, ry, j * 1.5, rnd), fill, o); };
const poly = (parent, pts, fill, o = {}) => { const rnd = rng(o.seed ?? seedCounter++); const j = o.j ?? 2; return sketch(parent, polyPath(pts, j, rnd, !!fill || o.close), o.single ? null : polyPath(pts, j * 1.6, rnd, !!fill || o.close), fill, o); };
const line = (parent, pts, o = {}) => poly(parent, pts, null, { single: true, ...o });
const text = (parent, x, y, str, o = {}) => { const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', class: o.cls || 'hand', 'font-size': o.size || 40, fill: o.fill || INK, ...(o.attrs || {}) }, parent); t.textContent = str; return t; };
const setT = (node, s) => node.setAttribute('transform', s);
const setO = (node, o) => { node.setAttribute('opacity', clamp(o).toFixed(3)); node.style.display = o <= 0.001 ? 'none' : ''; };

// ---------- stage ----------
function paperTexture() {
  const c = document.createElement('canvas'); c.width = 960; c.height = 540;
  const x = c.getContext('2d'), img = x.createImageData(960, 540), r = rng(77);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = r(); const g = v > 0.985 ? 150 : v > 0.93 ? 205 : 245 + r() * 10;
    img.data[i] = img.data[i + 1] = g; img.data[i + 2] = g - 6; img.data[i + 3] = v > 0.93 ? 60 : 18;
  }
  x.putImageData(img, 0, 0);
  x.globalAlpha = 0.05; x.strokeStyle = '#8a7f72';
  for (let i = 0; i < 260; i++) { const px = r() * 960, py = r() * 540, a = r() * 6.28, l = 6 + r() * 20; x.beginPath(); x.moveTo(px, py); x.lineTo(px + Math.cos(a) * l, py + Math.sin(a) * l); x.stroke(); }
  return c.toDataURL();
}
function setupStage(bg = '#F4ECDD') {
  const stage = document.getElementById('stage');
  const svg = el('svg', { width: W, height: H, viewBox: `0 0 ${W} ${H}` }, stage);
  const defs = el('defs', {}, svg);
  defs.innerHTML = `
    <filter id="boil" x="-2%" y="-2%" width="104%" height="104%">
      <feTurbulence id="turb" type="fractalNoise" baseFrequency="0.024" numOctaves="2" seed="1" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <pattern id="hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(38)">
      <line x1="0" y1="0" x2="0" y2="9" stroke="#2a1d17" stroke-width="2.2" opacity=".09"/>
      <line x1="5" y1="0" x2="5" y2="9" stroke="#fff" stroke-width="1.4" opacity=".16"/>
    </pattern>
    <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.2" fill="#fff" opacity=".85"/><circle cx="11" cy="11" r="1.6" fill="#fff" opacity=".7"/>
    </pattern>`;
  const bgRect = el('rect', { width: W, height: H, fill: bg }, svg);
  const world = el('g', { filter: 'url(#boil)' }, svg);
  const back = el('g', {}, world);   // not moved by the camera
  const cam = el('g', {}, world);
  const tex = el('image', { x: 0, y: 0, width: W, height: H, opacity: 0.5, style: 'pointer-events:none' }, svg);
  tex.setAttribute('href', paperTexture());
  const overlay = el('g', {}, svg);  // crisp layer for the end card
  return { svg, bgRect, world, back, cam, overlay };
}
const boil = (t) => document.getElementById('turb').setAttribute('seed', String(1 + (Math.floor(t * 8) % 6)));
const camera = (cam, x, y, z) => setT(cam, `translate(960 540) scale(${z.toFixed(4)}) translate(${f1(-x)} ${f1(-y)})`);

// ---------- props ----------
function bubble(parent, rx, ry, tail, lines, size) {
  const g = el('g', {}, parent);
  poly(g, [[-rx * 0.28, ry * 0.62], [tail[0], tail[1]], [rx * 0.02, ry * 0.8]], PAPER, { sw: 4.5, hatch: false, j: 1 });
  ell(g, 0, 0, rx, ry, PAPER, { sw: 5, hatch: false });
  el('path', { d: `M${-rx * 0.3} ${ry * 0.55} L${rx * 0.05} ${ry * 0.72}`, stroke: PAPER, 'stroke-width': 12 }, g);
  lines.forEach((s, i) => text(g, 0, (i - (lines.length - 1) / 2) * size * 1.05 + size * 0.34, s, { size }));
  return g;
}
const popIn = (t, a, b) => (t < a || t > b ? 0 : Math.min(outBack(P(t, a, a + 0.35), 2.2), 1 - inCubic(P(t, b - 0.22, b))));
function showBubble(g, t, a, b, x, y, wobble = 0) {
  const k = popIn(t, a, b);
  setO(g, k > 0 ? 1 : 0);
  setT(g, `translate(${x} ${y}) scale(${Math.max(0.001, k).toFixed(3)}) rotate(${f1(Math.sin(t * 7) * wobble)})`);
}
function drawCard(parent) {
  rrect(parent, -104, -62, 208, 124, 10, PAPER, { sw: 4.5, hatch: false });
  text(parent, 0, -28, 'INDICATION', { cls: 'pen', size: 22, fill: '#6f665f', attrs: { 'letter-spacing': 3 } });
  text(parent, 0, 22, '$1,511', { size: 58, fill: CORAL_DK });
  text(parent, 0, 50, 'non-binding', { cls: 'pen', size: 20, fill: '#8a817a' });
}
function makeSparkles(parent, spots) {
  return spots.map(([x, y], i) => {
    const g = el('g', {}, parent);
    poly(g, [[0, -22], [5, -5], [22, 0], [5, 5], [0, 22], [-5, 5], [-22, 0], [-5, -5]], i % 2 ? MUSTARD : CORAL, { sw: 2.5, j: 0.6 });
    return { g, x, y };
  });
}
function updateSparkles(list, t, t0, ox, oy) {
  list.forEach((s, i) => { const k = bump(t, t0 + i * 0.07, 0.6, 1); setO(s.g, k); setT(s.g, `translate(${f1(ox + s.x)} ${f1(oy + s.y)}) scale(${(0.4 + k).toFixed(3)}) rotate(${f1(t * 90)})`); });
}
function makeConfetti(parent, { n = 90, seed = 8, burst = 34, colors = [CORAL, GREEN, MUSTARD, SKY, CORAL] } = {}) {
  const r = rng(seed), layer = el('g', {}, parent), list = [];
  for (let i = 0; i < n; i++) {
    const g = el('g', {}, layer), c = colors[i % colors.length], kind = i % 4;
    if (kind === 0) poly(g, [[-8, -6], [8, -6], [8, 6], [-8, 6]], c, { sw: 2, single: true, j: 0.8, hatch: false });
    else if (kind === 1) poly(g, [[0, -9], [8, 7], [-8, 7]], c, { sw: 2, single: true, j: 0.8, hatch: false });
    else if (kind === 2) sketch(g, 'M0 4 C-10 -4 -6 -12 0 -6 C6 -12 10 -4 0 4 Z', null, c, { sw: 2, hatch: false });
    else line(g, [[-9, 0], [-4, -5], [1, 0], [6, -5], [10, 0]], { sw: 3, stroke: c });
    const ang = -Math.PI / 2 + (r() - 0.5) * 2.4;
    list.push({ g, burst: i < burst, x0: r() * W, y0: -40 - r() * 700, v: 90 + r() * 90, sway: 20 + r() * 30, ph: r() * 6.28,
      spin: (r() - 0.5) * 300, vx: Math.cos(ang) * (500 + r() * 700), vy: Math.sin(ang) * (500 + r() * 700) });
  }
  return {
    update(t, t0, ox, oy, floor = 900) {
      list.forEach((c) => {
        const d = t - t0;
        if (d < 0) { setO(c.g, 0); return; }
        let cx, cy;
        if (c.burst) { cx = ox + c.vx * d * Math.exp(-d * 1.2); cy = oy + c.vy * d * Math.exp(-d * 1.2) + 300 * d * d; }
        else { cx = c.x0 + Math.sin(d * 2 + c.ph) * c.sway; cy = c.y0 + c.v * d * 1.6; }
        setO(c.g, cy < floor ? (c.burst ? 1 - P(d, 2.2, 3) : 1) : 0);
        setT(c.g, `translate(${f1(cx)} ${f1(cy)}) rotate(${f1(c.spin * d)}) scale(${(0.7 + 0.3 * Math.cos(d * 5 + c.ph)).toFixed(3)} 1)`);
      });
    },
  };
}
// doodle phone running QuickQuote; local coords are centred, 320 x 580
const ROW_Y = [-130, -50, 30, 110], BTN_Y = 200;
function makePhone(parent) {
  const g = el('g', {}, parent), inner = el('g', {}, g);
  rrect(inner, -160, -290, 320, 580, 42, PAPER, { sw: 5.5, hatch: false });
  rrect(inner, -142, -272, 284, 544, 30, null, { sw: 2, single: true, stroke: '#9a918a' });
  rrect(inner, -42, -262, 84, 22, 11, INK, { sw: 3, single: true, hatch: false });
  text(inner, -118, -196, 'QuickQuote', { anchor: 'start', size: 46 });
  poly(inner, [[102, -238], [86, -206], [100, -206], [90, -178], [118, -214], [103, -214], [112, -238]], CORAL, { sw: 3, j: 0.8 });
  text(inner, -118, -166, 'by CARMA', { anchor: 'start', cls: 'pen', size: 24, fill: '#7a706a' });
  const rows = ['Coverage', 'Eligibility', 'Rate', 'Indication'].map((lab, i) => {
    const y0 = ROW_Y[i];
    const hi = el('g', {}, inner); rrect(hi, -132, y0 - 32, 264, 64, 16, '#DDEEDD', { stroke: null });
    rrect(inner, -120, y0 - 19, 38, 38, 7, PAPER, { sw: 3.5, hatch: false });
    text(inner, -64, y0 + 12, lab, { anchor: 'start', cls: 'pen', size: 36 });
    const ck = el('path', { d: `M-113 ${y0 + 1} L-102 ${y0 + 13} L-78 ${y0 - 18}`, fill: 'none', stroke: GREEN, 'stroke-width': 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'stroke-dasharray': 60, 'stroke-dashoffset': 60 }, inner);
    return { hi, ck };
  });
  const btn = el('g', {}, inner);
  rrect(btn, -130, BTN_Y - 34, 260, 68, 34, CORAL, { sw: 4 });
  text(btn, 0, BTN_Y + 11, 'Get indication', { size: 36, fill: '#fff' });
  return {
    g, inner,
    update(t, taps, btnT) {
      rows.forEach((r, i) => { const c = taps[i]; setO(r.hi, P(t, c - 0.02, c + 0.12)); r.ck.setAttribute('stroke-dashoffset', f1(60 * (1 - outCubic(P(t, c + 0.02, c + 0.28))))); });
      const bp = t >= btnT && t < btnT + 0.18;
      setT(btn, `translate(0 ${bp ? 5 : 0}) scale(${bp ? 0.97 : 1})`);
    },
  };
}
function makeWatch(parent) {
  const g = el('g', {}, parent);
  rrect(g, -12, -74, 24, 18, 4, INK, { single: true, sw: 3 });
  ell(g, 0, 0, 56, 56, PAPER, { sw: 5, hatch: false });
  const hand = el('g', {}, g); line(hand, [[0, 0], [0, -38]], { sw: 5, stroke: CORAL });
  ell(g, 0, 0, 5, 5, INK, { single: true, sw: 2 });
  const label = text(g, 0, 108, '0:00', { size: 52 });
  const sub = text(g, 0, 150, 'under 3 min!', { size: 34, fill: GREEN });
  return {
    g,
    update(t, a, b, x, y, show) {
      const secs = clamp((t - a) / (b - a)) * 167;
      setO(g, show);
      setT(g, `translate(${f1(x)} ${f1(y + Math.sin(t * 2) * 5)}) scale(${(show * (1 + bump(t, b, 0.3, 0.15))).toFixed(3)}) rotate(${f1(Math.sin(t * 1.7) * 3)})`);
      setT(hand, `rotate(${f1(secs * 6)})`);
      label.textContent = `${Math.floor(secs / 60)}:${String(Math.floor(secs % 60)).padStart(2, '0')}`;
      label.setAttribute('fill', t >= b ? GREEN : INK);
      setO(sub, P(t, b, b + 0.3));
    },
  };
}
// end card on the crisp overlay, text column centred at EX
function makeEndCard(overlay, { line1, line2, EX = 1330 }) {
  const logo = el('g', {}, overlay);
  text(logo, EX, 300, 'CARMA', { cls: '', size: 118, fill: '#343434', attrs: { style: 'font-family:Montserrat;font-weight:800;letter-spacing:-1px' } });
  text(logo, EX - 6, 344, 'insurance', { cls: '', size: 34, fill: '#343434', attrs: { style: "font-family:'Playfair Display';letter-spacing:14px" } });
  el('path', { d: `M${EX + 150} 314 l18 0 l-14 40 l-18 0 Z`, fill: BRAND }, logo);
  const qq = el('g', {}, overlay); text(qq, EX, 480, 'QuickQuote', { size: 124, fill: CORAL_DK });
  const ul = el('path', { d: `M${EX - 250} 506 Q${EX} 520 ${EX + 262} 500`, fill: 'none', stroke: CORAL, 'stroke-width': 9, 'stroke-linecap': 'round', 'stroke-dasharray': 560, 'stroke-dashoffset': 560 }, overlay);
  const l1 = el('g', {}, overlay); text(l1, EX, 598, line1, { size: 64 });
  const l2 = el('g', {}, overlay); text(l2, EX, 670, line2, { size: 44, fill: '#4a403a' });
  const cta = el('g', {}, overlay);
  { const g = el('g', { filter: 'url(#boil)' }, cta); rrect(g, EX - 360, 736, 720, 92, 46, BRAND, { sw: 5 }); }
  text(cta, EX, 797, 'Request access  →  carma365.com', { size: 42, fill: '#fff' });
  const fine = el('g', {}, overlay); text(fine, 960, 1046, 'Non-binding indications for eligible cannabis accounts.', { cls: 'pen', size: 28, fill: '#6f665f' });
  return {
    update(t, t0) {
      const e = (a, s = 2) => outBack(P(t, a, a + 0.45), s);
      const at = (node, a, s = 2) => { const k = e(a, s); setO(node, clamp(k * 2)); setT(node, `translate(0 ${f1((1 - k) * 30)})`); };
      at(logo, t0); at(qq, t0 + 0.3);
      ul.setAttribute('stroke-dashoffset', f1(560 * (1 - outCubic(P(t, t0 + 0.6, t0 + 1.0)))));
      at(l1, t0 + 0.7, 1.4); at(l2, t0 + 0.9, 1.4);
      const ck = e(t0 + 1.3, 2.2); setO(cta, clamp(ck * 2));
      const pulse = t > t0 + 2 ? 1 + Math.sin((t - t0 - 2) * 5) * 0.015 : 1;
      setT(cta, `translate(${EX} 782) scale(${(Math.max(0.001, ck) * pulse).toFixed(3)}) translate(${-EX} -782)`);
      setO(fine, P(t, t0 + 1.6, t0 + 2.0));
    },
  };
}

// ---------- the CARMA critter: a round bean on two stubby legs ----------
// origin at its feet; body spans y -236..-32. variant: 'sprout' | 'cowboy'
function makeCritter(parent, { variant = 'sprout' } = {}) {
  const root = el('g', {}, parent), body = el('g', {}, root);
  const legs = [-44, 44].map((x) => { const g = el('g', {}, body); rrect(g, x - 18, -44, 36, 44, 15, CORAL, { sw: 4 }); return g; });
  let sprout = null, tails = null, hat = null;
  if (variant === 'sprout') {
    sprout = el('g', {}, body);
    line(sprout, [[3, -228], [0, -252], [4, -272]], { sw: 5 });
    const lf = el('g', { transform: 'rotate(-38 0 -268)' }, sprout); ell(lf, -26, -268, 26, 13, GREEN, { sw: 4 });
    const rf = el('g', { transform: 'rotate(30 6 -274)' }, sprout); ell(rf, 34, -274, 28, 14, GREEN_LT, { sw: 4 });
  }
  rrect(body, -114, -236, 228, 204, 86, CORAL, { sw: 5 });
  ell(body, -50, -198, 28, 11, '#fff', { stroke: null, hatch: false, fillOpacity: 0.25 });
  if (variant === 'cowboy') {   // polka-dot neckerchief knotted at the side
    const band = 'M-106 -96 Q0 -72 106 -96 L102 -78 Q0 -56 -102 -78 Z';
    sketch(body, band, null, GREEN, { sw: 4 }); el('path', { d: band, fill: 'url(#dots)', transform: 'translate(2.5 2)' }, body);
    const tri = 'M-36 -72 Q0 -62 36 -72 L2 -30 Q0 -28 -2 -30 Z';
    sketch(body, tri, null, GREEN, { sw: 4 }); el('path', { d: tri, fill: 'url(#dots)', transform: 'translate(2.5 2)' }, body);
    tails = el('g', {}, body);
    poly(tails, [[98, -90], [140, -110], [138, -86]], GREEN_DK, { sw: 3.5, j: 0.6 });
    poly(tails, [[98, -84], [134, -72], [120, -58]], GREEN_DK, { sw: 3.5, j: 0.6 });
    ell(body, 98, -86, 11, 9, GREEN_DK, { sw: 3.5, hatch: false });
  }
  const face = el('g', {}, body);
  const EY = -150, EX = 42, MY = -112;
  const eyes = el('g', {}, face), eyeL = el('g', {}, eyes), eyeR = el('g', {}, eyes);
  [[eyeL, -EX], [eyeR, EX]].forEach(([g, ex]) => {
    ell(g, ex, EY, 15, 20, INK, { single: true, sw: 1, hatch: false });
    el('circle', { cx: ex + 5, cy: EY - 8, r: 5.5, fill: '#fff' }, g); el('circle', { cx: ex - 5, cy: EY + 9, r: 2.6, fill: '#fff' }, g);
  });
  const eyesHappy = el('g', {}, face); [-EX, EX].forEach((ex) => line(eyesHappy, [[ex - 14, EY + 6], [ex, EY - 10], [ex + 14, EY + 6]], { sw: 6 }));
  const eyesSquint = el('g', {}, face);
  [-EX, EX].forEach((ex) => line(eyesSquint, [[ex - 16, EY], [ex + 16, EY + 2]], { sw: 6 }));
  line(eyesSquint, [[-EX - 18, EY - 24], [-EX + 14, EY - 14]], { sw: 5 }); line(eyesSquint, [[EX + 18, EY - 24], [EX - 14, EY - 14]], { sw: 5 });
  [-1, 1].forEach((sd) => ell(face, sd * 80, -116, 21, 12, BLUSH, { stroke: null, hatch: false }));
  const mSmile = line(face, [[-13, MY - 4], [-6.5, MY + 3], [0, MY - 3], [6.5, MY + 3], [13, MY - 4]], { sw: 4.5, j: 0.4 });
  const mOpen = poly(face, [[-15, MY - 6], [15, MY - 6], [10, MY + 9], [0, MY + 14], [-10, MY + 9]], INK, { sw: 3, hatch: false, j: 0.6 });
  ell(mOpen, 0, MY + 7, 6, 4, BLUSH, { stroke: null, hatch: false });
  const mO = ell(face, 0, MY + 2, 7, 9, INK, { single: true, sw: 2, hatch: false });
  const mFlat = line(face, [[-12, MY], [12, MY + 1]], { sw: 4.5 });
  const mWorry = line(face, [[-14, MY + 2], [-7, MY - 3], [0, MY + 2], [7, MY - 3], [14, MY + 2]], { sw: 4.5 });
  const sweat = el('g', {}, face); sketch(sweat, 'M100 -206 q13 20 0 28 q-13 -8 0 -28 Z', null, '#A9D4F2', { sw: 3 });
  if (variant === 'cowboy') {   // tan hat with a coral band
    hat = el('g', {}, body);
    sketch(hat, 'M-52 -228 L-46 -288 Q-26 -302 0 -288 Q26 -302 46 -288 L52 -228 Z', null, TAN, { sw: 4.5 });
    rrect(hat, -51, -252, 102, 16, 5, BRAND, { sw: 3 });
    sketch(hat, 'M-122 -226 Q-136 -256 -108 -244 Q0 -216 108 -244 Q136 -256 122 -226 Q0 -196 -122 -226 Z', null, '#B98A55', { sw: 4.5 });
  }
  const armL = el('g', {}, root), armR = el('g', {}, root), aLi = el('g', {}, armL), aRi = el('g', {}, armR);
  rrect(aLi, -40, -15, 44, 30, 15, CORAL, { sw: 4 });
  rrect(aRi, -4, -15, 44, 30, 15, CORAL, { sw: 4 });
  const held = el('g', {}, root);
  const all = [eyes, eyesHappy, eyesSquint, mSmile, mOpen, mO, mFlat, mWorry, sweat];
  const FACES = { smile: [eyes, mSmile], happy: [eyesHappy, mOpen], o: [eyes, mO], open: [eyes, mOpen], worried: [eyes, mWorry, sweat], squint: [eyesSquint, mFlat], sweat: [eyes, mO, sweat] };
  return {
    root, body, held, hat,
    pose({ x, y, r = 0, sq = 1, look = 0, face: fc = 'smile', t = 0, walk = 0, amp = 0, air = false, aL = null, sL = 1, aR = null, sR = 1, hatLift = 0, hatTilt = 0 }) {
      setT(root, `translate(${f1(x)} ${f1(y)}) rotate(${f1(r)})`);
      const sy = sq * (1 + Math.sin(t * 2.4) * 0.015), sx = 1 / Math.sqrt(sy);
      setT(body, `scale(${sx.toFixed(3)} ${sy.toFixed(3)})`);
      legs.forEach((g, i) => setT(g, `translate(0 ${f1(-Math.max(0, Math.sin(walk + i * Math.PI)) * amp)}) rotate(${air ? (i ? 10 : -10) : 0} ${i ? 44 : -44} -44)`));
      const bm = (t + 0.4) % 2.7, blink = bm < 0.13 ? 1 - Math.sin((Math.PI * bm) / 0.13) * 0.9 : 1;
      setT(eyes, `translate(${f1(look)} 0)`);
      [eyeL, eyeR].forEach((g) => setT(g, `translate(0 ${f1(EY * (1 - blink))}) scale(1 ${blink.toFixed(3)})`));
      const on = FACES[fc] || FACES.smile;
      all.forEach((n) => setO(n, on.includes(n) ? 1 : 0));
      setT(sweat, `translate(0 ${f1((t * 40) % 14)})`);
      const idle = Math.sin(t * 3) * 6;
      setT(armL, `translate(-112 ${f1(-118 * sy)})`); setT(aLi, `rotate(${f1(aL ?? idle)}) scale(${sL.toFixed(3)} 1)`);
      setT(armR, `translate(112 ${f1(-118 * sy)})`); setT(aRi, `rotate(${f1(aR ?? -idle)}) scale(${sR.toFixed(3)} 1)`);
      if (sprout) setT(sprout, `rotate(${f1(Math.sin(t * 2.6) * 5 + (air ? -10 : 0))} 0 -228)`);
      if (tails) setT(tails, `rotate(${f1(Math.sin(t * 7) * (amp > 0 || air ? 9 : 3))} 98 -86)`);
      if (hat) setT(hat, `translate(0 ${f1(-hatLift)}) rotate(${f1(-8 + hatTilt)} 0 -236)`);
      setT(held, `translate(0 ${f1((1 - sy) * 150)})`);
    },
  };
}
// world position of a critter's hand (ignores squash); side -1 = left arm, 1 = right arm
function handPos(x, y, side, a, s) {
  const ar = (a * Math.PI) / 180;
  return [x + side * 112 + side * Math.cos(ar) * 38 * s, y - 118 + side * Math.sin(ar) * 38 * s];
}
const steps = (a, b, dt = 0.145, k = 'step') => Array.from({ length: Math.max(0, Math.floor((b - a) / dt)) }, (_, i) => ({ t: a + i * dt, k }));

// ---------- runtime ----------
function run({ duration, draw, sfx, music = 'uke' }) {
  window.setTime = draw; window.DURATION = duration; window.STAGE = [W, H]; window.SFX = sfx; window.MUSIC = music;
  const stage = document.getElementById('stage');
  if (new URLSearchParams(location.search).has('render')) { draw(0); return; }
  document.body.classList.add('live');
  const fit = () => { stage.style.transform = `scale(${Math.min(innerWidth / W, innerHeight / H)})`; };
  fit(); addEventListener('resize', fit);
  let start = null;
  document.fonts.ready.then(() => {
    const loop = (now) => { if (start === null) start = now; draw(((now - start) / 1000) % duration); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  });
  const btn = document.getElementById('replay'); if (btn) btn.onclick = () => { start = null; };
}

// ---------- motion helpers ----------
// walking state from a position function: legs cycle with distance travelled
function walker(xAt, t) {
  const x = xAt(t), xn = xAt(t + 0.02), speed = Math.abs(xn - x) / 0.02;
  return { x, walk: x * 0.075, amp: speed > 20 ? clamp(speed / 500) * 14 : 0, moving: speed > 20, bob: speed > 20 ? Math.abs(Math.sin(x * 0.075)) * 5 : 0 };
}
// hop up to reach a button J px above the arm, hold at the top for the tap, drop back
function tapJump(t, c, J) {
  if (J <= 0) return 0;
  if (t >= c - 0.36 && t < c) return J * outCubic(P(t, c - 0.36, c));
  if (t >= c && t < c + 0.4) return J * (1 - inCubic(P(t, c + 0.06, c + 0.4)));
  return 0;
}
const reach = (t, c) => Math.max(0, bump(t, c - 0.12, 0.34, 1));
