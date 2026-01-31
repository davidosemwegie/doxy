---
description: Show doxy command reference
---

Display the doxy command reference.

Show this help text:

```
Doxy - Generate Claude Code skills from documentation

COMMANDS
  /doxy <url>              Generate skills from a documentation URL
  /doxy:init               Interactive setup for a new documentation skill
  /doxy:list               List all doxy-generated skills
  /doxy:update <name>      Refresh a skill by re-crawling its source URL
  /doxy:delete <name>      Delete a skill (with confirmation)
  /doxy:help               Show this help message

EXAMPLES
  /doxy https://react.dev/reference
      Generate skills from React documentation

  /doxy:init
      Interactively create a new skill (asks for name and URL)

  /doxy:update react-docs
      Re-crawl React documentation to refresh skills

  /doxy:list
      Show all skills with their source URLs

  /doxy:delete anime-js
      Remove the anime-js skill folder

SKILL STORAGE
  Skills are stored in: .claude-plugin/skills/<name>/
  Each skill folder contains:
    - SKILL.md files with documentation content
    - doxy-manifest.json with metadata (source URL, timestamps)

MORE INFO
  https://github.com/davidosemwegie/doxy
```
