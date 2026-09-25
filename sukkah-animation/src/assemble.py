import sys, re
import os
SP=os.path.dirname(os.path.abspath(__file__))
os.chdir(os.path.join(SP, ".."))
s=open('shlomit.html',encoding='utf-8').read()
t=open('transitions.html',encoding='utf-8').read()
def between(src, a, b, inc_b=False):
    i=src.index(a); j=src.index(b, i+len(a))
    return src[i:(j+len(b)) if inc_b else j]
helpers = between(s, '// ---------- כלים ----------', '// ---------- ציר זמן ----------')
anim = between(s, '// הנפשות קצרות', 'function drawPiece(p, cf, bf) {')
draw = between(s, 'function drawPiece(p, cf, bf) {', '// ============================================================\n//  התפאורה')
draw = draw.replace("  const s = p.spr;\n  ctx.save();\n", "  const s = p.spr;\n  ctx.save();\n  if (p.stretch) applyStretch();\n", 1)
assert 'applyStretch' in draw
consts = between(s, 'const C = {', "piece([P(rect(-100, -60, W + 200, H + 120), C.sky")
land = between(s, "piece([P(rect(-100, -60, W + 200, H + 120), C.sky", "butterfly(150, 610, '#f2b134', 6.8, 1); butterfly(1190, 590, '#8e55b8', 7.4, 2);", True)
land = land.replace('const hill1Y = x =>', "subLayer('sky');\nconst hill1Y = x =>", 1).replace('// גדר עץ לבנה', "subLayer('fence');\n// גדר עץ לבנה", 1)
assert land.count('subLayer') == 2
frond = between(s, 'function frondPaths(cx, cy, len, ang, col) {', '{\n  const cols')
kids = between(s, 'function makeKid(o) {', 'function kid(k, y, segs) {')
texts = between(s, 'const font = size =>', 'function buildTexts() {')
fg = between(s, 'function foreground() {', '// ============================================================\n//  מצלמה')
th = between(t, 'const ease = x =>', 'const easeOutBack')
trans = between(t, '// 1. דף מתהפך', '// [שם, פונקציה')
trans = re.sub(r'\bsh\(', 'tsh(', trans).replace('nosh()', 'tnosh()').replace('const k = IW / W,', 'const k = img.width / W,')
assert 'IW' not in trans
thelp = th + r"""function tsh(b, x, y, a) { ctx.shadowBlur = b * DPR; ctx.shadowOffsetX = x * DPR; ctx.shadowOffsetY = y * DPR; ctx.shadowColor = `rgba(30,16,4,${a})`; }
const tnosh = () => tsh(0, 0, 0, 0);
function part(img, sx, sy, sw, sh_, dx, dy, dw, dh) { const k = img.width / W; ctx.drawImage(img, sx * k, sy * k, sw * k, sh_ * k, dx, dy, dw, dh); }
function full(img, bf, seed = 0) { const r = mulberry32(bf * 131 + seed); ctx.save(); ctx.translate(640 + (r() - .5) * 2, 360 + (r() - .5) * 2); ctx.scale(1.006, 1.006); ctx.drawImage(img, -640, -360, W, H); ctx.restore(); }
const table = () => { ctx.fillStyle = '#3a2a1c'; ctx.fillRect(0, 0, W, H); };
"""
head = s[:s.index('<script>')]
ctrl_old = head[head.index('<div class="controls">'):head.index('</div>\n<p id="msg"')+len('</div>')]
ctrl_new = """<div class="controls">
  <button class="btn" id="restart" type="button">↺ מההתחלה</button>
  <button class="btn" id="play" type="button">▶ נגן</button>
  <span class="file"><span class="btn accent">♪ בחירת קובץ השיר</span><input type="file" id="song" accept="audio/*" aria-label="בחירת קובץ השיר"></span>
</div>"""
head = head.replace(ctrl_old, ctrl_new)
head = head.replace('</style>', "  @font-face { font-family: Discovery; src: url(fonts/Discovery_Fs-Bold.otf) format('opentype'); font-display: block; }\n</style>", 1)
head = re.sub(r'<p id="msg" aria-live="polite">.*?</p>', '<p id="msg" aria-live="polite">כל השיר (3:18). בחרו את קובץ השיר מהמכשיר כדי שהאנימציה תתנגן איתו בסנכרון, או לחצו "נגן" לצפייה בלי קול.</p>', head, flags=re.S)
top = """<script src="lyrics.js"></script>
<script>
// ============================================================
//  שלומית בונה סוכה — כל השיר, סטופ-מושן מגזרי נייר
//  מילים ולחן: נעמי שמר. התזמון נבנה לפי ניתוח של הקלטת השיר.
//  המילים נטענות מ-lyrics.js (קובץ פרטי שלא עולה למאגר); בלעדיו אין כתוביות.
// ============================================================
const W = 1280, H = 720, FPS = 8;
const cv = document.getElementById('c');
const mainCtx = cv.getContext('2d');
let ctx = mainCtx;
const DPR = Math.min(2, window.devicePixelRatio || 1);
cv.width = W * DPR; cv.height = H * DPR;

"""
out = head + top + helpers + anim + draw + '\n' + consts + '\nfunction landscape() {\n' + land + '\n}\n' + frond + '\n' + kids + '\n' + texts + '\n' + fg + '\n' + \
      open(SP+'/song-main.js',encoding='utf-8').read() + '\n' + thelp + '\n' + trans + '\n' + open(SP+'/song-scenes.js',encoding='utf-8').read() + '\n' + \
      open(SP+'/song-render.js',encoding='utf-8').read() + '\n</script>\n</body>\n</html>\n'
open('shlomit-song.html','w',encoding='utf-8').write(out)
print(len(out.split('\n')), 'lines')
