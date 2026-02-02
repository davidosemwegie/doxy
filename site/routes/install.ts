import { define } from "../utils.ts";

const INSTALL_SCRIPT = `#!/bin/bash
set -e

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
NC='\\033[0m' # No Color

echo ""
echo "  \\033[1mdoxy\\033[0m - Generate AI skills from docs"
echo ""

# Detect available editors
CLAUDE_DIR=""
CURSOR_DIR=""
WINDSURF_DIR=""
INSTALL_TARGETS=()

# Check for Claude Code
if [ -d "$HOME/.claude" ]; then
    CLAUDE_DIR="$HOME/.claude"
    INSTALL_TARGETS+=("claude")
elif [ -d "$HOME/.config/claude" ]; then
    CLAUDE_DIR="$HOME/.config/claude"
    INSTALL_TARGETS+=("claude")
fi

# Check for Cursor / Cursor Codex
if [ -d "$HOME/.cursor" ]; then
    CURSOR_DIR="$HOME/.cursor"
    INSTALL_TARGETS+=("cursor")
elif [ -d "$HOME/.config/cursor" ]; then
    CURSOR_DIR="$HOME/.config/cursor"
    INSTALL_TARGETS+=("cursor")
fi

# Check for Windsurf
if [ -d "$HOME/.windsurf" ]; then
    WINDSURF_DIR="$HOME/.windsurf"
    INSTALL_TARGETS+=("windsurf")
elif [ -d "$HOME/.config/windsurf" ]; then
    WINDSURF_DIR="$HOME/.config/windsurf"
    INSTALL_TARGETS+=("windsurf")
fi

# If no editors detected, default to Claude Code
if [ \${#INSTALL_TARGETS[@]} -eq 0 ]; then
    echo "\${YELLOW}No supported editors detected. Creating Claude Code directory.\${NC}"
    CLAUDE_DIR="$HOME/.claude"
    mkdir -p "$CLAUDE_DIR"
    INSTALL_TARGETS+=("claude")
fi

echo "Detected editors: \${INSTALL_TARGETS[*]}"
echo ""

# Function to install doxy to a specific editor directory
install_to_editor() {
    local EDITOR_DIR="$1"
    local EDITOR_NAME="$2"

    local PLUGINS_DIR="$EDITOR_DIR/plugins"
    local DOXY_DIR="$PLUGINS_DIR/doxy"

    echo "\${BLUE}Installing to $EDITOR_NAME: $DOXY_DIR\${NC}"

    # Create plugins directory if it doesn't exist
    mkdir -p "$PLUGINS_DIR"

    # Remove existing installation
    if [ -d "$DOXY_DIR" ]; then
        echo "  Removing existing installation..."
        rm -rf "$DOXY_DIR"
    fi

    # Clone the repository
    echo "  Downloading doxy..."
    if command -v git &> /dev/null; then
        git clone --depth 1 https://github.com/davidosemwegie/doxy.git "$DOXY_DIR" 2>/dev/null
    else
        # Fallback to curl + tar if git is not available
        curl -sL https://github.com/davidosemwegie/doxy/archive/master.tar.gz | tar -xz -C "$PLUGINS_DIR"
        mv "$PLUGINS_DIR/doxy-master" "$DOXY_DIR"
    fi

    # Remove site directory (not needed for plugin)
    rm -rf "$DOXY_DIR/site"

    # Register plugin in installed_plugins.json (if it exists)
    local PLUGINS_JSON="$PLUGINS_DIR/installed_plugins.json"
    local TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)

    if [ -f "$PLUGINS_JSON" ]; then
        # Create backup
        cp "$PLUGINS_JSON" "$PLUGINS_JSON.bak"

        # Add doxy entry using node (more reliable than jq for complex JSON)
        node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$PLUGINS_JSON', 'utf8'));
data.plugins = data.plugins || {};
data.plugins['doxy@local'] = [{
  scope: 'user',
  installPath: '$DOXY_DIR',
  version: '1.2.0',
  installedAt: '$TIMESTAMP',
  lastUpdated: '$TIMESTAMP'
}];
fs.writeFileSync('$PLUGINS_JSON', JSON.stringify(data, null, 2));
" 2>/dev/null || echo "  \${YELLOW}Note: Could not auto-register for $EDITOR_NAME. Run /plugin to manually add.\${NC}"
    fi

    echo "  \${GREEN}✓ Installed to $EDITOR_NAME\${NC}"
}

# Install to each detected editor
for editor in "\${INSTALL_TARGETS[@]}"; do
    case "$editor" in
        claude)
            install_to_editor "$CLAUDE_DIR" "Claude Code"
            ;;
        cursor)
            install_to_editor "$CURSOR_DIR" "Cursor / Cursor Codex"
            ;;
        windsurf)
            install_to_editor "$WINDSURF_DIR" "Windsurf"
            ;;
    esac
done

# Track the install
curl -s "https://doxy.sh/api/track-install" > /dev/null 2>&1 || true

echo ""
echo "\${GREEN}✓ doxy installed successfully!\${NC}"
echo ""
echo "Restart your editor(s) to load the plugin."
echo ""
echo "Usage:"
echo "  /doxy:init         Interactive setup (docs or codebase)"
echo "  /doxy:url <url>    Generate skills from docs"
echo "  /doxy:codebase     Analyze your codebase"
echo "  /doxy:help         Show all commands"
echo ""
echo "To uninstall:"
echo "  Remove doxy directories from your editor's plugins folder"
echo "  Remove 'doxy@local' entry from installed_plugins.json (if present)"
echo ""
`;

export const handler = define.handlers({
  GET(_ctx) {
    return new Response(INSTALL_SCRIPT, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  },
});
