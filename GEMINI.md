# AutoReport: AI-Powered Activity Report Generator

AutoReport is a specialized Next.js 15 application designed to generate official AI & ML Club activity reports for Dhole Patil College of Engineering. It transforms rough event notes and photographs into structured, professionally formatted PDF and DOCX documents using the Gemini API.

## Core Mandates

- **Synchronized Rendering:** Any changes to the report layout MUST be applied to both `src/templates/report.html.ts` (for browser/PDF) and `src/backend/docx.ts` (for DOCX).
- **Strict Data Contracts:** Report data structures are governed by Zod schemas in `src/types/report.ts`. AI generation must strictly adhere to these schemas.
- **Official Branding:** Always use the official header assets (`public/report-header.png`) and follow the established metadata table and signature layout.

## Architecture & Layout

- **`src/app/`**: Next.js App Router. API routes (`/api/generate`, `/api/pdf`, `/api/docx`) handle core logic.
- **`src/backend/`**: Server-side integrations.
  - `gemini.ts`: Interface with Gemini API for JSON-structured content.
  - `pdf.ts`: Puppeteer-based PDF generation from HTML templates.
  - `docx.ts`: Library-based DOCX generation matching the official style.
- **`src/services/`**: Orchestration layer.
  - `generateReport.ts`: Manages the prompt-validation-retry loop with Gemini.
  - `imagePipeline.ts`: Processes uploaded images for report inclusion.
- **`src/templates/`**: Single source of truth for visual layout.
  - `report.html.ts`: Functional components that return raw HTML strings.
  - `report.css.ts`: Scoped CSS used by both the browser preview and Puppeteer.
- **`src/types/report.ts`**: Central repository for Zod schemas (`ReportDataSchema`) and TypeScript types (`ReportPayload`).

## Development Workflow

### Commands

- `npm run dev`: Start development server at `localhost:3000`.
- `npm run build`: Production build.
- `npm run lint`: Run ESLint checks.

### Environment Setup

Required `.env.local` variables:
- `GEMINI_API_KEY`: Your Google AI Studio API key.
- `GEMINI_MODEL`: Defaults to `gemini-2.0-flash`.
- `PUPPETEER_CACHE_DIR`: Set to `./.cache/puppeteer` for stable local execution.

### AI Generation Contract

1. **Prompting**: Request JSON output from Gemini with a specific JSON schema.
2. **Validation**: Use `ReportDataSchema.safeParse` on the AI response.
3. **Retry Logic**: On validation failure, re-prompt the model once with the error details.
4. **Finalization**: Validated data is returned to the frontend for manual review/editing.

## Conventions

- **Commits**: Use conventional commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`).
- **Components**: Use Tailwind CSS for frontend components in `src/frontend/` and `src/components/ui/`.
- **Constants**: Store college-wide defaults (Academic Year, Semester, Signatories) in `src/utils/constants.ts`.
- **Naming**: Use descriptive filenames; follow existing patterns (e.g., `ReportForm.tsx`, `imagePipeline.ts`).
