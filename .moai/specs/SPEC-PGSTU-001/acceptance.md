# SPEC-PGSTU-001: Acceptance Criteria

---
spec_id: SPEC-PGSTU-001
title: PostgreSQL Study Site - Acceptance Criteria
created: 2026-02-28T00:00:00Z
---

## Acceptance Test Scenarios

### Scenario 1: SQL Beginner Onboarding (SR-001)

```gherkin
Given a first-time visitor who has no SQL experience
When they navigate to the "Getting Started" section
Then they shall see a guided learning path with numbered steps
And the first lesson shall include a visual explanation of what a database is
And an interactive example shall allow them to execute their first SELECT query

Given a beginner reading content with technical terms
When they encounter a highlighted term (e.g., "PRIMARY KEY")
Then a tooltip shall appear with a friendly, jargon-free explanation
And the tooltip shall include an everyday analogy
```

### Scenario 2: Junior Developer Practical Search (SR-002)

```gherkin
Given a junior developer searching for a practical pattern
When they enter "pagination" in the search modal
Then the system shall return relevant results within 1 second
And results shall include production-ready code examples
And each result shall display a difficulty badge

Given a junior developer encountering a PostgreSQL error
When they search for "ERROR 23505"
Then the system shall display the error reference page
And the page shall list common causes and solutions
And related troubleshooting content shall be linked
```

### Scenario 3: Backend Developer Performance Analysis (SR-003)

```gherkin
Given a backend developer on the advanced indexes page
When they view the content
Then they shall see benchmark comparisons for B-tree, GiST, and GIN indexes
And version-specific behavior notes shall be displayed for PostgreSQL 13-17

Given a backend developer in the SQL Playground
When they execute a query with the "Show Plan" option enabled
Then the execution plan (EXPLAIN ANALYZE output) shall be displayed alongside results
And the plan shall highlight sequential scans and potential optimization opportunities
```

### Scenario 4: Data Analyst Window Functions (SR-004)

```gherkin
Given a data analyst navigating to the intermediate section
When they open the "Window Functions" lesson
Then the content shall include ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD examples
And each example shall use a realistic analytics dataset
And the SQL Playground shall be pre-loaded with the analytics sample data

Given a data analyst working through a CTE lesson
When they view the interactive examples
Then each CTE shall be visually decomposed showing step-by-step execution
```

### Scenario 5: Content Organization (FR-001)

```gherkin
Given a user on any content page
When they view the sidebar navigation
Then they shall see the complete curriculum structure organized in 6 sections:
  | Section | Article Count |
  | Getting Started | 3 |
  | SQL Basics | 4 |
  | Data Modeling | 3 |
  | Intermediate SQL | 4 |
  | Advanced Features | 5 |
  | Practical Patterns | 3 |

Given a user completing a lesson
When they reach the end of the page
Then "Previous" and "Next" navigation links shall be displayed
And the next link shall point to the next lesson in curriculum order

Given a content author creating a new MDX file
When the file includes valid frontmatter (title, description, difficulty, tags, version)
Then the build pipeline shall successfully include the page in navigation
And the search index shall include the new content
```

### Scenario 6: Interactive SQL Playground (FR-002)

```gherkin
Given a user on a page with an SQL Playground component
When the page loads
Then the PGlite WASM module shall NOT be loaded immediately
And the playground shall show a "Click to activate" or lazy-load trigger

Given a user who has activated the SQL Playground
When they type a valid SQL query and click "Run"
Then the query results shall be displayed in a table format within 3 seconds
And the results shall show column names and data types

Given a user who submits an invalid SQL query
When they click "Run"
Then a PostgreSQL error message shall be displayed
And a link to the relevant error reference page shall be provided

Given a user who submits a long-running query
When the query exceeds 10 seconds
Then the query shall be terminated
And a friendly timeout message shall be displayed
And optimization suggestions shall be offered

Given a user interacting with the SQL Playground
When a query is executing
Then the browser UI shall remain responsive (no main thread blocking)
```

### Scenario 7: Search Functionality (FR-003)

```gherkin
Given a user opening the search modal (Ctrl+K or click)
When they type "JOIN"
Then autocomplete suggestions shall appear as they type
And results shall be returned within 1 second
And results shall be ranked by relevance

Given search results displayed
When the user views the results
Then each result shall show:
  - Content title
  - Section path (breadcrumb)
  - Content preview with highlighted matching terms
  - Difficulty badge (beginner/intermediate/advanced)
```

### Scenario 8: Navigation (FR-004)

```gherkin
Given a user on any content page
When they view the page layout on desktop (viewport >= 1024px)
Then the sidebar shall be visible on the left
And the table of contents shall be visible on the right
And breadcrumb navigation shall be visible at the top

Given a user on a mobile device (viewport < 768px)
When they view the page
Then the sidebar shall be accessible via a hamburger menu
And the table of contents shall be hidden or collapsible
And the content shall occupy the full width
```

### Scenario 9: Code Block (FR-005)

```gherkin
Given a user viewing a SQL code block
When the code block renders
Then SQL syntax shall be highlighted with appropriate colors
And a copy button shall be visible in the top-right corner

Given a user clicking the copy button
When the click is registered
Then the code content shall be copied to the clipboard
And a "Copied!" confirmation tooltip shall appear for 2 seconds

Given a user viewing an interactive code example
When they see the "Open in Playground" button
Then clicking it shall load the code in the nearest SQL Playground component
```

### Scenario 10: Theme Support (FR-006)

```gherkin
Given a user visiting the site for the first time
When no theme preference is stored
Then the system shall use the OS-level theme preference (prefers-color-scheme)

Given a user toggling the theme switch
When they switch from light to dark mode
Then all UI elements shall update immediately
And the preference shall be persisted in localStorage
And code block themes shall update to match

Given a user returning to the site
When localStorage contains a theme preference
Then the stored theme shall be applied without flash of incorrect theme (FOUC)
```

### Scenario 11: Learning Progress (FR-007)

```gherkin
Given a user who has completed 3 lessons in "SQL Basics"
When they visit the progress dashboard
Then "SQL Basics" shall show "3/4 completed" with a progress bar at 75%
And completed lessons shall be marked with a checkmark icon

Given a user bookmarking a lesson
When they click the bookmark icon
Then the bookmark shall be persisted in localStorage
And the lesson shall appear in their bookmarks list

Given a user adding a note to a lesson
When they type in the notes panel and save
Then the note shall be persisted in localStorage
And the note shall be visible when they return to the lesson
```

### Scenario 12: Reference Documentation (FR-008)

```gherkin
Given a user viewing the data types reference page
When the page loads
Then all PostgreSQL data types shall be listed with descriptions
And version compatibility badges shall indicate which versions support each type

Given a user searching for a specific function
When they enter "array_agg" in the reference search
Then the function reference shall be displayed with:
  - Syntax
  - Parameters description
  - Return type
  - Usage examples
  - Related functions
```

### Scenario 13: Performance (NFR-001)

```gherkin
Given the production deployment
When a Lighthouse audit is run on a content page
Then the Performance score shall be >= 90
And LCP shall be < 2.5 seconds
And FID shall be < 100 milliseconds
And CLS shall be < 0.1
And TTFB shall be < 600 milliseconds

Given a content page without SQL Playground
When the page loads
Then no PGlite WASM resources shall be downloaded
```

### Scenario 14: Accessibility (NFR-002)

```gherkin
Given any page on the site
When an automated accessibility audit (axe-core) is run
Then zero critical or serious WCAG 2.1 AA violations shall be reported

Given a keyboard-only user
When they navigate the site using Tab, Enter, Escape, and Arrow keys
Then all interactive elements shall be reachable and operable
And focus indicators shall be clearly visible

Given a screen reader user
When they navigate through the content
Then heading hierarchy shall be logical (h1 -> h2 -> h3)
And all images shall have descriptive alt text
And all form inputs shall have associated labels
And ARIA roles shall be correctly applied to custom components
```

### Scenario 15: Security (NFR-003)

```gherkin
Given the production deployment
When HTTP headers are inspected
Then Content-Security-Policy header shall be present
And X-Content-Type-Options shall be set to "nosniff"
And all connections shall use HTTPS

Given the CI/CD pipeline
When the build runs
Then pnpm audit shall report zero high-severity vulnerabilities
```

### Scenario 16: Responsive Design (NFR-005)

```gherkin
Given a user on a mobile device (320px viewport)
When they view a content page
Then all text shall be readable without horizontal scrolling
And code blocks shall be horizontally scrollable within their container
And images shall scale to fit the viewport

Given a user on a tablet (768px viewport)
When they view a content page
Then the sidebar shall be collapsible
And content shall occupy the remaining width

Given a user on a desktop (1440px viewport)
When they view a content page
Then the three-column layout shall be displayed:
  - Left sidebar (navigation)
  - Center content (main article)
  - Right sidebar (table of contents)
```

### Scenario 17: SEO (NFR-006)

```gherkin
Given any content page
When the HTML source is inspected
Then it shall contain:
  - A single h1 tag matching the page title
  - OpenGraph meta tags (og:title, og:description, og:image)
  - Twitter Card meta tags
  - Canonical URL
  - Structured data (JSON-LD) for Article type

Given the production build
When the output is inspected
Then sitemap.xml shall be generated with all content page URLs
And robots.txt shall be generated with appropriate directives
```

### Scenario 18: Build and Deployment (NFR-004)

```gherkin
Given a content author adding a new MDX file
When they create the file with valid frontmatter and update _meta.json
Then the next build shall include the new page without any code changes

Given a developer pushing to the main branch
When the push is registered by GitHub
Then the CI pipeline shall run: type-check, lint, build
And on success, Vercel shall deploy the new version
And a preview URL shall be available within 5 minutes
```

---

## Quality Gate Criteria

### Definition of Done

- [ ] All Gherkin scenarios pass manual or automated verification
- [ ] Core Web Vitals targets met (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] WCAG 2.1 AA compliance verified (zero critical violations)
- [ ] All content pages render correctly on mobile (320px), tablet (768px), and desktop (1440px)
- [ ] Search returns results within 1 second for all test queries
- [ ] SQL Playground executes queries within 3 seconds on standard hardware
- [ ] Dark and light themes render correctly without FOUC
- [ ] CI pipeline passes: type-check, lint, build, accessibility audit
- [ ] No high-severity dependency vulnerabilities (pnpm audit)

### Verification Methods

| Category | Method | Tool |
|---|---|---|
| Performance | Automated audit | Lighthouse CI |
| Accessibility | Automated + manual audit | axe-core, manual keyboard testing |
| Responsiveness | Visual regression | Playwright screenshots at breakpoints |
| Search | Integration tests | Vitest |
| SQL Playground | E2E tests | Playwright |
| SEO | HTML validation | Custom build-time script |
| Security | Header analysis + audit | securityheaders.com, pnpm audit |

---

Document Version: 1.0.0
Created: 2026-02-28
Last Updated: 2026-02-28
