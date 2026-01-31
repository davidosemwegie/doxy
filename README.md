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
curl -fsSL doxy.sh/install | bash
```

Or manually add via Claude Code:
```
/plugin davidosemwegie/doxy
```

## Usage

```
/doxy <documentation-url>
```

### Example

```
/doxy https://animejs.com/documentation
```

## What It Does

1. Fetches the documentation page and extracts navigation structure
2. Visits each documentation page
3. Generates Claude Code skills from the content
4. Saves skills to `.claude-plugin/skills/[library-name]/`

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
