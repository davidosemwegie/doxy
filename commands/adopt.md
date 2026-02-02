---
description: Add a manifest to an existing skill folder
argument-hint: <skill-name> <source-url>
---

Create a doxy manifest for an existing skill folder that was created before manifest support.

## Input

Parse $ARGUMENTS to extract:
1. The skill name (first argument)
2. The source URL (second argument)

Example: `/doxy:adopt react-docs https://react.dev/reference`

## Step 1: Validate Arguments

If $ARGUMENTS is empty or missing the URL:
1. Show usage: `/doxy:adopt <skill-name> <source-url>`
2. Use Glob to find skill folders without manifests:
   - Find all folders: `.claude/skills/*/`
   - Check which ones are missing `doxy-manifest.json`
3. List any orphaned skills found
4. STOP

## Step 2: Validate Skill Folder Exists

Check if `.claude/skills/[skill-name]/` exists by using Glob with pattern:
`.claude/skills/[skill-name]/*`

If no files found:
1. Tell user the skill folder doesn't exist
2. Suggest using `/doxy <url>` to create a new skill instead
3. STOP

## Step 3: Check for Existing Manifest

Try to read `.claude/skills/[skill-name]/doxy-manifest.json`

If manifest already exists:
1. Show the current manifest contents
2. Ask user if they want to overwrite it using AskUserQuestion:
   - Question: "This skill already has a manifest. Overwrite with new URL?"
   - Header: "Overwrite"
   - Options: "Yes, update URL" / "No, keep existing"
3. If user says no, STOP

## Step 4: Create Manifest

Use Write to create `.claude/skills/[skill-name]/doxy-manifest.json`:

```json
{
  "name": "[skill-name]",
  "source_url": "[source-url from arguments]",
  "created_at": "[current ISO 8601 timestamp]",
  "last_updated": "[current ISO 8601 timestamp]"
}
```

## Step 5: Confirm

Tell the user:
- Manifest created for '[skill-name]'
- Source URL: [source-url]
- They can now use `/doxy:update [skill-name]` to refresh this skill
