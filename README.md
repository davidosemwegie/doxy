```
██████╗  ██████╗ ██╗  ██╗██╗   ██╗
██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
██║  ██║██║   ██║ ╚███╔╝  ╚████╔╝
██║  ██║██║   ██║ ██╔██╗   ╚██╔╝
██████╔╝╚██████╔╝██╔╝ ██╗   ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝
```

**docs → skills**

Generate Claude Code skills from documentation websites.

## Installation

```bash
npx skills add davidosemwegie/doxy
```

## Usage

### From Documentation

```
/doxy:url <documentation-url>
```

Example:
```
/doxy:url https://animejs.com/documentation
```

### From Codebase

```
/doxy:codebase [path]
```

Example:
```
/doxy:codebase ./backend
```

## Commands

### Documentation Skills

| Command | Description |
|---------|-------------|
| `/doxy:url <url>` | Generate skills from a documentation URL |
| `/doxy:init` | Interactive setup - asks for name and URL |
| `/doxy:list` | List all doxy-generated skills |
| `/doxy:update <name> [url]` | Refresh a skill (optionally with new URL) |
| `/doxy:delete <name>` | Delete a skill (with confirmation) |
| `/doxy:adopt <name> <url>` | Add manifest to existing skill folder |
| `/doxy:help` | Show command reference |

### Codebase Analysis

| Command | Description |
|---------|-------------|
| `/doxy:codebase [path]` | Generate architecture skill from codebase |
| `/doxy:codebase:update <name> [path]` | Refresh skill (optionally with new path) |
| `/doxy:codebase:export <name>` | Export skill for use in another repo |
| `/doxy:codebase:import <path>` | Import exported skill |

## What It Does

### Documentation Skills
1. Fetches the documentation page and extracts navigation structure
2. Visits each documentation page
3. Generates Claude Code skills from the content
4. Saves skills to `.claude/skills/[library-name]/`
5. Creates a manifest with source URL for easy updates

### Codebase Analysis
1. Analyzes your codebase structure and patterns
2. Identifies key components, APIs, and architecture
3. Generates skills that help Claude understand your code
4. Exports portable skills for use across repositories

## Output

Skills are created following best practices:
- Organized under a folder named after the library (e.g., `webgl/`, `react/`)
- One skill per documentation page
- SKILL.md files under 200 lines
- Progressive disclosure with references/ for detailed content

## Supported Editors

- Claude Code
- Cursor
- Windsurf

## License

MIT
