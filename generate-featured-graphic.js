const puppeteer = require('puppeteer');
const path = require('path');

const makeHTML = ({ appName, tagline, verseLabel, diffLabels, verseWords }) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  width: 1024px; height: 500px; overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', Roboto, sans-serif;
  background: #BFA58A;
  display: flex; align-items: center; justify-content: center;
}
.card {
  background: rgba(255,255,255,0.12);
  border-radius: 20px;
  padding: 48px 60px;
  display: flex;
  align-items: center;
  gap: 64px;
  width: 920px;
}
.branding { flex: 1; }
.app-name {
  font-size: 52px; font-weight: 700; color: #fff;
  line-height: 1.15; letter-spacing: -0.5px;
}
.tagline {
  font-size: 20px; color: rgba(255,255,255,0.82);
  margin-top: 14px; font-weight: 400; line-height: 1.5;
}
.verse-card {
  width: 300px; background: #fff;
  border-radius: 14px; padding: 24px 22px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
}
.verse-label {
  font-size: 13px; font-weight: 700; color: #BFA58A;
  letter-spacing: 0.5px; margin-bottom: 12px; text-transform: uppercase;
}
.diff-row { display: flex; gap: 5px; margin-bottom: 16px; }
.diff-btn {
  flex: 1; padding: 6px 0; border-radius: 5px;
  font-size: 11px; text-align: center; font-weight: 500; color: #333;
}
.verse-words { display: flex; flex-wrap: wrap; gap: 5px; align-items: center; }
.word { font-size: 13px; color: #222; }
.block { display: inline-block; height: 16px; border-radius: 3px; background: #e0e0e0; vertical-align: middle; }
</style></head><body>
<div class="card">
  <div class="branding">
    <div class="app-name">${appName}</div>
    <div class="tagline">${tagline}</div>
  </div>
  <div class="verse-card">
    <div class="verse-label">${verseLabel}</div>
    <div class="diff-row">
      <div class="diff-btn" style="background:#B8E6B8">${diffLabels[0]}</div>
      <div class="diff-btn" style="background:#FFE5B4">${diffLabels[1]}</div>
      <div class="diff-btn" style="background:#FFB3BA;border:2px solid #808080">${diffLabels[2]}</div>
      <div class="diff-btn" style="background:#FF6B6B">${diffLabels[3]}</div>
    </div>
    <div class="verse-words">${verseWords}</div>
  </div>
</div>
</body></html>`;

const EN_WORDS = `
  <span class="block" style="width:22px"></span>
  <span class="word">God</span>
  <span class="word">so</span>
  <span class="block" style="width:38px"></span>
  <span class="word">the</span>
  <span class="block" style="width:34px"></span>
  <span class="word">that</span>
  <span class="word">he</span>
  <span class="block" style="width:28px"></span>
  <span class="word">his</span>
  <span class="block" style="width:44px"></span>
  <span class="block" style="width:28px"></span>
  <span class="word">Son,</span>
  <span class="word">that</span>
  <span class="block" style="width:58px"></span>
  <span class="block" style="width:50px"></span>
  <span class="word">in</span>
  <span class="word">him</span>
  <span class="word">should</span>
  <span class="word">not</span>
  <span class="block" style="width:38px"></span>
  <span class="word">but</span>
  <span class="word">have</span>
  <span class="block" style="width:60px"></span>
  <span class="word">life.</span>`;

// 요한복음 3:16 개역개정 — hard difficulty: show 이는, 그를, 않고, 하려, 하심이라
const KO_WORDS = `
  <span class="block" style="width:52px"></span>
  <span class="block" style="width:36px"></span>
  <span class="block" style="width:40px"></span>
  <span class="block" style="width:48px"></span>
  <span class="block" style="width:44px"></span>
  <span class="block" style="width:44px"></span>
  <span class="word">이는</span>
  <span class="word">그를</span>
  <span class="block" style="width:28px"></span>
  <span class="block" style="width:40px"></span>
  <span class="block" style="width:52px"></span>
  <span class="word">않고</span>
  <span class="block" style="width:36px"></span>
  <span class="block" style="width:28px"></span>
  <span class="word">하려</span>
  <span class="word">하심이라</span>`;

const CONFIGS = [
  {
    file: 'featured_graphic.png',
    appName: 'Bible<br>Memorization',
    tagline: 'Hide words. Test yourself.<br>Memorize scripture.',
    verseLabel: 'John 3 &middot; Verse 16',
    diffLabels: ['Easy', 'Med', 'Hard', 'Full'],
    verseWords: EN_WORDS,
  },
  {
    file: 'featured_graphic_ko.png',
    appName: '성경 암기',
    tagline: '단어를 가리고. 스스로 테스트.<br>성경을 암기하세요.',
    verseLabel: '요한복음 3장 &middot; 16절',
    diffLabels: ['쉬움', '보통', '어려움', '전체'],
    verseWords: KO_WORDS,
  },
];

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1024, height: 500, deviceScaleFactor: 1 });

  for (const cfg of CONFIGS) {
    const html = makeHTML(cfg);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    const out = path.join(__dirname, 'screenshots', cfg.file);
    await page.screenshot({ path: out, type: 'png' });
    console.log('Saved:', out);
  }

  await browser.close();
})();
