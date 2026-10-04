import { esc, renderChrome, showLoadError, loadSections } from "../lib/app.js";

const SHORTHANDS = [
  ["review:re-requested", "review-requested:@me reviewed-by:@me"],
  ["checks:failing | passing | pending", "status:failure | success | pending"],
  ["idle:>1w, idle:<2d", "updated:< or updated:> that date"],
];
const LOCAL = [
  ["unread:yes", "has activity you haven't seen"],
  ["conflicts:yes", "merge conflicts"],
  ["stacked:yes", "merges into a non-default branch"],
  ["reviewers:0", "review requests still outstanding"],
  ["approvals:>=2", "reviewers whose latest review approves"],
  ["size:>500", "lines moved either way"],
  ["files:>20", "files changed"],
];

export default async function render(ctx) {
  const main = renderChrome(ctx.content, ctx.route.path);
  main.innerHTML = `<p class="notice">Loading sections…</p>`;
  let sections;
  try {
    sections = await loadSections(ctx.db);
  } catch (err) {
    if (ctx.signal.aborted) return;
    showLoadError(main, err);
    return;
  }
  if (ctx.signal.aborted) return;
  const viewer = sections[0] ? { login: sections[0].viewer_login, avatar: sections[0].viewer_avatar } : null;
  renderChrome(ctx.content, ctx.route.path, viewer);
  const body = ctx.content.querySelector("#main");

  const q = (s) => s.replaceAll("@me", viewer?.login ?? "@me");
  body.innerHTML = `
<div class="page-head">
  <h1>Sections &amp; queries</h1>
  <p>Each section is a query in a language that takes GitHub's issue search whole and adds <code>or</code>, <code>not</code>, parentheses and a few local qualifiers. A query with an <code>or</code> runs as several searches, unioned by pull request.</p>
</div>
<div class="qgrid">
${sections
  .map(
    (s) => `
<article class="qcard" style="--c:${esc(s.color)}">
  <header><span class="dot"></span><h3>${esc(s.title)}</h3><span class="count">${esc(s.total_count)}</span></header>
  <code class="q">${esc(s.query)}</code>
  <footer>
    <span>limit ${esc(s.lim)}${s.collapsed === true || s.collapsed === "true" ? " · starts collapsed" : ""}</span>
    <a href="https://github.com/pulls?q=${encodeURIComponent(q(s.query).replace(/\s+/g, " "))}" target="_blank" rel="noopener">Run on GitHub ↗</a>
  </footer>
  ${s.error ? `<p class="err">${esc(s.error)}</p>` : ""}
</article>`,
  )
  .join("")}
</div>
<div class="ref">
  <section><h3>Shorthands</h3><table>${SHORTHANDS.map(([a, b]) => `<tr><td><code>${esc(a)}</code></td><td>${esc(b)}</td></tr>`).join("")}</table></section>
  <section><h3>Asked of results locally</h3><table>${LOCAL.map(([a, b]) => `<tr><td><code>${esc(a)}</code></td><td>${esc(b)}</td></tr>`).join("")}</table></section>
</div>
<p class="foot">The pipeline sends each section's GitHub-searchable terms to GitHub's API as the connected account. Local qualifiers are listed for reference from the original Crow's Foot desktop app.</p>`;
}
