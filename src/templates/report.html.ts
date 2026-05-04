import type { ReportPayload } from "@/types/report";
import { REPORT_CSS } from "./report.css";
import { formatDateLong } from "@/utils/formatDate";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function row(label: string, value: string): string {
  return `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`;
}

export function renderReportHtml(payload: ReportPayload): string {
  const { meta, ai, photographs, signatories } = payload;
  const headerTable = `
    <table class="header">
      <tbody>
        ${row("College Name", meta.college)}
        ${row("Academic Year", meta.academicYear)}
        ${row("Semester", meta.semester)}
        ${row("Report Title", meta.title)}
        ${row("Date", formatDateLong(meta.date))}
        ${row("ACA/R No.", meta.acaRNo)}
        ${row("Rev No.", meta.revNo)}
      </tbody>
    </table>
  `;

  const bullets = ai.programDetails.bullets
    .map((b) => `<li>${escapeHtml(b)}</li>`)
    .join("");

  const photos = photographs.length
    ? `
    <section class="photographs">
      <h2 class="section">Photographs:</h2>
      <div class="photo-grid">
        ${photographs
          .map(
            (p, i) => `
          <figure class="photo">
            <img src="${p.src}" alt="${escapeHtml(p.caption || `Photograph ${i + 1}`)}" />
            <figcaption class="caption">${escapeHtml(p.caption || `Photograph ${i + 1}`)}</figcaption>
          </figure>`
          )
          .join("")}
      </div>
    </section>
  `
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.title)}</title>
  <style>${REPORT_CSS}</style>
</head>
<body>
  <main class="report">
    ${headerTable}
    <h1 class="title">${escapeHtml(meta.title)}</h1>

    <section>
      <h2 class="section">Overview</h2>
      <p>${escapeHtml(ai.overview)}</p>
    </section>

    <section>
      <h2 class="section">Program Details</h2>
      <p>${escapeHtml(ai.programDetails.description)}</p>
      <ul class="bullets">${bullets}</ul>
    </section>

    <section>
      <h2 class="section">Overall Outcome</h2>
      <p>${escapeHtml(ai.outcome)}</p>
    </section>

    ${photos}

    <section class="signatures">
      <div class="sig">${escapeHtml(signatories.advisor)}</div>
      <div class="sig">${escapeHtml(signatories.sdpHead)}</div>
      <div class="sig">${escapeHtml(signatories.principal)}</div>
    </section>
  </main>
</body>
</html>`;
}
