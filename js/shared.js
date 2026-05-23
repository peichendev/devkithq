/* ============================================
   DevKit HQ — Shared JS
   Nav, Theme, i18n, Utilities
   ============================================ */

// ===== i18n =====
const I18N = {
  zh: {
    // Nav
    navHome: '首页',
    navImageTools: '图片工具',
    navDevTools: '开发工具',
    navDomain: '域名查询',
    // Homepage
    heroBadge: '12 款免费在线工具',
    heroTitle: '图片与代码工具<br><span>都在浏览器里完成</span>',
    heroSub: '隐私优先，所有数据在本地处理。开发者与设计师的在线工具箱。',
    heroCTA: '开始使用',
    heroGithub: 'GitHub',
    secImage: '图片工具',
    secImageSub: '压缩、转换、水印、调色 — 全部在 Canvas 本地处理',
    secDev: '开发工具',
    secDevSub: '格式化、编解码、时间戳 — 程序员日常必备',
    // Tool card descriptions
    descCompress: '智能压缩 JPEG / PNG / WebP，批量处理，本地完成',
    descConvert: '图片格式互转 JPEG ↔ PNG ↔ WebP，可调质量与尺寸',
    descResize: '自由裁剪和缩放图片，可视化操作',
    descWatermark: '添加文字或图片水印，保护你的作品',
    descImgBase64: '将图片编码为 Base64 文本，一键复制',
    descPalette: '上传图片提取主色调，生成配色方案',
    descJson: '粘贴 JSON 一键美化，错误自动标注行号',
    descBase64: '文本 ↔ Base64 编解码，支持中文',
    descUrl: 'URL 编解码，encodeURI / decodeURI',
    descTimestamp: 'Unix 时间戳 ↔ 人类可读日期时间互转',
    descMarkdown: '实时预览 Markdown 渲染效果，分栏编辑',
    descDomain: '查询域名 WHOIS 信息，判断是否可注册',
    // Tool names
    toolCompress: '图片压缩',
    toolConvert: '格式转换',
    toolResize: '裁剪缩放',
    toolWatermark: '水印工具',
    toolImgBase64: '图片转 Base64',
    toolPalette: '色彩提取',
    toolJson: 'JSON 格式化',
    toolBase64: 'Base64 编解码',
    toolUrl: 'URL 编解码',
    toolTimestamp: '时间戳转换',
    toolMarkdown: 'Markdown 预览',
    toolDomain: '域名查询',
    // Tool page taglines
    taglineCompress: '智能压缩 JPEG / PNG / WebP，所有处理在浏览器本地完成',
    taglineConvert: 'JPEG / PNG / WebP 互转，可调质量与尺寸',
    taglineResize: '可视化裁剪图片，支持锁定比例与预设尺寸',
    taglineWatermark: '添加文字或图片水印，保护你的作品',
    taglineImgBase64: '将图片编码为 Base64 文本，可直接嵌入 HTML/CSS',
    taglinePalette: '上传图片，自动提取主色调与配色方案',
    taglineJson: '粘贴 JSON 一键美化或压缩，错误自动标注行号，支持一键复制',
    taglineBase64: '文本 ↔ Base64 在线编解码，支持中文等 Unicode 字符',
    taglineUrl: 'URL 编码与解码，使用标准 encodeURIComponent / decodeURIComponent',
    taglineTimestamp: 'Unix 时间戳 ↔ 日期时间互转，支持秒/毫秒自动识别',
    taglineMarkdown: '实时编辑预览 Markdown，支持 GitHub Flavored Markdown',
    taglineDomain: '查询域名 WHOIS 信息，判断能否注册',
    // Footer
    footerImageTools: '图片工具',
    footerDevTools: '开发工具',
    footerAbout: '关于',
    footerAboutText: '为开发者和设计师打造的免费在线工具箱。所有工具均在浏览器本地运行，数据不会上传到任何服务器。',
    footerBottom: '© 2026 DevKit HQ · 浏览器本地处理 · 隐私优先',
    footerMadeWith: 'Made with',
    // Tool page common
    backHome: '← 返回首页',
    // Footer (simple)
    footer: '© 2026 DevKit HQ · 所有工具均在浏览器本地运行 · 隐私安全',
    // Home stats
    statTools: '款工具',
    statLocal: '浏览器本地',
    statPrivacy: '数据上传',
    // Theme
    themeDark: '暗色模式',
    themeLight: '亮色模式',
    // Toast
    copied: '已复制到剪贴板',
    error: '操作失败，请重试',
    processing: '处理中...',
    done: '完成',
  },
  en: {
    navHome: 'Home',
    navImageTools: 'Image Tools',
    navDevTools: 'Dev Tools',
    navDomain: 'Domain Lookup',
    heroBadge: '12 Free Online Tools',
    heroTitle: 'Image &amp; code tools<br><span>all in your browser</span>',
    heroSub: 'Privacy-first. Everything runs locally. The online toolbox for developers and designers.',
    heroCTA: 'Get Started',
    heroGithub: 'GitHub',
    secImage: 'Image Tools',
    secImageSub: 'Compress, convert, watermark, extract palettes — all via Canvas',
    secDev: 'Dev Tools',
    secDevSub: 'Format, encode, decode — daily essentials for developers',
    descCompress: 'Smart compression for JPEG / PNG / WebP. Batch processing, local.',
    descConvert: 'Convert between JPEG, PNG, WebP with quality and size controls.',
    descResize: 'Crop and resize images with an interactive visual editor.',
    descWatermark: 'Add text or image watermarks to protect your work.',
    descImgBase64: 'Encode images to Base64 text. One-click copy.',
    descPalette: 'Extract dominant colors from any image. Generate palettes.',
    descJson: 'Paste messy JSON, get instant formatting with error highlighting.',
    descBase64: 'Encode and decode text to/from Base64. Supports Unicode.',
    descUrl: 'URL encode and decode. encodeURI / decodeURI.',
    descTimestamp: 'Convert between Unix timestamps and human-readable dates.',
    descMarkdown: 'Live Markdown preview with split-pane editing.',
    descDomain: 'Look up WHOIS info for any domain. Check availability.',
    toolCompress: 'Image Compress',
    toolConvert: 'Format Convert',
    toolResize: 'Crop & Resize',
    toolWatermark: 'Watermark',
    toolImgBase64: 'Image to Base64',
    toolPalette: 'Color Palette',
    toolJson: 'JSON Formatter',
    toolBase64: 'Base64 Codec',
    toolUrl: 'URL Codec',
    toolTimestamp: 'Timestamp',
    toolMarkdown: 'Markdown Preview',
    toolDomain: 'Domain Lookup',
    taglineCompress: 'Smart JPEG / PNG / WebP compression. All processing done locally in your browser.',
    taglineConvert: 'Convert between JPEG, PNG, WebP formats with quality and size controls.',
    taglineResize: 'Visual crop tool with aspect ratio lock and preset sizes.',
    taglineWatermark: 'Add text or image watermarks to protect your work.',
    taglineImgBase64: 'Encode images to Base64 text for embedding in HTML/CSS.',
    taglinePalette: 'Upload an image to automatically extract dominant colors and palettes.',
    taglineJson: 'Paste JSON, get instant formatting or minification with error line highlighting. One-click copy.',
    taglineBase64: 'Online Base64 encoder and decoder. Supports Unicode characters.',
    taglineUrl: 'URL encode and decode. Standard encodeURIComponent / decodeURIComponent.',
    taglineTimestamp: 'Convert between Unix timestamps and dates. Auto-detects seconds/milliseconds.',
    taglineMarkdown: 'Live Markdown editor with split-pane preview. GitHub Flavored Markdown.',
    taglineDomain: 'Look up WHOIS info for any domain. Check registration availability.',
    footerImageTools: 'Image Tools',
    footerDevTools: 'Dev Tools',
    footerAbout: 'About',
    footerAboutText: 'A free online toolbox for developers and designers. All tools run locally in your browser — no data is ever uploaded.',
    footerBottom: '© 2026 DevKit HQ · Local processing · Privacy first',
    footerMadeWith: 'Made with',
    backHome: '← Back to Home',
    footer: '© 2026 DevKit HQ · All tools run locally in your browser · Privacy first',
    statTools: 'Tools',
    statLocal: 'Local Processing',
    statPrivacy: 'No Data Upload',
    themeDark: 'Dark mode',
    themeLight: 'Light mode',
    copied: 'Copied to clipboard',
    error: 'Something went wrong. Please try again.',
    processing: 'Processing...',
    done: 'Done',
  }
};

let lang = localStorage.getItem('dk_lang') || (navigator.language.startsWith('zh') ? 'zh' : 'en');
let dark = localStorage.getItem('dk_theme') === null ? true : localStorage.getItem('dk_theme') === 'dark';

function t(key) {
  return I18N[lang][key] || key;
}

function applyI18n() {
  document.querySelectorAll('[data-i]').forEach(el => {
    const key = el.dataset.i;
    const val = I18N[lang][key];
    if (val !== undefined) {
      if (key.startsWith('heroTitle')) {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    }
  });
  // Update lang toggle button text
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.textContent = lang === 'zh' ? 'EN' : '中';
}

function toggleLang() {
  lang = lang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('dk_lang', lang);
  applyI18n();
}

// ===== Theme =====
function applyTheme() {
  if (dark) {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  const themeBtn = document.getElementById('themeBtn');
  if (themeBtn) themeBtn.textContent = dark ? '☀️' : '🌙';
  if (themeBtn) themeBtn.title = dark ? t('themeLight') : t('themeDark');
}

function toggleTheme() {
  dark = !dark;
  localStorage.setItem('dk_theme', dark ? 'dark' : 'light');
  applyTheme();
}

// ===== Nav =====
function renderNav(currentPage) {
  const nav = document.getElementById('nav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="nav-inner">
      <a href="/" class="nav-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="7" fill="url(#dkGrad)"/>
          <defs>
            <linearGradient id="dkGrad" x1="0" y1="0" x2="28" y2="28">
              <stop offset="0%" stop-color="#3b82f6"/>
              <stop offset="100%" stop-color="#6366f1"/>
            </linearGradient>
          </defs>
          <text x="14" y="19.5" text-anchor="middle" font-family="-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" font-size="15" font-weight="800" fill="#fff" letter-spacing="-0.5">DK</text>
        </svg>
        DevKit
      </a>
      <div class="nav-links">
        <a href="/" class="nav-link ${currentPage === 'home' ? 'active' : ''}" data-i="navHome">${t('navHome')}</a>
        <a href="/tools/compress.html" class="nav-link ${currentPage === 'image' ? 'active' : ''}" data-i="navImageTools">${t('navImageTools')}</a>
        <a href="/tools/json-formatter.html" class="nav-link ${currentPage === 'dev' ? 'active' : ''}" data-i="navDevTools">${t('navDevTools')}</a>
        <a href="/tools/domain-lookup.html" class="nav-link ${currentPage === 'domain' ? 'active' : ''}" data-i="navDomain">${t('navDomain')}</a>
      </div>
      <div class="nav-right">
        <button class="nav-icon" id="langBtn" title="Switch language">${lang === 'zh' ? 'EN' : '中'}</button>
        <button class="nav-icon" id="themeBtn" title="${dark ? t('themeLight') : t('themeDark')}">${dark ? '☀️' : '🌙'}</button>
      </div>
    </div>
  `;
  document.getElementById('langBtn').addEventListener('click', toggleLang);
  document.getElementById('themeBtn').addEventListener('click', toggleTheme);
}

// ===== Toast =====
function toast(msg, duration = 2500) {
  let el = document.getElementById('toast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

// ===== Utilities =====
function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)) + ' ' + sizes[i];
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => toast(t('copied'))).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); toast(t('copied')); } catch (e) { toast(t('error')); }
  document.body.removeChild(ta);
}

function debounce(fn, ms = 300) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), ms); };
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  applyTheme();
  applyI18n();
});
