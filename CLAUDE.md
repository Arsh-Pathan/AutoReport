# CLAUDE.md

This file provides working guidance for Claude Code in this repository.

## Commands

- `npm run dev` - start the Next.js dev server at `http://localhost:3000`
- `npm run build` - production build
- `npm run start` - run the production build
- `npm run lint` - Next.js + ESLint

There is no test runner configured. Requires Node 20+ and a populated `.env.local` with `GEMINI_API_KEY` (see `.env.local.example`).

## Commit style

Use conventional commit prefixes for every commit in this repo:

- `feat:` for user-facing functionality
- `fix:` for bug fixes and regressions
- `refactor:` for internal structure changes without behaviour changes
- `docs:` for README / `CLAUDE.md` / comments / setup docs
- `chore:` for tooling, config, generated files, or maintenance

Keep commit messages short, professional, and scoped to the actual change.

## Committing
- ALWAYS use conventional commits format when committing changes (e.g., `feat:`, `chore:`, `fix:`, `docs:`, `refactor:`).

## Architecture

AutoReport is a Next.js 15 + React 19 single-page tool that generates AI & ML Club event reports as DOCX or PDF from rough notes plus photographs.

- `src/app/` - App Router pages and API routes only
- `src/app/api/{generate,pdf,docx}/route.ts` - POST endpoints; all force `runtime = "nodejs"`
- `src/frontend/` - client-side form, dropzone, and live preview
- `src/services/` - orchestration used by routes (`generateReport`, `imagePipeline`)
- `src/backend/` - server-only modules with side effects: `gemini.ts`, `pdf.ts`, `docx.ts`
- `src/templates/report.html.ts` + `report.css.ts` - single source of truth for the live preview and PDF layout
- `src/types/report.ts` - Zod schema plus shared payload types
- `src/utils/constants.ts` - college / club defaults and signatory labels
- `public/report-header.png` - official report header banner used by preview, PDF, and DOCX
- `public/college-logo.svg` - official college logo used in the app shell

## Rendering paths

PDF and DOCX are produced from the same `ReportPayload`, but through separate builders:

- PDF: payload -> `renderReportHtml()` -> Puppeteer `page.pdf()`
- DOCX: payload -> `buildDocx()` -> `docx` tables / paragraphs / images

When changing report structure, update both paths together. The header banner, metadata table, photographs block, and signatories must stay aligned across HTML, PDF, and DOCX.

## AI generation contract

`src/services/generateReport.ts` sends the prompt to Gemini through `src/backend/gemini.ts` using `models.generateContent` with JSON output enabled (`responseMimeType: "application/json"` and a response schema). The result is validated with `ReportDataSchema`. If validation fails, the model is prompted once more with the validation error; a second failure aborts the request.

Environment variables:

- `GEMINI_API_KEY` - required
- `GEMINI_MODEL` - optional, defaults to `gemini-2.0-flash`

## Format expectations

The report format is based on the provided college reference assets. Preserve these characteristics unless the user explicitly asks for a change:

- official top header banner
- centered underlined event title
- metadata table including venue and participants
- overview / program details / overall outcome sections
- photographs section with captions
- three-signature footer

## Notes

- `src/templates/report.html.ts` is also used by the browser live preview, so asset URLs must resolve in both the browser and Puppeteer.
- Do not move or overwrite files in `example/`; treat them as user-provided reference assets.
- If you touch documentation, keep it consistent with the current provider and file names.
