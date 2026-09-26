#!/usr/bin/env node
/**
 * Facebook Page → JSON + RSS feed scraper for Skål International Taipei.
 *
 * How it works (no login, no Graph API token):
 *   Facebook serves a server-rendered snapshot of a *public* Page to crawler
 *   user agents. That HTML embeds Relay JSON blobs in
 *   <script type="application/json"> tags, each post being a "Story" object
 *   with post_id, creation_time, message.text, permalink url and photo
 *   attachments. We parse those, download the photos (fbcdn URLs expire after
 *   ~1 month, so we must persist them), and emit:
 *
 *     content/facebook-feed.json   – structured posts for the website
 *     public/feed.xml              – standard RSS 2.0 feed
 *     public/images/feed/*.jpg     – persisted post photos
 *
 * Usage:  node scripts/fetch-facebook-feed.mjs [--page SLUG] [--limit N] [--no-images]
 *
 * Designed to run on a schedule (GitHub Actions cron) and commit the result,
 * which triggers a Cloudflare Pages rebuild.
 */
import fs from "node:fs";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a, i, arr) => {
    if (!a.startsWith("--")) return [];
    const key = a.slice(2);
    const next = arr[i + 1];
    return [key, next && !next.startsWith("--") ? next : true];
  }).filter((p) => p.length),
);

const PAGE_SLUG = args.page || "SkalInternationalTaipei.Since1970";
const PAGE_URL = `https://www.facebook.com/${PAGE_SLUG}/`;
const LIMIT = Number(args.limit || 40);
const DOWNLOAD_IMAGES = args["no-images"] !== true;
const SITE_URL = process.env.SITE_URL || "https://skaltaipei.org.tw";

const OUT_JSON = "content/facebook-feed.json";
const OUT_RSS = "public/feed.xml";
const IMG_DIR = "public/images/feed";

// Facebook returns the richest server-rendered snapshot for Googlebot.
// Order matters: try the richest first, fall back to others.
const USER_AGENTS = [
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  "curl/8.4.0",
];

async function fetchPageHtml() {
  let lastErr;
  for (const ua of USER_AGENTS) {
    try {
      const res = await fetch(PAGE_URL, {
        headers: { "user-agent": ua, accept: "text/html,*/*", "accept-language": "en-US,en;q=0.9" },
        redirect: "follow",
      });
      const html = await res.text();
      const storyCount = (html.match(/"__typename":"Story"/g) || []).length;
      console.log(`fetched with ${ua.split(" ")[0]} → HTTP ${res.status}, ${html.length} bytes, ${storyCount} stories`);
      if (res.ok && storyCount > 0) return html;
      lastErr = new Error(`HTTP ${res.status} / ${storyCount} stories`);
    } catch (e) {
      lastErr = e;
      console.warn(`fetch failed with ${ua}:`, e.message);
    }
  }
  throw new Error(`Could not fetch a usable page snapshot: ${lastErr?.message}`);
}

/** Extract every <script type="application/json"> blob and JSON.parse it. */
function extractJsonBlobs(html) {
  const blobs = [];
  for (const m of html.matchAll(/<script type="application\/json"[^>]*>(.*?)<\/script>/gs)) {
    try {
      blobs.push(JSON.parse(m[1]));
    } catch {
      /* ignore non-JSON */
    }
  }
  return blobs;
}

/** Recursively collect image URIs (largest per media id) under a node. */
function collectImages(node, out = new Map()) {
  if (!node || typeof node !== "object") return out;
  if (Array.isArray(node)) {
    node.forEach((n) => collectImages(n, out));
    return out;
  }
  for (const key of ["photo_image", "viewer_image", "image", "large_share_image"]) {
    const img = node[key];
    if (
      img &&
      typeof img.uri === "string" &&
      /fbcdn\.net|lookaside\.fbsbx\.com/.test(img.uri) &&
      !/\/t39\.30808-1\//.test(img.uri) // t39.30808-1 = profile pictures; skip
    ) {
      // Key by media id so we keep one (largest) variant per photo.
      const id =
        img.uri.match(/media_id=(\d+)/)?.[1] || img.uri.match(/\/(\d+_\d+_\d+)_n\./)?.[1] || img.uri;
      const area = (img.width || 0) * (img.height || 0);
      const prev = out.get(id);
      if (!prev || area > prev.area) out.set(id, { uri: img.uri, area, width: img.width, height: img.height });
    }
  }
  for (const k in node) collectImages(node[k], out);
  return out;
}

/** Walk all blobs and merge Story fragments by post_id. */
function collectStories(blobs) {
  const stories = new Map();
  const touch = (id) => {
    if (!stories.has(id)) stories.set(id, { post_id: id, images: new Map() });
    return stories.get(id);
  };
  function walk(o) {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);

    if (typeof o.post_id === "string" && (o.message || o.comet_sections || o.attachments || o.creation_time)) {
      const s = touch(o.post_id);
      if (o.message?.text) s.text = o.message.text;
      if (o.creation_time) s.creation_time = o.creation_time;
      const url = o.permalink_url || o.wwwURL || o.url;
      if (typeof url === "string" && url.includes("facebook.com")) s.url = url;
      if (o.attachments) collectImages(o.attachments, s.images);
      if (o.actors?.[0]?.name) s.actor = o.actors[0].name;
      if (o.actors?.[0]?.url) s.actor_url = o.actors[0].url;
    }
    // Timestamp sections: {"story":{"creation_time":..., "url":"…/posts/…"}}
    if (o.story && typeof o.story === "object" && o.story.creation_time && typeof o.story.url === "string") {
      const m = o.story.url.match(/\/posts\/([A-Za-z0-9]+)/);
      // We cannot map pfbid → post_id here; handled via post_id objects above.
      void m;
    }
    for (const k in o) walk(o[k]);
  }
  blobs.forEach(walk);
  return [...stories.values()];
}

function decodeText(t) {
  return (t || "").replace(/\r/g, "").trim();
}

/**
 * Derive a headline from the post body: the first line that is not just a
 * date stamp / salutation / hashtag soup. Falls back to the first non-empty line.
 */
function firstLine(text, max = 90) {
  const lines = decodeText(text).split("\n").map((l) => l.trim()).filter(Boolean);
  const weak = (l) =>
    /^\d{4}[-./]\d{1,2}[-./]\d{1,2}$/.test(l) || // "2026-02-11"
    /^(dear|hello|hi)\b.*,?$/i.test(l) || // "Dear Skalleagues,"
    /^[-–—\s]*$/.test(l) ||
    (l.split(/\s+/).every((w) => w.startsWith("#")) && l.length > 0); // only hashtags
  let line = lines.find((l) => !weak(l) && l.replace(/[^\p{L}\p{N}]/gu, "").length >= 12) || lines[0] || "";
  line = line.replace(/^[-–—\s]+/, "").replace(/^\d{4}[-./]\d{1,2}[-./]\d{1,2}\s+/, "");
  return line.length > max ? line.slice(0, max - 1).trimEnd() + "…" : line;
}

async function downloadImage(uri, dest) {
  if (fs.existsSync(dest)) return true;
  // lookaside.fbsbx.com only serves the JPEG to crawler UAs (Googlebot works);
  // plain browsers/curl get a 388-byte HTML stub instead.
  const res = await fetch(uri, { headers: { "user-agent": USER_AGENTS[0] }, redirect: "follow" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const type = res.headers.get("content-type") || "";
  const buf = Buffer.from(await res.arrayBuffer());
  if (!type.startsWith("image/")) throw new Error(`not an image (${type})`);
  if (buf.length < 2000) throw new Error("suspiciously small image");
  fs.writeFileSync(dest, buf);
  return false;
}

function escapeXml(s) {
  return s.replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));
}

function buildRss(posts) {
  const items = posts
    .map((p) => {
      const img = p.images[0] ? `<enclosure url="${escapeXml(SITE_URL + p.images[0])}" type="image/jpeg" length="0"/>` : "";
      const html = `<p>${escapeXml(p.text).replace(/\n/g, "<br/>")}</p>` +
        p.images.map((i) => `<p><img src="${escapeXml(SITE_URL + i)}" alt=""/></p>`).join("");
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${escapeXml(p.url)}</link>
      <guid isPermaLink="false">fb-${p.id}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${html}]]></description>
      ${img}
    </item>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Skål International Taipei — Current Events</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Latest news and events from Skål International Taipei (mirrored from our Facebook page).</description>
    <language>en</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

async function main() {
  const html = await fetchPageHtml();
  const blobs = extractJsonBlobs(html);
  const raw = collectStories(blobs);

  // Keep only posts authored on this page (drop shared posts from other actors).
  const own = raw.filter((s) => s.creation_time && s.url && s.url.includes(`facebook.com/${PAGE_SLUG}/`));
  own.sort((a, b) => b.creation_time - a.creation_time);
  console.log(`found ${raw.length} story objects, ${own.length} own posts`);

  // Merge with previously saved posts so older items are never lost when they
  // scroll off Facebook's first page.
  const previous = fs.existsSync(OUT_JSON) ? JSON.parse(fs.readFileSync(OUT_JSON, "utf8")).posts || [] : [];
  const byId = new Map(previous.map((p) => [p.id, p]));

  fs.mkdirSync(IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });

  let newImages = 0;
  for (const s of own) {
    const prev = byId.get(s.post_id);
    const images = prev?.images ? [...prev.images] : [];
    if (DOWNLOAD_IMAGES) {
      let n = 0;
      for (const { uri } of s.images.values()) {
        n++;
        const dest = `${IMG_DIR}/${s.post_id}-${n}.jpg`;
        const rel = "/" + dest.replace(/^public\//, "");
        if (images.includes(rel)) continue;
        try {
          const existed = await downloadImage(uri, dest);
          if (!existed) newImages++;
          images.push(rel);
        } catch (e) {
          console.warn(`  image ${s.post_id}-${n} failed: ${e.message}`);
        }
      }
    }
    const text = decodeText(s.text || prev?.text || "");
    byId.set(s.post_id, {
      id: s.post_id,
      date: new Date(s.creation_time * 1000).toISOString(),
      title: firstLine(text) || (images.length ? "Photo update" : "Update"),
      text,
      url: s.url,
      images,
      hasText: text.length > 0,
    });
  }

  const posts = [...byId.values()]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, LIMIT);

  const output = {
    source: PAGE_URL,
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };
  fs.writeFileSync(OUT_JSON, JSON.stringify(output, null, 2) + "\n");
  fs.writeFileSync(OUT_RSS, buildRss(posts.filter((p) => p.hasText)));
  console.log(`wrote ${OUT_JSON} (${posts.length} posts), ${OUT_RSS}, ${newImages} new images`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
