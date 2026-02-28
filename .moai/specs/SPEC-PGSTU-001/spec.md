# SPEC-PGSTU-001: PostgreSQL Study Site

---
id: SPEC-PGSTU-001
title: PostgreSQL Study Site - Comprehensive Learning Platform
created: 2026-02-28T00:00:00Z
status: Planned
priority: High
lifecycle: spec-anchored
assigned: manager-spec
---

## Executive Summary

### Project Vision

PostgreSQL Study Site is an educational web platform designed for developers ranging from SQL beginners to intermediate backend developers, enabling systematic PostgreSQL learning. Inspired by Karrot's warm accessibility and Toss's trustworthy clarity, the platform eliminates unnecessary complexity and focuses on the essence of learning.

### Core Value Proposition

- Browser-based interactive SQL execution environment (PGlite) with zero backend dependency
- Step-by-step curriculum from basics to production-level optimization
- Design philosophy combining Karrot's friendliness with Toss's precision
- MDX-based content management for easy contribution and maintenance

### Success Metrics

- New visitor first lesson completion rate > 60%
- Monthly return visit rate > 40%
- Search success rate for desired content > 85%
- First query execution within 15 minutes for beginners
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1, TTFB < 600ms

---

## Environment

### Technology Stack

- **Framework**: Next.js 15 (App Router) with React 19
- **Documentation Framework**: Nextra 3.x (MDX native support)
- **Language**: TypeScript 5.x (strict mode)
- **Styling**: Tailwind CSS 4.x (utility-first)
- **Interactive SQL**: PGlite (WebAssembly PostgreSQL)
- **Deployment**: Vercel (Edge Network, auto-deploy)
- **Runtime**: Node.js 20+ LTS
- **Package Manager**: pnpm (recommended)

### Content Processing

- MDX parsing: `@next/mdx` or `next-mdx-remote`
- Code highlighting: `rehype-pretty-code` (Shiki-based)
- Markdown extensions: `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`

### Search

- Client-side full-text search: `flexsearch`
- Alternative: `fuse.js` (fuzzy search)

### UI Components

- Headless accessible components: `@radix-ui/react-*`
- Icons: `lucide-react`
- Theme switching: `next-themes`

---

## Assumptions

### Technical Assumptions

- [Confidence: High] Next.js 15 App Router is stable for production SSG documentation sites
- [Confidence: High] Nextra 3.x provides adequate MDX routing and sidebar generation
- [Confidence: High] PGlite WebAssembly can execute standard PostgreSQL queries in modern browsers
- [Confidence: Medium] PGlite initial WASM load (1-2MB) is acceptable for users on mobile networks
- [Confidence: High] Tailwind CSS 4.x is stable for production use
- [Confidence: High] Vercel free tier is sufficient for initial traffic

### Business Assumptions

- [Confidence: High] Korean developers need a localized PostgreSQL learning resource
- [Confidence: Medium] Users prefer interactive SQL execution over read-only documentation
- [Confidence: Medium] Step-by-step curriculum structure increases completion rates
- [Confidence: Low] Community features will drive long-term engagement

### User Assumptions

- [Confidence: High] Target users have basic programming knowledge
- [Confidence: Medium] Most users access via desktop (developer audience)
- [Confidence: Medium] Users prefer Korean-language content for database learning
- [Confidence: Low] Users will return regularly for advanced topics after initial learning

---

## Stakeholder Requirements

### SR-001: SQL Beginners (SQL Newcomers)

**WHEN** a SQL beginner visits the site for the first time, **THEN** the system **shall** present a guided onboarding path that enables the user to execute their first query within 15 minutes.

**WHEN** a beginner encounters a technical term, **THEN** the system **shall** provide an inline tooltip with a friendly explanation using everyday language analogies.

The system **shall** always display visual examples (tables, diagrams) alongside SQL concepts to support visual learners.

### SR-002: Junior Developers (1-3 years experience)

**WHEN** a junior developer searches for a practical pattern (e.g., "pagination query"), **THEN** the system **shall** return production-ready code examples with explanations of trade-offs.

**WHEN** a junior developer encounters a PostgreSQL error, **THEN** the system **shall** provide the error reference page with common causes and solutions.

**IF** a junior developer is working through intermediate content, **THEN** the system **shall** provide links to related real-world scenarios in the practical section.

### SR-003: Backend Developers (Performance Optimization)

**WHEN** a backend developer accesses the advanced section, **THEN** the system **shall** provide EXPLAIN ANALYZE visualization and index strategy guides with benchmark comparisons.

**WHILE** a backend developer is in the interactive SQL environment, **WHEN** they execute a query, **THEN** the system **shall** display the execution plan alongside the results.

**Where** possible, the system **shall** provide PostgreSQL version-specific behavior notes (versions 13-17).

### SR-004: Data Analysts (Analytical Queries)

**WHEN** a data analyst navigates to the intermediate section, **THEN** the system **shall** present window functions, CTEs, and aggregate functions with data analysis use cases.

The system **shall** always provide sample datasets that simulate realistic analytical scenarios (e-commerce, social media, log data).

---

## Functional Requirements

### FR-001: Content Organization and Curriculum

The system **shall** always organize content in a hierarchical structure with six learning stages: Getting Started, SQL Basics, Data Modeling, Intermediate SQL, Advanced Features, and Practical Patterns.

**WHEN** a user completes a lesson, **THEN** the system **shall** display navigation to the next lesson in the curriculum sequence.

Each MDX content file **shall** always include frontmatter metadata: title, description, difficulty level (beginner/intermediate/advanced), tags, minimum PostgreSQL version, last updated date, and related content links.

The system **shall not** present advanced topics without clear prerequisite indicators showing required prior knowledge.

### FR-002: Interactive SQL Playground (PGlite)

**WHEN** a user clicks "Run Query" in the SQL Playground component, **THEN** the system **shall** execute the SQL using PGlite WebAssembly and display results within 3 seconds.

**WHEN** a user visits a page with an interactive example, **THEN** the system **shall** lazy-load the PGlite WASM module to minimize initial page load impact.

The system **shall** always provide pre-loaded sample datasets (e-commerce, social network, log data) for each interactive playground instance.

**IF** a user submits a query that exceeds the execution time limit (10 seconds), **THEN** the system **shall** terminate the query and display a friendly timeout message with optimization suggestions.

**IF** a user submits a syntactically invalid query, **THEN** the system **shall** display the PostgreSQL error message with a link to the relevant error reference page.

The system **shall not** allow PGlite queries to affect the browser's main thread responsiveness (Web Worker execution required).

### FR-003: Search and Filtering

**WHEN** a user enters a search term in the search modal, **THEN** the system **shall** return matching results within 1 second, ranked by relevance.

The system **shall** always support searching by concept name, function name, error message, and tag.

**Where** possible, the system **shall** provide autocomplete suggestions as the user types.

**WHEN** search results are displayed, **THEN** the system **shall** show content previews with highlighted matching terms and difficulty badges.

### FR-004: Navigation and Information Architecture

The system **shall** always display a sidebar with the complete curriculum structure, highlighting the current page.

The system **shall** always provide breadcrumb navigation showing the current page location in the hierarchy.

**WHEN** a user reaches the end of a lesson, **THEN** the system **shall** display previous/next navigation links.

The system **shall** always render a table of contents for the current page on desktop viewports.

### FR-005: Code Block and Syntax Highlighting

The system **shall** always render SQL code blocks with syntax highlighting using Shiki.

**WHEN** a user clicks the copy button on a code block, **THEN** the system **shall** copy the code content to the clipboard and display a confirmation tooltip.

**Where** code examples are interactive, the system **shall** provide an "Open in Playground" button that loads the code in the SQL Playground.

### FR-006: Theme and Visual Design

The system **shall** always support dark and light themes with user preference persistence.

**WHEN** the user has not set a theme preference, **THEN** the system **shall** follow the system-level preference (prefers-color-scheme).

The system **shall** always apply the design system combining Karrot's warm tones with Toss's clean typography and spacing.

### FR-007: Learning Progress Tracking (Phase 2)

**WHEN** a user completes a lesson, **THEN** the system **shall** persist completion status in localStorage.

**Where** possible, the system **shall** provide a progress dashboard showing completed/remaining lessons per section.

**Where** possible, the system **shall** support bookmark and note functionality for individual lessons.

### FR-008: Reference Documentation

The system **shall** always provide a searchable reference section covering PostgreSQL data types, built-in functions, and common error codes.

**WHEN** a user views a reference page, **THEN** the system **shall** display PostgreSQL version compatibility information using version badges.

The system **shall** always link reference content to related learning materials.

---

## Non-Functional Requirements

### NFR-001: Performance

The system **shall** always achieve Core Web Vitals targets:
- LCP (Largest Contentful Paint) < 2.5 seconds
- FID (First Input Delay) < 100 milliseconds
- CLS (Cumulative Layout Shift) < 0.1
- TTFB (Time to First Byte) < 600 milliseconds

The system **shall** always generate static HTML at build time for all content pages (SSG).

The system **shall not** load PGlite WASM on pages that do not contain interactive SQL playgrounds.

**WHEN** PGlite is needed, **THEN** the system **shall** lazy-load the WASM module after the page is interactive.

### NFR-002: Accessibility

The system **shall** always comply with WCAG 2.1 AA standards for color contrast ratios.

The system **shall** always support full keyboard navigation for all interactive elements.

The system **shall** always provide appropriate ARIA labels for custom UI components.

The system **shall** always support screen reader navigation through content structure.

The system **shall not** rely solely on color to convey information (difficulty levels, status indicators).

### NFR-003: Security

The system **shall** always enforce HTTPS connections (provided by Vercel/Cloudflare).

The system **shall** always set Content Security Policy (CSP) headers to prevent XSS attacks.

**IF** interactive SQL execution is enabled, **THEN** the system **shall** execute all queries in a sandboxed Web Worker environment.

The system **shall not** collect personally identifiable information (PII) without explicit user consent.

The system **shall** always run dependency vulnerability scanning (`pnpm audit`) as part of the CI pipeline.

### NFR-004: Scalability and Extensibility

The system **shall** always use file-system-based routing (Nextra) so that new content can be added by creating MDX files without code changes.

The system **shall** always maintain a modular component architecture allowing new UI components without affecting existing ones.

**Where** new learning modules are added, the system **shall** require only an MDX file and `_meta.json` update.

The system **shall** always support internationalization (i18n) routing for future English content addition.

### NFR-005: Responsive Design

The system **shall** always render content readably on viewports from 320px (mobile) to 2560px (ultra-wide desktop).

The system **shall** always adapt the layout: single column on mobile, two columns (sidebar + content) on tablet, three columns (sidebar + content + TOC) on desktop.

The system **shall** always ensure code blocks are horizontally scrollable on narrow viewports without breaking the page layout.

### NFR-006: SEO

The system **shall** always generate semantic HTML with proper heading hierarchy (h1-h6).

The system **shall** always include OpenGraph and Twitter Card metadata for all content pages.

The system **shall** always generate a sitemap.xml and robots.txt at build time.

---

## Technical Architecture

### Frontend Architecture

```
postgresql-study/
+-- src/
|   +-- app/                    # Next.js App Router entry point
|   +-- components/
|   |   +-- layout/             # Header, Sidebar, Footer, TOC
|   |   +-- content/            # CodeBlock, SQLPlayground, Callout, Diagram
|   |   +-- navigation/         # Breadcrumb, PrevNext, SearchModal
|   |   +-- ui/                 # Button, Badge, Tooltip (Radix-based)
|   +-- content/                # MDX content files (file-based routing)
|   |   +-- getting-started/
|   |   +-- basics/
|   |   +-- data-modeling/
|   |   +-- intermediate/
|   |   +-- advanced/
|   |   +-- practical/
|   |   +-- reference/
|   +-- styles/                 # Global styles, Tailwind config
|   +-- lib/                    # Utilities, helpers, PGlite wrapper
+-- public/                     # Static assets (images, fonts)
+-- tests/                      # Test files
```

### Content Management

- MDX files with YAML frontmatter for metadata
- `_meta.json` files for navigation order per directory
- File-system routing: `src/content/advanced/indexes.mdx` maps to `/advanced/indexes`
- Nextra handles sidebar generation, page layout, and search index building

### Interactive SQL Environment

- PGlite loaded via Web Worker to prevent main thread blocking
- Lazy-loaded only on pages with `<SQLPlayground />` component
- Pre-loaded sample datasets injected on first playground initialization
- Query execution timeout: 10 seconds
- Results displayed in a tabular format with column type indicators

### Deployment Pipeline

```
Author pushes MDX -> GitHub -> CI/CD (type-check, lint, build) -> Vercel -> CDN
```

- Auto-deploy on `main` branch push
- Preview deployments on PR creation
- Core Web Vitals monitoring via Vercel Analytics

### Data Flow

```
Content Layer (MDX + frontmatter)
    |
    v
Build Pipeline (Next.js SSG + Nextra)
    |
    v
Static HTML + JS + Search Index
    |
    v
CDN / Edge Network (Vercel)
    |
    v
User Browser
    |
    v (client-side only)
PGlite WebAssembly (SQL Playground)
localStorage (Progress, Bookmarks)
```

---

## Dependencies and Constraints

### Hard Dependencies

| Package | Purpose | Version |
|---|---|---|
| next | Framework | 15.x |
| react / react-dom | UI library | 19.x |
| nextra / nextra-theme-docs | Documentation framework | 3.x |
| typescript | Type safety | 5.x |
| tailwindcss | Styling | 4.x |
| @electric-sql/pglite | Browser PostgreSQL | latest stable |

### Development Dependencies

| Package | Purpose |
|---|---|
| eslint + eslint-config-next | Linting |
| prettier | Formatting |
| husky + lint-staged | Git hooks |
| vitest | Unit/integration testing |
| @testing-library/react | Component testing |
| playwright | E2E testing |

### Constraints

- **No Backend for MVP**: All functionality must work client-side or via SSG
- **Content-First**: Architecture decisions prioritize content authoring experience
- **Accessibility-First**: WCAG 2.1 AA compliance is non-negotiable
- **Performance Budget**: Total page weight under 500KB for content pages (excluding PGlite WASM)
- **Browser Support**: Chrome 90+, Firefox 90+, Safari 15+, Edge 90+

---

## Traceability

| Requirement | Plan Reference | Acceptance Reference |
|---|---|---|
| SR-001 ~ SR-004 | plan.md: Milestone 1 | acceptance.md: Scenario 1-4 |
| FR-001 | plan.md: Milestone 1 | acceptance.md: Scenario 5 |
| FR-002 | plan.md: Milestone 2 | acceptance.md: Scenario 6 |
| FR-003 | plan.md: Milestone 1 | acceptance.md: Scenario 7 |
| FR-004 ~ FR-006 | plan.md: Milestone 1 | acceptance.md: Scenario 8-10 |
| FR-007 | plan.md: Milestone 3 | acceptance.md: Scenario 11 |
| FR-008 | plan.md: Milestone 1 | acceptance.md: Scenario 12 |
| NFR-001 ~ NFR-006 | plan.md: All Milestones | acceptance.md: Scenario 13-18 |

---

Document Version: 1.0.0
Created: 2026-02-28
Last Updated: 2026-02-28
