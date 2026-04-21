const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SIZES = [
  { name: 'phone',     width: 1080, height: 1920 },
  { name: 'tablet_7',  width: 1200, height: 1920 },
  { name: 'tablet_10', width: 1600, height: 2560 },
];

const OUT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

// ─── Locale configs ────────────────────────────────────────────────────────────
const LOCALES = {
  en: {
    suffix: '',
    appName: 'Bible Memorization',
    versionBadge: 'Current version: KJV',
    buttons: ['Find Chapter', 'Search Verses', 'History', 'Settings'],
    selectBookTitle: 'Select a Book',
    oldT: 'Old Testament:',
    newT: 'New Testament:',
    backToBooks: '← Back to Books',
    selectChapterTitle: "Select a chapter from 'John'",
    chapterLabel: (n) => `${n}`,
    difficultyLabel: 'Difficulty',
    diff: ['Easy', 'Medium', 'Hard', 'Full'],
    verseLabel: 'Verse 16',
    langTitle: 'Language',
    langOptions: [
      { label: 'English',   selected: true },
      { label: '한국어',    selected: false },
    ],
    translationTitle: 'Available Versions',
    translations: [
      { label: 'King James Version (KJV)',          selected: true },
      { label: 'New International Version (NIV)',    selected: false },
      { label: 'New American Standard Bible (NASB)', selected: false },
      { label: 'English Standard Version (ESV)',     selected: false },
    ],
    otBooks: ['Genesis','Exodus','Leviticus','Numbers','Deuteronomy','Joshua','Judges','Ruth',
      '1 Samuel','2 Samuel','1 Kings','2 Kings','1 Chronicles','2 Chronicles','Ezra','Nehemiah',
      'Esther','Job','Psalms','Proverbs','Ecclesiastes','Song of Solomon','Isaiah','Jeremiah',
      'Lamentations','Ezekiel','Daniel','Hosea','Joel','Amos','Obadiah','Jonah','Micah','Nahum',
      'Habakkuk','Zephaniah','Haggai','Zechariah','Malachi'],
    ntBooks: ['Matthew','Mark','Luke','John','Acts','Romans','1 Corinthians','2 Corinthians',
      'Galatians','Ephesians','Philippians','Colossians','1 Thessalonians','2 Thessalonians',
      '1 Timothy','2 Timothy','Titus','Philemon','Hebrews','James','1 Peter','2 Peter',
      '1 John','2 John','3 John','Jude','Revelations'],
    // John 3:16 KJV
    verse: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
    hiddenEasy: new Set([3, 8, 11, 14]),           // loved, gave, begotten, whosoever
    hiddenHard: new Set([0,1,3,4,5,6,7,8,10,11,12,13,14,15,16,17,18,20]), // show: so, his, only, Son, not, but, have, life.
  },
  ko: {
    suffix: '_ko',
    appName: '성경 암기',
    versionBadge: '현재 번역: 개역개정',
    buttons: ['통 암기', '구절 찾기', '열람 내역', '설정'],
    selectBookTitle: '책 선택',
    oldT: '구약',
    newT: '신약',
    backToBooks: '← 책 목록으로 돌아가기',
    selectChapterTitle: "'요한복음'에서 장 선택",
    chapterLabel: (n) => `${n}장`,
    difficultyLabel: '난이도:',
    diff: ['쉬움', '보통', '어려움', '전체'],
    verseLabel: '16절',
    langTitle: '언어',
    langOptions: [
      { label: 'English',   selected: false },
      { label: '한국어',    selected: true },
    ],
    translationTitle: '번역',
    translations: [
      { label: '개역개정', selected: true },
    ],
    otBooks: ['창세기','출애굽기','레위기','민수기','신명기','여호수아','사사기','룻기',
      '사무엘상','사무엘하','열왕기상','열왕기하','역대상','역대하','에스라','느헤미야',
      '에스더','욥기','시편','잠언','전도서','아가','이사야','예레미야',
      '예레미야 애가','에스겔','다니엘','호세아','요엘','아모스','오바댜','요나','미가','나훔',
      '하박국','스바냐','학개','스가랴','말라기'],
    ntBooks: ['마태복음','마가복음','누가복음','요한복음','사도행전','로마서','고린도전서','고린도후서',
      '갈라디아서','에베소서','빌립보서','골로새서','데살로니가전서','데살로니가후서',
      '디모데전서','디모데후서','디도서','빌레몬서','히브리서','야고보서','베드로전서','베드로후서',
      '요한1서','요한2서','요한3서','유다서','요한계시록'],
    // 요한복음 3:16 개역개정
    verse: '하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라',
    hiddenEasy: new Set([3, 4, 10]),               // 사랑하사, 독생자를, 멸망하지
    hiddenHard: new Set([0,1,2,3,4,5,8,9,10,12,13]), // show: 이는, 그를, 않고, 하려, 하심이라
  },
};

// ─── Shared CSS ────────────────────────────────────────────────────────────────
const BASE_STYLES = (scale) => `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', Roboto, sans-serif;
    background: #fff;
    overflow: hidden;
  }
  .status-bar {
    height: ${44*scale}px;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 ${24*scale}px;
    border-bottom: 1px solid #e0e0e0;
  }
  .status-time { font-size: ${17*scale}px; font-weight: 600; }
  .status-icons { font-size: ${15*scale}px; letter-spacing: ${3*scale}px; }
  .screen { padding: ${32*scale}px ${28*scale}px; height: calc(100vh - ${44*scale}px); display: flex; flex-direction: column; }
`;

const statusBar = (scale) => `
  <div class="status-bar">
    <span class="status-time">9:41</span>
    <span class="status-icons">&#9650; &#9670; &#9646;</span>
  </div>
`;

// ─── Screen builders ───────────────────────────────────────────────────────────
const homeHTML = (scale, loc) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_STYLES(scale)}
.version-badge {
  position: absolute; top: ${54*scale}px; right: ${28*scale}px;
  font-size: ${13*scale}px; color: #888;
}
.home-inner {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; align-items: center; gap: ${24*scale}px;
}
.app-title {
  font-size: ${34*scale}px; font-weight: 500;
  text-align: center; margin-bottom: ${16*scale}px; color: #222;
}
.btn {
  background: #BFA58A; color: #fff;
  border: none; border-radius: ${6*scale}px;
  padding: ${18*scale}px 0; width: ${340*scale}px;
  font-size: ${20*scale}px; cursor: pointer; text-align: center;
}
</style></head><body>
${statusBar(scale)}
<div class="screen" style="position:relative">
  <span class="version-badge">${loc.versionBadge}</span>
  <div class="home-inner">
    <div class="app-title">${loc.appName}</div>
    ${loc.buttons.map(b => `<button class="btn">${b}</button>`).join('\n    ')}
  </div>
</div>
</body></html>`;

const selectBookHTML = (scale, loc) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_STYLES(scale)}
.screen { overflow: hidden; }
.page-title { font-size: ${22*scale}px; font-weight: 700; margin-bottom: ${18*scale}px; }
.section-title { font-size: ${17*scale}px; font-weight: 700; color: #444;
  margin-top: ${14*scale}px; margin-bottom: ${10*scale}px; }
.book-grid { display: flex; flex-wrap: wrap; gap: ${6*scale}px; }
.book-btn {
  background: #BFA58A; color: #fff; border: none;
  border-radius: ${5*scale}px;
  padding: ${10*scale}px ${4*scale}px;
  width: calc(33.33% - ${4*scale}px);
  font-size: ${14*scale}px; text-align: center; cursor: pointer;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
</style></head><body>
${statusBar(scale)}
<div class="screen">
  <div class="page-title">${loc.selectBookTitle}</div>
  <div class="section-title">${loc.oldT}</div>
  <div class="book-grid">
    ${loc.otBooks.slice(0, 24).map(b => `<button class="book-btn">${b}</button>`).join('')}
  </div>
  <div class="section-title">${loc.newT}</div>
  <div class="book-grid">
    ${loc.ntBooks.slice(0, 9).map(b => `<button class="book-btn">${b}</button>`).join('')}
  </div>
</div>
</body></html>`;

const selectChapterHTML = (scale, loc) => `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_STYLES(scale)}
.back-btn { color: #78A2CC; font-size: ${19*scale}px; margin-bottom: ${18*scale}px; cursor: pointer; }
.page-title { font-size: ${22*scale}px; font-weight: 700; margin-bottom: ${20*scale}px; }
.chapter-grid { display: flex; flex-wrap: wrap; gap: ${7*scale}px; }
.ch-btn {
  background: #BFA58A; color: #fff; border: none;
  border-radius: ${5*scale}px;
  padding: ${12*scale}px 0;
  width: calc(33.33% - ${5*scale}px);
  font-size: ${17*scale}px; text-align: center; cursor: pointer;
}
</style></head><body>
${statusBar(scale)}
<div class="screen">
  <div class="back-btn">${loc.backToBooks}</div>
  <div class="page-title">${loc.selectChapterTitle}</div>
  <div class="chapter-grid">
    ${Array.from({length: 21}, (_, i) => i+1).map(c => `<button class="ch-btn">${loc.chapterLabel(c)}</button>`).join('')}
  </div>
</div>
</body></html>`;

const renderWords = (words, hiddenSet, scale) =>
  words.map((w, i) => hiddenSet.has(i)
    ? `<span style="display:inline-block;position:relative;margin:0 ${3*scale}px ${4*scale}px 0">
         <span style="opacity:0;font-size:${20*scale}px">${w}</span>
         <span style="position:absolute;inset:0;background:#e0e0e0;border-radius:${3*scale}px"></span>
       </span>`
    : `<span style="font-size:${20*scale}px;margin:0 ${3*scale}px ${4*scale}px 0">${w}</span>`
  ).join('');

const memorizationHTML = (scale, loc, difficulty, hiddenSet) => {
  const words = loc.verse.split(' ');
  const [easy, medium, hard, full] = loc.diff;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_STYLES(scale)}
.diff-label { font-size: ${16*scale}px; margin-bottom: ${10*scale}px; color: #333; }
.diff-row { display: flex; gap: ${4*scale}px; margin-bottom: ${22*scale}px; }
.diff-btn {
  flex: 1; padding: ${11*scale}px 0;
  border-radius: ${5*scale}px; border: 2px solid transparent;
  font-size: ${14*scale}px; cursor: pointer; text-align: center;
}
.diff-active { border-color: #808080 !important; }
.verse-box {
  background: #f0f0f0; border-radius: ${10*scale}px;
  padding: ${22*scale}px; margin-bottom: ${22*scale}px; flex: 1;
}
.verse-num { font-size: ${16*scale}px; font-weight: 700; margin-bottom: ${10*scale}px; }
.verse-text { display: flex; flex-wrap: wrap; align-items: baseline; line-height: 1.7; }
.action-row {
  display: flex; justify-content: space-around; align-items: center;
  padding: ${14*scale}px 0;
}
.icon { font-size: ${28*scale}px; color: #78A2CC; cursor: pointer; }
.icon-gray { font-size: ${28*scale}px; color: #ccc; cursor: pointer; }
</style></head><body>
${statusBar(scale)}
<div class="screen">
  <div class="diff-label">${loc.difficultyLabel}</div>
  <div class="diff-row">
    <button class="diff-btn${difficulty==='easy'?' diff-active':''}" style="background:#B8E6B8">${easy}</button>
    <button class="diff-btn${difficulty==='medium'?' diff-active':''}" style="background:#FFE5B4">${medium}</button>
    <button class="diff-btn${difficulty==='hard'?' diff-active':''}" style="background:#FFB3BA">${hard}</button>
    <button class="diff-btn${difficulty==='full'?' diff-active':''}" style="background:#FF6B6B">${full}</button>
  </div>
  <div class="verse-box">
    <div class="verse-num">${loc.verseLabel}</div>
    <div class="verse-text">${renderWords(words, hiddenSet, scale)}</div>
  </div>
  <div class="action-row">
    <span class="icon">&#128065;</span>
    <span class="icon-gray">&lsaquo;</span>
    <span class="icon">&rsaquo;</span>
    <span class="icon">&#8635;</span>
  </div>
</div>
</body></html>`;
};

const settingsHTML = (scale, loc) => {
  const radioCircle = (filled) => filled
    ? `<div style="width:${22*scale}px;height:${22*scale}px;border-radius:50%;border:2px solid #BFA58A;display:flex;align-items:center;justify-content:center">
         <div style="width:${12*scale}px;height:${12*scale}px;border-radius:50%;background:#BFA58A"></div></div>`
    : `<div style="width:${22*scale}px;height:${22*scale}px;border-radius:50%;border:2px solid #BFA58A"></div>`;
  return `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
${BASE_STYLES(scale)}
.section-title { font-size: ${21*scale}px; font-weight: 700; margin-top: ${24*scale}px; margin-bottom: ${14*scale}px; }
.radio-row { display: flex; align-items: center; margin-bottom: ${14*scale}px; gap: ${12*scale}px; }
.radio-label { font-size: ${17*scale}px; color: #222; }
</style></head><body>
${statusBar(scale)}
<div class="screen">
  <div class="section-title">${loc.langTitle}</div>
  ${loc.langOptions.map(o => `
  <div class="radio-row">
    ${radioCircle(o.selected)}
    <span class="radio-label">${o.label}</span>
  </div>`).join('')}
  <div class="section-title">${loc.translationTitle}</div>
  ${loc.translations.map(t => `
  <div class="radio-row">
    ${radioCircle(t.selected)}
    <span class="radio-label">${t.label}</span>
  </div>`).join('')}
</div>
</body></html>`;
};

// ─── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  let total = 0;

  for (const [langKey, loc] of Object.entries(LOCALES)) {
    for (const size of SIZES) {
      const scale = size.width / 390;
      const page = await browser.newPage();
      await page.setViewport({ width: size.width, height: size.height, deviceScaleFactor: 1 });

      const folderName = size.name + loc.suffix;
      const sizeDir = path.join(OUT_DIR, folderName);
      if (!fs.existsSync(sizeDir)) fs.mkdirSync(sizeDir);

      const screens = [
        { id: 'home',           html: homeHTML(scale, loc) },
        { id: 'select_book',    html: selectBookHTML(scale, loc) },
        { id: 'select_chapter', html: selectChapterHTML(scale, loc) },
        { id: 'memorize_easy',  html: memorizationHTML(scale, loc, 'easy', loc.hiddenEasy) },
        { id: 'memorize_hard',  html: memorizationHTML(scale, loc, 'hard', loc.hiddenHard) },
        { id: 'settings',       html: settingsHTML(scale, loc) },
      ];

      for (const screen of screens) {
        await page.setContent(screen.html, { waitUntil: 'domcontentloaded' });
        const outPath = path.join(sizeDir, `${screen.id}.png`);
        await page.screenshot({ path: outPath, type: 'png' });
        console.log(`✓ ${folderName}/${screen.id}.png`);
        total++;
      }

      await page.close();
    }
  }

  await browser.close();
  console.log(`\nDone — ${total} screenshots saved to screenshots/`);
})();
