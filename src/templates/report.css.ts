export const REPORT_CSS = `
  @page { size: A4; margin: 18mm 18mm 20mm 18mm; }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #111827;
    font-family: 'Times New Roman', 'Liberation Serif', serif;
    font-size: 12pt;
    line-height: 1.45;
  }
  .report {
    padding: 0;
    max-width: 174mm;
    margin: 0 auto;
  }
  table.header {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 14pt;
    page-break-inside: avoid;
  }
  table.header th, table.header td {
    border: 1px solid #111827;
    padding: 5pt 8pt;
    text-align: left;
    vertical-align: middle;
    font-size: 11pt;
  }
  table.header th {
    background: #f3f4f6;
    font-weight: 700;
    width: 28%;
  }
  h1.title {
    text-align: center;
    font-size: 16pt;
    font-weight: 700;
    text-transform: capitalize;
    margin: 18pt 0 14pt;
    text-decoration: underline;
  }
  h2.section {
    font-size: 13pt;
    font-weight: 700;
    margin: 14pt 0 6pt;
    text-decoration: underline;
  }
  p { margin: 0 0 8pt; text-align: justify; }
  ul.bullets { margin: 4pt 0 8pt 22pt; padding: 0; }
  ul.bullets li { margin-bottom: 4pt; }
  .photographs { margin-top: 12pt; }
  .photo-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10pt 14pt;
  }
  .photo {
    page-break-inside: avoid;
    text-align: center;
  }
  .photo img {
    max-width: 100%;
    max-height: 70mm;
    border: 1px solid #111827;
    object-fit: cover;
  }
  .photo .caption {
    font-size: 10pt;
    font-style: italic;
    margin-top: 4pt;
  }
  .signatures {
    margin-top: 28pt;
    display: flex;
    justify-content: space-between;
    page-break-inside: avoid;
  }
  .sig {
    width: 30%;
    text-align: center;
    font-weight: 600;
    border-top: 1px solid #111827;
    padding-top: 6pt;
  }
`;
