---
description: List all documentation skills created by doxy
---

List all doxy-generated skills with their source URLs.

## Step 1: Find All Doxy Manifests

Use Glob to find all doxy manifest files with pattern: `.claude-plugin/skills/*/doxy-manifest.json`

## Step 2: Read Each Manifest

For each manifest file found, use Read to get its contents. Extract:
- name
- source_url
- created_at
- last_updated

If a manifest file is corrupted or missing required fields, show a warning for that skill (e.g., "[skill-name]: manifest corrupted") and continue processing others.

## Step 3: Display Results

Present the results in a formatted table:

```
Doxy Skills
===========

Name            Source URL                          Last Updated
----            ----------                          ------------
react-docs      https://react.dev/reference         2025-01-31
anime-js        https://animejs.com/documentation   2025-01-30
```

If no manifests are found, tell the user:
"No doxy skills found. Use `/doxy:init` to create your first skill."
