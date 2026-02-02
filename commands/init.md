---
description: Interactive setup for a new documentation skill
---

Set up a new documentation skill interactively.

## Step 1: Ask for Skill Name

Use AskUserQuestion to get the skill folder name:

Question: "What do you want to call this skill? This will be the folder name under `.claude/skills/`"
Header: "Skill name"
Options:
- "Auto-detect from docs" (Let the crawler detect the library name automatically)
- "Custom name" (I'll specify the folder name)

If they choose "Custom name" or "Other", use their input as the folder name.
If they choose "Auto-detect", set folder name to "auto".

## Step 2: Ask for Documentation URL

Use AskUserQuestion to get the documentation URL:

Question: "What is the documentation URL you want to generate skills from?"
Header: "Docs URL"
Options:
- "Other" (I'll provide the URL)

The user will always select "Other" and provide the URL. Store this as the documentation URL.

## Step 3: Launch Crawler

Use the Task tool with these parameters:
- subagent_type: "doxy:docs-crawler"
- run_in_background: true
- prompt: "Crawl and generate skills from: [URL from step 2]\nSkill folder name: [folder name from step 1]"
- description: "Generating skills from docs"

Tell the user:
1. The agent is running in the background
2. They can continue working while it processes
3. Skills will be created in `.claude/skills/[folder-name]/`
4. They can check progress with `/tasks` or read the output file
