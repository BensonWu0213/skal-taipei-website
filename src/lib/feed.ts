/**
 * Build-time loader for the Current Events section.
 *
 * Data:   content/facebook-feed.json   (written by scripts/fetch-facebook-feed.mjs)
 * Copy:   content/feed-overrides.json  (hand-written headlines / summaries, optional)
 * Images: public/images/feed/<post_id>-<n>.jpg (downloaded by the same script)
 *
 * Images stay in public/ so the RSS feed keeps stable URLs; the ones shown on the
 * page are additionally imported here so Astro can resize/convert them at build.
 */
import type { ImageMetadata } from "astro";
import feed from "../../content/facebook-feed.json";
import overridesRaw from "../../content/feed-overrides.json";

export interface FeedPost {
  id: string;
  date: string;
  title: string;
  text: string;
  url: string;
  images: string[];
  hasText: boolean;
}

export interface FeedOverride {
  title?: string;
  summary?: string;
  tag?: string;
  hide?: boolean;
}

export interface EventCard {
  id: string;
  date: Date;
  dateISO: string;
  dateLabel: string;
  title: string;
  summary: string;
  tag?: string;
  url: string;
  image?: ImageMetadata;
  /** true for portrait flyers → rendered with object-fit: contain on navy */
  portrait: boolean;
}

const overrides: Record<string, FeedOverride> = Object.fromEntries(
  Object.entries(overridesRaw as Record<string, unknown>).filter(
    ([key, value]) => !key.startsWith("_") && typeof value === "object" && value !== null,
  ),
) as Record<string, FeedOverride>;

// Every feed photo, keyed by its public URL ("/images/feed/<id>-<n>.jpg").
const imageModules = import.meta.glob<{ default: ImageMetadata }>(
  "/public/images/feed/*.{jpg,jpeg,png,webp}",
  { eager: true },
);
const imagesByUrl = new Map<string, ImageMetadata>();
for (const [path, mod] of Object.entries(imageModules)) {
  imagesByUrl.set(path.replace(/^\/public/, ""), mod.default);
}

// Manual "26 Sep 2026" — Intl en-GB on newer ICU yields "Sept", which the design does not want.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const partsFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
  timeZone: "Asia/Taipei",
});
function formatDate(date: Date): string {
  const parts = Object.fromEntries(partsFormatter.formatToParts(date).map((p) => [p.type, p.value]));
  return `${Number(parts.day)} ${MONTHS[Number(parts.month) - 1]} ${parts.year}`;
}

/** Turn the raw Facebook text into a one-paragraph summary without the headline line. */
function autoSummary(text: string, title: string, max = 260): string {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.replace(/^[-–—\s]+/, "").trim())
    .filter(Boolean);
  const titleKey = title.replace(/…$/, "").trim().toLowerCase();
  const body = lines.filter((l) => !l.toLowerCase().startsWith(titleKey.slice(0, 40)));
  const joined = (body.length ? body : lines).join(" ").replace(/\s+/g, " ").trim();
  if (joined.length <= max) return joined;
  const cut = joined.slice(0, max);
  return cut.slice(0, Math.max(cut.lastIndexOf(" "), max - 40)).trim() + "…";
}

function cleanTitle(title: string): string {
  return title
    .replace(/^[-–—\s]+/, "")
    .replace(/^[\p{Extended_Pictographic}\p{Emoji_Presentation}\uFE0F\u200D\s]+/u, "")
    .replace(/\s*#\w+/g, "")
    .trim();
}

export function getEventCards(limit: number): EventCard[] {
  const posts = (feed.posts as FeedPost[])
    .filter((p) => !overrides[p.id]?.hide)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, limit);

  return posts.map((post) => {
    const o = overrides[post.id] ?? {};
    const title = o.title ?? cleanTitle(post.title);
    const summary = o.summary ?? autoSummary(post.text, post.title);
    const date = new Date(post.date);
    const image = post.images[0] ? imagesByUrl.get(post.images[0]) : undefined;
    const portrait = image ? image.height > image.width * 1.1 : false;

    return {
      id: post.id,
      date,
      dateISO: date.toISOString().slice(0, 10),
      dateLabel: formatDate(date),
      title,
      summary,
      tag: o.tag,
      url: post.url,
      image,
      portrait,
    };
  });
}

export const feedGeneratedAt: string = feed.generatedAt;
