import { env } from "cloudflare:workers";

export const ADMIN_COOKIE = "admin_session";
const CONTENT_KEY = "site";

type D1Result<T = unknown> = Promise<T>;

type D1PreparedStatementLike = {
  bind: (...values: unknown[]) => D1PreparedStatementLike;
  first: <T = Record<string, unknown>>() => D1Result<T | null>;
  all: <T = Record<string, unknown>>() => D1Result<{ results?: T[] }>;
  run: () => D1Result<unknown>;
};

type D1DatabaseLike = {
  prepare: (query: string) => D1PreparedStatementLike;
};

type R2ObjectBodyLike = {
  body: ReadableStream;
  httpMetadata?: { contentType?: string };
  writeHttpMetadata?: (headers: Headers) => void;
};

type R2BucketLike = {
  put: (
    key: string,
    value: ReadableStream | ArrayBuffer | Uint8Array,
    options?: { httpMetadata?: { contentType?: string } },
  ) => Promise<unknown>;
  get: (key: string) => Promise<R2ObjectBodyLike | null>;
  delete: (key: string) => Promise<void>;
};

type RuntimeEnv = {
  ADMIN_PASSWORD?: string;
  DB?: D1DatabaseLike;
  MEDIA?: R2BucketLike;
};

export type ContentSection = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  mediaPlacement: string;
  visible: boolean;
  order: number;
};

export type ContentPage = {
  id: string;
  slug: string;
  navLabel: string;
  title: string;
  body: string;
  visible: boolean;
  order: number;
};

export type DiscoverType = "project" | "blog" | "news";

export type DiscoverItem = {
  id: string;
  type: DiscoverType;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  date: string;
  link: string;
  mediaPlacement: string;
  visible: boolean;
  featured: boolean;
  order: number;
};

export type SiteContent = {
  contentVersion: number;
  siteTitle: string;
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    primaryLabel: string;
    secondaryLabel: string;
  };
  sections: ContentSection[];
  pages: ContentPage[];
  discoverItems: DiscoverItem[];
};

export type MediaItem = {
  id: string;
  filename: string;
  contentType: string;
  size: number;
  alt: string;
  placement: string;
  isVisible: boolean;
  createdAt: string;
  updatedAt: string;
  url: string;
};

type MediaRow = Omit<MediaItem, "isVisible" | "url"> & {
  objectKey: string;
  isVisible: number | boolean;
};

const LEGACY_DEFAULT_CONTENT: SiteContent = {
  contentVersion: 1,
  siteTitle: "300",
  hero: {
    eyebrow: "Cardano hub for 300",
    title: "300",
    body:
      "Token, 300 Degens NFTs, stake pool, DRep identity, Minswap trading, ADA access, and daily Cardano news in one arctic command center.",
    primaryLabel: "Trade 300",
    secondaryLabel: "View pool",
  },
  sections: [
    {
      id: "ecosystem",
      eyebrow: "Token + NFTs",
      title: "300 Token + 300 Degens",
      body:
        "The 300 token and 300 Degens collection belong together: one Cardano identity for trading, collecting, staking, governance, and community updates.",
      ctaLabel: "Open collection",
      ctaHref:
        "https://www.wayup.io/collection/585f70537a92ac23c87c913fba12cb8251c07032ba0a44c851fd3cd6",
      mediaPlacement: "ecosystem",
      visible: true,
      order: 10,
    },
    {
      id: "drep-profile",
      eyebrow: "Governance",
      title: "DRep profile",
      body:
        "The 300 DRep profile shows live delegated ADA and governance status from Cardano on-chain data.",
      ctaLabel: "",
      ctaHref: "",
      mediaPlacement: "drep",
      visible: true,
      order: 20,
    },
  ],
  pages: [
    {
      id: "about-300",
      slug: "about",
      navLabel: "About",
      title: "About 300",
      body:
        "300 brings a Cardano token, 300 Degens NFTs, stake pool operation, and DRep participation into one clean hub.",
      visible: true,
      order: 10,
    },
  ],
  discoverItems: [],
};

export const DEFAULT_CONTENT: SiteContent = {
  contentVersion: 3,
  siteTitle: "300",
  hero: {
    eyebrow: "300 made readable",
    title: "300",
    body:
      "A simple entry point into the 300 ecosystem: understand the token, NFTs, pool, governance, and next steps without needing to already speak crypto.",
    primaryLabel: "Start exploring",
    secondaryLabel: "View pool",
  },
  sections: [
    {
      id: "ecosystem",
      eyebrow: "Token + NFTs",
      title: "300 Token + 300 Degens",
      body:
        "The 300 token and 300 Degens collection sit together as one public identity: easy to inspect, easy to follow, and connected to live Cardano data.",
      ctaLabel: "Open collection",
      ctaHref:
        "https://www.wayup.io/collection/585f70537a92ac23c87c913fba12cb8251c07032ba0a44c851fd3cd6",
      mediaPlacement: "ecosystem",
      visible: true,
      order: 10,
    },
    {
      id: "spo-profile",
      eyebrow: "Stake pool",
      title: "300 SPO",
      body:
        "The 300 stake pool profile turns pool activity, live stake, delegation, and blocks into a quick snapshot that visitors can understand at a glance.",
      ctaLabel: "View pool",
      ctaHref:
        "https://pool.pm/61d0c2697209cc772297ac9ca784bc0bebf321cffbfe8c8c85d8ab7f",
      mediaPlacement: "spo",
      visible: true,
      order: 20,
    },
    {
      id: "drep-profile",
      eyebrow: "Governance",
      title: "300 DRep",
      body:
        "The DRep profile shows governance status and delegated ADA from on-chain data, so participation is visible without sending visitors through separate explorers.",
      ctaLabel: "",
      ctaHref: "",
      mediaPlacement: "drep",
      visible: true,
      order: 30,
    },
    {
      id: "how-it-works",
      eyebrow: "How it works",
      title: "One route into the 300 ecosystem",
      body:
        "Start with the live overview, read Discover for context, connect a wallet only when you need it, and use the trade section when you are ready to get ADA or swap 300.",
      ctaLabel: "Start with Discover",
      ctaHref: "#discover",
      mediaPlacement: "discover",
      visible: true,
      order: 40,
    },
  ],
  pages: [
    {
      id: "about-300",
      slug: "about",
      navLabel: "About",
      title: "About 300",
      body:
        "300 connects a token, NFT collection, stake pool, and DRep profile in one public hub. The goal is simple: make important Cardano signals easier to read, verify, and act on.",
      visible: true,
      order: 10,
    },
  ],
  discoverItems: [
    {
      id: "discover-300-hub",
      type: "project",
      slug: "300-cardano-hub",
      title: "300 Cardano hub",
      excerpt:
        "A plain-language home for 300: token, NFTs, SPO metrics, DRep status, swaps, ADA access, and daily Cardano discovery.",
      body:
        "300spo.live is designed as a practical hub rather than a brochure. Visitors should quickly understand what 300 is, what can be verified live, and which next step fits them: learn, read, connect, trade, or follow the community.",
      date: "2026-06-25",
      link: "",
      mediaPlacement: "discover",
      visible: true,
      featured: true,
      order: 10,
    },
    {
      id: "discover-governance",
      type: "blog",
      slug: "governance-made-readable",
      title: "Governance made readable",
      excerpt:
        "DRep information should be understandable at a glance: delegated ADA, status, and context in one place.",
      body:
        "Cardano governance can feel fragmented when the relevant signals live across multiple explorers. The 300 DRep profile brings the key public values into the same interface as the token, NFTs, pool, and community updates.",
      date: "2026-06-25",
      link: "",
      mediaPlacement: "drep",
      visible: true,
      featured: true,
      order: 20,
    },
    {
      id: "discover-community-projects",
      type: "project",
      slug: "community-projects",
      title: "Community projects",
      excerpt:
        "A clean lane for projects, collaborations, releases, and initiatives that should be visible from the front page.",
      body:
        "Discover can be expanded from the admin area with projects, articles, and updates. Each item can be published, hidden, featured, linked externally, or paired with uploaded media.",
      date: "2026-06-25",
      link: "",
      mediaPlacement: "gallery",
      visible: true,
      featured: false,
      order: 30,
    },
  ],
};

const V2_TEXT = {
  heroEyebrow: "300 on Cardano",
  heroBody:
    "A focused Cardano home for the 300 token, 300 Degens, stake pool, and DRep profile: live on-chain data, simple trading, governance context, and daily discovery in one clean place.",
  heroPrimaryLabel: "Discover 300",
  sections: {
    ecosystem:
      "The 300 token and 300 Degens collection are presented as one ecosystem: a recognizable Cardano identity for holders, collectors, traders, and community members who want live data instead of static promises.",
    "spo-profile":
      "The 300 stake pool profile gives visitors a direct view into pool activity, live stake, delegation, blocks, and Cardano network participation. It keeps the operational side of 300 visible and easy to understand.",
    "drep-profile":
      "The DRep profile shows current delegated ADA and status from on-chain data, so governance participation is visible without asking visitors to search through separate explorers.",
    "how-it-works":
      "Explore the live metrics, connect a Cardano wallet, trade the 300 token through Minswap, follow daily Cardano updates, and return to Discover for projects, blog posts, and governance notes.",
  },
  about:
    "300 connects token utility, NFT culture, stake pool operation, and Cardano governance in one public hub. The goal is simple: make the important signals easy to read, easy to verify, and easy to act on.",
  discover: {
    "discover-300-hub": {
      excerpt:
        "The public home for 300: token, NFTs, SPO metrics, DRep status, swaps, ADA access, and daily Cardano discovery.",
      body:
        "300spo.live is designed as a practical hub rather than a brochure. Visitors should immediately understand what 300 is, what live data is available, and which action makes sense next: discover, trade, delegate, read, or contact the community.",
    },
    "discover-governance": {
      excerpt:
        "DRep information should be understandable at a glance: delegated ADA, status, IDs, and context in one place.",
    },
    "discover-community-projects": {
      body:
        "Discover can be expanded from the admin area with new projects, blog posts, and news-style updates. Each item can be published, hidden, featured, linked externally, or paired with uploaded media.",
    },
  },
};

let schemaReady = false;

function runtimeEnv() {
  return env as unknown as RuntimeEnv;
}

function getDb() {
  return runtimeEnv().DB ?? null;
}

function getBucket() {
  return runtimeEnv().MEDIA ?? null;
}

function nowIso() {
  return new Date().toISOString();
}

function asString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = true) {
  return typeof value === "boolean" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asDiscoverType(value: unknown): DiscoverType {
  return value === "blog" || value === "news" || value === "project"
    ? value
    : "project";
}

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `page-${crypto.randomUUID().slice(0, 8)}`;
}

function normalizeSection(section: Partial<ContentSection>, index: number) {
  return {
    id: asString(section.id) || crypto.randomUUID(),
    eyebrow: asString(section.eyebrow),
    title: asString(section.title, "New section"),
    body: asString(section.body),
    ctaLabel: asString(section.ctaLabel),
    ctaHref: asString(section.ctaHref),
    mediaPlacement: asString(section.mediaPlacement, "gallery"),
    visible: asBoolean(section.visible, true),
    order: asNumber(section.order, (index + 1) * 10),
  };
}

function normalizePage(page: Partial<ContentPage>, index: number) {
  const title = asString(page.title, "New page");
  return {
    id: asString(page.id) || crypto.randomUUID(),
    slug: slugify(asString(page.slug) || title),
    navLabel: asString(page.navLabel, title),
    title,
    body: asString(page.body),
    visible: asBoolean(page.visible, true),
    order: asNumber(page.order, (index + 1) * 10),
  };
}

function normalizeDiscoverItem(item: Partial<DiscoverItem>, index: number) {
  const title = asString(item.title, "New item");

  return {
    id: asString(item.id) || crypto.randomUUID(),
    type: asDiscoverType(item.type),
    slug: slugify(asString(item.slug) || title),
    title,
    excerpt: asString(item.excerpt),
    body: asString(item.body),
    date: asString(item.date),
    link: asString(item.link),
    mediaPlacement: asString(item.mediaPlacement, "discover"),
    visible: asBoolean(item.visible, true),
    featured: asBoolean(item.featured, false),
    order: asNumber(item.order, (index + 1) * 10),
  };
}

function replaceKnownText(
  current: string,
  knownValues: Array<string | undefined>,
  next: string,
) {
  return knownValues.includes(current) ? next : current;
}

function upgradeContent(content: SiteContent): SiteContent {
  if (content.contentVersion >= DEFAULT_CONTENT.contentVersion) {
    return content;
  }

  const upgraded: SiteContent = {
    ...content,
    contentVersion: DEFAULT_CONTENT.contentVersion,
    hero: {
      eyebrow: replaceKnownText(
        content.hero.eyebrow,
        [LEGACY_DEFAULT_CONTENT.hero.eyebrow, V2_TEXT.heroEyebrow],
        DEFAULT_CONTENT.hero.eyebrow,
      ),
      title: content.hero.title,
      body: replaceKnownText(
        content.hero.body,
        [LEGACY_DEFAULT_CONTENT.hero.body, V2_TEXT.heroBody],
        DEFAULT_CONTENT.hero.body,
      ),
      primaryLabel: replaceKnownText(
        content.hero.primaryLabel,
        [LEGACY_DEFAULT_CONTENT.hero.primaryLabel, V2_TEXT.heroPrimaryLabel],
        DEFAULT_CONTENT.hero.primaryLabel,
      ),
      secondaryLabel: content.hero.secondaryLabel,
    },
    sections: [...content.sections],
    pages: [...content.pages],
    discoverItems:
      content.discoverItems.length > 0
        ? content.discoverItems
        : DEFAULT_CONTENT.discoverItems,
  };

  const legacySections = new Map(
    LEGACY_DEFAULT_CONTENT.sections.map((section) => [section.id, section]),
  );
  const defaultSections = new Map(
    DEFAULT_CONTENT.sections.map((section) => [section.id, section]),
  );

  upgraded.sections = upgraded.sections.map((section) => {
    const legacy = legacySections.get(section.id);
    const next = defaultSections.get(section.id);

    if (!next) {
      return section;
    }

    return {
      ...section,
      eyebrow: replaceKnownText(section.eyebrow, [legacy?.eyebrow], next.eyebrow),
      title: replaceKnownText(section.title, [legacy?.title], next.title),
      body: replaceKnownText(
        section.body,
        [
          legacy?.body,
          V2_TEXT.sections[section.id as keyof typeof V2_TEXT.sections],
        ],
        next.body,
      ),
      ctaLabel: replaceKnownText(
        section.ctaLabel,
        [legacy?.ctaLabel],
        next.ctaLabel,
      ),
      ctaHref: replaceKnownText(section.ctaHref, [legacy?.ctaHref], next.ctaHref),
      mediaPlacement: section.mediaPlacement || next.mediaPlacement,
      order: section.order || next.order,
    };
  });

  const existingSectionIds = new Set(upgraded.sections.map((section) => section.id));
  for (const section of DEFAULT_CONTENT.sections) {
    if (!existingSectionIds.has(section.id)) {
      upgraded.sections.push(section);
    }
  }

  const legacyPages = new Map(
    LEGACY_DEFAULT_CONTENT.pages.map((page) => [page.id, page]),
  );
  const defaultPages = new Map(DEFAULT_CONTENT.pages.map((page) => [page.id, page]));
  upgraded.pages = upgraded.pages.map((page) => {
    const legacy = legacyPages.get(page.id);
    const next = defaultPages.get(page.id);

    return next
      ? {
          ...page,
          title: replaceKnownText(page.title, [legacy?.title], next.title),
          body: replaceKnownText(page.body, [legacy?.body, V2_TEXT.about], next.body),
        }
      : page;
  });

  const defaultDiscover = new Map(
    DEFAULT_CONTENT.discoverItems.map((item) => [item.id, item]),
  );
  upgraded.discoverItems = upgraded.discoverItems.map((item) => {
    const next = defaultDiscover.get(item.id);
    const previous = V2_TEXT.discover[
      item.id as keyof typeof V2_TEXT.discover
    ] as { excerpt?: string; body?: string } | undefined;

    return next
      ? {
          ...item,
          excerpt: replaceKnownText(
            item.excerpt,
            [previous?.excerpt],
            next.excerpt,
          ),
          body: replaceKnownText(item.body, [previous?.body], next.body),
        }
      : item;
  });

  return upgraded;
}

export function normalizeContent(value: Partial<SiteContent>): SiteContent {
  const hero = value.hero ?? {};

  return {
    contentVersion: asNumber(value.contentVersion, 1),
    siteTitle: asString(value.siteTitle, DEFAULT_CONTENT.siteTitle),
    hero: {
      eyebrow: asString(hero.eyebrow, DEFAULT_CONTENT.hero.eyebrow),
      title: asString(hero.title, DEFAULT_CONTENT.hero.title),
      body: asString(hero.body, DEFAULT_CONTENT.hero.body),
      primaryLabel: asString(hero.primaryLabel, DEFAULT_CONTENT.hero.primaryLabel),
      secondaryLabel: asString(
        hero.secondaryLabel,
        DEFAULT_CONTENT.hero.secondaryLabel,
      ),
    },
    sections: Array.isArray(value.sections)
      ? value.sections.map(normalizeSection)
      : DEFAULT_CONTENT.sections,
    pages: Array.isArray(value.pages)
      ? value.pages.map(normalizePage)
      : DEFAULT_CONTENT.pages,
    discoverItems: Array.isArray(value.discoverItems)
      ? value.discoverItems.map(normalizeDiscoverItem)
      : DEFAULT_CONTENT.discoverItems,
  };
}

async function ensureSchema(db: D1DatabaseLike) {
  if (schemaReady) {
    return;
  }

  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS content_entries (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();
  await db
    .prepare(
      `CREATE TABLE IF NOT EXISTS media_items (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        content_type TEXT NOT NULL,
        size INTEGER NOT NULL,
        object_key TEXT NOT NULL,
        alt TEXT NOT NULL DEFAULT '',
        placement TEXT NOT NULL DEFAULT 'library',
        is_visible INTEGER NOT NULL DEFAULT 1,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
    )
    .run();

  schemaReady = true;
}

async function seedContent(db: D1DatabaseLike) {
  const row = await db
    .prepare("SELECT value FROM content_entries WHERE key = ?")
    .bind(CONTENT_KEY)
    .first<{ value: string }>();

  if (row?.value) {
    const normalized = normalizeContent(JSON.parse(row.value) as Partial<SiteContent>);
    const upgraded = upgradeContent(normalized);

    if (JSON.stringify(upgraded) !== JSON.stringify(normalized)) {
      await db
        .prepare(
          `UPDATE content_entries
           SET value = ?, updated_at = ?
           WHERE key = ?`,
        )
        .bind(JSON.stringify(upgraded), nowIso(), CONTENT_KEY)
        .run();
    }

    return upgraded;
  }

  const timestamp = nowIso();
  await db
    .prepare(
      "INSERT INTO content_entries (key, value, updated_at) VALUES (?, ?, ?)",
    )
    .bind(CONTENT_KEY, JSON.stringify(DEFAULT_CONTENT), timestamp)
    .run();

  return DEFAULT_CONTENT;
}

function mediaFromRow(row: MediaRow): MediaItem {
  return {
    id: row.id,
    filename: row.filename,
    contentType: row.contentType,
    size: row.size,
    alt: row.alt,
    placement: row.placement,
    isVisible: row.isVisible === true || row.isVisible === 1,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    url: `/api/media/${row.id}`,
  };
}

async function getMediaRows(db: D1DatabaseLike, includeHidden: boolean) {
  const query = includeHidden
    ? `SELECT id, filename, content_type as contentType, size, object_key as objectKey,
        alt, placement, is_visible as isVisible, created_at as createdAt,
        updated_at as updatedAt
       FROM media_items
       ORDER BY updated_at DESC`
    : `SELECT id, filename, content_type as contentType, size, object_key as objectKey,
        alt, placement, is_visible as isVisible, created_at as createdAt,
        updated_at as updatedAt
       FROM media_items
       WHERE is_visible = 1
       ORDER BY updated_at DESC`;

  const result = await db.prepare(query).all<MediaRow>();
  return result.results ?? [];
}

export async function getSitePayload(options?: { includeHiddenMedia?: boolean }) {
  const db = getDb();
  if (!db) {
    return { content: DEFAULT_CONTENT, media: [] as MediaItem[], storageReady: false };
  }

  await ensureSchema(db);
  const [content, mediaRows] = await Promise.all([
    seedContent(db),
    getMediaRows(db, options?.includeHiddenMedia ?? false),
  ]);

  return {
    content,
    media: mediaRows.map(mediaFromRow),
    storageReady: Boolean(getBucket()),
  };
}

export async function saveSiteContent(content: SiteContent) {
  const db = getDb();
  if (!db) {
    throw new Error("D1 storage is not configured.");
  }

  await ensureSchema(db);
  const normalized = upgradeContent(normalizeContent(content));
  await db
    .prepare(
      `INSERT INTO content_entries (key, value, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    )
    .bind(CONTENT_KEY, JSON.stringify(normalized), nowIso())
    .run();

  return normalized;
}

export function adminConfigured() {
  return Boolean(runtimeEnv().ADMIN_PASSWORD);
}

async function sha256Base64Url(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  const binary = String.fromCharCode(...new Uint8Array(digest));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function expectedAdminToken() {
  const password = runtimeEnv().ADMIN_PASSWORD;
  if (!password) {
    return null;
  }
  return sha256Base64Url(`300:${password}`);
}

function parseCookie(header: string | null, name: string) {
  return (
    header
      ?.split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${name}=`))
      ?.slice(name.length + 1) ?? null
  );
}

export async function isAdminRequest(request: Request) {
  const expected = await expectedAdminToken();
  const actual = parseCookie(request.headers.get("cookie"), ADMIN_COOKIE);
  return Boolean(expected && actual && expected === actual);
}

export function adminCookie(value: string, request: Request) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${ADMIN_COOKIE}=${value}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure}`;
}

export function clearAdminCookie() {
  return `${ADMIN_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`;
}

function safeFilename(value: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "") || "upload"
  );
}

export async function insertMediaItem(options: {
  file: File;
  alt: string;
  placement: string;
  isVisible: boolean;
}) {
  const db = getDb();
  const bucket = getBucket();

  if (!db || !bucket) {
    throw new Error("D1 and R2 storage are required for media uploads.");
  }

  await ensureSchema(db);

  const id = crypto.randomUUID();
  const filename = safeFilename(options.file.name);
  const objectKey = `uploads/${id}-${filename}`;
  const contentType = options.file.type || "application/octet-stream";
  const timestamp = nowIso();

  await bucket.put(objectKey, options.file.stream(), {
    httpMetadata: { contentType },
  });

  await db
    .prepare(
      `INSERT INTO media_items
        (id, filename, content_type, size, object_key, alt, placement, is_visible, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      id,
      filename,
      contentType,
      options.file.size,
      objectKey,
      options.alt,
      options.placement,
      options.isVisible ? 1 : 0,
      timestamp,
      timestamp,
    )
    .run();

  return mediaFromRow({
    id,
    filename,
    contentType,
    size: options.file.size,
    objectKey,
    alt: options.alt,
    placement: options.placement,
    isVisible: options.isVisible,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
}

export async function updateMediaItem(
  id: string,
  updates: Partial<Pick<MediaItem, "alt" | "placement" | "isVisible">>,
) {
  const db = getDb();
  if (!db) {
    throw new Error("D1 storage is not configured.");
  }

  await ensureSchema(db);
  const row = await db
    .prepare(
      `SELECT id, filename, content_type as contentType, size, object_key as objectKey,
        alt, placement, is_visible as isVisible, created_at as createdAt,
        updated_at as updatedAt
       FROM media_items
       WHERE id = ?`,
    )
    .bind(id)
    .first<MediaRow>();

  if (!row) {
    return null;
  }

  const next = {
    alt: updates.alt ?? row.alt,
    placement: updates.placement ?? row.placement,
    isVisible:
      typeof updates.isVisible === "boolean"
        ? updates.isVisible
        : row.isVisible === true || row.isVisible === 1,
    updatedAt: nowIso(),
  };

  await db
    .prepare(
      `UPDATE media_items
       SET alt = ?, placement = ?, is_visible = ?, updated_at = ?
       WHERE id = ?`,
    )
    .bind(next.alt, next.placement, next.isVisible ? 1 : 0, next.updatedAt, id)
    .run();

  return mediaFromRow({
    ...row,
    ...next,
  });
}

export async function getMediaObject(id: string, includeHidden: boolean) {
  const db = getDb();
  const bucket = getBucket();
  if (!db || !bucket) {
    return null;
  }

  await ensureSchema(db);
  const row = await db
    .prepare(
      `SELECT id, filename, content_type as contentType, size, object_key as objectKey,
        alt, placement, is_visible as isVisible, created_at as createdAt,
        updated_at as updatedAt
       FROM media_items
       WHERE id = ?`,
    )
    .bind(id)
    .first<MediaRow>();

  if (!row) {
    return null;
  }

  const visible = row.isVisible === true || row.isVisible === 1;
  if (!visible && !includeHidden) {
    return null;
  }

  const object = await bucket.get(row.objectKey);
  if (!object) {
    return null;
  }

  return { item: mediaFromRow(row), object };
}
