export const esc = (v) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const TABS = [
  { path: "home", href: "home", label: "Dashboard" },
  { path: "queries", href: "queries", label: "Sections & queries" },
];

export const PALETTE = ["#a78bfa", "#2dd4bf", "#f5c451", "#4f8cff", "#f472b6", "#3dd68c", "#f2792b", "#a3e635"];

const LOGO = `<svg viewBox="0 0 32 32" class="logo-mark" role="img" aria-label="Crow's Foot">
<defs><linearGradient id="cf-sheen" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse"><stop offset="0%" stop-color="#7c4dff"/><stop offset="50%" stop-color="#a78bfa"/><stop offset="100%" stop-color="#2dd4bf"/></linearGradient></defs>
<g fill="url(#cf-sheen)">
<path d="M14 18.2Q14.55 13.2 14.78 11.08Q15 8.95 15.7 6.78Q16.4 4.6 16.4 4.6Q16.4 4.6 16.7 6.82Q17 9.05 17.22 11.12Q17.45 13.2 17.73 15.7L18 18.2Z"/>
<path d="M14.98 19.92Q10.85 16.84 9.03 15.42Q7.21 14.01 5.56 12Q3.9 10 3.9 10Q3.9 10 6.14 11.2Q8.39 12.39 10.37 13.38Q12.35 14.36 14.69 15.42L17.02 16.48Z"/>
<path d="M14.98 16.48Q19.65 14.36 21.63 13.38Q23.61 12.39 25.86 11.2Q28.1 10 28.1 10Q28.1 10 26.44 12Q24.79 14.01 22.97 15.42Q21.15 16.84 19.09 18.38L17.02 19.92Z"/>
<path d="M17.85 18.16Q17.4 22.87 16.96 24.56Q16.51 26.26 15.36 27.83Q14.2 29.4 14.2 29.4Q14.2 29.4 14.44 27.57Q14.69 25.74 14.74 24.24Q14.8 22.73 14.48 20.49L14.15 18.24Z"/>
<circle cx="16" cy="18.2" r="2.2"/></g></svg>`;

export { LOGO };

/** Draws header + tabs; returns the element the page renders into. */
export function renderChrome(content, current, viewer) {
  content.innerHTML = `
<div id="app">
  <header id="top">
    <div class="brand">${LOGO}<span class="wordmark">Crow's Foot</span></div>
    <nav id="tabs">${TABS.map((t) => `<a class="tab" href="${t.href}"${t.path === current ? ' aria-current="page"' : ""}>${t.label}</a>`).join("")}</nav>
    <div id="top-right">${viewer ? `<span class="viewer">${viewer.avatar ? `<img src="${esc(viewer.avatar)}" alt="">` : ""}${esc(viewer.login)}</span>` : ""}</div>
  </header>
  <main id="main"></main>
</div>`;
  return content.querySelector("#main");
}

export function showLoadError(main, err) {
  main.innerHTML = `<p class="notice">Couldn't load the dashboard data (${esc(err?.message ?? err)}). Try Reload.</p>`;
}

export async function loadSections(db) {
  return db.rows(
    `SELECT section_id, title, query, color, "limit" AS lim, collapsed, ord, total_count, error, viewer_login, viewer_avatar, fetched_at
     FROM s ORDER BY ord LIMIT 50`,
  );
}

export async function loadPrs(db) {
  const rows = await db.rows(
    `SELECT section_id, pr_id, number, title, url, repo, is_draft, state, base_ref, head_ref, targets_non_default,
            updated_at, additions, deletions, changed_files, comment_count, is_read, check_state, review_decision,
            mergeable, author_login, author_avatar, labels_json, requested_json, reviews_json
     FROM p ORDER BY updated_at DESC LIMIT 1000`,
  );
  return rows.map((r) => ({
    ...r,
    number: Number(r.number),
    additions: Number(r.additions ?? 0),
    deletions: Number(r.deletions ?? 0),
    changed_files: Number(r.changed_files ?? 0),
    comment_count: Number(r.comment_count ?? 0),
    labels: safeJson(r.labels_json),
    requested: safeJson(r.requested_json),
    reviews: safeJson(r.reviews_json),
  }));
}

function safeJson(s) {
  try {
    const v = JSON.parse(s ?? "[]");
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export function ago(iso) {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return "";
  const s = Math.max(0, (Date.now() - t) / 1000);
  const units = [[31536000, "y"], [2592000, "mo"], [604800, "w"], [86400, "d"], [3600, "h"], [60, "m"]];
  for (const [n, u] of units) if (s >= n) return `${Math.floor(s / n)}${u} ago`;
  return "just now";
}

export function fmtSize(n) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

/** Stack structure: a PR is stacked on another when it merges into that one's head branch in the same repo. */
export function stackInfo(prs) {
  const byBranch = new Map();
  for (const p of prs) byBranch.set(`${p.repo}\u0000${p.head_ref}`, p);
  const parent = new Map();
  for (const p of prs) {
    const par = byBranch.get(`${p.repo}\u0000${p.base_ref}`);
    if (par && par.pr_id !== p.pr_id) parent.set(p.pr_id, par);
  }
  const bottom = (p) => {
    const seen = new Set([p.pr_id]);
    let cur = p;
    for (;;) {
      const par = parent.get(cur.pr_id);
      if (!par || seen.has(par.pr_id)) return cur;
      seen.add(par.pr_id);
      cur = par;
    }
  };
  return {
    parentOf: (p) => parent.get(p.pr_id) ?? null,
    colorOf: (p) => PALETTE[bottom(p).number % PALETTE.length],
  };
}

/** Order a section's PRs so children sit right after their parent (stack-adjacent). */
export function orderStacks(prs, parentOf) {
  const ids = new Set(prs.map((p) => p.pr_id));
  const kids = new Map();
  for (const p of prs) {
    const par = parentOf(p);
    if (par && ids.has(par.pr_id)) kids.set(par.pr_id, [...(kids.get(par.pr_id) ?? []), p]);
  }
  const placed = new Set();
  const out = [];
  const visit = (p, depthParent) => {
    if (placed.has(p.pr_id)) return;
    placed.add(p.pr_id);
    out.push({ pr: p, inStack: !!depthParent || (kids.get(p.pr_id)?.length ?? 0) > 0 });
    for (const k of kids.get(p.pr_id) ?? []) visit(k, p);
  };
  for (const p of prs) {
    const par = parentOf(p);
    if (!par || !ids.has(par.pr_id)) visit(p, null);
  }
  for (const p of prs) visit(p, null);
  return out;
}
