import { define } from "../utils.ts";

const INSTALL_SCRIPT = `#!/bin/bash
set -e

# Colors
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

echo ""
echo "  \\033[1mdoxy\\033[0m - Generate Claude Code skills from docs"
echo ""

# Detect Claude Code config directory
CLAUDE_DIR=""
if [ -d "$HOME/.claude" ]; then
    CLAUDE_DIR="$HOME/.claude"
elif [ -d "$HOME/.config/claude" ]; then
    CLAUDE_DIR="$HOME/.config/claude"
else
    # Create default directory
    CLAUDE_DIR="$HOME/.claude"
    mkdir -p "$CLAUDE_DIR"
fi

PLUGINS_DIR="$CLAUDE_DIR/plugins"
DOXY_DIR="$PLUGINS_DIR/doxy"

echo "Installing to: $DOXY_DIR"
echo ""

# Create plugins directory if it doesn't exist
mkdir -p "$PLUGINS_DIR"

# Remove existing installation
if [ -d "$DOXY_DIR" ]; then
    echo "Removing existing installation..."
    rm -rf "$DOXY_DIR"
fi

# Clone the repository
echo "Downloading doxy..."
if command -v git &> /dev/null; then
    git clone --depth 1 https://github.com/davidosemwegie/doxy.git "$DOXY_DIR" 2>/dev/null
else
    # Fallback to curl + tar if git is not available
    curl -sL https://github.com/davidosemwegie/doxy/archive/master.tar.gz | tar -xz -C "$PLUGINS_DIR"
    mv "$PLUGINS_DIR/doxy-master" "$DOXY_DIR"
fi

# Remove site directory (not needed for plugin)
rm -rf "$DOXY_DIR/site"

# Register plugin in installed_plugins.json
PLUGINS_JSON="$CLAUDE_DIR/plugins/installed_plugins.json"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%S.000Z)

if [ -f "$PLUGINS_JSON" ]; then
    # Create backup
    cp "$PLUGINS_JSON" "$PLUGINS_JSON.bak"

    # Add doxy entry using node (more reliable than jq for complex JSON)
    node -e "
const fs = require('fs');
const data = JSON.parse(fs.readFileSync('$PLUGINS_JSON', 'utf8'));
data.plugins['doxy@local'] = [{
  scope: 'user',
  installPath: '$DOXY_DIR',
  version: '1.1.0',
  installedAt: '$TIMESTAMP',
  lastUpdated: '$TIMESTAMP'
}];
fs.writeFileSync('$PLUGINS_JSON', JSON.stringify(data, null, 2));
" 2>/dev/null || echo "\${YELLOW}Note: Could not auto-register. Run /plugin to manually add.\${NC}"
fi

# Track the install
curl -s "https://doxy.sh/api/track-install" > /dev/null 2>&1 || true

echo ""
echo "\${GREEN}✓ doxy installed successfully!\${NC}"
echo ""
echo "Restart Claude Code to load the plugin."
echo ""
echo "Usage:"
echo "  /doxy:init         Interactive setup (docs or codebase)"
echo "  /doxy:url <url>    Generate skills from docs"
echo "  /doxy:codebase     Analyze your codebase"
echo "  /doxy:help         Show all commands"
echo ""
echo "To uninstall:"
echo "  rm -rf $DOXY_DIR"
echo "  # Then remove 'doxy@local' from $PLUGINS_JSON"
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
