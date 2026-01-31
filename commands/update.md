---
description: Refresh a documentation skill by re-crawling its source
argument-hint: <skill-name>
---

Re-crawl the documentation for an existing skill.

## Input

The skill name is provided as $ARGUMENTS. If no argument is provided, show available skills and ask the user to choose one.

## Step 1: Validate Skill Exists

If $ARGUMENTS is empty:
1. Use Glob to find all doxy manifests: `.claude-plugin/skills/*/doxy-manifest.json`
2. List the available skills
3. Ask user to run the command again with a skill name: `/doxy:update <skill-name>`
4. STOP

If $ARGUMENTS is provided:
1. Try to read `.claude-plugin/skills/$ARGUMENTS/doxy-manifest.json`
2. If file doesn't exist, tell user the skill wasn't found and list available skills
3. STOP if not found

## Step 2: Get Source URL

Read the manifest file and extract the `source_url`.

## Step 3: Confirm Update

Use AskUserQuestion:

Question: "Ready to refresh '[skill-name]' from [source_url]. This will regenerate all skills in this folder. Continue?"
Header: "Confirm"
Options:
- "Yes, update" (Proceed with the refresh)
- "No, cancel" (Cancel the operation)

If user cancels, STOP.

## Step 4: Delete Existing Skills (Keep Manifest)

Use Bash to delete all files in the skill folder EXCEPT the manifest:
```bash
find ".claude-plugin/skills/$ARGUMENTS" -type f ! -name "doxy-manifest.json" -delete
find ".claude-plugin/skills/$ARGUMENTS" -type d -empty -delete
```

## Step 5: Re-crawl Documentation

Use the Task tool with these parameters:
- subagent_type: "doxy:docs-crawler"
- run_in_background: true
- prompt: "Crawl and generate skills from: [source_url]\nSkill folder name: $ARGUMENTS\nThis is an UPDATE - manifest already exists, just update last_updated timestamp."
- description: "Updating skills from docs"

Tell the user the update is running in the background.
