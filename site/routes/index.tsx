import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import InstallCommand from "../islands/InstallCommand.tsx";

export default define.page(async function Home(_ctx) {
  // Get install count from KV (with fallback for dev mode)
  let installs = 0;
  try {
    if (typeof Deno !== "undefined" && Deno.openKv) {
      const kv = await Deno.openKv();
      const result = await kv.get<Deno.KvU64>(["installs"]);
      // sum() stores as Deno.KvU64, convert to number
      installs = result.value ? Number(result.value.value) : 0;
    }
  } catch {
    // KV not available in dev mode
    installs = 42; // placeholder for dev
  }

  // Get GitHub stars
  let stars = 0;
  try {
    const res = await fetch("https://api.github.com/repos/davidosemwegie/doxy");
    if (res.ok) {
      const data = await res.json();
      stars = data.stargazers_count ?? 0;
    }
  } catch {
    // GitHub API not available
  }

  return (
    <div class="min-h-screen">
      <Head>
        <title>doxy — docs & codebases → Claude Code skills</title>
        <meta
          name="description"
          content="Turn any docs URL or codebase into Claude Code skills. One command. Claude answers from the source, not from memory."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="doxy — docs & codebases → skills" />
        <meta property="og:description" content="Turn any docs URL or codebase into Claude Code skills. One command. Claude answers from the source, not from memory." />
        <meta property="og:image" content="https://doxy.sh/og.png" />
        <meta property="og:url" content="https://doxy.sh" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="doxy — docs & codebases → skills" />
        <meta name="twitter:description" content="Turn any docs URL or codebase into Claude Code skills. One command. Claude answers from the source, not from memory." />
        <meta name="twitter:image" content="https://doxy.sh/og.png" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      {/* Main content */}
      <main class="max-w-3xl mx-auto px-5 sm:px-8 py-16 sm:py-24 gradient-bg min-h-screen">
        {/* Hero Section */}
        <header class="mb-20 animate-fade-in">
          <div class="mb-6">
            <pre class="ascii-logo text-[9px] sm:text-[12px] leading-none select-none whitespace-pre text-left" aria-hidden="true">{`██████╗  ██████╗ ██╗  ██╗██╗   ██╗
██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
██║  ██║██║   ██║ ╚███╔╝  ╚████╔╝
██║  ██║██║   ██║ ██╔██╗   ╚██╔╝
██████╔╝╚██████╔╝██╔╝ ██╗   ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝`}</pre>
          </div>
          <p class="section-label mb-6">
            docs & codebases → skills
          </p>
          <h1 class="text-xl sm:text-2xl font-medium text-[var(--text-primary)] mb-4 leading-snug max-w-md">
            Stop copy-pasting from docs.
          </h1>
          <p class="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-lg">
            Point doxy at any docs URL or codebase. Get a Claude Code skill that actually knows it. One command.
          </p>
        </header>

        {/* Install */}
        <section class="mb-20 animate-fade-in animate-delay-1">
          <p class="section-label mb-4">
            Install
          </p>
          <InstallCommand />
        </section>

        {/* How it works */}
        <section class="mb-20 animate-fade-in animate-delay-2">
          <p class="section-label mb-5">
            How it works
          </p>

          <div class="space-y-3">
            {[
              {
                num: "01",
                title: "Point at a source",
                desc: "A docs URL, a codebase path, or both. React docs, your monorepo, anything.",
              },
              {
                num: "02",
                title: "doxy does the reading",
                desc: "Crawls docs. Maps architecture. Extracts the stuff that matters.",
              },
              {
                num: "03",
                title: "Get structured skills",
                desc: "Clean markdown files that Claude Code actually understands.",
              },
              {
                num: "04",
                title: "Ask Claude anything",
                desc: "Answers come from the source, not from stale training data.",
              },
            ].map((step) => (
              <div
                key={step.num}
                class="flex items-start gap-5 p-4 terminal-box"
              >
                <span class="step-number">{step.num}</span>
                <div>
                  <h3 class="font-medium text-[var(--text-primary)] mb-1">{step.title}</h3>
                  <p class="text-sm text-[var(--text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section class="mb-20 animate-fade-in animate-delay-3">
          <p class="section-label mb-5">
            In action
          </p>

          <div class="space-y-4">
            <div class="terminal-box p-4 sm:p-5 overflow-x-auto font-mono">
              <p class="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Interactive setup</p>
              <code class="block text-sm whitespace-nowrap">
                <span class="text-[var(--text-muted)]">$</span>{" "}
                <span class="text-[var(--text-primary)]">/doxy:init</span>
              </code>
              <div class="mt-3 pt-3 border-t border-[var(--border-color)] text-sm text-[var(--text-muted)] space-y-1">
                <p>→ What do you want to generate skills from?</p>
                <p class="pl-4 text-[var(--text-secondary)]">◉ Documentation URL</p>
                <p class="pl-4 text-[var(--text-muted)]">○ Local codebase</p>
              </div>
            </div>
            <div class="terminal-box p-4 sm:p-5 overflow-x-auto font-mono">
              <p class="text-xs text-[var(--text-muted)] mb-3 uppercase tracking-wider">Direct commands</p>
              <code class="block text-sm whitespace-nowrap mb-2">
                <span class="text-[var(--text-muted)]">$</span>{" "}
                <span class="text-[var(--text-primary)]">/doxy:url</span>{" "}
                <span class="text-[var(--text-secondary)]">https://react.dev/reference</span>
              </code>
              <code class="block text-sm whitespace-nowrap">
                <span class="text-[var(--text-muted)]">$</span>{" "}
                <span class="text-[var(--text-primary)]">/doxy:codebase</span>{" "}
                <span class="text-[var(--text-secondary)]">./packages/api</span>
              </code>
            </div>
          </div>
        </section>

        {/* Commands */}
        <section class="mb-20 animate-fade-in animate-delay-4">
          <p class="section-label mb-5">
            Commands
          </p>

          {/* Getting started */}
          <p class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3 mt-6">Getting started</p>
          <div class="space-y-2 mb-6">
            {[
              { cmd: "/doxy:init", desc: "Interactive setup (docs or codebase)" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3 terminal-box"
              >
                <code class="text-[var(--text-primary)] text-sm font-mono">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Docs commands */}
          <p class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Documentation</p>
          <div class="space-y-2 mb-6">
            {[
              { cmd: "/doxy:url <url>", desc: "Generate skills from docs" },
              { cmd: "/doxy:update <name>", desc: "Re-crawl from source" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3 terminal-box"
              >
                <code class="text-[var(--text-primary)] text-sm font-mono">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Codebase commands */}
          <p class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Codebase</p>
          <div class="space-y-2 mb-6">
            {[
              { cmd: "/doxy:codebase [path]", desc: "Generate architecture skills" },
              { cmd: "/doxy:codebase:update <name>", desc: "Re-analyze codebase" },
              { cmd: "/doxy:codebase:export <name>", desc: "Export for another repo" },
              { cmd: "/doxy:codebase:import <path>", desc: "Import exported skill" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3 terminal-box"
              >
                <code class="text-[var(--text-primary)] text-sm font-mono">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>

          {/* Management commands */}
          <p class="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-3">Management</p>
          <div class="space-y-2">
            {[
              { cmd: "/doxy:list", desc: "List all doxy skills" },
              { cmd: "/doxy:delete <name>", desc: "Remove a skill" },
              { cmd: "/doxy:adopt <name> <url>", desc: "Add manifest to existing skill" },
              { cmd: "/doxy:help", desc: "Show all commands" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3 terminal-box"
              >
                <code class="text-[var(--text-primary)] text-sm font-mono">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section class="mb-20 animate-fade-in animate-delay-5">
          <div class="flex flex-wrap items-center gap-3">
            <span class="tag">{installs.toLocaleString()} installs</span>
            <span class="tag">{stars.toLocaleString()} stars</span>
            <span class="tag">v1.2.0</span>
          </div>
        </section>

        {/* Footer */}
        <footer class="pt-10 border-t border-[var(--border-color)]">
          <div class="flex flex-wrap items-center justify-between gap-6">
            <a href="https://github.com/davidosemwegie/doxy" class="text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]">GitHub</a>
            <p class="text-sm text-[var(--text-muted)]">
              <a href="https://davidosemwegie.com" class="hover:text-[var(--text-secondary)]">
                David Osemwegie
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
});
