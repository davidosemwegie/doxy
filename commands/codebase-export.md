---
description: Export architecture skill for use in another repo
---

# Export Codebase Architecture Skill

Export an architecture skill for use in another repository.

## Steps

### 1. Parse Arguments

Get the skill name from `$ARGUMENTS`.

If no skill name provided:
- Use `Glob` to find available skills matching `.claude/skills/*-arch/`
- Use `AskUserQuestion` to ask which skill to export:
  - Question: "Which skill would you like to export?"
  - Header: "Available Skills"
  - Options: List each available skill by name (extracted from directory names)

### 2. Validate Skill Exists

Check if the skill exists by looking for:
```
.claude/skills/[name]-arch/doxy-codebase-manifest.json
```

If not found:
- Report error: "Skill '[name]' not found."
- List available skills from `.claude/skills/*-arch/`
- Stop execution

### 3. Ask Export Format

Use `AskUserQuestion`:
- Question: "What export format do you need?"
- Header: "Format"
- Options:
  - "Full copy (Recommended)" - Copy all files, sanitize manifest
  - "Standalone file" - Concatenate into single portable .md
  - "API surface only" - Export just api-surface.md

### 4. Ask Destination

Use `AskUserQuestion`:
- Question: "Where should the export be saved?"
- Header: "Destination"
- Options:
  - "Default" - Use ./[name]-arch-export/
  - "Custom path" - I'll specify the path

If user selects "Custom path", use `AskUserQuestion` to get the path:
- Question: "Enter the destination path:"
- Header: "Custom Path"
- Suggest: "./exports/"

### 5. Process Export

Based on the selected format:

#### Full Copy Format

1. Create destination directory
2. Copy all files from `.claude/skills/[name]-arch/` to destination
3. Read and modify `doxy-codebase-manifest.json`:
   - Remove the `source_path` field (absolute paths don't transfer)
   - Add `exported_at` with current ISO-8601 timestamp
   - Add `exported_from` containing the original `source_path` value
4. Write the modified manifest to destination

#### Standalone File Format

1. Create a single file named `[name]-arch-standalone.md`
2. Concatenate content in this order:

```markdown
# [name] Architecture Export

**Exported:** [ISO-8601 timestamp]
**Original Path:** [source_path from manifest]

---

## Skill Definition

[Content of SKILL.md]

---

## API Surface

[Content of api-surface.md if it exists]

---

## Package Files

[Content of any package-specific files if monorepo]
```

3. Use clear `---` section dividers between sections

#### API Surface Only Format

1. Read `api-surface.md` from the skill directory
2. Create file named `[name]-api-surface.md` at destination
3. Prepend header comment:

```markdown
<!--
  Exported from: [source_path]
  Exported at: [ISO-8601 timestamp]
  Original skill: [name]-arch
-->

[Original api-surface.md content]
```

### 6. Show Import Instructions

Display completion message:

```
Export complete: [destination path]

To import in another repo:
  /doxy:codebase:import [path-to-export]

For standalone file:
  Copy the file to your project and reference it manually
```
