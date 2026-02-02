# SKILL.md Format Reference

Complete specification for generating well-formed skill files.

## YAML Frontmatter

Every SKILL.md requires frontmatter:

```yaml
---
name: library-topic
description: Use when [trigger condition]. Covers [key concepts].
---
```

### Required Fields

| Field | Format | Example |
|-------|--------|---------|
| `name` | `library-topic` (kebab-case) | `react-hooks`, `express-middleware` |
| `description` | Trigger-focused sentence | `Use when implementing React hooks. Covers useState, useEffect, custom hooks.` |

### Name Patterns

- Prefix with library name: `webgl-shaders`, `react-state`
- Use kebab-case: `getting-started`, `api-reference`
- Keep concise: 2-4 words typical

### Description Guidelines

Start with trigger phrase:
- "Use when..."
- "Apply when..."
- "Reference for..."

Include what it covers:
- Key APIs or concepts
- Common use cases
- Problem types it addresses

**Good:** `Use when implementing authentication in Express. Covers sessions, JWT, OAuth patterns.`

**Bad:** `This skill explains authentication.`

## Markdown Body

### Recommended Sections

```markdown
# [Topic Name]

Brief overview (1-2 sentences).

## Core Concepts

Key ideas the user needs to understand.

## Patterns

Common implementation patterns with code examples.

## Common Issues

Frequent problems and solutions.

## Quick Reference

Tables or lists for lookup.
```

### Code Examples

Always include language tags:

```markdown
```javascript
const example = "code here";
```
```

For patterns, show structure:

```markdown
## Pattern: [Name]

**When to use:** [Condition]

```typescript
// Implementation
function pattern() {
  // ...
}
```
```

### Tables for Reference Data

Use tables for APIs, options, or comparisons:

```markdown
| Method | Parameters | Returns | Description |
|--------|------------|---------|-------------|
| `create()` | `config: Config` | `Instance` | Creates new instance |
| `destroy()` | none | `void` | Cleans up resources |
```

## Directory Structure

### Single Topic

```
.claude/skills/library-name/
├── doxy-manifest.json
└── topic/
    └── SKILL.md
```

### Multi-Page Documentation

```
.claude/skills/library-name/
├── doxy-manifest.json
├── getting-started/
│   └── SKILL.md
├── core-concepts/
│   └── SKILL.md
├── api-reference/
│   ├── SKILL.md
│   └── references/
│       ├── methods.md
│       └── types.md
└── advanced/
    └── SKILL.md
```

### Folder Naming

- Derive from URL path
- Remove common prefixes: `docs/`, `guide/`, `reference/`, `api/`
- Remove library name prefix if present
- Convert to kebab-case

Examples:
- `/docs/react/hooks/use-state` → `hooks-use-state/`
- `/guide/getting-started` → `getting-started/`
- `/api/v2/methods` → `methods/`

## References Subdirectory

Use `references/` when content exceeds 200 lines or for detailed lookup material.

### When to Use

- API reference tables with many entries
- Configuration option lists
- Type definitions
- Extended examples

### Structure

```
topic/
├── SKILL.md           # Main content (under 200 lines)
└── references/
    ├── api.md         # Detailed API reference
    ├── types.md       # Type definitions
    └── examples.md    # Extended examples
```

### Linking from Main SKILL.md

```markdown
## API Reference

Core methods are documented below. For complete API, see `references/api.md`.

| Method | Description |
|--------|-------------|
| `init()` | Initialize the library |
| `render()` | Render to canvas |
```

## Quality Guidelines

### Line Limits

- Main SKILL.md: Under 200 lines
- Reference files: No strict limit, but prefer focused documents

### Writing Style

**Do:**
- Use imperative voice: "Configure the server..."
- Focus on actions: "Run this command..."
- Include working code examples

**Don't:**
- Use passive voice: "The server can be configured..."
- Over-explain: "This section will teach you about..."
- Include broken or pseudo-code

### Progressive Disclosure

1. **SKILL.md**: Essential information for common tasks
2. **references/**: Deep details for specific needs

Users should accomplish 80% of tasks from main SKILL.md alone.

## Manifest Files

### Documentation Manifest (doxy-manifest.json)

Created when generating skills from documentation:

```json
{
  "name": "library-name",
  "source_url": "https://docs.example.com",
  "created_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

### Codebase Manifest (codebase-manifest.json)

Created when generating skills from a codebase:

```json
{
  "name": "project-name",
  "source_path": "/path/to/codebase",
  "created_at": "2024-01-15T10:30:00Z",
  "last_updated": "2024-01-15T10:30:00Z"
}
```

## Complete Example

A well-formed SKILL.md:

```markdown
---
name: express-middleware
description: Use when implementing Express middleware. Covers middleware patterns, error handling, and composition.
---

# Express Middleware

Middleware functions have access to request, response, and next function.

## Basic Pattern

```javascript
function middleware(req, res, next) {
  // Process request
  next(); // Pass to next middleware
}

app.use(middleware);
```

## Error Handling Middleware

Error middleware has four parameters:

```javascript
function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
}

// Must be last
app.use(errorHandler);
```

## Common Patterns

| Pattern | Use Case |
|---------|----------|
| Authentication | Verify user identity |
| Logging | Record request details |
| Validation | Check request data |
| CORS | Handle cross-origin requests |

## Quick Reference

```javascript
// Apply to all routes
app.use(middleware);

// Apply to specific path
app.use('/api', middleware);

// Apply to specific route
app.get('/users', middleware, handler);
```

For detailed middleware API, see `references/api.md`.
```

This example:
- Has proper frontmatter with trigger-based description
- Uses imperative voice
- Includes working code examples
- Has table for quick lookup
- References detailed docs appropriately
- Stays under 200 lines
