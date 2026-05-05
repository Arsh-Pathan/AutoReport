import type { ReportPayload } from "@/types/report";
import { REPORT_CSS } from "./report.css";
import { formatDateShort } from "@/utils/formatDate";
import { CLUB_NAME } from "@/utils/constants";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}



function escapeAttribute(s: string): string {
  return escapeHtml(s);
}

type RenderOptions = {
  assetBaseUrl?: string;
};

function normalizeAssetBaseUrl(assetBaseUrl?: string): string {
  if (!assetBaseUrl) return "http://localhost:3000/";
  return assetBaseUrl.endsWith("/") ? assetBaseUrl : `${assetBaseUrl}/`;
}

export function renderReportHtml(payload: ReportPayload, options: RenderOptions = {}): string {
  const { meta, ai, photographs, signatories } = payload;
  const assetBaseUrl = normalizeAssetBaseUrl(options.assetBaseUrl);
  const headerTable = `
    <table class="header" style="width: 100%; border-collapse: collapse; margin-bottom: 10pt;">
      <tbody>
        <tr>
          <td style="width: 25%;"><strong>ACA/R / 56</strong></td>
          <td rowspan="2" style="width: 50%; text-align: center; vertical-align: middle;"><strong>Dhole Patil College of Engineering</strong></td>
          <td style="width: 25%;"><strong>AcademicYear:${escapeHtml(meta.academicYear)}</strong></td>
        </tr>
        <tr>
          <td><strong>Rev: 00</strong></td>
          <td><strong>Semester: ${escapeHtml(meta.semester)}</strong></td>
        </tr>
        <tr>
          <td><strong>Date: 15.12.2016</strong></td>
          <td style="text-align: center;"><strong>Report</strong></td>
          <td><strong>Date- ${formatDateShort(meta.date)}</strong></td>
        </tr>
      </tbody>
    </table>
  `;

  const sectionsHtml = ai.sections.map(sec => {
    let content = "";
    if (sec.type === "text") {
      content = `<p>${escapeHtml(sec.text || "")}</p>`;
    } else if (sec.type === "bullets") {
      content = `<ul class="bullets">${(sec.bullets || []).map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;
    } else if (sec.type === "table") {
      content = `<table class="content-table"><tbody>${(sec.table || []).map(row => 
        `<tr>${row.map(cell => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
      ).join("")}</tbody></table>`;
    } else if (sec.type === "image") {
      const p = photographs[sec.imageIndex || 0];
      if (p) {
        content = `<div class="photo-center">
          <img src="${p.src}" alt="${escapeHtml(p.caption || "")}" />
          <div class="caption"><u>${escapeHtml(p.caption || "")}</u></div>
        </div>`;
      }
    }

    return `
      <section>
        ${sec.heading ? `<h2 class="section">${escapeHtml(sec.heading)}</h2>` : ""}
        ${content}
      </section>
    `;
  }).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(meta.title)}</title>
  <base href="${escapeAttribute(assetBaseUrl)}" />
  <style>${REPORT_CSS}</style>
</head>
<body>
  <main class="report">
    <div class="report-outer-border">
      <div class="report-inner-border">
        <header class="masthead">
          <img class="masthead-logo" src="example/dpes_new_logo.svg" alt="DPES Logo" />
          <div class="masthead-text-col">
            <div class="masthead-title">DHOLE PATIL COLLEGE OF ENGINEERING</div>
            <div class="masthead-subtitle">Accredited with Grade A+ by NAAC</div>
            <div class="masthead-subtitle">ISO 9001:2015 Certified Institute, Approved by A.I.C.T.E New Delhi,</div>
            <div class="masthead-subtitle">D.T.E. Govt of Maharashtra and Affiliated to Savitribai Phule Pune University, Pune.</div>
          </div>
        </header>

        <section class="report-shell">
          <table class="header-table">
            <tbody>
              <tr>
                <td style="width: 25%;"><strong>ACA/R / 56</strong></td>
                <td rowspan="2" style="width: 50%; text-align: center; vertical-align: middle; border-bottom: 1px solid black;"><strong>Dhole Patil College of Engineering</strong></td>
                <td style="width: 25%;"><strong>AcademicYear:${escapeHtml(meta.academicYear)}</strong></td>
              </tr>
              <tr>
                <td><strong>Rev: 00</strong></td>
                <td><strong>Semester: ${escapeHtml(meta.semester)}</strong></td>
              </tr>
              <tr>
                <td><strong>Date: 15.12.2016</strong></td>
                <td style="text-align: center;"><strong>Report</strong></td>
                <td><strong>Date- ${formatDateShort(meta.date)}</strong></td>
              </tr>
            </tbody>
          </table>

          <h1 class="title"><u>${escapeHtml(meta.title)}</u></h1>

          ${sectionsHtml}

          <section class="signatures" style="margin-top: 60pt;">
            <div class="sig-col">
              <strong>Club Advisor</strong><br/>
              ${escapeHtml(signatories.advisor)}
            </div>
            <div class="sig-col">
              <strong>SDP Head</strong><br/>
              ${escapeHtml(signatories.sdpHead)}
            </div>
            <div class="sig-col">
              <strong>Principal</strong><br/>
              ${escapeHtml(signatories.principal)}
            </div>
          </section>
        </section>
      </div>
    </div>
  </main>
</body>
</html>`;
}
