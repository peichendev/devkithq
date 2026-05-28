/* ============================================
   DevKit HQ — Image Compressor
   ============================================ */

let files = [];
let compressed = new Map();
let processing = false;

const dz = document.getElementById('dropzone');
const fi = document.getElementById('fileInput');
const grid = document.getElementById('imgGrid');
const cb = document.getElementById('countBar');
const cn = document.getElementById('countNum');
const pa = document.getElementById('progressArea');
const pf = document.getElementById('progFill');
const pt = document.getElementById('progText');
const sb = document.getElementById('stickyBar');
const rc = document.getElementById('readyCount');
const cpBtn = document.getElementById('compressBtn');

// ===== Dropzone =====
dz.addEventListener('dragover', e => { e.preventDefault(); dz.classList.add('dragover'); });
dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
dz.addEventListener('drop', e => {
  e.preventDefault();
  dz.classList.remove('dragover');
  if (e.dataTransfer.files.length) addFiles([...e.dataTransfer.files]);
});
document.getElementById('uploadBtn').addEventListener('click', () => fi.click());
fi.addEventListener('change', e => {
  if (e.target.files.length) addFiles([...e.target.files]);
  fi.value = '';
});

function addFiles(fl) {
  const valid = fl.filter(f => {
    if (!['image/jpeg','image/png','image/webp'].includes(f.type)) return false;
    if (f.size > 20*1024*1024) return false;
    return true;
  });
  if (!valid.length) return;
  files = [...files, ...valid];
  renderGrid();
}

// ===== Render =====
function renderGrid() {
  grid.innerHTML = '';
  grid.classList.toggle('show', files.length > 0);
  cb.classList.toggle('show', files.length > 0);
  cn.textContent = files.length;

  files.forEach((f, i) => {
    const card = document.createElement('div');
    card.className = 'cmp-card';
    const cp = compressed.get(i);
    if (cp) card.classList.add('done');

    const img = document.createElement('img');
    img.src = URL.createObjectURL(f);
    card.appendChild(img);

    const name = document.createElement('div');
    name.className = 'name';
    name.textContent = f.name;
    card.appendChild(name);

    const size = document.createElement('div');
    size.className = 'size';
    if (cp) {
      const pct = Math.round((1 - cp.size / f.size) * 100);
      size.innerHTML = `<span style="text-decoration:line-through;color:var(--red)">${formatBytes(f.size)}</span> → <span style="color:var(--green);font-weight:600">${formatBytes(cp.size)}</span>`;
      const save = document.createElement('div');
      save.className = 'save';
      save.textContent = `-${pct}%`;
      card.appendChild(save);
      card.addEventListener('click', () => showModal(f, cp));
    } else {
      size.textContent = formatBytes(f.size);
    }
    card.appendChild(size);

    const del = document.createElement('button');
    del.className = 'del';
    del.textContent = '×';
    del.onclick = e => {
      e.stopPropagation();
      files.splice(i, 1);
      compressed.delete(i);
      // Remap keys for remaining files
      const newMap = new Map();
      compressed.forEach((v, k) => { if (k > i) newMap.set(k - 1, v); else newMap.set(k, v); });
      compressed = newMap;
      renderGrid();
      if (!files.length) resetAll();
    };
    card.appendChild(del);
    grid.appendChild(card);
  });
  updateSticky();
}

// ===== Compress All =====
cpBtn.addEventListener('click', () => {
  if (processing) return;
  const idxs = files.map((_, i) => i).filter(i => !compressed.has(i));
  if (!idxs.length) return;
  processing = true;
  cpBtn.disabled = true;
  pa.classList.add('show');
  pf.style.width = '0';

  let done = 0;
  const total = idxs.length;
  const mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

  function next() {
    if (done >= total) {
      processing = false;
      cpBtn.disabled = false;
      pt.textContent = '✅ ' + t('done');
      pf.style.width = '100%';
      updateSticky();
      return;
    }
    const idx = idxs[done];
    pt.textContent = t('processing') + ' ' + (done + 1) + '/' + total + ': ' + files[idx].name;

    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth;
      c.height = img.naturalHeight;
      c.getContext('2d').drawImage(img, 0, 0);
      c.toBlob(blob => {
        compressed.set(idx, blob);
        done++;
        pf.style.width = `${(done / total) * 100}%`;
        renderGrid();
        next();
      }, 'image/jpeg', 0.8);
    };
    img.src = URL.createObjectURL(files[idx]);
  }
  next();
});

// ===== Modal =====
const mo = document.getElementById('modalOverlay');
let lastBlob = null, lastFile = null, modalCanvas = null;

function showModal(file, blob) {
  lastBlob = blob;
  lastFile = file;
  modalCanvas = null;
  document.getElementById('modalQSlider').value = 80;
  document.getElementById('modalQVal').textContent = '80';
  document.getElementById('modalFmt').value = 'jpeg';
  document.getElementById('modalW').value = '0';
  mo.classList.add('show');

  document.getElementById('cmpPreview').src = URL.createObjectURL(blob);

  const mImg = new Image();
  mImg.onload = () => {
    const c = document.createElement('canvas');
    c.width = mImg.naturalWidth;
    c.height = mImg.naturalHeight;
    c.getContext('2d').drawImage(mImg, 0, 0);
    modalCanvas = c;
    animateCounters(file.size, blob.size);
  };
  mImg.src = URL.createObjectURL(file);
}

function animateCounters(origSize, compSize) {
  const cos = document.getElementById('origStat');
  const ccs = document.getElementById('compStat');
  const css = document.getElementById('saveStat');
  const savePct = Math.round((1 - compSize / origSize) * 100);
  let start = 0;
  const dur = 500, step = 16;
  function tick() {
    const p = Math.min(start / dur, 1);
    cos.textContent = formatBytes(Math.round(origSize * p));
    ccs.textContent = formatBytes(Math.round(compSize * p));
    start += step;
    if (p < 1) { requestAnimationFrame(tick); }
    else {
      cos.textContent = formatBytes(origSize);
      ccs.textContent = formatBytes(compSize);
      css.textContent = '-' + savePct + '%';
    }
  }
  requestAnimationFrame(tick);
}

function recompress(cb) {
  if (!modalCanvas || !lastFile) return;
  const q = parseInt(document.getElementById('modalQSlider').value) / 100;
  const mime = { jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
  const fmt = mime[document.getElementById('modalFmt').value] || 'image/jpeg';
  const mw = parseInt(document.getElementById('modalW').value);
  const c = document.createElement('canvas');
  let w = modalCanvas.width, h = modalCanvas.height;
  if (mw > 0 && w > mw) { h = Math.round((mw / w) * h); w = mw; }
  c.width = w; c.height = h;
  c.getContext('2d').drawImage(modalCanvas, 0, 0, w, h);
  c.toBlob(b => {
    if (!b) return;
    lastBlob = b;
    document.getElementById('cmpPreview').src = URL.createObjectURL(b);
    document.getElementById('compStat').textContent = formatBytes(b.size);
    document.getElementById('saveStat').textContent = '-' + Math.round((1 - b.size / lastFile.size) * 100) + '%';
    if (cb) cb(b);
  }, fmt, q);
}

// Modal events
document.getElementById('modalClose').addEventListener('click', () => mo.classList.remove('show'));
document.getElementById('modalCloseBtn').addEventListener('click', () => mo.classList.remove('show'));
mo.addEventListener('click', e => { if (e.target === mo) mo.classList.remove('show'); });

document.getElementById('modalQSlider').addEventListener('input', function() {
  document.getElementById('modalQVal').textContent = this.value;
  recompress();
});
document.getElementById('modalFmt').addEventListener('change', recompress);
document.getElementById('modalW').addEventListener('change', recompress);
document.getElementById('modalDownloadBtn').addEventListener('click', () => {
  if (!lastBlob || !lastFile) return;
  const ext = document.getElementById('modalFmt').value;
  const name = lastFile.name.replace(/\.[^.]+$/, '') + '.' + ext;
  const url = URL.createObjectURL(lastBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  a.click();
});

// ===== Sticky / Download =====
function updateSticky() {
  sb.classList.toggle('show', compressed.size > 0);
  rc.textContent = compressed.size;
}

document.getElementById('downloadBtn').addEventListener('click', async () => {
  const ext = 'jpeg';
  if (compressed.size === 1) {
    const [idx, blob] = compressed.entries().next().value;
    const name = files[idx].name.replace(/\.[^.]+$/,'') + '.' + ext;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    return;
  }
  // Multi-file ZIP
  toast(t('packing'));
  try {
    const parts = [];
    compressed.forEach((blob, idx) => {
      const name = files[idx].name.replace(/\.[^.]+$/,'') + '.' + ext;
      parts.push(new File([blob], name));
    });
    const zipResp = downloadZip(parts);
    const zipBlob = await zipResp.blob();
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a'); a.href = url; a.download = 'images.zip'; a.click();
    toast(t('downloadComplete'));
  } catch(e) {
    toast(t('packingFailed'));
    console.error(e);
  }
});

document.getElementById('startOverBtn').addEventListener('click', resetAll);
document.getElementById('clearBtn').addEventListener('click', resetAll);

function resetAll() {
  files = [];
  compressed = new Map();
  lastBlob = null;
  grid.innerHTML = '';
  grid.classList.remove('show');
  cb.classList.remove('show');
  pa.classList.remove('show');
  sb.classList.remove('show');
}

// ===== ZIP library (embedded CRC32 WASM) =====
var downloadZip = (() => {
  Blob.prototype.stream || Object.defineProperty(Blob.prototype, 'stream', { value() { return new Response(this).body } });
  DataView.prototype.setBigUint64 || Object.defineProperty(DataView.prototype, 'setBigUint64', { value(e, n, t) { this.setUint32(e+(t?0:4), Number(0xffffffffn & n), t); this.setUint32(e+(t?4:0), Number(n >> 32n), t) } });
  const f = e => new DataView(new ArrayBuffer(e));
  const r = e => new Uint8Array(e.buffer || e);
  const a = e => new TextEncoder().encode(String(e));
  const s = e => Math.min(4294967295, Number(e));
  const A = e => Math.min(65535, Number(e));

  function u(e, n) {
    if (e instanceof File) return { isFile: 1, t: n || new Date(e.lastModified), i: e.stream() };
    if (e instanceof Response) return { isFile: 1, t: n || new Date(e.headers.get('Last-Modified') || Date.now()), i: e.body };
    n = n || new Date();
    if (typeof e === 'string') return { isFile: 1, t: n, i: a(e) };
    if (e instanceof Blob) return { isFile: 1, t: n, i: e.stream() };
    if (e instanceof Uint8Array || e instanceof ReadableStream) return { isFile: 1, t: n, i: e };
    if (e instanceof ArrayBuffer || ArrayBuffer.isView(e)) return { isFile: 1, t: n, i: r(e) };
    if (Symbol.asyncIterator in e) return { isFile: 1, t: n, i: (function* (e) { for (const v of e) yield typeof v === 'string' ? a(v) : v instanceof Uint8Array ? v : r(v); })(e) };
    throw new TypeError('Unsupported input format.');
  }

  function y(e, n, t) {
    n = n instanceof Uint8Array ? n : a(n || (e instanceof File ? e.name : ''));
    if (e instanceof File) return { o: B(n || a(e.name)), A: BigInt(e.size) };
    if (e instanceof Response) {
      const cd = e.headers.get('content-disposition');
      const m = cd && cd.match(/;\s*filename\*?=["']?(.*?)["']?$/i);
      const fn = (m && m[1]) || (e.url && new URL(e.url).pathname.split('/').filter(Boolean).pop());
      return { o: B(n || a(fn ? decodeURIComponent(fn) : '')), A: BigInt(t || +e.headers.get('content-length') || 0) };
    }
    n = B(n, true);
    return typeof e === 'string' ? { o: n, A: BigInt(a(e).length) }
      : e instanceof Blob ? { o: n, A: BigInt(e.size) }
      : e instanceof ArrayBuffer || ArrayBuffer.isView(e) ? { o: n, A: BigInt(e.byteLength) }
      : { o: n, A: BigInt(t || 0) };
  }

  function B(e, isFile = true) {
    if (!e || e.every(b => b === 47)) throw new Error('File must have a name.');
    if (isFile) { while (e[e.length - 1] === 47) e = e.subarray(0, -1); }
    else if (e[e.length - 1] !== 47) e = new Uint8Array([...e, 47]);
    return e;
  }

  const { c, m } = new WebAssembly.Instance(new WebAssembly.Module(Uint8Array.from(atob('AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw=='), b => b.charCodeAt(0))));
  const I = 65536, g = r(m).subarray(I);

  function p(e, n = 0) {
    for (const chunk of (function*(e){while(e.length>I){yield e.subarray(0,I);e=e.subarray(I)}e.length&&(yield e)})(e)) {
      g.set(chunk); n = c(chunk.length, n);
    }
    return n;
  }

  function D(e, n, t = 0) {
    n.setUint16(t, (e.getSeconds()>>1)|(e.getMinutes()<<5)|(e.getHours()<<11), 1);
    n.setUint16(t+2, e.getDate()|((e.getMonth()+1)<<5)|((e.getFullYear()-1980)<<9), 1);
  }

  function v(e) {
    const n = f(30);
    n.setUint32(0, 1347093252); n.setUint32(4, 754976768);
    D(e.t, n, 10); n.setUint16(26, e.o.length, 1);
    return r(n);
  }

  async function* h(e) {
    let { i: stream } = e;
    if (stream.then) stream = await stream;
    if (stream instanceof Uint8Array) { yield stream; e.u = p(stream, 0); e.A = BigInt(stream.length); }
    else {
      e.A = 0n; const reader = stream.getReader();
      for (;;) { const { value, done } = await reader.read(); if (done) break; e.u = p(value, e.u); e.A += BigInt(value.length); yield value; }
    }
  }

  function F(e, n) {
    const t = f(16 + (n ? 8 : 0));
    t.setUint32(0, 1347094280); t.setUint32(4, e.isFile ? e.u : 0, 1);
    if (n) { t.setBigUint64(8, e.A, 1); t.setBigUint64(16, e.A, 1); }
    else { t.setUint32(8, s(e.A), 1); t.setUint32(12, s(e.A), 1); }
    return r(t);
  }

  function Q(e, n, t = 0) {
    const i = f(46);
    i.setUint32(0, 1347092738); i.setUint32(4, 755182848); i.setUint16(8, 2048);
    D(e.t, i, 12); i.setUint32(16, e.isFile ? e.u : 0, 1);
    i.setUint32(20, s(e.A), 1); i.setUint32(24, s(e.A), 1);
    i.setUint16(28, e.o.length, 1); i.setUint16(30, t, 1);
    i.setUint16(40, e.isFile ? 33204 : 16893, 1); i.setUint32(42, s(n), 1);
    return r(i);
  }

  function E(e, n, t) {
    const i = f(t);
    i.setUint16(0, 1, 1); i.setUint16(2, t - 4, 1);
    if (t & 16) { i.setBigUint64(4, e.A, 1); i.setBigUint64(12, e.A, 1); }
    i.setBigUint64(t - 8, n, 1);
    return r(i);
  }

  function C(e) {
    return e instanceof File || e instanceof Response
      ? [[e], [e]]
      : [[e.input, e.name, e.size], [e.input, e.lastModified]];
  }

  function N(e) {
    let n = BigInt(22), t = 0n, use64 = false;
    for (const o of e) {
      if (!o.o) throw new Error('Every file must have a non-empty name.');
      if (o.A === undefined) throw new Error(`Missing size for file "${new TextDecoder().decode(o.o)}".`);
      const bigSize = o.A >= 0xffffffffn, bigOff = t >= 0xffffffffn;
      t += BigInt(46 + o.o.length + (bigSize ? 8 : 0)) + o.A;
      n += BigInt(o.o.length + 46 + (bigOff ? 12 : 0) + (bigSize ? 28 : 0));
      use64 = use64 || bigSize;
    }
    if (use64 || t >= 0xffffffffn) n += BigInt(76);
    return n + t;
  }

  return function(e, n = {}) {
    const headers = { 'Content-Type': 'application/zip', 'Content-Disposition': 'attachment' };
    n.metadata && (headers['Content-Length'] = String(N(n.metadata)));

    async function* streamZip(entries) {
      const recs = []; let off = 0n, recIdx = 0, useZip64 = false;
      for await (const entry of entries) {
        yield v(entry); yield entry.o;
        if (entry.isFile) yield* h(entry);
        const bigSize = entry.A >= 0xffffffffn;
        const extraSz = (off >= 0xffffffffn ? 12 : 0) + (bigSize ? 28 : 0);
        yield F(entry, bigSize);
        recs.push(Q(entry, off, extraSz)); recs.push(entry.o);
        if (extraSz) recs.push(E(entry, off, extraSz));
        if (bigSize) off += 8n;
        recIdx++; off += BigInt(46 + entry.o.length) + entry.A;
        useZip64 = useZip64 || bigSize;
      }
      let dirSize = 0n;
      for (const r of recs) { yield r; dirSize += BigInt(r.length); }
      if (useZip64 || off >= 0xffffffffn) {
        const z64 = f(76);
        z64.setUint32(0, 1347094022); z64.setBigUint64(4, 44n, 1);
        z64.setUint32(12, 755182848); z64.setBigUint64(24, BigInt(recIdx), 1);
        z64.setBigUint64(32, BigInt(recIdx), 1); z64.setBigUint64(40, dirSize, 1);
        z64.setBigUint64(48, off, 1); z64.setUint32(56, 1347094023);
        z64.setBigUint64(64, off + dirSize, 1); z64.setUint32(72, 1, 1);
        yield r(z64);
      }
      const eocd = f(22);
      eocd.setUint32(0, 1347093766); eocd.setUint16(8, A(recIdx), 1);
      eocd.setUint16(10, A(recIdx), 1); eocd.setUint32(12, s(dirSize), 1);
      eocd.setUint32(16, s(off), 1);
      yield r(eocd);
    }

    return new Response(new ReadableStream({
      async start(ctrl) {
        const writer = ctrl;
        for await (const chunk of streamZip(
          (async function* (items) {
            for await (const item of items) {
              const [meta, val] = C(item);
              yield Object.assign(u(...val), y(...meta));
            }
          })(e)
        )) { writer.enqueue(chunk); }
        writer.close();
      }
    }), { headers });
  };
})();
