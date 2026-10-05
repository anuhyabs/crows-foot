import { esc, ago, fmtSize, renderChrome, showLoadError, loadSections, loadPrs, stackInfo, orderStacks } from "../lib/app.js";

// Module state outlives re-renders (the module is imported once).
const collapsedOverride = new Map();
let filterText = "";

const DECISION = {
  APPROVED: ["Approved", "ok"],
  CHANGES_REQUESTED: ["Changes requested", "bad"],
  REVIEW_REQUIRED: ["Review required", "warn"],
};
const CHECK = {
  SUCCESS: ["Checks passing", "ok"],
  FAILURE: ["Checks failing", "bad"],
  ERROR: ["Checks errored", "bad"],
  PENDING: ["Checks running", "warn"],
  EXPECTED: ["Checks expected", "warn"],
};
const RING = { APPROVED: "ok", CHANGES_REQUESTED: "bad", COMMENTED: "muted" };

function initials(name) {
  return esc(String(name || "?").replace(/[^A-Za-z0-9]/g, "").slice(0, 2).toUpperCase() || "?");
}

function reviewerChips(pr) {
  const done = new Set(pr.reviews.map((r) => r.login));
  const given = pr.reviews
    .filter((r) => r.state !== "DISMISSED" && r.state !== "PENDING")
    .map(
      (r) =>
        `<span class="rv ring-${RING[r.state] ?? "muted"}" title="${esc(r.login)}: ${esc(String(r.state).toLowerCase().replace("_", " "))}">${
          r.avatar ? `<img src="${esc(r.avatar)}" alt="">` : initials(r.login)
        }</span>`,
    );
  const owed = pr.requested
    .filter((n) => n && !done.has(n))
    .map((n) => `<span class="rv owed" title="${esc(n)}: review requested">${initials(n)}</span>`);
  return `<span class="rvs">${given.join("")}${owed.join("")}</span>`;
}

function row(pr, info, inStack) {
  const parent = info.parentOf(pr);
  const color = info.colorOf(pr);
  const dec = DECISION[pr.review_decision];
  const chk = CHECK[pr.check_state];
  const labels = pr.labels
    .slice(0, 3)
    .map((l) => {
      const c = /^[0-9a-fA-F]{6}$/.test(l.color ?? "") ? `#${l.color}` : "#9292ad";
      return `<span class="label" style="--lc:${c}">${esc(l.name)}</span>`;
    })
    .join("");
  const state = pr.state === "MERGED" ? ["merged", "Merged"] : pr.state === "CLOSED" ? ["closed", "Closed"] : pr.is_draft ? ["draft", "Draft"] : ["open", "Open"];
  const stackMark = parent
    ? `<span class="stack-on" style="color:${color}" title="Stacked on #${parent.number}: ${esc(parent.title)}">on #${parent.number}</span>`
    : pr.targets_non_default
      ? `<span class="stack-on" style="color:${color}" title="Builds on branch ${esc(pr.base_ref)}">stacked</span>`
      : "";
  const unread = pr.is_read === false || pr.is_read === "false";
  return `
<a class="pr${inStack ? " in-stack" : ""}" href="${esc(pr.url)}" target="_blank" rel="noopener" style="--stack:${color}">
  <span class="gutter">${unread ? '<span class="unread" title="Unseen activity"></span>' : ""}</span>
  <span class="state state-${state[0]}" title="${state[1]}"></span>
  ${pr.author_avatar ? `<img class="avatar" src="${esc(pr.author_avatar)}" alt="" title="${esc(pr.author_login)}">` : `<span class="avatar"></span>`}
  <span class="pr-main">
    <span class="pr-title">${esc(pr.title)} ${stackMark}</span>
    <span class="pr-meta">${esc(pr.repo)} · #${pr.number} · ${esc(pr.author_login)} · <span class="add">+${fmtSize(pr.additions)}</span> <span class="del">−${fmtSize(pr.deletions)}</span> · ${pr.changed_files} file${pr.changed_files === 1 ? "" : "s"}${pr.mergeable === "CONFLICTING" ? ' · <span class="conflict">conflicts</span>' : ""}</span>
  </span>
  <span class="pr-side">
    ${labels}
    ${pr.comment_count ? `<span class="cmt" title="${pr.comment_count} comments">💬 ${pr.comment_count}</span>` : ""}
    ${reviewerChips(pr)}
    ${dec && pr.state === "OPEN" ? `<span class="pill pill-${dec[1]}">${dec[0]}</span>` : ""}
    ${chk ? `<span class="pill pill-${chk[1]}">${chk[0]}</span>` : ""}
    <span class="age" title="${esc(pr.updated_at)}">${esc(ago(pr.updated_at))}</span>
  </span>
</a>`;
}

function matches(pr, q) {
  if (!q) return true;
  const hay = `${pr.title} ${pr.repo} ${pr.author_login} #${pr.number} ${pr.labels.map((l) => l.name).join(" ")}`.toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export default async function render(ctx) {
  const main = renderChrome(ctx.content, ctx.route.path);
  main.innerHTML = `<p class="notice">Loading pull requests…</p>`;

  let sections, prs;
  try {
    [sections, prs] = await Promise.all([loadSections(ctx.db), loadPrs(ctx.db)]);
  } catch (err) {
    if (ctx.signal.aborted) return;
    showLoadError(main, err);
    return;
  }
  if (ctx.signal.aborted) return;

  const viewer = sections[0] ? { login: sections[0].viewer_login, avatar: sections[0].viewer_avatar } : null;
  renderChrome(ctx.content, ctx.route.path, viewer);
  const body = ctx.content.querySelector("#main");

  const info = stackInfo(prs);
  const total = sections.reduce((n, s) => n + Number(s.total_count ?? 0), 0);
  const needs = sections.filter((s) => ["needs-your-review", "changes-requested"].includes(s.section_id)).reduce((n, s) => n + Number(s.total_count ?? 0), 0);

  body.innerHTML = `
<div class="toolbar">
  <div class="kpis">
    <div class="kpi"><b>${needs}</b><span>need your attention</span></div>
    <div class="kpi"><b>${total}</b><span>across ${sections.length} sections</span></div>
  </div>
  <label class="search"><span>Filter</span><input id="filter" type="search" placeholder="Filter on screen…  ( / )" value="${esc(filterText)}" autocomplete="off"></label>
</div>
<div id="sections"></div>`;

  const holder = body.querySelector("#sections");

  function paint() {
    const q = filterText.trim();
    holder.innerHTML = sections
      .map((s) => {
        const mine = prs.filter((p) => p.section_id === s.section_id);
        const shown = mine.filter((p) => matches(p, q));
        const isCollapsed = collapsedOverride.has(s.section_id)
          ? collapsedOverride.get(s.section_id)
          : s.collapsed === true || s.collapsed === "true" || mine.length === 0;
        const hidden = Number(s.total_count ?? 0) - mine.length;
        const ordered = orderStacks(shown, info.parentOf);
        const count = q ? `${shown.length}/${s.total_count}` : `${s.total_count}`;
        let inner;
        if (s.error) inner = `<div class="sec-empty err">This query failed: ${esc(s.error)}</div>`;
        else if (!shown.length) inner = `<div class="sec-empty">${q ? "Nothing matches this filter." : "Nothing in this section."}</div>`;
        else
          inner =
            ordered.map((o) => row(o.pr, info, o.inStack)).join("") +
            (hidden > 0 && !q ? `<div class="more">${hidden} more match this query. Raise the section limit to see them.</div>` : "");
        return `
<section class="section" style="--c:${esc(s.color)}">
  <button class="sec-head" data-id="${esc(s.section_id)}" aria-expanded="${!isCollapsed}">
    <span class="chev${isCollapsed ? " closed" : ""}">▾</span>
    <span class="dot"></span>
    <h2>${esc(s.title)}</h2>
    <span class="count">${esc(count)}</span>
  </button>
  ${isCollapsed ? "" : `<div class="sec-body">${inner}</div>`}
</section>`;
      })
      .join("");
  }
  paint();

  const input = body.querySelector("#filter");
  input.addEventListener(
    "input",
    () => {
      filterText = input.value;
      paint();
    },
    { signal: ctx.signal },
  );
  holder.addEventListener(
    "click",
    (e) => {
      const btn = e.target.closest(".sec-head");
      if (!btn) return;
      const id = btn.dataset.id;
      const cur = btn.getAttribute("aria-expanded") === "true";
      collapsedOverride.set(id, cur);
      paint();
    },
    { signal: ctx.signal },
  );
  document.addEventListener(
    "keydown",
    (e) => {
      const tag = (e.target?.tagName ?? "").toLowerCase();
      if (e.key === "/" && tag !== "input") {
        e.preventDefault();
        input.focus();
      } else if (e.key === "r" && tag !== "input" && !e.metaKey && !e.ctrlKey) {
        ctx.reload();
      } else if (e.key === "Escape" && tag === "input") {
        input.blur();
      }
    },
    { signal: ctx.signal },
  );
}
