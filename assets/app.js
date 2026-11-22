const manifestUrl = "reports.json";
let reports = [];
let activeFilter = "all";

const $ = (selector) => document.querySelector(selector);
const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, c => ({
  "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
}[c]));

function formatDate(value) {
  const date = new Date(value + "T12:00:00");
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", {
    day:"2-digit", month:"short", year:"numeric"
  });
}

function reportCard(report) {
  const kind = report.type === "morning" ? "08:30 IST · MORNING" : "21:30 IST · EVENING";
  return `<article class="brief-card">
    <div class="card-kicker">${kind}</div>
    <h3>${escapeHtml(report.title)}</h3>
    <p>${escapeHtml(report.summary || "")}</p>
    <a class="read-link" href="${escapeHtml(report.file)}" data-report="${escapeHtml(report.id)}">Read full briefing →</a>
  </article>`;
}

function archiveItem(report) {
  return `<div class="archive-item">
    <div class="archive-date">${formatDate(report.date)}</div>
    <div class="archive-main">
      <div class="archive-title">${escapeHtml(report.title)}</div>
      <div class="archive-summary">${escapeHtml(report.summary || "")}</div>
    </div>
    <div class="archive-type">${report.type === "morning" ? "MORNING" : "EVENING"} · <a href="${escapeHtml(report.file)}" data-report="${escapeHtml(report.id)}">Open</a></div>
  </div>`;
}

function render() {
  const latest = [...reports].sort((a,b) => (b.date + b.type).localeCompare(a.date + a.type));
  const morning = latest.find(r => r.type === "morning");
  const evening = latest.find(r => r.type === "evening");
  const latestGrid = $("#latest-grid");
  latestGrid.innerHTML = [morning, evening].map(r => r ? reportCard(r) : `
    <article class="brief-card empty-card">
      <div class="card-kicker">${r === morning ? "08:30 IST · MORNING" : "21:30 IST · EVENING"}</div>
      <h3>${r === morning ? "Morning market intelligence" : "Evening market debrief"}</h3>
      <p>${r === morning ? "Overnight developments, pre-market cues, key catalysts and scenarios for the trading day." : "What moved, why it moved, after-market developments and implications for the next session."}</p>
      <span class="empty-note">Your first report will appear here.</span>
    </article>`).join("");

  const query = ($("#search").value || "").toLowerCase();
  const filtered = latest.filter(r =>
    (activeFilter === "all" || r.type === activeFilter) &&
    [r.title, r.summary, r.date, r.type].join(" ").toLowerCase().includes(query)
  );
  $("#archive-list").innerHTML = filtered.length
    ? filtered.map(archiveItem).join("")
    : `<div class="archive-empty">No matching reports. Try another search or filter.</div>`;
}

async function openReport(report, link) {
  try {
    const response = await fetch(report.file);
    if (!response.ok) throw new Error("Report file not found");
    const markdown = await response.text();
    $("#dialog-meta").textContent = `${formatDate(report.date)} · ${report.type.toUpperCase()} · ${report.title}`;
    $("#dialog-content").innerHTML = window.marked
      ? marked.parse(markdown, { breaks: true, gfm: true })
      : `<pre>${escapeHtml(markdown)}</pre>`;
    $("#report-dialog").showModal();
  } catch (error) {
    alert("Could not load this report. Check that its file path is correct in reports.json.");
  }
}

document.addEventListener("click", event => {
  const link = event.target.closest("[data-report]");
  if (!link) return;
  const report = reports.find(r => r.id === link.dataset.report);
  if (!report) return;
  event.preventDefault();
  openReport(report, link);
});
$("#close-dialog").addEventListener("click", () => $("#report-dialog").close());
$("#report-dialog").addEventListener("click", e => {
  if (e.target === $("#report-dialog")) $("#report-dialog").close();
});
$("#search").addEventListener("input", render);
document.querySelectorAll(".filter").forEach(button => button.addEventListener("click", () => {
  document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
  button.classList.add("active");
  activeFilter = button.dataset.filter;
  render();
}));

fetch(manifestUrl)
  .then(response => { if (!response.ok) throw new Error("manifest missing"); return response.json(); })
  .then(data => { reports = Array.isArray(data) ? data : []; render(); })
  .catch(() => {
    $("#archive-list").innerHTML = `<div class="archive-empty">The report index could not be loaded. Check that reports.json exists in the site root.</div>`;
  });
