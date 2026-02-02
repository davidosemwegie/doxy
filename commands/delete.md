---
description: Delete a documentation skill
argument-hint: <skill-name>
---

Delete a doxy-generated skill folder.

## Input

The skill name is provided as $ARGUMENTS. If no argument is provided, show available skills and ask the user to choose one.

## Step 1: Validate Skill Exists

If $ARGUMENTS is empty:
1. Use Glob to find all doxy manifests: `.claude/skills/*/doxy-manifest.json`
2. List the available skills
3. Ask user to run the command again with a skill name: `/doxy:delete <skill-name>`
4. STOP

If $ARGUMENTS is provided:
1. Try to read `.claude/skills/$ARGUMENTS/doxy-manifest.json`
2. If the manifest doesn't exist, tell user the skill wasn't found and list available skills
3. STOP if not found

## Step 2: Show What Will Be Deleted

Use Glob to list all files in the skill folder:
```
pattern: .claude/skills/$ARGUMENTS/**/*
```

Show the user what will be deleted.

## Step 3: Confirm Deletion

Use AskUserQuestion:

Question: "Are you sure you want to delete the '$ARGUMENTS' skill? This will remove all files shown above and cannot be undone."
Header: "Confirm delete"
Options:
- "Yes, delete it" (Proceed with deletion)
- "No, keep it" (Cancel the operation)

If user cancels, tell them the deletion was cancelled and STOP.

## Step 4: Delete the Folder

Use Bash to remove the skill folder:
```bash
rm -rf ".claude/skills/$ARGUMENTS"
```

## Step 5: Confirm Deletion

Tell the user: "Deleted skill '$ARGUMENTS' successfully."
