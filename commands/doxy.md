---
description: Generate Claude Code skills from documentation websites
argument-hint: [documentation-url]
---

Generate Claude Code skills from the documentation at $ARGUMENTS.

## Step 1: Ask for Skill Folder Name

Before doing anything else, use AskUserQuestion to ask the user what they want to name the skill folder:

Question: "What should I name the skills folder? This will be created under `.claude-plugin/skills/`"
Header: "Folder name"
Options:
- "Auto-detect from docs" (Let the crawler detect the library name automatically)
- "Custom name" (I'll specify the folder name)

If they choose "Custom name" or "Other", use their input as the folder name.
If they choose "Auto-detect", set folder name to "auto".

## Step 2: Launch Crawler

Use the Task tool with these parameters:
- subagent_type: "doxy:docs-crawler"
- run_in_background: true
- prompt: "Crawl and generate skills from: $ARGUMENTS\nSkill folder name: [the folder name from step 1]"
- description: "Generating skills from docs"

Tell the user:
1. The agent is running in the background
2. They can continue working while it processes
3. Skills will be created in `.claude-plugin/skills/[folder-name]/`
4. They can check progress with `/tasks` or read the output file
