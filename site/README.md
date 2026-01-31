# doxy.sh

Landing page and install script for the doxy Claude Code plugin.

## Development

```bash
deno task dev
```

## Deploy to Deno Deploy

1. Connect your GitHub repo to [Deno Deploy](https://deno.com/deploy)
2. Set the project root to `/site`
3. Enable Deno KV for install tracking

## Features

- Landing page with dark theme
- Copy-to-clipboard install command
- Install script served at `/install`
- Install tracking via Deno KV
- Supported editors section
