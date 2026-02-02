---
description: Generate architecture skill from a codebase
---

Generate an architecture skill from analyzing a codebase.

## Step 1: Resolve Path

Use `$ARGUMENTS` if provided, otherwise default to the current working directory.

Tell the user: "Analyzing codebase at: [resolved path]"

## Step 2: Detect Monorepo

Check for the presence of these files at the resolved path:
- `turbo.json` → Turborepo
- `nx.json` → Nx
- `lerna.json` → Lerna
- `pnpm-workspace.yaml` → pnpm workspaces
- `package.json` with "workspaces" field → npm/yarn workspaces

If none are found, skip to Step 4.

## Step 3: Monorepo Options (if detected)

Use AskUserQuestion to determine how to analyze the monorepo:

Question: "How would you like to analyze this [type] monorepo?"
Header: "Monorepo"
Options:
- "All packages" (Analyze every package in the monorepo)
- "Select specific" (Choose which packages to analyze)
- "Root only" (Analyze only the root configuration)
- "Unified skill" (Create a single skill covering the entire monorepo)

If they choose "Select specific", use another AskUserQuestion showing the list of packages for multi-select.

Store the monorepo type, mode, and selected packages (if applicable).

## Step 4: Ask for Skill Name

Use AskUserQuestion to get the skill name:

Question: "What should the skill be called? This will create `.claude/skills/[name]-arch/`"
Header: "Skill name"
Options:
- "Auto-detect from package.json" (Use project name)
- "Custom name" (I'll specify the name)

If they choose "Custom name", use their input as the folder name.
If they choose "Auto-detect from package.json", read the project name from package.json and use that.

## Step 5: Ask for Focus Area

Use AskUserQuestion to determine the analysis focus:

Question: "What analysis focus should be used?"
Header: "Focus"
Options:
- "Full analysis (Recommended)" (Complete analysis of all patterns)
- "API surface only" (Focus on endpoints, types, data layer)
- "Frontend patterns" (Focus on components, state, routing)

Map the selection to:
- "Full analysis (Recommended)" → "full"
- "API surface only" → "api"
- "Frontend patterns" → "frontend"

## Step 6: Launch Agent

Use the Task tool with these parameters:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt:
  ```
  First, read the file at .claude/plugins/doxy/agents/codebase-analyzer.md to get your full instructions. Then follow those instructions to:
  Analyze codebase at: [resolved path]
  Skill folder name: [name from step 4]
  Focus: [full|api|frontend]
  Monorepo type: [type or "none"]
  Monorepo mode: [all|selected|root|unified] (if monorepo)
  Selected packages: [list] (if "selected" mode)
  ```
- description: "Analyzing codebase"

## Step 7: Inform User

Tell the user:
1. The agent is running in the background
2. They can continue working while it analyzes
3. Skills will be created in `.claude/skills/[name]-arch/`
4. They can check progress with `/tasks` or read the output file
