"use client";

import type { ContentPage, ContentSection, MediaItem, SiteContent } from "@/app/lib/content";
import {
  Eye,
  EyeOff,
  FileText,
  Image as ImageIcon,
  LogOut,
  Plus,
  Save,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

type SessionState = {
  authenticated: boolean;
  configured: boolean;
};

type AdminPayload = {
  content: SiteContent;
  media: MediaItem[];
  storageReady: boolean;
};

const emptySession: SessionState = {
  authenticated: false,
  configured: true,
};

function makeSection(order: number): ContentSection {
  return {
    id: crypto.randomUUID(),
    eyebrow: "New",
    title: "New section",
    body: "",
    ctaLabel: "",
    ctaHref: "",
    mediaPlacement: "gallery",
    visible: true,
    order,
  };
}

function makePage(order: number): ContentPage {
  return {
    id: crypto.randomUUID(),
    slug: "new-page",
    navLabel: "New page",
    title: "New page",
    body: "",
    visible: true,
    order,
  };
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  const payload = (await response.json().catch(() => ({}))) as T & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(payload.error || "Request failed.");
  }

  return payload;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      aria-pressed={checked}
      className={`toggle-button ${checked ? "is-on" : ""}`}
      onClick={() => onChange(!checked)}
      type="button"
    >
      {checked ? <Eye size={16} /> : <EyeOff size={16} />}
      {label}
    </button>
  );
}

export function AdminPanel() {
  const [session, setSession] = useState<SessionState>(emptySession);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<SiteContent | null>(null);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "pages" | "media">(
    "content",
  );
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const sortedSections = useMemo(
    () => [...(content?.sections ?? [])].sort((a, b) => a.order - b.order),
    [content?.sections],
  );
  const sortedPages = useMemo(
    () => [...(content?.pages ?? [])].sort((a, b) => a.order - b.order),
    [content?.pages],
  );

  async function loadAdminPayload() {
    const payload = await fetchJson<AdminPayload>("/api/admin/content");
    setContent(payload.content);
    setMedia(payload.media);
    setStorageReady(payload.storageReady);
  }

  useEffect(() => {
    let alive = true;

    async function boot() {
      try {
        const nextSession =
          await fetchJson<SessionState>("/api/admin/session");
        if (!alive) {
          return;
        }
        setSession(nextSession);
        if (nextSession.authenticated) {
          await loadAdminPayload();
        }
      } catch (error) {
        if (alive) {
          setMessage(error instanceof Error ? error.message : "Admin unavailable.");
        }
      }
    }

    boot();

    return () => {
      alive = false;
    };
  }, []);

  async function login(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const nextSession = await fetchJson<SessionState>("/api/admin/session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      setSession({ ...nextSession, configured: true });
      setPassword("");
      await loadAdminPayload();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    setSession({ authenticated: false, configured: true });
    setContent(null);
    setMedia([]);
  }

  async function saveContent() {
    if (!content) {
      return;
    }

    setBusy(true);
    setMessage("");

    try {
      const payload = await fetchJson<{ content: SiteContent }>(
        "/api/admin/content",
        {
          method: "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content }),
        },
      );
      setContent(payload.content);
      setMessage("Saved.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function uploadMedia(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const formData = new FormData(event.currentTarget);
      const payload = await fetchJson<{ media: MediaItem }>("/api/admin/media", {
        method: "POST",
        body: formData,
      });
      setMedia((items) => [payload.media, ...items]);
      event.currentTarget.reset();
      setMessage("Uploaded.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function updateMedia(
    id: string,
    updates: Partial<Pick<MediaItem, "alt" | "placement" | "isVisible">>,
  ) {
    const payload = await fetchJson<{ media: MediaItem }>(
      `/api/admin/media/${id}`,
      {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(updates),
      },
    );
    setMedia((items) =>
      items.map((item) => (item.id === id ? payload.media : item)),
    );
  }

  function patchContent(next: Partial<SiteContent>) {
    setContent((current) => (current ? { ...current, ...next } : current));
  }

  function patchHero(next: Partial<SiteContent["hero"]>) {
    setContent((current) =>
      current
        ? {
            ...current,
            hero: { ...current.hero, ...next },
          }
        : current,
    );
  }

  function patchSection(id: string, next: Partial<ContentSection>) {
    setContent((current) =>
      current
        ? {
            ...current,
            sections: current.sections.map((section) =>
              section.id === id ? { ...section, ...next } : section,
            ),
          }
        : current,
    );
  }

  function patchPage(id: string, next: Partial<ContentPage>) {
    setContent((current) =>
      current
        ? {
            ...current,
            pages: current.pages.map((page) =>
              page.id === id ? { ...page, ...next } : page,
            ),
          }
        : current,
    );
  }

  if (!session.configured) {
    return (
      <main className="admin-shell">
        <section className="admin-login glass-card">
          <h1>300 Admin</h1>
          <p>Set `ADMIN_PASSWORD` in Sites environment variables to enable editing.</p>
        </section>
      </main>
    );
  }

  if (!session.authenticated) {
    return (
      <main className="admin-shell">
        <form className="admin-login glass-card" onSubmit={login}>
          <span className="label">Admin</span>
          <h1>300</h1>
          <Field label="Password">
            <input
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter admin password"
              type="password"
              value={password}
            />
          </Field>
          <button className="admin-primary" disabled={busy} type="submit">
            <Save size={16} />
            Sign in
          </button>
          {message ? <p className="admin-message">{message}</p> : null}
        </form>
      </main>
    );
  }

  if (!content) {
    return (
      <main className="admin-shell">
        <section className="admin-login glass-card">
          <h1>300</h1>
          <p>Loading editor.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-shell">
      <nav className="admin-topbar">
        <Link className="brand" href="/">
          <span className="brand-mark">300</span>
          <span>300</span>
        </Link>
        <div className="admin-actions">
          <button className="admin-ghost" onClick={saveContent} disabled={busy}>
            <Save size={16} />
            Save
          </button>
          <button className="admin-ghost" onClick={logout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </nav>

      <section className="admin-workspace">
        <aside className="admin-sidebar">
          <button
            className={activeTab === "content" ? "is-active" : ""}
            onClick={() => setActiveTab("content")}
            type="button"
          >
            <FileText size={16} />
            Content
          </button>
          <button
            className={activeTab === "pages" ? "is-active" : ""}
            onClick={() => setActiveTab("pages")}
            type="button"
          >
            <Plus size={16} />
            Pages
          </button>
          <button
            className={activeTab === "media" ? "is-active" : ""}
            onClick={() => setActiveTab("media")}
            type="button"
          >
            <ImageIcon size={16} />
            Media
          </button>
          {message ? <p className="admin-message">{message}</p> : null}
        </aside>

        <div className="admin-panel">
          {activeTab === "content" ? (
            <>
              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="label">Site</span>
                    <h2>Hero and title</h2>
                  </div>
                </div>
                <div className="admin-form-grid">
                  <Field label="Site title">
                    <input
                      value={content.siteTitle}
                      onChange={(event) =>
                        patchContent({ siteTitle: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Eyebrow">
                    <input
                      value={content.hero.eyebrow}
                      onChange={(event) =>
                        patchHero({ eyebrow: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Hero title">
                    <input
                      value={content.hero.title}
                      onChange={(event) => patchHero({ title: event.target.value })}
                    />
                  </Field>
                  <Field label="Hero text">
                    <textarea
                      value={content.hero.body}
                      onChange={(event) => patchHero({ body: event.target.value })}
                    />
                  </Field>
                  <Field label="Primary button">
                    <input
                      value={content.hero.primaryLabel}
                      onChange={(event) =>
                        patchHero({ primaryLabel: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Secondary button">
                    <input
                      value={content.hero.secondaryLabel}
                      onChange={(event) =>
                        patchHero({ secondaryLabel: event.target.value })
                      }
                    />
                  </Field>
                </div>
              </section>

              <section className="admin-card">
                <div className="admin-card-header">
                  <div>
                    <span className="label">Home</span>
                    <h2>Sections</h2>
                  </div>
                  <button
                    className="admin-ghost"
                    onClick={() =>
                      patchContent({
                        sections: [
                          ...content.sections,
                          makeSection((content.sections.length + 1) * 10),
                        ],
                      })
                    }
                    type="button"
                  >
                    <Plus size={16} />
                    Add section
                  </button>
                </div>
                <div className="stack">
                  {sortedSections.map((section) => (
                    <article className="editor-block" key={section.id}>
                      <div className="editor-block-head">
                        <strong>{section.title}</strong>
                        <Toggle
                          checked={section.visible}
                          label={section.visible ? "Shown" : "Hidden"}
                          onChange={(checked) =>
                            patchSection(section.id, { visible: checked })
                          }
                        />
                      </div>
                      <div className="admin-form-grid">
                        <Field label="Eyebrow">
                          <input
                            value={section.eyebrow}
                            onChange={(event) =>
                              patchSection(section.id, {
                                eyebrow: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Title">
                          <input
                            value={section.title}
                            onChange={(event) =>
                              patchSection(section.id, {
                                title: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Text">
                          <textarea
                            value={section.body}
                            onChange={(event) =>
                              patchSection(section.id, { body: event.target.value })
                            }
                          />
                        </Field>
                        <Field label="Media placement">
                          <input
                            value={section.mediaPlacement}
                            onChange={(event) =>
                              patchSection(section.id, {
                                mediaPlacement: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Button label">
                          <input
                            value={section.ctaLabel}
                            onChange={(event) =>
                              patchSection(section.id, {
                                ctaLabel: event.target.value,
                              })
                            }
                          />
                        </Field>
                        <Field label="Button URL">
                          <input
                            value={section.ctaHref}
                            onChange={(event) =>
                              patchSection(section.id, {
                                ctaHref: event.target.value,
                              })
                            }
                          />
                        </Field>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          ) : null}

          {activeTab === "pages" ? (
            <section className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="label">Tabs</span>
                  <h2>Pages</h2>
                </div>
                <button
                  className="admin-ghost"
                  onClick={() =>
                    patchContent({
                      pages: [
                        ...content.pages,
                        makePage((content.pages.length + 1) * 10),
                      ],
                    })
                  }
                  type="button"
                >
                  <Plus size={16} />
                  Add page
                </button>
              </div>
              <div className="stack">
                {sortedPages.map((page) => (
                  <article className="editor-block" key={page.id}>
                    <div className="editor-block-head">
                      <strong>{page.navLabel}</strong>
                      <Toggle
                        checked={page.visible}
                        label={page.visible ? "Shown" : "Hidden"}
                        onChange={(checked) =>
                          patchPage(page.id, { visible: checked })
                        }
                      />
                    </div>
                    <div className="admin-form-grid">
                      <Field label="Tab label">
                        <input
                          value={page.navLabel}
                          onChange={(event) =>
                            patchPage(page.id, { navLabel: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Slug">
                        <input
                          value={page.slug}
                          onChange={(event) =>
                            patchPage(page.id, { slug: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Title">
                        <input
                          value={page.title}
                          onChange={(event) =>
                            patchPage(page.id, { title: event.target.value })
                          }
                        />
                      </Field>
                      <Field label="Page text">
                        <textarea
                          value={page.body}
                          onChange={(event) =>
                            patchPage(page.id, { body: event.target.value })
                          }
                        />
                      </Field>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {activeTab === "media" ? (
            <section className="admin-card">
              <div className="admin-card-header">
                <div>
                  <span className="label">Library</span>
                  <h2>Images and videos</h2>
                </div>
                <span className="storage-pill">
                  {storageReady ? "R2 ready" : "Storage pending"}
                </span>
              </div>
              <form className="upload-form" onSubmit={uploadMedia}>
                <Field label="File">
                  <input accept="image/*,video/*" name="file" type="file" />
                </Field>
                <Field label="Alt text">
                  <input name="alt" placeholder="Short description" />
                </Field>
                <Field label="Placement">
                  <select name="placement" defaultValue="gallery">
                    <option value="hero">Hero</option>
                    <option value="ecosystem">Token + NFT</option>
                    <option value="drep">DRep</option>
                    <option value="gallery">Gallery</option>
                    <option value="library">Library only</option>
                  </select>
                </Field>
                <input name="isVisible" type="hidden" value="true" />
                <button className="admin-primary" disabled={busy} type="submit">
                  <Upload size={16} />
                  Upload
                </button>
              </form>
              <div className="media-admin-grid">
                {media.map((item) => (
                  <article className="media-admin-card" key={item.id}>
                    <div className="media-thumb">
                      {item.contentType.startsWith("video/") ? (
                        <video src={item.url} muted controls />
                      ) : (
                        <img alt={item.alt || item.filename} src={item.url} />
                      )}
                    </div>
                    <Field label="Alt text">
                      <input
                        value={item.alt}
                        onChange={(event) =>
                          updateMedia(item.id, { alt: event.target.value })
                        }
                      />
                    </Field>
                    <Field label="Placement">
                      <select
                        value={item.placement}
                        onChange={(event) =>
                          updateMedia(item.id, { placement: event.target.value })
                        }
                      >
                        <option value="hero">Hero</option>
                        <option value="ecosystem">Token + NFT</option>
                        <option value="drep">DRep</option>
                        <option value="gallery">Gallery</option>
                        <option value="library">Library only</option>
                      </select>
                    </Field>
                    <Toggle
                      checked={item.isVisible}
                      label={item.isVisible ? "Shown" : "Hidden"}
                      onChange={(checked) =>
                        updateMedia(item.id, { isVisible: checked })
                      }
                    />
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </section>
    </main>
  );
}
