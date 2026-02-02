---
description: Refresh an existing architecture skill
---

# Codebase Update

This command refreshes an existing architecture skill.

## Flow

### 1. Parse Arguments

Get skill name from `$ARGUMENTS`. If no name provided, use AskUserQuestion to ask which skill to update (list available skills from `.claude/skills/*-arch/`).

### 2. Validate Skill Exists

Check for `.claude/skills/[name]-arch/doxy-codebase-manifest.json`

If not found, report error and suggest using `/doxy:codebase` instead.

### 3. Read Manifest

- Get source_path from manifest
- Get git_commit from manifest (last analyzed commit)

### 4. Validate Path Exists

Check if source_path directory exists.

If not found, use AskUserQuestion:
- Question: "The original path '[path]' no longer exists. Where is the codebase now?"
- Header: "New path"
- Options: "Other" (user provides new path)

### 5. Show Changes Since Last Analysis

Run: `cd "[path]" && git log --oneline [last_commit]..HEAD | head -20`

Show the output to the user.

### 6. Confirm Regeneration

Use AskUserQuestion:
- Question: "Ready to regenerate the [name] skill? This will overwrite existing files."
- Header: "Confirm"
- Options:
  - "Yes, regenerate" (Proceed with update)
  - "No, cancel" (Abort the update)

### 7. Launch Agent with UPDATE Flag

If confirmed, use Task tool:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt format:
  ```
  First, read the file at .claude/plugins/doxy/agents/codebase-analyzer.md to get your full instructions. Then follow those instructions to:
  Analyze codebase at: [path]
  Skill folder name: [name without -arch suffix]
  Focus: [focus from manifest]
  This is an UPDATE - manifest already exists, just update analyzed_at timestamp.
  Monorepo type: [from manifest or "none"]
  Monorepo mode: [from manifest or "unified"]
  ```
- description: "Updating architecture skill"

### 8. For Monorepos

If manifest.monorepo.type is not null:
- Compare git commits per package
- Only regenerate packages with changes
- Show which packages will be updated

### 9. Tell User

- The update is running in the background
- Skills will be updated in `.claude/skills/[name]-arch/`
