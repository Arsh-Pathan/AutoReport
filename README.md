# AutoReport

AI-powered activity report generator for the **AI & ML Club, Dhole Patil College of Engineering (DPCOE)**.

Drop in messy notes from an event, attach a few photographs, and get back a polished DOCX or PDF that follows the official college report format — header table, structured sections, captioned photos, and the three-signature footer — every time.

---

## Features

- **Drag-and-drop image upload** with per-image captions.
- **Live A4 preview** that mirrors the printed PDF exactly (rendered in an isolated iframe).
- **AI rewriting** via [OpenRouter](https://openrouter.ai) — converts unstructured notes into formal, third-person, past-tense report prose.
- **Editable AI output** — every paragraph and bullet is editable before download.
- **DOCX + PDF export** from the same data contract:
  - PDF via headless Chromium (Puppeteer) using a shared HTML/CSS template.
  - DOCX via the [`docx`](https://www.npmjs.com/package/docx) package, structurally parallel to the HTML.
- **Strict format compliance** — header table, centered title, Overview / Program Details / Overall Outcome, "Photographs:" section, and Club Advisor / SDP Head / Principal sign blocks.

---

## Tech stack

| Layer            | Choice                                              |
| ---------------- | --------------------------------------------------- |
| Framework        | Next.js 15 (App Router) + React 19                  |
| Language         | TypeScript                                          |
| Styling          | Tailwind CSS                                        |
| AI               | OpenRouter Chat Completions (JSON mode)             |
| PDF              | Puppeteer (bundled Chromium)                        |
| DOCX             | `docx` (officegen-style builder)                    |
| Validation       | Zod                                                 |
| Image dimensions | `image-size`                                        |

---

## Project layout

```
src/
├─ app/                   # Next.js App Router (pages + API routes)
│  ├─ page.tsx            # form + live preview screen
│  └─ api/
│     ├─ generate/        # POST: messy notes → structured AI JSON
│     ├─ pdf/             # POST: payload + photos → PDF download
│     └─ docx/            # POST: payload + photos → DOCX download
├─ frontend/              # client components: form, dropzone, preview
├─ components/ui/         # primitives (Button, Field, TextArea)
├─ backend/               # server-only modules (openrouter, pdf, docx)
├─ services/              # generateReport, renderHtml, imagePipeline
├─ templates/             # report.html.ts + report.css.ts (single source of truth)
├─ utils/                 # constants, dates, filenames
└─ types/                 # ReportData / ReportPayload + Zod schema
```

The split into `frontend/`, `backend/`, `components/`, `services/`, `templates/`, and `utils/` follows the brief; App Router lives in `app/` because Next.js requires it.

---

## Setup

### 1. Prerequisites

- Node.js **20.x or newer**
- npm (or pnpm / yarn — pick one)
- An **OpenRouter API key** — sign up at <https://openrouter.ai>.

### 2. Install

```bash
npm install
```

The `puppeteer` install will download a matching Chromium build (~170 MB). On Windows, if your home directory is OneDrive-synced or aggressively scanned by antivirus, point the cache inside the repo with the env var below.

### 3. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=anthropic/claude-sonnet-4.5
OPENROUTER_APP_NAME=AutoReport
OPENROUTER_SITE_URL=http://localhost:3000

# Windows-friendly: keep Chromium inside the repo
PUPPETEER_CACHE_DIR=./.cache/puppeteer
```

| Variable              | Required | Notes                                                                                |
| --------------------- | -------- | ------------------------------------------------------------------------------------ |
| `OPENROUTER_API_KEY`  | yes      | Server-only. Never prefix with `NEXT_PUBLIC_`.                                       |
| `OPENROUTER_MODEL`    | no       | Default: `anthropic/claude-sonnet-4.5`. Any OpenRouter model that supports JSON mode. |
| `OPENROUTER_APP_NAME` | no       | Shown in your OpenRouter usage dashboard.                                            |
| `OPENROUTER_SITE_URL` | no       | Same — used as the `HTTP-Referer` header.                                            |
| `PUPPETEER_CACHE_DIR` | no       | Recommended on Windows; keeps Chromium out of `%USERPROFILE%`.                       |

### 4. Run

```bash
npm run dev
```

Open <http://localhost:3000>.

---

## How report generation works

1. **User fills the form** — event title, date, venue, participants, highlights, free-form description, and optional photos with captions.
2. **AI step (`POST /api/generate`)** — `services/generateReport.ts` builds a system + user prompt and calls OpenRouter with `response_format: { type: "json_object" }`. The result is parsed and validated with Zod (`ReportDataSchema`). On schema failure the model is asked once more with the validation error appended; a second failure raises an error.
3. **Editable preview** — the AI's `overview`, `programDetails.{description,bullets}`, and `outcome` populate textareas the user can freely edit. The right-hand iframe re-renders the report HTML on every keystroke (debounced ~150 ms).
4. **Download** — clicking *Download PDF* or *Download DOCX* posts a `multipart/form-data` body with the JSON payload and raw image files:
   - **PDF route** (`/api/pdf`): inlines images as data URLs, calls `templates/report.html.ts` to build the HTML, renders via Puppeteer with `format: 'A4', preferCSSPageSize: true, printBackground: true`.
   - **DOCX route** (`/api/docx`): hands the payload + processed image buffers to `backend/docx.ts`, which builds the document section-by-section with `Table`, `Paragraph`, and `ImageRun`.
5. **Filename** — both downloads use `AI & ML Club Report DD_MM_YYYY.{pdf,docx}` (matching the sample report's convention) via `utils/filename.ts` with proper `Content-Disposition` encoding for the `&`.

The header table, "Photographs:" section, and three-signature footer are **never** AI-generated — they come from form fields and `utils/constants.ts`. The AI is only responsible for the prose in the three content sections.

---

## Format guarantees

The shared template enforces:

- **Header table** with: College Name, Academic Year, Semester, Report Title, Date, ACA/R No., Rev No.
- **Centered, bold, underlined title**.
- **Three sections in order**: Overview → Program Details (paragraph + bullet list) → Overall Outcome.
- **Photographs section** titled `Photographs:` with each image followed by an italic centered caption.
- **Three-block signature footer**: Club Advisor · SDP Head · Principal.

To change the college name, ACA/R number, or default signatories edit `src/utils/constants.ts`.

---

## Known issues / deployment notes

- **Vercel + Puppeteer**: full `puppeteer` exceeds Vercel's serverless function size limit. For deployment, swap to `puppeteer-core` + [`@sparticuz/chromium`](https://github.com/Sparticuz/chromium) and set `runtime = 'nodejs'` with `maxDuration = 60`.
- **Chromium cold start**: `backend/pdf.ts` caches a launched browser on `globalThis` so the first PDF takes ~700 ms and subsequent renders are <300 ms. The browser is closed on `SIGTERM`/`SIGINT`.
- **Fonts**: the report specifies `Times New Roman, Liberation Serif, serif`. On Linux Chromium it falls back to Liberation Serif (visually similar).
- **Body size**: large image batches may exceed Vercel's 4.5 MB request cap. Locally there is no such limit (`bodySizeLimit: 25mb` in `next.config.mjs`).

---

## Conventional commits used in this repo

```
chore: scaffold next.js with typescript and tailwind
feat:  add report data types, zod schema, and constants
feat:  build report form, dropzone, and live preview
feat:  integrate openrouter for structured ai generation
feat:  add shared html template for preview and pdf
feat:  add pdf export via puppeteer
feat:  add docx export with header table and signatures
docs:  add readme, env example, and known issues
```

---

## License

Built for the AI & ML Club at Dhole Patil College of Engineering. Internal academic use.
