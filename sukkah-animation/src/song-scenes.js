
// ============================================================
//  הדמויות
// ============================================================
function buildAll() {
const shlomit = makeKid({ seed: 1, scale: 1, skin: '#f3c29b', hairCol: '#6b3a1f', hair: 'braids', bow: '#e3343f', dress: true, top: '#ef6a36', legs: '#f3c29b', shoe: '#3a2a4a' });
const boy = makeKid({ seed: 2, scale: .95, skin: '#e8b48a', hairCol: '#2d1f16', hair: 'short', kippah: '#2f6db5', top: '#f2b134', stripe: '#2f86d6', legs: '#3d4f6b', shoe: '#6b3a1f' });
const girl = makeKid({ seed: 3, scale: .92, skin: '#f6d0ae', hairCol: '#d99a2b', hair: 'pony', bow: '#8e55b8', dress: true, top: '#6dbb4c', legs: '#f6d0ae', shoe: '#b0303a' });
const mom = makeKid({ seed: 4, scale: 1.22, skin: '#e9b98f', hairCol: '#3a2418', hair: 'pony', bow: '#2f86d6', dress: true, top: '#8e55b8', legs: '#e9b98f', shoe: '#2b2b3a' });
const dad = makeKid({ seed: 5, scale: 1.3, skin: '#d9a47c', hairCol: '#2a1c14', hair: 'short', kippah: '#fffaf0', top: '#fffaf0', stripe: '#9fc2e8', legs: '#4a4a58', shoe: '#2b2b3a' });
const people = [['#e3343f', '#f3c29b', '#2d1f16'], ['#2f86d6', '#e0a878', '#6b3a1f'], ['#f2b134', '#f6d0ae', '#d99a2b'], ['#4caf50', '#c98a60', '#1e1410'],
  ['#ef7a36', '#f3c29b', '#3a2418'], ['#8e55b8', '#e9b98f', '#6b3a1f'], ['#1f9e9e', '#f6d0ae', '#2d1f16'], ['#d9483b', '#d9a47c', '#b9b0a0'],
  ['#6ab8ff', '#f3c29b', '#6b3a1f'], ['#e8612f', '#e0a878', '#2a1c14']].map(([t, s, h], i) => makePerson(900 + i, t, s, h));

// ============================================================
//  סצנה 0: כרטיס פתיחה (0:00–0:08)
// ============================================================
scene('title', 0); TSHIFT = 0;
{
  const dashes = [];
  for (let x = 40; x < W - 50; x += 26) dashes.push(rect(x, 30, 14, 4), rect(x + 6, H - 34, 14, 4));
  for (let y = 44; y < H - 50; y += 26) dashes.push(rect(30, y, 4, 14), rect(W - 34, y + 6, 4, 14));
  piece([P(rect(0, 0, W, H), '#c9a071', { raw: true, edge: false }), P(dashes, '#f4e6c8', { detail: true, amp: .4, step: 8 })], { depth: 0, jit: 0, rot0: 0 });
}
[[170, 120, 320, -.55, [-420, -260], .2], [1110, 120, 320, .55, [420, -260], .5], [150, 610, 300, .5, [-420, 260], .8], [1130, 610, 300, -.5, [420, 260], 1.1]]
  .forEach(([x, y, len, ang, from, at], i) => piece(frondPaths(x, y, len, ang, ['#4f9d3a', '#5fb043', '#3f8a34', '#74b94a'][i]), { at, anim: 'tumble', n: 5, from, turns: i % 2 ? -.6 : .6 }));
piece([P(ell(300, 600, 34), '#c62839', { amp: 1.2 }), P([[286, 570], [292, 556], [298, 568], [304, 554], [310, 568], [316, 558], [316, 574], [286, 574]], '#9e1b2b', { detail: true, amp: .5, step: 8 }),
       P(ell(290, 590, 9, 13, .5), '#ef6a78', { detail: true, amp: .4 })], { at: 3.4, anim: 'drop', n: 3, dist: 260, spin: .6 });
piece([P(ell(985, 598, 26, 36, .5), '#f2d024', { amp: 1.8, step: 8 }), P(rect(1000, 560, 6, 14), '#5a8f2e', { detail: true, amp: .4 }),
       P(ell(1012, 560, 16, 7, -.4), '#4caf50', { detail: true, amp: .6 })], { at: 3.7, anim: 'drop', n: 3, dist: 260, spin: -.6 });
function star5(cx, cy, r, col) { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return [P(p, col, { amp: .6, step: 8 })]; }
[[330, 140, 22, '#f2b134', 4.0], [955, 150, 18, '#fffaf0', 4.3], [230, 330, 14, '#fffaf0', 4.6], [1060, 320, 20, '#f2b134', 4.9], [640, 560, 16, '#fffaf0', 5.2]]
  .forEach(([x, y, r, c, at]) => piece(star5(x, y, r, c), { at, anim: 'pop', rot0: rnd(-.4, .4) }));
piece([P([[250, 392], [345, 392], [345, 492], [250, 492], [282, 442]], '#a8322a'), P([[1030, 392], [935, 392], [935, 492], [1030, 492], [998, 442]], '#a8322a')], { at: 2.2, anim: 'pop' });
{
  const band = piece([P(rect(330, 370, 620, 104), '#d9483b'), P([rect(330, 380, 620, 3), rect(330, 461, 620, 3)], '#f4a08f', { detail: true, amp: .5 })], { at: 1.8, anim: 'unrollX', n: 4 });
  band.roll = sprite([P(rect(-12, -58, 24, 116), '#b83a2e', { amp: .8 }), P(rect(-5, -58, 4, 116), 'rgba(255,255,255,.35)', { detail: true, amp: .3 })]);
}
layoutLine('שלומית', 150, 6).forEach(({ ch, x }, i) => {
  const s = letterSprites(ch, x, 250, 150, PAPER[i % PAPER.length], '#fffaf0');
  add({ spr: s.front, back: s.back, px: x, py: 250, at: .6 + i * SONG.BEAT / 2, anim: 'flip', n: 3, rot0: rnd(-.09, .09), jit: .9, bbw: { h: 0 } });
});
layoutLine('בונה סוכה', 84, 4).forEach(({ ch, x }, i) => {
  const s = letterSprites(ch, x, 420, 84, '#fff4dc', null);
  add({ spr: s.front, px: x, py: 420, at: 2.3 + i * .09, anim: 'roll', n: 5, from: [560, 0], radius: 42, rot0: rnd(-.07, .07), depth: .8, jit: .8, bbw: { h: 0 } });
});
{ // קרדיט
  const rb = sprite([P([[470, 548], [810, 548], [796, 574], [810, 600], [470, 600], [484, 574]], '#fff4dc', { amp: .8 })],
    { after: g => { g.font = font(28); g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl'; g.fillStyle = '#7a4826'; g.fillText('מילים ולחן: נעמי שמר', 640, 575); } });
  add({ spr: rb, px: 640, py: 574, at: 5.0, anim: 'slide', from: [0, 160], rot0: .01, bbw: { h: 0 } });
}

// ============================================================
//  סצנה 1: בונים את הסוכה (0:07–1:05) — בית ראשון
// ============================================================
scene('build', 7.0);
TSHIFT = 3.0; landscape(); TSHIFT = 0;
{ // שלט "כאן תהיה סוכה!"
  const sg = sprite([P(rect(513, 520, 14, 104), C.woodD, { amp: .8 }), P(rect(398, 462, 244, 76), C.woodL, { amp: 1.2 }),
                     P([ell(410, 474, 3.5, 3.5, 0, 6), ell(630, 474, 3.5, 3.5, 0, 6)], '#6b6f75', { detail: true, amp: .2 })],
    { after: g => { g.font = font(34); g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl'; sh(g, 1.5, .8, 1, 'rgba(40,24,10,.35)');
                    g.fillStyle = '#5a2e14'; g.fillText('כאן תהיה סוכה!', 520, 502); sh(g, 0, 0, 0, 'rgba(0,0,0,0)'); } });
  add({ spr: sg, px: 520, py: 624, at: 11.0, until: 20.6, exit: 'fall', anim: 'rise', base: 628, bbw: { h: 170 } });
}
const B1 = i => snap(L(1, i));
sukkah({
  floor: snap(L(1, 1, .05)), postB1: snap(L(1, 1, .3)), postB2: snap(L(1, 1, .55)), beamB: snap(L(1, 1, .8)),
  postF1: snap(L(1, 2, .05)), postF2: snap(L(1, 2, .3)), beamS: snap(L(1, 2, .55)), beamF: snap(L(1, 2, .8)),
  wallB: snap(L(1, 3, .05)), wallL: snap(L(1, 3, .4)), wallR: snap(L(1, 3, .7)),
  lights: snap(L(1, 2, .95)), lit: B1(5),
  fronds: [...Array(9)].map((_, i) => snap(L(1, 4, .05) + i * 2 * SONG.BEAT)).concat([snap(L(1, 5, .2)), snap(L(1, 5, .4)), snap(L(1, 5, .6))]),
  banner: snap(L(1, 6, .05)),
});
piece([P(rect(1000, 652, 128, 11), C.wood), P(rect(1008, 641, 118, 11), C.woodL), P(rect(996, 663, 134, 11), C.woodD),
       P([rect(1020, 656, 40, 1.3), rect(1070, 645, 36, 1.3), rect(1030, 667, 50, 1.3)], '#6a3c1e', { detail: true, amp: .2, step: 20 })],
      { at: 19.3, until: L(1, 4), exit: 'fall', anim: 'tumble', from: [60, -140], turns: .5 });
piece([P([[1150, 636], [1224, 636], [1224, 628], [1150, 628]], '#b9bec4', { amp: .5, step: 10 }),
       P([[1160, 630], [1236, 612], [1238, 620], [1162, 636]], '#aeb4ba', { amp: .4, step: 8 }), P(rect(1226, 606, 18, 12), C.woodL, { amp: .4 }),
       P(rect(1144, 638, 88, 34), '#c8453a', { amp: .8, step: 12 }), P(rect(1144, 646, 88, 4), '#e8735f', { detail: true, amp: .3 }),
       P([rect(1176, 624, 24, 5), rect(1174, 624, 5, 16), rect(1197, 624, 5, 16)], '#3a3a44', { amp: .3 })], { at: 19.7, anim: 'drop', dist: 200, spin: -.4 });
subLayer('stage');
kid(shlomit, 670, [
  { from: 13.4, to: 19.2, pose: 'carry', walk: true, x0: 1420, x1: 860 },
  { from: 19.2, to: 21.0, pose: 'stand', x0: 860 },
  { from: 21.0, to: 22.1, pose: 'present' },
  { from: 22.1, to: L(1, 4), pose: 'hammer' },
  { from: L(1, 4), to: L(1, 5, .7), pose: 'lift' },
  { from: L(1, 5, .7), to: L(1, 6), pose: 'cheer' },
  { from: L(1, 6), to: 999, pose: 'present' },
]);
dove(L(1, 6, .35), L(1, 6, .75), 1400, 120, 560, 232, 999, 40);
window.SEG_BUILD = shlomit.segs;
for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; sparkle(400 + Math.cos(a) * rnd(180, 300), 372 + Math.sin(a) * rnd(60, 120), snap(L(1, 9, .15) + i * SONG.BEAT / 2), L(1, 9, .95), rnd(.6, 1.1)); }
TSHIFT = 3.0; foreground(); TSHIFT = 0; subLayer('front');
SC.cam = [[0, 1, 640, 360], [8.6, 1, 640, 360], [10.2, 1.6, 540, 470], [12.8, 1.6, 540, 470], [14.2, 1.85, T => segX(shlomit.segs, T).x, 520],
  [19.0, 1.85, T => segX(shlomit.segs, T).x, 520], [20.6, 1.4, 690, 470], [L(1, 3, .6), 1.4, 690, 470], [L(1, 4), 1.05, 650, 380],
  [L(1, 5, .8), 1.05, 650, 380], [L(1, 6), 1.5, 560, 380], [999, 1.5, 560, 380]];

// ============================================================
//  סצנה 2: בתוך הסוכה — ארבעת המינים ופירות הסתיו (1:03–1:47) — בית שני
// ============================================================
scene('decor', 63.0);
{
  // נוף הבוסתן שנראה מבעד לחלון (מאחורי הקיר)
  piece([P(rect(60, 110, 360, 280), '#9fd3e3', { raw: true, edge: false })], { depth: 0, jit: 0, rot0: 0 });
  const orch = [];
  piece([P([[60, 300], [140, 270], [240, 285], [330, 262], [420, 280], [420, 400], [60, 400]], '#9ccd82', { amp: 1.2 })], { depth: .3 });
  for (let i = 0; i < 6; i++) {
    const x = 90 + i * 58, y = 300 + (i % 2) * 18;
    piece([P(rect(x - 3, y - 6, 6, 22), C.woodD, { amp: .4 }), P(ell(x, y - 18, 22, 20), i % 2 ? '#5fa848' : '#4f9d3a', { amp: .8 }),
           P([ell(x - 8, y - 20, 4), ell(x + 7, y - 12, 4), ell(x + 2, y - 28, 3.5)], ['#e3343f', '#ef7a36', '#f2d024'][i % 3], { detail: true, amp: .3 })],
          { depth: .5, jit: .6 });
  }
  // קיר הבד האחורי עם חור לחלון
  const wallP = P([rect(-60, -40, W + 120, 700), [[60, 110], [60, 390], [420, 390], [420, 110]]], C.wall, { rule: 'evenodd', amp: 1 });
  const stripes = [];
  for (let x = 480; x < W + 40; x += 150) stripes.push(rect(x, -40, 12, 700));
  piece([wallP, P(stripes, '#9fc2e8', { detail: true, amp: .8 }), P(rect(-60, 470, W + 120, 14), C.red, { detail: true, amp: 1 })], { depth: .4, jit: .4, rot0: 0 });
  piece([P([rect(46, 96, 388, 16), rect(46, 388, 388, 16), rect(46, 96, 16, 308), rect(418, 96, 16, 308)], C.woodL, { amp: .8 }),
         P(rect(236, 110, 8, 280), C.woodL, { amp: .6 })], { depth: .8 });
  // תריסי נייר שנפתחים
  const shutter = (x0, dir) => add({ at: 63.0, noShift: true, spr: sprite([P(rect(x0, 112, 176, 276), '#e8d7b0', { amp: .8 }),
      P([rect(x0 + 20, 150, 136, 6), rect(x0 + 20, 210, 136, 6), rect(x0 + 20, 270, 136, 6), rect(x0 + 20, 330, 136, 6)], '#cdb88c', { detail: true, amp: .4 })]),
    draw(cf, bf) {
      const T = cf / FPS, open = clamp((cf - appearF(snap(L(2, 6, .05)))) / 4, 0, 1), sx = Math.cos(open * Math.PI * .5);
      if (sx < .03) return;
      const hx = dir < 0 ? 62 : 418;
      ctx.save(); ctx.translate(hx, 0); ctx.scale(sx, 1); ctx.translate(-hx, 0); place(this.spr, 0, 0, 0, .6);
      if (open > 0) { ctx.fillStyle = `rgba(30,15,0,${(.3 * open).toFixed(2)})`; ctx.fillRect(x0, 112, 176, 276); }
      ctx.restore();
    } });
  shutter(62, -1); shutter(242, 1);
  subLayer('wall');
  // סכך מלמעלה ונורות
  const cols = ['#3f8a34', '#4f9d3a', '#5fb043', '#46913a'];
  for (let i = 0; i < 7; i++) piece(frondPaths(-40 + i * 220, 18 + (i % 2) * 22, 360, rnd(-.12, .12), cols[i % 4]), { depth: .9, jit: .6, k: 1.05 });
  add({ at: 0, noShift: true, draw(cf, bf) {                      // נורות דולקות לאורך הסכך
    const T = cf / FPS;
    for (let i = 0; i < 12; i++) {
      const x = 40 + i * 110, y = 70 + 16 * Math.sin(i * 1.3), c = ['#ffd24a', '#ff8a3d', '#ff5a5f', '#7fd46b', '#6ab8ff'][i % 5], tw = (i + beatN(T)) % 3 === 0;
      const g = ctx.createRadialGradient(x, y, 1, x, y, tw ? 20 : 28); g.addColorStop(0, c); g.addColorStop(1, c + '00');
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8; ctx.fillStyle = g; ctx.fillRect(x - 30, y - 30, 60, 60); ctx.restore();
      ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, 5, 7, 0, 0, 7); ctx.fill();
    }
  } });
  // רצפה ושולחן
  piece([P(rect(-60, 600, W + 120, 180), '#d9a766', { amp: 1 }), P([rect(-60, 640, W + 120, 3), rect(-60, 690, W + 120, 3)], '#b9864c', { detail: true, amp: .6 })], { depth: .6, jit: .4, rot0: 0 });
  piece([P([rect(170, 470, 760, 14), rect(200, 484, 14, 150), rect(886, 484, 14, 150)], C.woodD, { amp: .8 })], { depth: 1 });
  {
    const pts = [[164, 462], [936, 462], [950, 510]];
    for (let cx = 950 - 16; cx > 150; cx -= 32) for (let a = 0; a <= Math.PI; a += Math.PI / 5) pts.push([cx + 16 * Math.cos(a), 510 + 10 * Math.sin(a)]);
    pts.push([150, 510]);
    piece([P(pts, '#ffffff', { amp: .8, step: 14 }), P([[156, 494], [944, 494], [946, 501], [154, 501]], '#7cc4fa', { detail: true, amp: .5 })], { depth: 1 });
  }
  // לולב והדסים, ערבה, אתרוג
  piece([P([rect(470, 440, 36, 24), rect(476, 434, 24, 8)], '#b88c62', { amp: .6 })], { at: snap(L(2, 2, .02)), anim: 'pop' });
  piece(lulavPaths(488, 446, 330), { at: snap(L(2, 2, .1)), anim: 'rise', base: 446, px: 488, py: 446 });
  piece(sprigPaths(500, 446, 150, 30, '#2f6b2a', 'myrtle'), { at: snap(L(2, 2, .45)), anim: 'pop', px: 500, py: 446 });
  piece(sprigPaths(478, 446, 140, -34, '#2f6b2a', 'myrtle'), { at: snap(L(2, 2, .65)), anim: 'pop', px: 478, py: 446 });
  piece(sprigPaths(494, 446, 190, 46, '#8fbf5a', 'willow'), { at: snap(L(2, 3, .1)), anim: 'pop', px: 494, py: 446 });
  piece(sprigPaths(482, 446, 180, -52, '#8fbf5a', 'willow'), { at: snap(L(2, 3, .35)), anim: 'pop', px: 482, py: 446 });
  piece([P(rect(560, 430, 70, 34), '#fbe7a6', { amp: .6 }), P(rect(560, 430, 70, 8), '#e8cf7a', { detail: true, amp: .3 }),
         P(ell(595, 424, 18, 24, .4), '#f2d024', { amp: 1.4, step: 7 }), P(rect(606, 398, 4, 8), '#5a8f2e', { detail: true, amp: .2 })], { at: snap(L(2, 3, .6)), anim: 'drop', dist: 200 });
  // רימונים עם עלים, ופירות הסתיו תלויים
  const hang = (x, len, at, paths) => piece([P(rect(x - .8, 0, 1.6, len + 2), '#6b4a2b', { raw: true, edge: false }), ...paths], { at, anim: 'drop', swing: true, px: x, py: 0, pad: 14, dist: 200 });
  const pom = (x, top, r) => [P(ell(x, top + r, r), '#c62839', { amp: 1 }),
    P([[x - r * .4, top + 2], [x - r * .25, top - 6], [x - .1 * r, top + 1], [x + .15 * r, top - 7], [x + .3 * r, top + 1], [x + .45 * r, top - 5], [x + .45 * r, top + 5], [x - r * .4, top + 5]], '#9e1b2b', { detail: true, amp: .4, step: 6 }),
    P([ell(x - r - 6, top + 2, 13, 5, -.5), ell(x + r + 6, top + 4, 13, 5, .5)], '#4f9d3a', { detail: true, amp: .4 }),
    P(ell(x - r * .35, top + r * .6, r * .22, r * .35, .5), '#ef6a78', { detail: true, amp: .3 })];
  hang(700, 150, snap(L(2, 4, .05)), pom(700, 150, 26));
  hang(610, 190, snap(L(2, 4, .4)), pom(610, 190, 20));
  hang(790, 175, snap(L(2, 4, .65)), pom(790, 175, 22));
  const grapes = (x, top) => { const g = []; [[-10, 8], [0, 8], [10, 8], [-5, 18], [5, 18], [-10, 28], [0, 28], [10, 28], [-5, 38], [5, 38], [0, 48]].forEach(([a, b]) => g.push(ell(x + a, top + b, 7)));
    return [P(g, '#7b3f9e', { amp: .5, step: 6 }), P([[x, top], [x + 20, top - 8], [x + 12, top + 8]], '#4caf50', { detail: true, amp: .4, step: 6 })]; };
  const fruit = (x, top, rx, ry, col, leaf = true) => [P(ell(x, top + ry, rx, ry), col, { amp: .9 }), P(rect(x - 2, top - 6, 4, 8), '#6b4a2b', { detail: true, amp: .2 }),
    ...(leaf ? [P(ell(x + 10, top - 2, 10, 4, -.4), '#5fb043', { detail: true, amp: .3 })] : []), P(ell(x - rx * .35, top + ry * .6, rx * .25, ry * .3), 'rgba(255,255,255,.45)', { detail: true, amp: .2 })];
  hang(880, 130, snap(L(2, 5, .05)), grapes(880, 130));
  hang(540, 170, snap(L(2, 5, .2)), fruit(540, 170, 17, 18, '#d9303e'));
  hang(960, 190, snap(L(2, 5, .35)), fruit(960, 190, 15, 22, '#b8c93a'));
  hang(650, 120, snap(L(2, 5, .5)), fruit(650, 120, 17, 17, '#ef7a36'));
  hang(750, 110, snap(L(2, 5, .65)), [P(ell(750, 128, 14, 18), '#7a4a6a', { amp: .8 }), P(rect(748, 104, 4, 8), '#6b4a2b', { detail: true, amp: .2 })]);
  {
    const bowl = []; for (let i = 0; i <= 12; i++) { const a = i / 12 * Math.PI; bowl.push([760 + 54 * Math.cos(a), 450 + 26 * Math.sin(a)]); }
    piece([P(ell(732, 436, 16), '#ef7a36', { amp: .6 }), P(ell(764, 428, 18), '#d9303e', { amp: .6 }), P(ell(792, 440, 14), '#8cc43f', { amp: .6 }),
           P([ell(748, 420, 6), ell(758, 414, 6), ell(768, 420, 6)], '#7b3f9e', { amp: .3 }), P([bowl, rect(742, 472, 36, 8)], C.blue, { amp: .7 }),
           P(rect(706, 454, 108, 5), '#f2b134', { detail: true, amp: .4 })], { at: snap(L(2, 5, .8)), anim: 'pop', px: 760, py: 476 });
  }
  // ריח בוסתן: סלסלות נייר שמרחפות מהחלון
  const curl = col => sprite([P((() => { const p = []; for (let a = 0; a <= Math.PI * 3.2; a += .25) p.push([Math.cos(a) * (6 + a * 4), Math.sin(a) * (6 + a * 4) * .7]);
    for (let a = Math.PI * 3.2; a >= 0; a -= .25) p.push([Math.cos(a) * (2 + a * 4), Math.sin(a) * (2 + a * 4) * .7]); return p; })(), col, { amp: .3, step: 10 })]);
  ['#f7a8c4', '#c9b3f0', '#fff0a8', '#b8e8c8', '#f7c8a8', '#f7a8c4', '#c9b3f0', '#fff0a8', '#b8e8c8', '#f7c8a8'].forEach((col, i) => {
    const sp = curl(col), t0 = snap(i < 5 ? L(2, 6, .15 + i * .1) : L(2, 9, .1 + (i - 5) * .1));
    add({ at: t0, noShift: true, draw(cf, bf) {
      const u = (cf / FPS - t0) / 5; if (u > 1) return;
      const x = 240 + u * 820, y = 250 + i * 18 + 40 * Math.sin(u * 8 + i);
      ctx.save(); ctx.globalAlpha = Math.min(1, (1 - u) * 3); place(sp, x, y, u * 6 + i, .5); ctx.restore();
    } });
  });
  kid(shlomit, 700, [{ from: 60, to: L(2, 2), pose: 'finger', x0: 1080 }, { from: L(2, 2), to: L(2, 4), pose: 'present' },
    { from: L(2, 4), to: L(2, 5), pose: 'wave' }, { from: L(2, 5), to: L(2, 6, .1), pose: 'cheer' }, { from: L(2, 6, .1), to: 999, pose: 'sniff' }], 1.45);
  subLayer('front');
  SC.cam = [[0, 1, 640, 360], [L(2, 1, .6), 1, 640, 360], [L(2, 2, .1), 1.3, 520, 330], [L(2, 3, .8), 1.3, 540, 350], [L(2, 4), 1.25, 700, 300],
    [L(2, 4, .9), 1.25, 700, 300], [L(2, 5, .1), 1.05, 740, 330], [L(2, 5, .95), 1.05, 740, 330], [L(2, 6, .1), 1.35, 330, 300], [L(2, 6, .6), 1.1, 560, 330], [999, 1.1, 560, 330]];
}

// ============================================================
//  סצנה 3: "הביטו, זה נגמר!" — השכנים באים (1:45–2:30) — בית שלישי
// ============================================================
scene('crowd', 105.4);
TSHIFT = -200; landscape(); TSHIFT = 0;
function insideDecor(at) {
  sk([P([rect(518, 500, 244, 12), rect(534, 512, 10, 98), rect(736, 512, 10, 98)], C.woodD), P(rect(514, 494, 252, 30), '#ffffff', { amp: .8 })], { at, stretch: true });
  const x = 528, top = 312 + 70;
  hanging(x, 70, at, [P(ell(x, top + 17, 17), '#c62839', { amp: 1 })], { anim: 'none', stretch: true });
  hanging(684, 74, at, [P(ell(684, 386 + 17, 12, 17, .15), '#f2d024', { amp: 1.4, step: 7 })], { anim: 'none', stretch: true });
  const g = []; [[-9, 8], [0, 8], [9, 8], [-4.5, 17], [4.5, 17], [0, 26]].forEach(([a, b]) => g.push(ell(752 + a, 374 + b, 6)));
  hanging(752, 62, at, [P(g, '#7b3f9e', { amp: .5, step: 6 })], { anim: 'none', stretch: true });
  piece(lulavPaths(600, 494, 150), { at, shift: SHIFT, stretch: true });
}
const DONE = 100;
sukkah({ floor: DONE, postB1: DONE, postB2: DONE, beamB: DONE, postF1: DONE, postF2: DONE, beamS: DONE, beamF: DONE, wallB: DONE, wallL: DONE, wallR: DONE,
  lights: DONE, lit: DONE, fronds: [DONE], banner: DONE, inside: () => insideDecor(DONE) }, true);
dove(DONE, DONE + .1, 560, 232, 560, 232);
SC.stretch = T => [1, 1.1, 1.2, 1.3, 1.36][clamp(Math.floor((T - snap(L(3, 5, .45))) * FPS) + 1, 0, 4)];
SC.shake = T => T > L(3, 3) && T < L(3, 3, .5) ? 4 : 1;
{ // בועת דיבור
  const bx = 860, by = 330;
  const bs = sprite([P([ell(bx, by, 150, 56), [[bx - 30, by + 40], [bx + 10, by + 48], [bx - 10, by + 96]]], '#fffaf0', { amp: 1.2, step: 12 })],
    { after: g => { g.font = font(46); g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl'; sh(g, 2, 1, 1.5, 'rgba(40,24,10,.3)'); g.fillStyle = '#e3343f'; g.fillText('הביטו, זה נגמר!', bx, by + 2); } });
  add({ spr: bs, px: bx - 10, py: by + 90, at: snap(L(3, 2, .05)), until: L(3, 3, .6), anim: 'pop', noShift: true, bbw: { h: 0 } });
}
for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; sparkle(520 + Math.cos(a) * rnd(260, 420), 400 + Math.sin(a) * rnd(160, 260), snap(L(3, 3, .05) + i * SONG.BEAT / 2), L(3, 4, .3), rnd(.7, 1.4)); }
subLayer('stage');
kid(shlomit, 690, [{ from: 100, to: L(3, 2), pose: 'present', x0: 860 }, { from: L(3, 2), to: L(3, 3, .6), pose: 'cheer' },
  { from: L(3, 3, .6), to: L(3, 6), pose: 'wave' }, { from: L(3, 6), to: 999, pose: 'cheer' }]);
kid(boy, 684, [{ from: L(3, 4), to: L(3, 4, .8), pose: 'stand', walk: true, x0: 1400, x1: 1050 }, { from: L(3, 4, .8), to: L(3, 6), pose: 'wave' }, { from: L(3, 6), to: 999, pose: 'cheer', phase: 1 }]);
kid(girl, 674, [{ from: L(3, 4, .2), to: L(3, 4, .95), pose: 'stand', walk: true, x0: 1440, x1: 1180 }, { from: L(3, 4, .95), to: L(3, 6), pose: 'stand' }, { from: L(3, 6), to: 999, pose: 'cheer' }]);
kid(mom, 690, [{ from: L(3, 4, .1), to: L(3, 4, .9), pose: 'stand', walk: true, x0: -160, x1: 150 }, { from: L(3, 4, .9), to: L(3, 6), pose: 'stand' }, { from: L(3, 6), to: 999, pose: 'cheer', phase: 1 }]);
kid(dad, 698, [{ from: L(3, 4, .3), to: L(3, 5), pose: 'stand', walk: true, x0: -200, x1: 70 }, { from: L(3, 5), to: L(3, 6), pose: 'wave' }, { from: L(3, 6), to: 999, pose: 'cheer' }]);
people.forEach((p, i) => {                                          // ההמונים: שורה בתוך הסוכה שנמתחה
  const x = 200 + i * 64 + (i % 2) * 10, y = 618 - (i % 2) * 10;
  crowdMember(p, x, y, snap(L(3, 5, .55) + i * SONG.BEAT / 2), .78, L(3, 6));
});
TSHIFT = -200; foreground(); TSHIFT = 0; subLayer('front');
SC.cam = [[0, 1, 640, 360], [L(3, 1, .7), 1, 640, 360], [L(3, 2, .05), 1.55, 800, 420], [L(3, 3, .1), 1.55, 800, 420], [L(3, 3, .6), 1, 640, 360], [999, 1, 640, 360]];

// ============================================================
//  סצנה 4: לילה, כוכב מציץ מהסכך (2:27–סוף) — בית רביעי
// ============================================================
scene('night', 147.2, '#0e1430');
TSHIFT = -300; landscape();
SC.pieces = SC.pieces.filter(p => !(p.px === 1130 && p.py === 118));          // בלילה אין שמש
add({ at: 0, noShift: true, k: .3, draw() { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#34458a'; ctx.fillRect(-400, -300, W + 800, H + 600); ctx.restore(); } });
{ // ירח וכוכבים קטנים
  const moon = [...ell(0, 0, 46)], cut = ell(18, -10, 40);
  piece([P([moon.map(([x, y]) => [x + 200, y + 110]), cut.map(([x, y]) => [x + 200, y + 110]).reverse()], '#fff2c2', { rule: 'evenodd', amp: .8 })], { at: 0, k: .2, depth: .5 });
  const r = mulberry32(333);
  for (let i = 0; i < 26; i++) { const x = r() * W, y = r() * 260, s = .25 + r() * .35;
    add({ at: 0, noShift: true, k: .2, draw(cf, bf) { const tw = (bf + i) % 4 === 0 ? .6 : 1; ctx.save(); ctx.translate(x, y); ctx.scale(s * tw, s * tw); place(SPARK, 0, 0, 0, 0); ctx.restore(); } }); }
  [[300, 470], [352, 474], [870, 470], [925, 466]].forEach(([x, y]) => add({ at: 0, noShift: true, k: .5, draw(cf, bf) {
    ctx.fillStyle = (bf + x) % 7 ? '#ffd86a' : '#ffe9a8'; ctx.fillRect(x - 11, y - 20, 6, 6); ctx.fillRect(x + 5, y - 20, 6, 6); } }));
}
TSHIFT = 0;
sukkah({ floor: DONE, postB1: DONE, postB2: DONE, beamB: DONE, postF1: DONE, postF2: DONE, beamS: DONE, beamF: DONE, wallB: DONE, wallL: DONE, wallR: DONE,
  lights: DONE, lit: DONE, fronds: [DONE], banner: DONE, inside: () => {
    insideDecor(DONE);
    // הכוכב עולה מאחורי הסכך (נצבע לפני הענפים)
    add({ at: L(4, 2), noShift: true, draw(cf, bf) {
      const T = cf / FPS, u = clamp((cf - appearF(snap(L(4, 2, .1)))) / 6, 0, 1), big = T > L(4, 3) ? 1.25 + (bf % 2 ? .08 : 0) : 1;
      ctx.save(); applyStretch(); ctx.translate(560 + SHIFT, 262 - u * 110); ctx.rotate(Math.sin(bf * .5) * .05); ctx.scale(big, big);
      if (T > L(4, 3)) { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, 150); g.addColorStop(0, 'rgba(255,240,170,.55)'); g.addColorStop(1, 'rgba(255,240,170,0)');
        ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(-150, -150, 300, 300); ctx.restore(); }
      place(STAR, 0, 0, 0, .6); ctx.restore();
    } });
    subLayer('roof');
  } }, true);
SC.stretch = () => 1.36;
add({ at: 0, noShift: true, draw() { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = '#8c95c6'; ctx.fillRect(-400, -300, W + 800, H + 600); ctx.restore(); } });
lights(0, 0, true);                                                     // הנורות שוב מעל הגוון הכחול, שיזהרו
add({ at: 0, noShift: true, draw(cf) {                               // אור חם מתוך הסוכה
  const g = ctx.createRadialGradient(520, 470, 40, 520, 470, 430); g.addColorStop(0, 'rgba(255,200,110,.45)'); g.addColorStop(1, 'rgba(255,200,110,0)');
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = .8 + (cf % 3) * .06; ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.restore(); } });
for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; sparkle(440 + Math.cos(a) * rnd(90, 170), 190 + Math.sin(a) * rnd(60, 120), snap(L(4, 3, .05) + i * SONG.BEAT / 2), L(4, 4, .6), rnd(.6, 1.1)); }
subLayer('stage');
people.forEach((p, i) => crowdMember(p, 200 + i * 64 + (i % 2) * 10, 618 - (i % 2) * 10, 0, .78, L(4, 5)));
kid(boy, 684, [{ from: 0, to: L(4, 5), pose: 'stand', x0: 1060 }, { from: L(4, 5), to: 999, pose: 'cheer', phase: 1 }]);
kid(girl, 674, [{ from: 0, to: L(4, 5), pose: 'stand', x0: 1180 }, { from: L(4, 5), to: 999, pose: 'cheer' }]);
kid(shlomit, 700, [{ from: 0, to: L(4, 2), pose: 'present', x0: 940 }, { from: L(4, 2), to: L(4, 5), pose: 'finger' }, { from: L(4, 5), to: 999, pose: 'cheer' }]);
// כותרת הסיום בשמי הלילה
layoutLine('שלומית בנתה', 86, 5).forEach(({ ch, x }, i) => {
  const s = letterSprites(ch, x, 92, 86, PAPER[i % PAPER.length], '#fffaf0');
  add({ spr: s.front, back: s.back, px: x, py: 92, at: snap(L(4, 9, .02)) + i * SONG.BEAT / 2, noShift: true, anim: 'flip', n: 3, rot0: rnd(-.09, .09), screen: true, bbw: { h: 0 } });
});
layoutLine('סוכת שלום', 96, 6).forEach(({ ch, x }, i) => {
  const s = letterSprites(ch, x, 196, 96, PAPER[(i + 3) % PAPER.length], '#fffaf0');
  add({ spr: s.front, back: s.back, px: x, py: 196, at: snap(L(4, 9, .45)) + i * SONG.BEAT / 2, noShift: true, anim: 'flip', n: 3, rot0: rnd(-.09, .09), screen: true, bbw: { h: 0 } });
});
dove(L(4, 9, .3), L(4, 9, .95), -120, 330, 1420, 250, 999, 80);
for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; sparkle(520 + Math.cos(a) * rnd(300, 460), 330 + Math.sin(a) * rnd(150, 240), snap(L(4, 6, .05) + i * SONG.BEAT / 2), L(4, 7), rnd(.7, 1.2)); }
{
  const rb = sprite([P([[1010, 268], [1250, 268], [1236, 300], [1250, 332], [1010, 332], [1024, 300]], '#fff4dc', { amp: 1 })],
    { after: g => { g.font = font(40); g.textAlign = 'center'; g.textBaseline = 'middle'; g.direction = 'rtl'; g.fillStyle = '#b83a2e'; g.fillText('חג שמח!', 1130, 302); } });
  add({ spr: rb, px: 1130, py: 300, at: SONG.MUSIC_END - 2.2, noShift: true, anim: 'slide', from: [400, 0], screen: true, rot0: .04, bbw: { h: 0 } });
}
subLayer('front');
SC.cam = [[0, 2.1, 480, 250], [L(4, 1, .3), 2.1, 480, 250], [L(4, 2, .9), 1.8, 480, 260], [L(4, 3, .9), 1.8, 480, 260], [L(4, 4, .6), 1, 640, 360], [999, 1, 640, 360]];
}   // buildAll

// ============================================================
//  שוטים: כל שורה בשיר מקבלת "שוט" עם תנועת מצלמה משלו (זום פנימה/החוצה),
//  ובחלק מהמעברים בין השוטים יש מעבר נייר
// ============================================================
function sceneById(id) { return SCENES.find(s => s.id === id); }
const mv = (t0, t1, a, b) => [[t0, ...a], [t1, ...b]];
const SX = T => segX(window.SEG_BUILD, T).x;
const SHOTS_DEF = () => [
  { s: 'title', from: 0, cam: mv(0, 99, [1, 640, 360], [1, 640, 360]) },
  { s: 'build', from: 7.5, tr: 'rollUp', dur: 1.0, cam: mv(8.6, 13.0, [1, 640, 360], [1.65, 540, 470]) },
  { s: 'build', from: 13.4, tr: 'newSheet', dur: 1.1, cam: [[13.4, 1.95, SX, 520], [19.2, 1.75, SX, 520]] },
  { s: 'build', from: 19.4, cam: mv(19.4, 21.9, [1.35, 700, 470], [1.55, 640, 470]) },
  // בית 1 — בונים
  { s: 'build', from: L(1, 1), cam: mv(L(1, 1), L(1, 2), [1.6, 860, 500], [1.3, 700, 470]) },
  { s: 'build', from: L(1, 2), tr: 'strips', dur: 1.0, cam: mv(L(1, 2), L(1, 3), [1.15, 640, 420], [1.55, 560, 330]) },
  { s: 'build', from: L(1, 3), cam: mv(L(1, 3), L(1, 4), [1.65, 520, 470], [1.25, 610, 430]) },
  { s: 'build', from: L(1, 4), tr: 'tearH', dur: 1.1, cam: mv(L(1, 4), L(1, 5), [2.0, 560, 290], [1.35, 620, 370]) },
  { s: 'build', from: L(1, 5), cam: mv(L(1, 5), L(1, 6), [1.0, 640, 360], [1.4, 540, 330]) },
  { s: 'build', from: L(1, 6), tr: 'accordion', dur: 1.1, cam: mv(L(1, 6), L(1, 7), [1.85, 520, 370], [1.25, 600, 350]) },
  { s: 'build', from: L(1, 7), tr: 'newSheet', dur: 1.0, cam: mv(L(1, 7), L(1, 8), [1.0, 640, 360], [1.25, 700, 420]) },
  { s: 'build', from: L(1, 8), cam: mv(L(1, 8), L(1, 9), [1.7, 520, 300], [1.3, 520, 330]) },
  { s: 'build', from: L(1, 9), tr: 'tear3', dur: 1.1, cam: mv(L(1, 9), 63.2, [1.5, 560, 300], [1.0, 640, 360]) },
  // בית 2 — בתוך הסוכה
  { s: 'decor', from: 63.15, tr: 'pageTurn', dur: 1.9, cam: mv(63.4, L(2, 2), [1.0, 640, 360], [1.35, 980, 430]) },
  { s: 'decor', from: L(2, 2), tr: 'newSheet', dur: 1.0, cam: mv(L(2, 2), L(2, 3), [1.7, 490, 300], [1.25, 520, 340]) },
  { s: 'decor', from: L(2, 3), cam: mv(L(2, 3), L(2, 4), [1.9, 520, 390], [1.3, 540, 380]) },
  { s: 'decor', from: L(2, 4), tr: 'tear', dur: 1.1, cam: mv(L(2, 4), L(2, 5), [1.7, 700, 240], [1.2, 700, 300]) },
  { s: 'decor', from: L(2, 5), cam: mv(L(2, 5), L(2, 6), [1.0, 640, 360], [1.3, 760, 300]) },
  { s: 'decor', from: L(2, 6), tr: 'peel', dur: 1.4, cam: mv(L(2, 6), L(2, 7), [1.75, 240, 250], [1.15, 520, 330]) },
  { s: 'decor', from: L(2, 7), tr: 'strips', dur: 1.0, cam: mv(L(2, 7), L(2, 8), [1.9, 650, 210], [1.4, 700, 260]) },
  { s: 'decor', from: L(2, 8), cam: mv(L(2, 8), L(2, 9), [1.25, 880, 250], [1.6, 760, 420]) },
  { s: 'decor', from: L(2, 9), tr: 'accordion', dur: 1.1, cam: mv(L(2, 9), 104.5, [1.3, 300, 260], [1.0, 640, 360]) },
  // בית 3 — השכנים
  { s: 'crowd', from: 104.9, tr: 'crumple', dur: 2.9, cam: mv(105.6, L(3, 2), [1.3, 860, 470], [1.0, 640, 360]) },
  { s: 'crowd', from: L(3, 2), cam: mv(L(3, 2), L(3, 3), [1.85, 820, 380], [1.5, 820, 400]) },
  { s: 'crowd', from: L(3, 3), tr: 'shatter', dur: 1.5, cam: mv(L(3, 3), L(3, 4), [1.0, 640, 360], [1.3, 520, 400]) },
  { s: 'crowd', from: L(3, 4), cam: mv(L(3, 4), L(3, 5), [1.4, 1050, 470], [1.4, 260, 470]) },
  { s: 'crowd', from: L(3, 5), tr: 'tear3', dur: 1.2, cam: mv(L(3, 5), L(3, 6), [1.0, 640, 360], [1.3, 520, 480]) },
  { s: 'crowd', from: L(3, 6), cam: mv(L(3, 6), L(3, 7), [1.6, 1000, 460], [1.0, 640, 360]) },
  { s: 'crowd', from: L(3, 7), tr: 'newSheet', dur: 1.0, cam: mv(L(3, 7), L(3, 8), [1.5, 300, 480], [1.2, 420, 450]) },
  { s: 'crowd', from: L(3, 8), cam: mv(L(3, 8), L(3, 9), [1.8, 520, 560], [1.4, 520, 500]) },
  { s: 'crowd', from: L(3, 9), tr: 'tearH', dur: 1.1, cam: mv(L(3, 9), 146.5, [1.0, 640, 360], [1.15, 600, 380]) },
  // בית 4 — לילה
  { s: 'night', from: 147.1, tr: 'plane', dur: 2.6, cam: mv(147.6, L(4, 2), [2.1, 480, 250], [1.8, 480, 260]) },
  { s: 'night', from: L(4, 2), cam: mv(L(4, 2), L(4, 3), [2.3, 440, 220], [1.9, 440, 240]) },
  { s: 'night', from: L(4, 3), tr: 'strips', dur: 1.0, cam: mv(L(4, 3), L(4, 4), [1.5, 440, 260], [1.15, 520, 330]) },
  { s: 'night', from: L(4, 4), tr: 'tear', dur: 1.1, cam: mv(L(4, 4), L(4, 5), [1.0, 640, 360], [1.2, 560, 380]) },
  { s: 'night', from: L(4, 5), cam: mv(L(4, 5), L(4, 6), [1.6, 560, 520], [1.0, 640, 360]) },
  { s: 'night', from: L(4, 6), tr: 'peel', dur: 1.3, cam: mv(L(4, 6), L(4, 7), [1.3, 900, 470], [1.05, 640, 380]) },
  { s: 'night', from: L(4, 7), cam: mv(L(4, 7), L(4, 8), [1.8, 440, 200], [1.3, 480, 280]) },
  { s: 'night', from: L(4, 8), tr: 'newSheet', dur: 1.0, cam: mv(L(4, 8), L(4, 9), [1.5, 520, 520], [1.15, 600, 420]) },
  { s: 'night', from: L(4, 9), tr: 'accordion', dur: 1.1, cam: mv(L(4, 9), 192, [1.3, 560, 300], [1.0, 640, 360]) },
];
