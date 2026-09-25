
// ============================================================
//  תזמון לפי השיר (ניתוח של ההקלטה): 4 בתים × 6 שורות, ~103 פעימות לדקה
// ============================================================
// זמני תחילת השורות (מתמלול מתוזמן, מאומת מול ניתוח הפעימות). כל בית: 3 שורות, ואז 3 שורות פעמיים
const LINES = [
  [21.90, 25.56, 29.08, 35.64, 39.24, 42.52, 49.40, 52.40, 56.60, 63.90],
  [63.90, 67.50, 70.96, 77.50, 80.92, 85.36, 92.04, 95.00, 99.32, 105.91],
  [105.91, 109.81, 113.37, 119.95, 123.11, 127.25, 133.95, 137.67, 141.23, 148.25],
  [148.25, 151.47, 155.67, 162.57, 166.21, 169.65, 176.55, 180.43, 183.71, 190.40],
];
const SONG = { S: LINES.map(l => l[0]), BEAT: 0.58495, MUSIC_END: 196.4, END: 198.5 };
const L = (s, i, f = 0) => { const a = LINES[s - 1][i - 1], b = LINES[s - 1][i]; return f ? a + f * (b - a) : a; };   // בית s, שורה i (1..9)
const snap = t => SONG.S[0] + Math.round((t - SONG.S[0]) / SONG.BEAT) * SONG.BEAT;    // לפעימה הקרובה
const beatPh = t => ((((t - SONG.S[0]) / SONG.BEAT) % 1) + 1) % 1;
const beatN = t => Math.floor((t - SONG.S[0]) / SONG.BEAT);

// ============================================================
//  מנוע סצנות: כל סצנה מצוירת לקנבס משלה, ומעברים מרכיבים ביניהן
// ============================================================
const appearF = at => Math.round(at * FPS);
let SC = null, TSHIFT = 0, PID = 0, STRETCH = 1;
const SCENES = [];
function scene(id, from, bg = '#2a1d12') {
  const c = document.createElement('canvas'); c.width = W * DPR; c.height = H * DPR;
  SC = { id, from, bg, cam: [[0, 1, 640, 360], [999, 1, 640, 360]], pieces: [], canvas: c, g: c.getContext('2d'), shake: () => 1, stretch: null };
  SCENES.push(SC); return SC;
}
function add(o) {
  o.id = PID++; o.scene = SC;
  if (o.jit === undefined) o.jit = 1;
  if (o.depth === undefined) o.depth = 1;
  if (o.rot0 === undefined) o.rot0 = rnd(-0.008, 0.008);
  if (o.k === undefined) o.k = 1;
  if (!o.noShift) { o.at = (o.at || 0) + TSHIFT; if (o.until !== undefined) o.until += TSHIFT; }
  SC.pieces.push(o); return o;
}
function piece(paths, o) {
  const spr = sprite(paths, o);
  const bb = bboxOf(paths.flatMap(p => p.polys));
  return add(Object.assign({ spr, px: bb.x + bb.w / 2, py: bb.y + bb.h / 2, anim: 'none', at: 0 }, o, { bbw: bb }));
}
function applyStretch() { if (STRETCH !== 1) { ctx.translate(520, 0); ctx.scale(STRETCH, 1); ctx.translate(-520, 0); } }
function camAt(sc, T) {
  const K = sc.cam; let i = 0;
  while (i < K.length - 2 && T >= K[i + 1][0]) i++;
  const a = K[i], b = K[i + 1], l = clamp((T - a[0]) / (b[0] - a[0]), 0, 1), e = .5 - .5 * Math.cos(Math.PI * l);
  const X = v => typeof v === 'function' ? v(T) : v;
  const z = a[1] + (b[1] - a[1]) * e;
  let x = X(a[2]) + (X(b[2]) - X(a[2])) * e, y = a[3] + (b[3] - a[3]) * e;
  x = clamp(x, 640 / z, W - 640 / z); y = clamp(y, 360 / z, H - 360 / z);
  return { z, x, y };
}
function applyCam(c, k) {
  const zk = 1 + (c.z - 1) * k;
  ctx.translate(640, 360); ctx.scale(zk, zk); ctx.translate(-(640 + (c.x - 640) * k), -(360 + (c.y - 360) * k));
  shK = DPR * zk;
}

// ============================================================
//  דמויות: בובות נייר
// ============================================================
function posePlus(name, walk, ph, T) {
  const bp = beatPh(T) < .5 ? 0 : 1, bn = beatN(T) % 2;
  const extra = {
    finger: { aL: .14, aR: -2.75 },
    sniff: { aL: .9, aR: -.9, tilt: -.12 },
    wave: { aL: .14, aR: bn ? -2.3 : -2.8 },
    sit: { aL: .5, aR: -.5 },
  }[name];
  if (extra) return Object.assign({ lL: 0, lR: 0, bob: 0 }, extra);
  const q = pose(name, walk, name === 'hammer' ? bp : name === 'cheer' ? bn : ph);
  return q;
}
function kid(k, y, segs, sc = 1) {
  k.segs = segs;
  add({ at: segs[0].from, noShift: true, draw(cf, bf) {
    const T = cf / FPS, { seg, x } = segX(segs, T);
    if (!seg) return;
    const q = posePlus(seg.pose, seg.walk, (cf + (seg.phase || 0)) % 2, T + (seg.phase || 0) * SONG.BEAT);
    const jr = mulberry32(bf * 131 + k.o.seed), J = () => jr() - .5, s = (seg.scale || sc) * k.o.scale;
    ctx.save();
    ctx.translate(x + J() * 2.4, (seg.y || y) + q.bob + J() * 2.4); ctx.scale(s, s);
    if (seg.pop !== undefined) { const kk = cf - appearF(seg.from); if (kk < 3) ctx.scale(1, [.4, 1.12, .96][kk]); }
    place(k.hairBack, 0, -150, J() * .03);
    place(k.legL, -9, -72, q.lL + J() * .04);
    place(k.legR, 9, -72, q.lR + J() * .04);
    place(k.body, 0, 0, J() * .015);
    if (q.prop === 'planks') place(k.planks, 0, 0, J() * .02);
    place(k[q.armL || 'arm'], -24, -146, q.aL + J() * .05);
    place(k.arm, 24, -146, q.aR + J() * .05);
    place(k.head, 0, -150, J() * .05 + (q.tilt || 0));
    if (q.prop === 'branch' || q.prop === 'chain') place(k[q.prop], 0, 0, J() * .02);
    ctx.restore();
  } });
}
// אנשים קטנים לקהל השכנים
function makePerson(seed, top, skin, hair) {
  const r = mulberry32(seed), tall = .9 + r() * .25;
  return sprite([P([rect(-10, -52 * tall, 8, 52 * tall), rect(2, -52 * tall, 8, 52 * tall)], '#3d4f6b', { amp: .6, step: 10 }),
    P([[-18, -112 * tall], [18, -112 * tall], [26, -48 * tall], [-26, -48 * tall]], top, { amp: .8, step: 12 }),
    P(ell(0, -132 * tall, 19), skin, { amp: .7 }), P([[-19, -134 * tall], [0, -156 * tall], [19, -134 * tall], [12, -142 * tall], [-12, -142 * tall]], hair, { amp: .6, step: 8 }),
    P([ell(-6, -132 * tall, 2, 2.6, 0, 6), ell(6, -132 * tall, 2, 2.6, 0, 6)], '#2b1d14', { detail: true, amp: .1 }),
    P(ell(0, -124 * tall, 5, 2, 0, 8), '#a8323a', { detail: true, amp: .1 })]);
}
function crowdMember(spr, x, y, at, sc = 1, cheerAt = 1e9) {
  add({ at, noShift: true, spr, draw(cf, bf) {
    const T = cf / FPS, kk = cf - appearF(at), jr = mulberry32(bf * 53 + x | 0);
    const s = sc * (kk < 3 ? [.4, 1.12, .96][kk] : 1), bob = T > cheerAt && beatN(T) % 2 ? -6 : 0;
    ctx.save(); ctx.translate(x + (jr() - .5) * 2, y + bob + (jr() - .5) * 2); ctx.scale(sc, s);
    place(spr, 0, 0, (jr() - .5) * .04, .8); ctx.restore();
  } });
}

// ============================================================
//  חלקי סוכה (בקואורדינטות של הסוכה, מוזזת 120 שמאלה)
// ============================================================
const SHIFT = -120;
const sk = (paths, o) => piece(paths, Object.assign({ shift: SHIFT }, o));
const rollSpr = (w, col) => sprite([P(rect(-w / 2 - 4, -8, w + 8, 16), col, { amp: .8 }), P(rect(-w / 2, -5, w, 3), 'rgba(255,255,255,.4)', { detail: true, amp: .3 })]);
function post(x, y, w, h, at, anim = 'rise', o = {}) {
  const grain = [];
  for (let i = 0; i < 4; i++) { const gx = x + w * rnd(.45, .85), gy = y + rnd(20, h - 90); grain.push(rect(gx, gy, 1.3, rnd(30, 70))); }
  sk([P(rect(x, y, w, h), C.wood), P(rect(x + w * .25, y + 8, w * .18, h - 16), C.woodL, { detail: true, amp: .6 }),
      P(grain, '#7a4826', { detail: true, amp: .3, step: 20 }), P([ell(x + w / 2, y + 12, 2.6, 2.6, 0, 6)], '#6b6f75', { detail: true, amp: .2 })],
     Object.assign({ at, anim, base: y + h, px: x + w / 2, py: y + h }, o));
}
function sideWall(xf, xb, at, anim = 'unroll', o = {}) {
  const ty = x => 308 + (x - xf) / (xb - xf) * (274 - 308), by = x => 640 + (x - xf) / (xb - xf) * (580 - 640);
  const s1 = xf + (xb - xf) * .15, s2 = xf + (xb - xf) * .28;
  const s = sk([P([[xf, ty(xf)], [xb, ty(xb)], [xb, by(xb)], [xf, by(xf)]], C.wallS),
                P([[s1, ty(s1)], [s2, ty(s2)], [s2, by(s2)], [s1, by(s1)]], C.blue, { detail: true, amp: .6 })], Object.assign({ at, anim }, o));
  s.roll = rollSpr(Math.abs(xb - xf), '#d3bf94');
}
function hanging(hx, len, at, paths, o = {}) {
  sk([P(rect(hx - .8, 312, 1.6, len + 2), '#6b4a2b', { raw: true, edge: false }), ...paths], Object.assign({ at, anim: 'drop', swing: true, px: hx, py: 312, pad: 14 }, o));
}
// t = זמני הופעה; st = true לסוכה גמורה (בלי הנפשות, נמתחת)
function sukkah(t, st) {
  const A = (name, def) => st ? 'none' : def, o = st ? { stretch: true } : {};
  const planks = [];
  for (let i = 1; i < 6; i++) { const xf = 404 + i * 472 / 6, xb = 470 + i * 340 / 6; planks.push([[xb - 1, 581], [xb + 1, 581], [xf + 1.5, 639], [xf - 1.5, 639]]); }
  sk([P([[404, 640], [470, 580], [810, 580], [876, 640]], '#d9a766'), P(rect(394, 638, 492, 14), '#b9864c'), P(planks, '#b9864c', { detail: true, amp: .4 })],
     Object.assign({ at: t.floor, anim: A('f', 'pop') }, o));
  const bw = sk([P(rect(488, 274, 304, 306), C.wall), P(rect(500, 274, 9, 306), C.blue, { detail: true, amp: .8 }), P(rect(771, 274, 9, 306), C.blue, { detail: true, amp: .8 }),
     P(rect(488, 540, 304, 11), C.red, { detail: true, amp: .8 }), P(rect(488, 286, 304, 7), C.blue, { detail: true, amp: .8 })], Object.assign({ at: t.wallB, anim: A('w', 'unroll') }, o));
  bw.roll = rollSpr(304, '#e6d6b0');
  post(470, 268, 18, 312, t.postB1, A('p', 'rise'), o); post(792, 268, 18, 312, t.postB2, A('p', 'rise'), o);
  sk([P(rect(460, 258, 360, 16), C.wood), P(rect(470, 262, 340, 3), C.woodL, { detail: true, amp: .5 })], Object.assign({ at: t.beamB, anim: A('b', 'drop') }, o));
  sideWall(404, 470, t.wallL, A('w', 'unroll'), o); sideWall(876, 810, t.wallR, A('w', 'unroll'), o);
  if (t.inside) t.inside();
  post(378, 296, 26, 344, t.postF1, A('p', 'rise'), o); post(876, 296, 26, 344, t.postF2, A('p', 'rise'), o);
  sk([P([[380, 296], [470, 262], [478, 272], [396, 308]], C.wood, { amp: .8 })], Object.assign({ at: t.beamS, anim: A('b', 'drop') }, o));
  sk([P([[900, 296], [810, 262], [802, 272], [884, 308]], C.wood, { amp: .8 })], Object.assign({ at: t.beamS + .3, anim: A('b', 'drop'), spinDir: -1 }, o));
  sk([P(rect(366, 288, 548, 24), C.wood), P(rect(378, 294, 524, 4), C.woodL, { detail: true, amp: .6 })], Object.assign({ at: t.beamF, anim: A('b', 'drop'), spinDir: -1, dist: 220 }, o));
  lights(t.lights, t.lit, st);
  const cols = ['#4f9d3a', '#5fb043', '#3f8a34', '#74b94a', '#6aa840', '#9aae45', '#58a63e', '#46913a', '#80bd52', '#4f9d3a', '#5fb043', '#3f8a34'];
  [[430, 282, 260], [820, 280, 270], [560, 268, 300], [700, 272, 290], [470, 262, 240], [790, 258, 250],
   [640, 286, 330], [520, 290, 230], [760, 292, 230], [600, 262, 260], [680, 290, 250], [450, 294, 200]]
    .forEach(([x, y, len], i) => sk(frondPaths(x, y, len, rnd(-.14, .14), cols[i]),
      Object.assign({ at: t.fronds[i] ?? t.fronds[t.fronds.length - 1], anim: A('d', 'drop'), spinDir: i % 2 ? 1 : -1 }, o)));
  if (t.banner !== undefined) banner(t.banner, st);
}
// שרשרת נורות על הקורה הקדמית (נדלקות בזמן lit)
function lights(at, litAt, st) {
  const N = 17, bulbs = [];
  for (let i = 0; i < N; i++) { const x = 400 + i * 480 / (N - 1); bulbs.push([x, 318 + 22 * (1 - Math.pow((x - 640) / 240, 2))]); }
  const COL = ['#ffd24a', '#ff8a3d', '#ff5a5f', '#7fd46b', '#6ab8ff'];
  const wire = sprite([P(bulbs.map(([x, y]) => [x, y - 1]).concat([...bulbs].reverse().map(([x, y]) => [x, y + 1.4])), '#3a2a1c', { raw: true, edge: false })], { pad: 4 });
  const off = COL.map(c => sprite([P(ell(0, 5, 5, 7), c, { amp: .3 }), P(rect(-3, -4, 6, 4), '#6b6f75', { amp: .2 })], { pad: 4 }));
  const glow = c => { const g = document.createElement('canvas'); g.width = g.height = 96; const x = g.getContext('2d');
    const gr = x.createRadialGradient(48, 48, 2, 48, 48, 46); gr.addColorStop(0, c); gr.addColorStop(.35, c + '88'); gr.addColorStop(1, c + '00');
    x.fillStyle = gr; x.fillRect(0, 0, 96, 96); return g; };
  const GL = COL.map(glow);
  add({ at, noShift: true, draw(cf, bf) {
    const T = cf / FPS, lit = T >= litAt, kk = cf - appearF(at);
    ctx.save(); if (st) applyStretch(); ctx.translate(SHIFT, 0);
    if (kk < 3) { ctx.translate(0, [-40, -8, 2][kk]); }
    place(wire, 0, 0, 0, .4);
    bulbs.forEach(([x, y], i) => {
      const c = i % COL.length, tw = lit && (i + beatN(T)) % 3 === 0;
      if (lit) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = tw ? .55 : .9;
        ctx.drawImage(GL[c], x - (tw ? 22 : 30), y + 5 - (tw ? 22 : 30), tw ? 44 : 60, tw ? 44 : 60); ctx.restore(); }
      ctx.save(); if (!lit) ctx.filter = 'brightness(0.6) saturate(0.6)';
      place(off[c], x, y, (mulberry32(bf * 7 + i)() - .5) * .2, .4); ctx.restore();
    });
    ctx.restore();
  } });
}
// באנר "סוכת שלום" על הקורה הקדמית
function banner(at, st) {
  const ribbon = sprite([P([[450, 346], [830, 346], [820, 372], [830, 398], [450, 398], [460, 372]], '#d9483b', { amp: .8 }),
                          P([rect(460, 352, 360, 2.5), rect(460, 391, 360, 2.5)], '#f4a08f', { detail: true, amp: .3 })]);
  const rp = add({ spr: ribbon, px: 640, py: 372, at, noShift: true, anim: st ? 'none' : 'unrollX', n: 4, shift: SHIFT, stretch: st, bbw: { h: 0 } });
  rp.roll = sprite([P(rect(-8, -30, 16, 60), '#b83a2e', { amp: .6 })]);
  layoutLine('סוכת שלום', 44, 3).forEach(({ ch, x }, i) => {
    const xx = x - 640 + 520 + 120, s = letterSprites(ch, xx, 373, 44, '#fff4dc', null);
    add({ spr: s.front, back: s.back, px: xx, py: 373, at: st ? at : at + .5 + i * .1, noShift: true, anim: st ? 'none' : 'flip', n: 3,
          shift: SHIFT, stretch: st, rot0: rnd(-.06, .06), depth: .6, jit: .7, bbw: { h: 0 } });
  });
}
// יונת נייר עם ענף זית
const DOVE = (() => {
  const body = open => sprite([
    P([[-34, 0], [-10, -12], [18, -10], [34, -2], [18, 8], [-8, 10]], '#fbf8f0', { amp: .6, step: 8 }),
    P(ell(26, -8, 9, 8), '#fbf8f0', { amp: .5 }), P([[34, -8], [44, -5], [34, -3]], '#f2b134', { amp: .3, step: 6 }),
    P(ell(28, -10, 1.6, 1.6, 0, 6), '#2b1d14', { detail: true, amp: .1 }),
    P(open ? [[-6, -6], [8, -44], [16, -36], [10, -4]] : [[-6, -2], [10, 26], [18, 20], [10, 0]], '#e9e4d6', { amp: .5, step: 8 }),
    P([[-34, 0], [-50, -10], [-48, 8]], '#e9e4d6', { amp: .4, step: 8 }),
    P([rect(40, -6, 16, 2)], '#5a8f2e', { amp: .2 }), P([ell(50, -10, 5, 2.4, -.5), ell(54, -2, 5, 2.4, .5)], '#6aa840', { detail: true, amp: .2 })]);
  return [body(true), body(false)];
})();
function dove(t0, t1, x0, y0, x1, y1, perchUntil = 1e9, hop = 60) {
  add({ at: t0, noShift: true, draw(cf, bf) {
    const T = cf / FPS; if (T > perchUntil) return;
    const l = clamp((T - t0) / (t1 - t0), 0, 1), x = x0 + (x1 - x0) * l, y = y0 + (y1 - y0) * l - Math.sin(Math.PI * l) * hop;
    const flying = l < 1, spr = flying ? DOVE[bf % 2] : DOVE[1];
    ctx.save(); ctx.translate(x, y); if (x1 < x0) ctx.scale(-1, 1); place(spr, 0, 0, flying ? (mulberry32(bf)() - .5) * .15 : 0, .6); ctx.restore();
  } });
}
// כוכב נוצץ וניצוצות
const STAR = sprite([P((() => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 22 : 54; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; })(), '#ffd84a', { amp: .8, step: 10 }),
                     P((() => { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 11 : 28; p.push([Math.cos(a) * r, Math.sin(a) * r]); } return p; })(), '#fff6c8', { detail: true, amp: .4, step: 8 })]);
const SPARK = sprite([P([[0, -22], [5, -5], [22, 0], [5, 5], [0, 22], [-5, 5], [-22, 0], [-5, -5]], '#fffbe6', { amp: .4, step: 8 })]);
function sparkle(x, y, at, until, s = 1, spin = true) {
  add({ at, until, noShift: true, draw(cf, bf) {
    const kk = cf - appearF(at), sc = s * (kk < 3 ? [.3, 1.3, .9][kk] : (bf % 3 === 0 ? .75 : 1));
    ctx.save(); ctx.translate(x, y); ctx.rotate(spin ? bf * .3 : 0); ctx.scale(sc, sc); ctx.globalCompositeOperation = 'lighter'; place(SPARK, 0, 0, 0, 0); ctx.restore();
  } });
}
// לולב, הדסים, ערבה
function lulavPaths(x, yb, h) {
  const leaves = [];
  for (let i = 0; i < 7; i++) { const dx = (i - 3) * 3.2; leaves.push([[x + dx - 2.5, yb], [x + dx * 2.2 + rnd(-3, 3), yb - h + rnd(-10, 10)], [x + dx + 2.5, yb]]); }
  return [P(leaves, '#8fb04a', { amp: .5, step: 14 }), P(rect(x - 3, yb - h + 40, 6, h - 40), '#6f8f35', { detail: true, amp: .4, step: 20 })];
}
function sprigPaths(x, yb, h, lean, leafCol, leaf) {
  const stem = [[x - 1.5, yb], [x + lean - 1, yb - h], [x + lean + 1, yb - h], [x + 1.5, yb]], L = [];
  for (let u = .15; u < .95; u += leaf === 'myrtle' ? .09 : .12) {
    const cx = x + lean * u, cy = yb - h * u;
    if (leaf === 'myrtle') { L.push(ell(cx - 6, cy, 6.5, 3.6, -.4), ell(cx + 6, cy, 6.5, 3.6, .4), ell(cx, cy - 5, 6, 3.4, 1.4)); }
    else { L.push(ell(cx - 12, cy + 6, 16, 2.6, -1.1), ell(cx + 12, cy + 6, 16, 2.6, 1.1)); }
  }
  return [P(stem, '#6b4a2b', { amp: .3, step: 20 }), P(L, leafCol, { amp: .4, step: 8 })];
}
