---
description: Interactive setup for a new skill from docs or codebase
---

Set up a new skill interactively - works with both documentation URLs and local codebases.

## Step 1: Ask for Source Type

Use AskUserQuestion to determine the source:

Question: "What do you want to generate skills from?"
Header: "Source type"
Options:
- "Documentation URL" (Generate skills from a docs website)
- "Local codebase" (Generate architecture skills from code)

## If Documentation URL:

### Step 2a: Ask for Skill Name

Use AskUserQuestion to get the skill folder name:

Question: "What do you want to call this skill? This will be the folder name under `.claude/skills/`"
Header: "Skill name"
Options:
- "Auto-detect from docs" (Let the crawler detect the library name automatically)
- "Custom name" (I'll specify the folder name)

If they choose "Custom name" or "Other", use their input as the folder name.
If they choose "Auto-detect", set folder name to "auto".

### Step 3a: Ask for Documentation URL

Use AskUserQuestion to get the documentation URL:

Question: "What is the documentation URL you want to generate skills from?"
Header: "Docs URL"
Options:
- "Other" (I'll provide the URL)

The user will always select "Other" and provide the URL. Store this as the documentation URL.

### Step 4a: Launch Crawler

Use the Task tool with these parameters:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt: "First, read the file at .claude/plugins/doxy/agents/docs-crawler.md to get your full instructions. Then follow those instructions to crawl and generate skills from: [URL from step 3a]\nSkill folder name: [folder name from step 2a]"
- description: "Generating skills from docs"

Tell the user:
1. The agent is running in the background
2. They can continue working while it processes
3. Skills will be created in `.claude/skills/[folder-name]/`
4. They can check progress with `/tasks` or read the output file

## If Local Codebase:

### Step 2b: Ask for Codebase Path

Use AskUserQuestion:

Question: "What path do you want to analyze? (Leave empty for current directory)"
Header: "Codebase path"
Options:
- "Current directory" (Analyze the current working directory)
- "Other" (I'll specify a path)

If they choose "Current directory", use "." as the path.
If they choose "Other", use their input as the path.

### Step 3b: Ask for Skill Name

Use AskUserQuestion:

Question: "What do you want to call this skill?"
Header: "Skill name"
Options:
- "Auto-detect from project" (Use project/package name)
- "Custom name" (I'll specify the name)

If they choose "Custom name" or "Other", use their input.
If they choose "Auto-detect", set name to "auto".

### Step 4b: Launch Analyzer

Use the Task tool with these parameters:
- subagent_type: "general-purpose"
- run_in_background: true
- prompt: "First, read the file at .claude/plugins/doxy/agents/codebase-analyzer.md to get your full instructions. Then follow those instructions to analyze codebase at: [path from step 2b]\nSkill folder name: [name from step 3b]\nFocus: full"
- description: "Analyzing codebase"

Tell the user:
1. The agent is running in the background
2. They can continue working while it analyzes
3. Skills will be created in `.claude/skills/[name]-arch/`
4. They can check progress with `/tasks` or read the output file
