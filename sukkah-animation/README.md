# שלומית בונה סוכה — אנימציית סטופ-מושן מגזרי נייר

## הקבצים
- `shlomit-song.html` — האנימציה המלאה (כל השיר). **קובץ שנבנה אוטומטית** — לא לערוך ישירות.
- `src/` — קוד המקור של הגרסה המלאה:
  - `song-main.js` — תזמון השיר (זמני שורות), מנוע הסצנות, דמויות, חלקי הסוכה
  - `song-scenes.js` — ארבע הסצנות והשוטים (מצלמה ומעברים לכל שורה)
  - `song-render.js` — הרכבה, כתוביות מגזרי נייר, ניגון
  - `assemble.py` — בונה את `shlomit-song.html` מ-`src/` + `shlomit.html` + `transitions.html`
- `shlomit.html`, `transitions.html` — מקור לחלקים משותפים (עזרים, תפאורה, מעברים)
- `tools/render.mjs` — רינדור לוידאו עם השיר, על כל המעבדים

## קבצים פרטיים (לא בגיטהאב — המאגר ציבורי)
שימו אותם בתיקייה הזו:
- `song.mp3` — השיר
- `lyrics.js` — המילים
- `fonts/Discovery_Fs-Bold.otf` — הפונט

## בנייה ורינדור
```
python src/assemble.py            # אחרי שינוי בקוד שב-src/
cd tools
npm install
npx playwright install chromium   # פעם אחת
node render.mjs --song ../song.mp3 --out ../shlomit.mp4            # 1080p
node render.mjs --scale 1 --out ../shlomit-720p.mp4                 # 720p, מהיר יותר
node render.mjs --from 160 --to 520 --out ../test.mp4               # רק קטע (פריימים, 8 לשנייה)
```
