---
description: Show doxy command reference
---

Display the doxy command reference.

Show this help text:

```
Doxy - Generate Claude Code skills from docs & codebases

GETTING STARTED
  /doxy:init               Interactive setup (docs or codebase)

DOCUMENTATION COMMANDS
  /doxy:url <url>          Generate skills from a documentation URL
  /doxy:update <name> [url]  Refresh a skill (optionally with new URL)

MANAGEMENT
  /doxy:list               List all doxy-generated skills
  /doxy:delete <name>      Delete a skill (with confirmation)
  /doxy:adopt <name> <url>   Add manifest to existing skill folder
  /doxy:help               Show this help message

EXAMPLES
  /doxy:init
      Interactive setup - choose docs or codebase

  /doxy:url https://react.dev/reference
      Generate skills from React documentation

  /doxy:update react-docs
      Re-crawl React documentation to refresh skills

  /doxy:update react-docs https://new-react.dev/docs
      Update with a new documentation URL (if docs moved)

  /doxy:adopt old-skill https://example.com/docs
      Add manifest to a skill created before v1.1.0

  /doxy:list
      Show all skills with their source URLs

  /doxy:delete anime-js
      Remove the anime-js skill folder

CODEBASE COMMANDS
  /doxy:codebase [path]              Generate architecture skill from codebase
  /doxy:codebase:update <name> [path] Refresh skill (optionally with new path)
  /doxy:codebase:export <name>       Export for use in another repo
  /doxy:codebase:import <path>       Import exported skill

CODEBASE EXAMPLES
  /doxy:codebase                     Analyze current directory
  /doxy:codebase ./backend           Analyze specific folder
  /doxy:codebase:update api          Refresh the api skill
  /doxy:codebase:export api          Export api skill
  /doxy:codebase:import ~/other/skills/api-arch/

SKILL STORAGE
  Skills are stored in: .claude/skills/<name>/
  Each skill folder contains:
    - SKILL.md files with documentation content
    - doxy-manifest.json with metadata (source URL, timestamps)

MORE INFO
  Start here: /doxy:init
  https://github.com/davidosemwegie/doxy
```
