---
description: Refresh a documentation skill by re-crawling its source
argument-hint: <skill-name> [new-url]
---

Re-crawl the documentation for an existing skill. Optionally provide a new URL if the docs have moved.

## Input

Parse $ARGUMENTS to extract:
1. The skill name (first argument, required)
2. Optionally, a new source URL (second argument)

Examples:
- `/doxy:update react-docs` - refresh using stored URL
- `/doxy:update react-docs https://new-docs.react.dev` - update with new URL

If no arguments provided, show available skills.

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

## Step 2: Determine Source URL

Read the manifest file to get the existing `source_url`.

**If a new URL was provided in arguments:**
- Use the new URL instead of the stored one
- Note that the manifest will be updated with this new URL

**If no new URL was provided:**
- Use the `source_url` from the manifest

## Step 3: Confirm Update

Use AskUserQuestion:

If using a NEW URL:
- Question: "Ready to refresh '[skill-name]' from NEW URL: [new-url]. This will update the stored URL and regenerate all skills. Continue?"

If using the STORED URL:
- Question: "Ready to refresh '[skill-name]' from [source_url]. This will regenerate all skills in this folder. Continue?"

Header: "Confirm"
Options:
- "Yes, update" (Proceed with the refresh)
- "No, cancel" (Cancel the operation)

If user cancels, STOP.

## Step 3b: Update Manifest URL (if new URL provided)

If a new URL was provided, update the manifest with the new source_url:
1. Read the existing manifest
2. Update `source_url` to the new URL
3. Update `last_updated` to current timestamp
4. Write the updated manifest back

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
