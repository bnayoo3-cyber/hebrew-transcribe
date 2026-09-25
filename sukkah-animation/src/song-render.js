
// ============================================================
//  הרכבה: שוט אחד או מעבר בין שני שוטים, כתוביות, ואז "מצלמה"
// ============================================================
const POOL = [0, 1].map(() => { const c = document.createElement('canvas'); c.width = W * DPR; c.height = H * DPR; return c; });
function renderScene(sc, f, cam, canvas) {
  const T = f / FPS; ctx = canvas.getContext('2d'); shK = DPR;
  STRETCH = sc.stretch ? sc.stretch(T) : 1;
  const jr = mulberry32(f * 31 + 7), sk_ = sc.shake(T);
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
  ctx.fillStyle = sc.bg; ctx.fillRect(0, 0, W, H);
  ctx.save(); ctx.translate((jr() - .5) * 1.6 * sk_ - 3, (jr() - .5) * 1.6 * sk_ - 3); ctx.scale((W + 6) / W, (H + 6) / H);
  const cm = camAt({ cam }, T);
  for (const p of sc.pieces) { ctx.save(); if (!p.screen) applyCam(cm, p.k); drawPiece(p, f, f); ctx.restore(); shK = DPR; }
  ctx.restore();
  return canvas;
}
const TFN = { rollUp, pageTurn, crumple, plane, strips, tearH, accordion, newSheet, tear, peel, shatter, tear3 };
let SHOTS = [];
function render(f) {
  const T = f / FPS;
  let i = SHOTS.length - 1; while (i > 0 && T < SHOTS[i].from) i--;
  const cur = SHOTS[i], nxt = SHOTS[i + 1];
  // מעבר פעיל? (חצי לפני נקודת ההחלפה, חצי אחריה)
  let tr = null;
  if (cur.tr && T < cur.from + cur.dur / 2 && i > 0) tr = { a: SHOTS[i - 1], b: cur };
  else if (nxt && nxt.tr && T >= nxt.from - nxt.dur / 2) tr = { a: cur, b: nxt };
  if (tr) {
    const A = renderScene(sceneById(tr.a.s), f, tr.a.cam, POOL[0]), B = renderScene(sceneById(tr.b.s), f, tr.b.cam, POOL[1]);
    ctx = mainCtx; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); table();
    const d = tr.b.dur, at = tr.b.from - d / 2, n = Math.max(1, Math.round(d * FPS));
    TFN[tr.b.tr](A, B, Math.min(1, (Math.floor((T - at) * FPS + 1e-6) + 1) / n), f);
  } else {
    const A = renderScene(sceneById(cur.s), f, cur.cam, POOL[0]);
    ctx = mainCtx; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.drawImage(A, 0, 0, W, H);
  }
  ctx = mainCtx; ctx.setTransform(DPR, 0, 0, DPR, 0, 0); shK = DPR;
  drawSubs(f);
  const jr = mulberry32(f * 31 + 7);
  ctx.save(); ctx.globalAlpha = .42; ctx.translate(-Math.floor(jr() * 256), -Math.floor(jr() * 256));
  ctx.fillStyle = grainPat; ctx.fillRect(0, 0, W + 256, H + 256); ctx.restore();
  ctx.fillStyle = vignette; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = `rgba(30,15,0,${(jr() * .05).toFixed(3)})`; ctx.fillRect(0, 0, W, H);
}
const vignette = (() => { const g = mainCtx.createRadialGradient(640, 360, 250, 640, 360, 780);
  g.addColorStop(0, 'rgba(60,30,0,0)'); g.addColorStop(1, 'rgba(50,25,0,0.42)'); return g; })();
const grainPat = mainCtx.createPattern(TEX, 'repeat');

// ============================================================
//  כתוביות מגזרי נייר — לכל שורה עיצוב משלה: חומר, פריסה, מיקום, גודל מילים,
//  כניסה ויציאה. חלק מהשורות "בתוך" הסצנה, מאחורי גדר / ענפים / אנשים.
// ============================================================
const SUBFONT = size => `${size}px Discovery, "Secular One", Rubik, "Arial Hebrew", sans-serif`;
const SUBS = [], NOTES = [];
const SUB_STYLE = [
  { papers: ['#fff4dc', '#ffe08a', '#c9e8b8', '#ffd0c2'], ink: '#5a2e14', accent: '#d9483b' },
  { papers: ['#fde2ec', '#e6dcf7', '#fff0a8', '#d5f0dc'], ink: '#4a2340', accent: '#8e55b8' },
  { papers: ['#ffd7a8', '#cfe9ff', '#ffe7a8', '#e8f5c8'], ink: '#3a2a1c', accent: '#2f86d6' },
  { papers: ['#2e4280', '#44307a', '#1f5063', '#4f2e66'], ink: '#fff4dc', accent: '#f2b134' },
];
// [בית][שורה]: style=חומר, lay=פריסה, pos=מיקום, world=בתוך הסצנה (layer=מאחורי מה), em=גודל לכל מילה, inA/outA=אנימציות
const SUB_SPEC = [
  [ { style: 'paper', lay: 'stack', pos: [1065, 400], world: 1, layer: 'fence', em: [1.35, .8, 1.15], inA: 'rise', outA: 'fly' },
    { style: 'letters', lay: 'arc', pos: [520, 205], world: 1, layer: 'sky', em: [1.3, 1.3], inA: 'drop', outA: 'pop' },
    { style: 'ribbon', lay: 'row', pos: [640, 642], em: [.75, .75, 1, 1.35, 1], inA: 'slideR', outA: 'fall' },
    { style: 'clothesline', lay: 'row', pos: [520, 440], world: 1, layer: 'stage', em: [1, .7, 1, 1.3], inA: 'drop', outA: 'fall' },
    { style: 'bubbles', lay: 'diag', pos: [1060, 110], em: [1.2, 1.2], inA: 'grow', outA: 'fly' },
    { style: 'stickers', lay: 'row', pos: [640, 640], em: [1, 1, 1, 1.6], inA: 'spin', outA: 'fall', gold: 3 },
    { style: 'letters', lay: 'diag', pos: [1080, 120], em: [1, .7, 1, 1.4], inA: 'slideR', outA: 'fly' },
    { style: 'paper', lay: 'arc', pos: [520, 190], world: 1, layer: 'sky', em: [1.3, 1.3], inA: 'rise', outA: 'pop' },
    { style: 'ribbon', lay: 'row', pos: [640, 640], em: [1.2, .9, 1, 1.5], inA: 'slideR', outA: 'fall' } ],
  [ { style: 'torn', lay: 'row', pos: [720, 300], world: 1, layer: 'wall', em: [.8, .8, 1.3, 1], inA: 'flip', outA: 'fall' },
    { style: 'letters', lay: 'stack', pos: [660, 250], world: 1, layer: 'wall', em: [1.5, 1.1], inA: 'rise', outA: 'sink' },
    { style: 'paper', lay: 'diag', pos: [1110, 120], em: [1.1, .65, 1.45, 1], inA: 'slideR', outA: 'fly' },
    { style: 'bubbles', lay: 'row', pos: [700, 300], world: 1, layer: 'front', em: [1.35, .8, 1], inA: 'pop', outA: 'pop' },
    { style: 'stickers', lay: 'scatter', pos: [[1010, 150], [660, 560], [330, 470]], em: [.9, 1.3, 1.5], inA: 'spin', outA: 'fall' },
    { style: 'paper', lay: 'row', pos: [300, 250], world: 1, layer: 'front', em: [.75, 1, 1.35, 1], inA: 'pop', outA: 'fly', drift: 1 },
    { style: 'stickers', lay: 'arc', pos: [700, 330], world: 1, layer: 'front', em: [1.5, .9, 1.1], inA: 'spin', outA: 'pop' },
    { style: 'bubbles', lay: 'scatter', pos: [[1000, 560], [700, 120], [360, 560]], em: [.9, 1.3, 1.4], inA: 'grow', outA: 'fly' },
    { style: 'letters', lay: 'row', pos: [640, 640], em: [.75, 1.1, 1.4, 1], inA: 'drop', outA: 'fall' } ],
  [ { style: 'letters', lay: 'row', pos: [640, 92], em: [1.3, 1], inA: 'drop', outA: 'fly' },
    { style: 'stickers', lay: 'row', pos: [620, 610], em: [1.1, .8, 1.7], inA: 'spin', outA: 'pop' },
    { style: 'bubbles', lay: 'arc', pos: [520, 150], world: 1, layer: 'sky', em: [1, .9, 1.6, 1.1], inA: 'grow', outA: 'fly' },
    { style: 'paper', lay: 'row', pos: [1150, 585], world: 1, layer: 'fence', em: [1, 1.3], inA: 'rise', outA: 'sink' },
    { style: 'letters', lay: 'diag', pos: [1040, 120], em: [1.5, 1.2], inA: 'slideR', outA: 'fall' },
    { style: 'ribbon', lay: 'row', pos: [520, 470], world: 1, layer: 'stage', em: [1.1, .9, 1.4], inA: 'slideR', outA: 'fall' },
    { style: 'clothesline', lay: 'row', pos: [520, 430], world: 1, layer: 'stage', em: [1, 1.3], inA: 'drop', outA: 'fall' },
    { style: 'stickers', lay: 'scatter', pos: [[900, 150], [400, 110]], em: [1.5, 1.2], inA: 'spin', outA: 'pop' },
    { style: 'paper', lay: 'stack', pos: [1050, 390], world: 1, layer: 'fence', em: [1.1, .85, 1.35], inA: 'rise', outA: 'fly' } ],
  [ { style: 'torn', lay: 'row', pos: [640, 96], em: [.9, 1, 1.25], inA: 'flip', outA: 'fly' },
    { style: 'letters', lay: 'row', pos: [440, 212], world: 1, layer: 'roof', em: [1.3, .7, 1.1], inA: 'rise', outA: 'sink' },
    { style: 'stickers', lay: 'arc', pos: [440, 60], world: 1, layer: 'stage', em: [1.5, 1, 1.3], inA: 'spin', outA: 'pop', gold: -1 },
    { style: 'bubbles', lay: 'row', pos: [640, 100], em: [1.4, 1, 1.2], inA: 'grow', outA: 'fly' },
    { style: 'paper', lay: 'row', pos: [640, 645], em: [.75, 1.4, 1, 1.4], inA: 'drop', outA: 'fall' },
    { style: 'stickers', lay: 'row', pos: [640, 640], em: [1.3, 1, 1, 1.5], inA: 'spin', outA: 'fly', gold: 3 },
    { style: 'torn', lay: 'row', pos: [640, 640], em: [1.3, 1, 1.2], inA: 'flip', outA: 'fall' },
    { style: 'bubbles', lay: 'arc', pos: [520, 120], world: 1, layer: 'stage', em: [.8, 1.4, .8, 1.4], inA: 'grow', outA: 'fly' },
    null ],
];
const SCENE_OF = ['build', 'decor', 'crowd', 'night'];
// זמן תחילת כל מילה (מהתמלול המתוזמן; המילים עצמן מהמילים המקוריות)
const WORDT = [
  [[21.90, 22.66, 23.54], [25.56, 26.46], [29.08, 29.30, 29.88, 30.50, 31.44], [35.64, 37.12, 37.38, 37.70], [39.24, 40.82],
   [42.52, 43.68, 44.54, 46.28], [49.40, 51.12, 51.38, 51.74], [52.40, 55.04], [56.60, 58.32, 58.72, 59.44]],
  [[63.90, 64.38, 64.98, 66.08], [67.50, 68.54], [70.96, 72.56, 73.08, 73.64], [77.50, 79.06, 80.16], [80.92, 83.04, 83.70],
   [85.36, 85.52, 86.84, 88.02], [92.04, 93.60, 94.18], [95.00, 96.52, 97.64], [99.32, 99.52, 100.74, 101.88]],
  [[105.91, 107.97], [109.81, 111.09, 111.65], [113.37, 114.09, 115.03, 115.53], [119.95, 121.19], [123.11, 125.09],
   [127.25, 129.33, 130.77], [133.95, 136.05], [137.67, 138.87], [141.23, 143.37, 143.97]],
  [[148.25, 149.89, 150.45], [151.47, 153.07, 153.77], [155.67, 157.03, 157.90], [162.57, 164.07, 164.69], [166.21, 166.70, 167.73, 168.40],
   [169.65, 171.23, 172.30, 173.35], [176.55, 177.71, 178.85], [180.43, 180.90, 181.95, 182.60], [183.71, 184.87, 185.85, 186.91]],
];
const NOTE_SPR = (() => {
  const one = col => sprite([P(ell(-6, 14, 11, 8, -.4), col, { amp: .5 }), P(rect(3, -26, 4.5, 40), col, { amp: .3 }), P([[3, -26], [18, -16], [16, -8], [7, -16]], col, { amp: .3, step: 6 })]);
  const two = col => sprite([P([ell(-16, 16, 10, 7, -.4), ell(16, 12, 10, 7, -.4)], col, { amp: .5 }), P([rect(-8, -22, 4.5, 38), rect(24, -26, 4.5, 38), [[-8, -22], [28, -26], [28, -18], [-8, -14]]], col, { amp: .3, step: 8 })]);
  return ['#e3343f', '#2f86d6', '#f2b134', '#4caf50', '#8e55b8', '#ef7a36'].flatMap(c => [one(c), two(c)]);
})();
const cloudPoly = (w, h) => { const c = []; const n = Math.max(3, Math.round(w / 34));
  for (let i = 0; i < n; i++) { const x = -w / 2 + (i + .5) * w / n; c.push(ell(x, -h * .18 + (i % 2 ? -6 : 4), w / n * .75, h * .42)); }
  c.push(ell(0, h * .08, w * .56, h * .36)); return c; };
function wordSprite(style, w, size, st, i, li, s, gold) {
  const txt = (ink, dy = 3) => gg => { gg.font = SUBFONT(size); gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.direction = 'rtl';
    sh(gg, 1.2, .6, .9, 'rgba(0,0,0,.25)'); gg.fillStyle = ink; gg.fillText(w, 0, dy); sh(gg, 0, 0, 0, 'rgba(0,0,0,0)'); };
  ctx = mainCtx; ctx.font = SUBFONT(size);
  const tw = ctx.measureText(w).width, ph = size * 1.42, col = st.papers[(i + li) % st.papers.length];
  if (style === 'paper') { const pw = tw + size * .62;
    return { w: pw, h: ph, spr: sprite([P(rect(-pw / 2, -ph / 2, pw, ph), col, { amp: 1.3, step: 14, ...((i + li) % 3 === 0 ? { torn: 2.6 } : {}) }),
      ...((i + li) % 4 === 1 ? [P([[-16, -ph / 2 - 8], [18, -ph / 2 - 12], [20, -ph / 2 + 8], [-14, -ph / 2 + 12]], 'rgba(255,252,235,.6)', { detail: true, amp: .4, step: 10 })] : [])], { after: txt(st.ink) }) }; }
  if (style === 'bubbles') { const pw = tw + size * .95;
    return { w: pw, h: ph * 1.1, spr: sprite([P(cloudPoly(pw, ph * 1.12), s === 3 ? '#3d5294' : '#fffdf6', { amp: 1, step: 10 })], { after: txt(s === 3 ? '#fff4dc' : st.ink, 6) }) }; }
  if (style === 'stickers') { const pw = tw + size * .55, isGold = gold === i || gold === -1;
    const c = isGold ? '#f2b134' : [st.accent, '#2f86d6', '#4caf50', '#ef7a36', '#e3343f'][(i + li) % 5];
    return { w: pw + 16, h: ph + 16, spr: sprite([P(rect(-pw / 2 - 8, -ph / 2 - 8, pw + 16, ph + 16), '#ffffff', { amp: .8, step: 12 }), P(rect(-pw / 2, -ph / 2, pw, ph), c, { amp: .8, step: 12 })], { after: txt(isGold ? '#5a2e14' : '#ffffff') }) }; }
  if (style === 'clothesline') { const pw = tw + size * .6;
    return { w: pw, h: ph, spr: sprite([P(rect(-pw / 2, 0, pw, ph), col, { amp: 1.2, step: 14 })], { after: gg => { gg.font = SUBFONT(size); gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.direction = 'rtl'; gg.fillStyle = st.ink; gg.fillText(w, 0, ph / 2 + 3); } }),
      pin: sprite([P(rect(-5, -14, 10, 30), '#c98a52', { amp: .4, step: 8 }), P(rect(-5, -2, 10, 3), '#8a5530', { detail: true, amp: .2 })]) }; }
  if (style === 'letters') {
    const letters = []; const lw = ch => Math.max(size * .56, ctx.measureText(ch).width + size * .3);
    const W_ = [...w].reduce((a, ch) => a + lw(ch) + 4, 0); let lx = W_ / 2;
    [...w].forEach((ch, j) => { const L_ = lw(ch); lx -= L_ / 2; const c2 = st.papers[(i + j + li) % st.papers.length];
      letters.push({ dx: lx, dy: rnd(-7, 7), rot: rnd(-.18, .18), spr: sprite([P(rect(-L_ / 2, -size * .6, L_, size * 1.2), c2, { amp: 1.1, step: 12 })],
        { after: gg => { gg.font = SUBFONT(size); gg.textAlign = 'center'; gg.textBaseline = 'middle'; gg.fillStyle = j % 3 === 1 ? st.accent : st.ink; gg.fillText(ch, 0, 3); } }) });
      lx -= L_ / 2 + 4; });
    return { w: W_, h: size * 1.2, letters };
  }
  const ink = style === 'ribbon' ? '#fff4dc' : style === 'torn' ? (s === 3 ? '#1d2f6b' : '#23408e') : st.ink;
  return { w: tw + size * .4, h: ph, spr: sprite([], { bb: { x: -tw / 2 - 10, y: -ph / 2, w: tw + 20, h: ph }, pad: 6, after: txt(ink) }) };
}
function buildSubs() {
  if (!window.LYRICS) return;
  LYRICS.forEach((lines6, s) => [...lines6, ...lines6.slice(3)].forEach((line, li) => {
    const sp = SUB_SPEC[s][li]; if (!sp) return;
    const start = L(s + 1, li + 1), end = L(s + 1, li + 2);
    const st = SUB_STYLE[s], words = line.split(' ').filter(w => w && !/^[-–:,.!]+$/.test(w));
    const base = sp.style === 'letters' ? 54 : 58, gap = 16;
    const W_ = words.map((w, i) => wordSprite(sp.style, w, Math.round(base * (sp.em?.[i] ?? (w.length <= 2 ? .72 : 1))), st, i, li, s, sp.gold));
    const total = W_.reduce((a, b) => a + b.w, 0) + gap * (W_.length - 1);
    const k = sp.world ? 1 : Math.min(1, 1160 / total);
    const [px, py] = Array.isArray(sp.pos[0]) ? [640, 360] : sp.pos;
    // פריסה: מימין לשמאל
    const pos = [];
    if (sp.lay === 'row') { let xr = px + total * k / 2; W_.forEach((o, i) => { pos.push([xr - o.w * k / 2, py + (i % 2 ? -5 : 4), 0]); xr -= (o.w + gap) * k; }); }
    else if (sp.lay === 'stack') { let y = py - W_.reduce((a, o) => a + o.h, 0) / 2; W_.forEach((o, i) => { pos.push([px + (i % 2 ? -22 : 18), y + o.h / 2, 0]); y += o.h * .98; }); }
    else if (sp.lay === 'diag') { let x = px, y = py; W_.forEach((o, i) => { if (i) { x -= (W_[i - 1].w / 2 + o.w / 2) * .72; y += Math.max(W_[i - 1].h, o.h) * .78; } pos.push([x, y, -.05]); }); }
    else if (sp.lay === 'arc') { const R = Math.max(total / 2.1, 260), span = total / R; let acc = 0;
      W_.forEach(o => { const th = span / 2 - (acc + o.w / 2) / R; acc += o.w + gap; pos.push([px + R * Math.sin(th), py + R - R * Math.cos(th), th]); }); }
    else pos.push(...sp.pos.map(p => [p[0], p[1], 0]));
    const span = (end - start) * .62;
    const out = { ...sp, start, end, st, k, total: total * k, cx: px, y: py, scene: SCENE_OF[s], words: W_.map((o, i) => ({ ...o, x: pos[i][0], y: pos[i][1], th: pos[i][2],
      rot: rnd(-.08, .08), at: (WORDT[s][li]?.[i] ?? start + i * SONG.BEAT * 2) - .08, dir: i % 2 ? 1 : -1, seed: SUBS.length * 17 + i })) };
    if (sp.style === 'ribbon') { const w2 = out.total + 70;
      out.band = sprite([P([[-w2 / 2, -46], [w2 / 2, -46], [w2 / 2 - 16, 0], [w2 / 2, 46], [-w2 / 2, 46], [-w2 / 2 + 16, 0]], st.accent, { amp: .9, step: 14 }),
        P([rect(-w2 / 2 + 14, -38, w2 - 28, 2.5), rect(-w2 / 2 + 14, 35, w2 - 28, 2.5)], 'rgba(255,255,255,.45)', { detail: true, amp: .3 })]);
      out.roll = sprite([P(rect(-11, -50, 22, 100), st.accent, { amp: .6 }), P(rect(-4, -50, 4, 100), 'rgba(0,0,0,.18)', { detail: true, amp: .3 })]); }
    if (sp.style === 'torn') { const w2 = out.total + 90, tp = [];
      for (let x = -w2 / 2; x <= w2 / 2; x += 18) tp.push([x, -52 + rnd(-5, 5)]);
      out.band = sprite([P([...tp, [w2 / 2, 50], [-w2 / 2, 50]], '#fdfbf2', { amp: 1, step: 16, torn: 3 }),
        P([-22, 0, 22].map(y => rect(-w2 / 2 + 6, y + 8, w2 - 12, 1.6)), '#a9c4e8', { detail: true, amp: .3, step: 30 }), P(rect(w2 / 2 - 50, -46, 2.5, 94), '#e38a8a', { detail: true, amp: .3 })]); }
    SUBS.push(out);
    if (!sp.world) {                                                    // תווי נגינה עולים מדי פעם
      const r = mulberry32(SUBS.length * 991), x0 = out.lay === 'row' ? px - out.total / 2 : px - 250, wd = out.lay === 'row' ? out.total : 500;
      const spawn = t => NOTES.push({ t, x: x0 + r() * wd, y: (py > 360 ? py - 40 : py + 60), spr: NOTE_SPR[Math.floor(r() * NOTE_SPR.length)], sway: r() * 6, dir: r() < .5 ? -1 : 1, s: 1.15 + r() * .55 });
      if (SUBS.length % 2 === 1) for (let n = 0; n < 3; n++) spawn(start + .1 + n * SONG.BEAT);
      for (let b = start + 2 * SONG.BEAT; b < end - 1; b += 4 * SONG.BEAT) if (r() < .45) spawn(b);
    }
  }));
}
// אנימציות כניסה/יציאה, פריים-פריים
const IN = {
  pop:    k => ({ sc: [.5, 1.15, .95][k], dy: [-34, -8, 2][k] }),
  drop:   k => ({ dy: [-170, -40, 6][k], rot: [.35, .08, 0][k] }),
  rise:   k => ({ dy: [110, 30, -5][k] }),
  slideR: k => ({ dx: [300, 80, -8][k] }),
  flip:   k => ({ sx: [-.5, .35, 1.05][k] }),
  spin:   k => ({ rot: [2.4, .7, -.1][k], sc: [.3, .9, 1.06][k] }),
  grow:   k => ({ sc: [.15, .45, .8, 1.06][k] }),
};
const OUT = {
  fall: k => ({ dy: (k + 1) * (k + 1) * 16, rot: (k + 1) * .28, dx: (k + 1) * 10 }),
  fly:  k => ({ dy: -(k + 1) * (k + 1) * 18, rot: -(k + 1) * .15, dx: (k + 1) * 6 }),
  sink: k => ({ dy: (k + 1) * 26 }),
  pop:  k => ({ sc: [1.12, .8, .5, .25, .08, 0][k] }),
};
function wordAnim(line, w, f) {
  const kin = f - appearF(w.at), kout = f - appearF(line.end - .3), jr = mulberry32(f * 97 + w.seed);
  if (kin < 0 || kout >= 6) return null;
  const a = { sc: 1, sx: 1, dx: (jr() - .5) * 2, dy: (jr() - .5) * 2, rot: w.rot + (jr() - .5) * .02, kin, kout };
  const fi = IN[line.inA] || IN.pop, n = line.inA === 'grow' ? 4 : 3;
  if (kin < n) { const q = fi(kin); a.sc *= q.sc ?? 1; a.sx *= q.sx ?? 1; a.dx += (q.dx ?? 0) * (w.dir < 0 ? 1 : .8); a.dy += q.dy ?? 0; a.rot += (q.rot ?? 0) * w.dir; }
  if (kout >= 0) { const q = (OUT[line.outA] || OUT.fall)(kout); a.sc *= q.sc ?? 1; a.dx += (q.dx ?? 0) * w.dir; a.dy += q.dy ?? 0; a.rot += (q.rot ?? 0) * w.dir; }
  if (line.drift) { const u = (f / FPS - w.at); a.dx += u * 55; a.dy += Math.sin(u * 2.4 + w.seed) * 12; }
  if (line.style === 'bubbles') a.dy += -Math.sin(f / FPS * 2.2 + w.seed) * 6;
  return a;
}
function drawLine(line, f) {
  const T = f / FPS, kout = f - appearF(line.end - .3), k = line.k;
  if (T < line.start - .2 || T > line.end + 1) return;
  if (line.style === 'ribbon' || line.style === 'torn') {
    if (kout >= 6) return;
    const lastAt = line.words[line.words.length - 1].at, prog = clamp((T - line.start) / Math.max(.4, lastAt + .4 - line.start), 0, 1);
    const q = kout >= 0 ? (OUT[line.outA] || OUT.fall)(kout) : {}, jr = mulberry32(f * 13 + (line.start * 10 | 0));
    ctx.save(); ctx.translate(line.cx + (jr() - .5) * 2, line.y + (q.dy ?? 0)); ctx.rotate(line.style === 'torn' ? -.025 : .01);
    if (line.style === 'ribbon') { const w2 = line.total + 70, edge = w2 / 2 - w2 * prog;
      ctx.save(); ctx.beginPath(); ctx.rect(edge, -80, w2, 160); ctx.clip(); place(line.band, 0, 0, 0, .9); ctx.restore(); if (prog < 1) place(line.roll, edge, 0, 0, .9); }
    else { const j = f - appearF(line.start); ctx.scale(1, j < 3 ? [.2, .7, 1.03][Math.max(0, j)] : 1); place(line.band, 0, 0, 0, .9); }
    ctx.restore();
  }
  if (line.style === 'clothesline' && kout < 6) {
    const x0 = line.cx - line.total / 2 - 50, x1 = line.cx + line.total / 2 + 50, yy = line.y - 60, show = clamp((f - appearF(line.start - .1)) / 3, 0, 1);
    if (show > 0) { ctx.save(); ctx.strokeStyle = '#6b4a2b'; ctx.lineWidth = 2.2; ctx.beginPath();
      for (let i = 0; i <= 20; i++) { const u = i / 20, x = x1 - (x1 - x0) * u * show, y = yy + 16 * Math.sin(Math.PI * u) + (kout >= 0 ? (kout + 1) * (kout + 1) * 14 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.restore(); }
  }
  for (const w of line.words) {
    const a = wordAnim(line, w, f); if (!a) continue;
    ctx.save();
    if (line.style === 'letters') {
      ctx.translate(w.x + a.dx, w.y + a.dy); ctx.rotate(w.th + (a.kout >= 0 ? a.rot : 0)); ctx.scale(k * a.sc, k * a.sc);
      w.letters.forEach((l, j) => { const kk = a.kin - j; if (kk < 0) return; const s2 = kk < 2 ? [.4, 1.15][kk] : 1;
        ctx.save(); ctx.translate(l.dx, l.dy); ctx.rotate(l.rot); ctx.scale(s2, s2); place(l.spr, 0, 0, 0, .8); ctx.restore(); });
    } else if (line.style === 'clothesline') {
      const u = (w.x - (line.cx - line.total / 2 - 50)) / (line.total + 100), py = line.y - 60 + 16 * Math.sin(Math.PI * (1 - u)) + (a.kout >= 0 ? (a.kout + 1) * (a.kout + 1) * 14 : 0);
      const sw = a.kin < 3 ? [-40, -10, 0][a.kin] : 0, swing = .22 * Math.exp(-a.kin / 6) * Math.sin(a.kin * 1.1);
      ctx.translate(w.x, py + sw); ctx.rotate(swing + w.rot * .4); ctx.scale(k, k); place(w.spr, 0, 0, 0, .9); place(w.pin, 0, 0, 0, .6);
    } else if (line.style === 'ribbon' || line.style === 'torn') {
      const q = a.kout >= 0 ? (OUT[line.outA] || OUT.fall)(a.kout) : {};
      ctx.translate(w.x + a.dx * .3, line.y + (q.dy ?? 0)); ctx.rotate(line.style === 'torn' ? -.025 : .01); ctx.scale(a.sc * k * Math.abs(a.sx), a.sc * k); place(w.spr, 0, 0, 0, 0);
    } else {
      const slap = line.style === 'stickers' && a.kin < 3 && line.inA !== 'spin' ? [1.7, .82, 1.06][a.kin] : 1;
      ctx.translate(w.x + a.dx, w.y + a.dy); ctx.rotate(w.th + a.rot); ctx.scale(a.sc * slap * k * Math.max(.05, Math.abs(a.sx)), a.sc * slap * k);
      place(w.spr, 0, 0, 0, .9);
      if (a.sx < 0) { ctx.fillStyle = 'rgba(255,250,235,.85)'; ctx.fillRect(-w.w / 2, -w.h / 2, w.w, w.h); }   // גב הנייר
    }
    ctx.restore();
  }
}
// שכבת כתוביות בתוך סצנה (מצוירת בין החלקים, ומושפעת מהמצלמה)
function subLayer(name) { const scId = SC.id; add({ at: 0, noShift: true, draw(cf) { for (const l of SUBS) if (l.world && l.layer === name && l.scene === scId) drawLine(l, cf); } }); }
function drawSubs(f) {
  const T = f / FPS;
  for (const line of SUBS) if (!line.world) drawLine(line, f);
  for (const n of NOTES) {
    const u = (T - n.t) / 2.4; if (u < 0 || u > 1) continue;
    const x = n.x + Math.sin(u * 6 + n.sway) * 16 * n.dir, y = n.y - u * 230, al = u < .8 ? 1 : (1 - u) * 5;
    ctx.save(); ctx.globalAlpha = al; ctx.translate(x, y); ctx.rotate(Math.sin(u * 7 + n.sway) * .3); ctx.scale(n.s * (u < .06 ? .5 : 1), n.s); place(n.spr, 0, 0, 0, .7); ctx.restore();
  }
}

// ============================================================
//  ניגון עם השיר (קובץ מהמכשיר) או בלי קול
// ============================================================
const msg = document.getElementById('msg'), btnPlay = document.getElementById('play');
const audio = new Audio(); audio.preload = 'auto';
let audioReady = false, playing = false, t0 = 0, pausedAt = 0, last = -1;
const nowT = () => audioReady ? audio.currentTime : (playing ? (performance.now() - t0) / 1000 : pausedAt);
function tick() {
  let T = nowT();
  if (T >= SONG.END && !audioReady) { t0 = performance.now(); T = 0; }
  const f = Math.floor(Math.min(T, SONG.END) * FPS);
  if (f !== last) { last = f; render(f); }
  requestAnimationFrame(tick);
}
btnPlay.onclick = () => {
  if (audioReady) { if (audio.paused) audio.play().catch(() => {}); else audio.pause(); btnPlay.textContent = audio.paused ? '▶ נגן' : '⏸ השהה'; return; }
  if (playing) { pausedAt = nowT(); playing = false; btnPlay.textContent = '▶ נגן'; }
  else { t0 = performance.now() - pausedAt * 1000; playing = true; btnPlay.textContent = '⏸ השהה'; }
};
document.getElementById('restart').onclick = () => {
  if (audioReady) { audio.currentTime = 0; audio.play().catch(() => {}); btnPlay.textContent = '⏸ השהה'; }
  else { pausedAt = 0; t0 = performance.now(); playing = true; btnPlay.textContent = '⏸ השהה'; }
};
document.getElementById('song').onchange = async e => {
  const file = e.target.files[0]; if (!file) return;
  audio.src = URL.createObjectURL(file);
  try { await new Promise((res, rej) => { audio.onloadedmetadata = res; audio.onerror = rej; }); }
  catch { msg.textContent = 'לא הצלחתי לקרוא את הקובץ. נסו MP3 או M4A.'; return; }
  audioReady = true; playing = false; audio.currentTime = 0;
  audio.play().then(() => { btnPlay.textContent = '⏸ השהה'; }).catch(() => { btnPlay.textContent = '▶ נגן'; });
  msg.textContent = 'השיר נטען. האנימציה מסונכרנת לשיר.';
};

Promise.race([Promise.all([document.fonts.load('84px "Secular One"'), document.fonts.load('28px Rubik'), document.fonts.load('60px Discovery')]).catch(() => {}), new Promise(r => setTimeout(r, 2000))]).then(() => {
  buildAll(); SHOTS = SHOTS_DEF(); buildSubs();
  window.renderFrame = f => { render(f); return cv.toDataURL('image/jpeg', .92); };
  const fz = new URLSearchParams(location.search).get('frame');
  if (fz !== null) { render(+fz); window.__ready = true; return; }
  window.__ready = true;
  requestAnimationFrame(tick);
});
