/* ============================================
   DevKit HQ — Domain Lookup API
   Vercel Serverless Function
   Queries RDAP for domain registration info
   ============================================ */

// RDAP server mapping for common TLDs
const RDAP_SERVERS = {
  com: 'https://rdap.verisign.com/com/v1/domain/',
  net: 'https://rdap.verisign.com/net/v1/domain/',
  org: 'https://rdap.publicinterestregistry.org/rdap/domain/',
  io: 'https://rdap.nic.io/v1/domain/',
  co: 'https://rdap.nic.co/v1/domain/',
  ai: 'https://rdap.nic.ai/v1/domain/',
  dev: 'https://rdap.nic.google/v1/domain/',
  app: 'https://rdap.nic.google/v1/domain/',
  sh: 'https://rdap.nic.sh/v1/domain/',
  cc: 'https://rdap.nic.cc/v1/domain/',
  me: 'https://rdap.nic.me/v1/domain/',
  tv: 'https://rdap.nic.tv/v1/domain/',
  xyz: 'https://rdap.centralnic.com/xyz/v1/domain/',
  info: 'https://rdap.afilias.net/rdap/v1/domain/',
  biz: 'https://rdap.nic.biz/v1/domain/',
  pro: 'https://rdap.afilias.net/rdap/v1/domain/',
  online: 'https://rdap.centralnic.com/online/v1/domain/',
  shop: 'https://rdap.centralnic.com/shop/v1/domain/',
  site: 'https://rdap.centralnic.com/site/v1/domain/',
  tech: 'https://rdap.centralnic.com/tech/v1/domain/',
  cloud: 'https://rdap.centralnic.com/cloud/v1/domain/',
  tools: 'https://rdap.centralnic.com/tools/v1/domain/',
  ooo: 'https://rdap.centralnic.com/ooo/v1/domain/',
};

// IANA RDAP bootstrap: maps TLD → RDAP base URLs
const IANA_BOOTSTRAP = 'https://data.iana.org/rdap/dns.json';

let bootstrapCache = null;
let bootstrapCacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

async function getRdapServer(tld) {
  // Check known servers first
  if (RDAP_SERVERS[tld]) return RDAP_SERVERS[tld];

  // Try IANA bootstrap for unknown TLDs
  try {
    if (!bootstrapCache || Date.now() - bootstrapCacheTime > CACHE_TTL) {
      const resp = await fetch(IANA_BOOTSTRAP);
      if (resp.ok) {
        bootstrapCache = await resp.json();
        bootstrapCacheTime = Date.now();
      }
    }
    if (bootstrapCache) {
      for (const svc of bootstrapCache.services || []) {
        if (svc[0] && svc[0].includes(tld)) return svc[1][0];
      }
    }
  } catch (e) {
    // Bootstrap failed, fall through
  }
  return null;
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const domain = (searchParams.get('domain') || '').trim().toLowerCase();

  if (!domain) {
    return res.status(400).json({ error: '请提供 domain 参数' });
  }

  // Basic validation: strip protocol/path if accidentally included
  const cleaned = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').split(':')[0];
  const parts = cleaned.split('.');
  if (parts.length < 2) {
    return res.status(400).json({ error: '域名格式不正确，请输入如 example.com' });
  }

  const tld = parts[parts.length - 1];
  const baseUrl = await getRdapServer(tld);

  if (!baseUrl) {
    return res.status(404).json({ error: `暂不支持 .${tld} 后缀，请尝试 .com/.net/.org/.io 等常见后缀` });
  }

  try {
    const rdapUrl = baseUrl + encodeURIComponent(cleaned);
    const rdapResp = await fetch(rdapUrl, {
      headers: { 'Accept': 'application/rdap+json, application/json' },
      signal: AbortSignal.timeout(8000),
    });

    if (!rdapResp.ok) {
      if (rdapResp.status === 404) {
        return res.status(200).json({
          domain: cleaned,
          available: true,
          registered: false,
          message: `${cleaned} 未被注册，可以抢注`,
        });
      }
      return res.status(502).json({ error: `RDAP 查询失败: HTTP ${rdapResp.status}` });
    }

    const data = await rdapResp.json();

    // Parse RDAP response into a clean format
    const events = (data.events || []).map(e => ({
      action: e.eventAction,
      date: e.eventDate,
    }));

    const status = (data.status || []).filter(s => !s.startsWith('server')).join(', ') || '无特殊状态';

    const nameservers = (data.nameservers || []).map(ns => ns.ldhName || ns.unicodeName).filter(Boolean);

    // Find registrar info
    let registrar = '未知';
    for (const entity of data.entities || []) {
      if (entity.roles && entity.roles.includes('registrar')) {
        registrar = entity.vcardArray?.[1]?.[1]?.[3] || entity.handle || '未知';
        break;
      }
    }

    return res.status(200).json({
      domain: cleaned,
      available: false,
      registered: true,
      tld: `.${tld}`,
      registrar,
      status,
      nameservers,
      events,
      created: events.find(e => e.action === 'registration')?.date || null,
      updated: events.find(e => e.action === 'last changed' || e.action === 'last update of RDAP database')?.date || null,
      expires: events.find(e => e.action === 'expiration')?.date || null,
    });

  } catch (e) {
    if (e.name === 'TimeoutError' || e.name === 'AbortError') {
      return res.status(504).json({ error: '查询超时，请重试' });
    }
    return res.status(500).json({ error: `查询出错: ${e.message}` });
  }
}
