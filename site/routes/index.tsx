import { Head } from "fresh/runtime";
import { define } from "../utils.ts";
import InstallCommand from "../islands/InstallCommand.tsx";

export default define.page(async function Home(_ctx) {
  // Get install count from KV (with fallback for dev mode)
  let installs = 0;
  try {
    if (typeof Deno !== "undefined" && Deno.openKv) {
      const kv = await Deno.openKv();
      const result = await kv.get<number>(["installs"]);
      installs = result.value ?? 0;
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
        <title>doxy — docs → skills</title>
        <meta
          name="description"
          content="Transform any documentation site into Claude Code skills. One command. Instant knowledge."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      {/* Main content */}
      <main class="max-w-3xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <header class="mb-20 animate-fade-in">
          {/* ASCII-style logo */}
          <div class="mb-8">
            <pre class="text-[10px] leading-none glow-cyan select-none" aria-hidden="true">{`
    ██████╗  ██████╗ ██╗  ██╗██╗   ██╗
    ██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
    ██║  ██║██║   ██║ ╚███╔╝  ╚████╔╝
    ██║  ██║██║   ██║ ██╔██╗   ╚██╔╝
    ██████╔╝╚██████╔╝██╔╝ ██╗   ██║
    ╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝
            `}</pre>
          </div>

          {/* Tagline */}
          <h1 class="sr-only">doxy</h1>
          <p class="text-2xl mb-4 tracking-tight">
            <span class="text-[var(--text-muted)]">docs</span>
            <span class="glow-cyan mx-3">→</span>
            <span>skills</span>
          </p>

          {/* Stats bar */}
          <div class="flex items-center gap-4 text-sm text-[var(--text-muted)]">
            <span class="tag">{installs.toLocaleString()} installs</span>
            <span class="tag">★ {stars.toLocaleString()}</span>
            <span class="tag">v1.0.0</span>
            <span class="tag">free</span>
          </div>
        </header>

        {/* Description */}
        <section class="mb-16 animate-fade-in animate-delay-1">
          <p class="text-lg leading-relaxed text-[var(--text-primary)]">
            Transform any documentation site into{" "}
            <span class="glow-lime">Claude Code skills</span>. Point it at docs,
            get instant, structured knowledge your AI can actually use.
          </p>
        </section>

        {/* Install Section */}
        <section class="mb-20 animate-fade-in animate-delay-2">
          <div class="flex items-center gap-3 mb-4">
            <span class="text-[var(--accent-cyan)]">$</span>
            <span class="text-sm uppercase tracking-wider text-[var(--text-muted)]">
              Install
            </span>
          </div>
          <InstallCommand />
        </section>

        {/* How it works */}
        <section class="mb-20 animate-fade-in animate-delay-3">
          <h2 class="flex items-center gap-3 mb-8">
            <span class="text-[var(--accent-cyan)]">//</span>
            <span class="text-sm uppercase tracking-wider text-[var(--text-muted)]">
              How it works
            </span>
          </h2>

          <div class="space-y-6">
            {[
              {
                num: "01",
                title: "Point at docs",
                desc: "Give doxy any documentation URL",
              },
              {
                num: "02",
                title: "Crawl & extract",
                desc: "Automatically maps navigation and fetches all pages",
              },
              {
                num: "03",
                title: "Generate skills",
                desc: "Creates properly structured SKILL.md files",
              },
              {
                num: "04",
                title: "Instant knowledge",
                desc: "Your AI now has deep expertise in that library",
              },
            ].map((step) => (
              <div
                key={step.num}
                class="flex items-start gap-6 p-4 terminal-box hover-glow transition-all"
              >
                <span class="glow-cyan text-xl font-bold">{step.num}</span>
                <div>
                  <h3 class="font-bold mb-1">{step.title}</h3>
                  <p class="text-sm text-[var(--text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section class="mb-20 animate-fade-in animate-delay-4">
          <h2 class="flex items-center gap-3 mb-8">
            <span class="text-[var(--accent-cyan)]">//</span>
            <span class="text-sm uppercase tracking-wider text-[var(--text-muted)]">
              Usage
            </span>
          </h2>

          <div class="terminal-box p-6 bracket-corners">
            <div class="flex items-center gap-2 mb-4">
              <span class="w-3 h-3 rounded-full bg-red-500/50"></span>
              <span class="w-3 h-3 rounded-full bg-yellow-500/50"></span>
              <span class="w-3 h-3 rounded-full bg-green-500/50"></span>
            </div>
            <code class="block text-sm">
              <span class="text-[var(--text-muted)]">{">"}</span>{" "}
              <span class="text-[var(--accent-lime)]">/doxy</span>{" "}
              <span class="text-[var(--text-primary)]">
                https://react.dev/reference
              </span>
            </code>
            <div class="mt-4 pt-4 border-t border-[var(--border-color)] text-sm text-[var(--text-muted)]">
              <p>
                <span class="glow-cyan">→</span> Crawling react.dev...
              </p>
              <p>
                <span class="glow-cyan">→</span> Found 47 documentation pages
              </p>
              <p>
                <span class="glow-cyan">→</span> Generated skills in{" "}
                <code class="text-[var(--accent-lime)]">
                  .claude-plugin/skills/react/
                </code>
              </p>
            </div>
          </div>
        </section>

        {/* Commands */}
        <section class="mb-20 animate-fade-in animate-delay-4">
          <h2 class="flex items-center gap-3 mb-8">
            <span class="text-[var(--accent-cyan)]">//</span>
            <span class="text-sm uppercase tracking-wider text-[var(--text-muted)]">
              Commands
            </span>
          </h2>

          <div class="space-y-3">
            {[
              { cmd: "/doxy <url>", desc: "Generate skills from docs" },
              { cmd: "/doxy:init", desc: "Interactive setup wizard" },
              { cmd: "/doxy:list", desc: "List all skills" },
              { cmd: "/doxy:update <name>", desc: "Refresh from source" },
              { cmd: "/doxy:delete <name>", desc: "Remove a skill" },
              { cmd: "/doxy:help", desc: "Show help" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex items-center justify-between p-3 terminal-box hover-glow transition-all"
              >
                <code class="text-[var(--accent-lime)] text-sm">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Supported Editors */}
        <section class="mb-20 animate-fade-in animate-delay-5">
          <h2 class="flex items-center gap-3 mb-8">
            <span class="text-[var(--accent-cyan)]">//</span>
            <span class="text-sm uppercase tracking-wider text-[var(--text-muted)]">
              Works with
            </span>
          </h2>

          <div class="flex flex-wrap gap-4">
            {[
              { name: "Claude Code", icon: "◈" },
              { name: "Cursor", icon: "◇" },
              { name: "Windsurf", icon: "◆" },
            ].map((editor) => (
              <div
                key={editor.name}
                class="tag flex items-center gap-3 hover-glow cursor-default"
              >
                <span class="glow-cyan">{editor.icon}</span>
                <span>{editor.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer class="pt-12 border-t border-[var(--border-color)]">
          <div class="flex flex-wrap items-center justify-between gap-6">
            <div class="flex gap-6 text-sm">
              <a href="https://github.com/davidosemwegie/doxy">GitHub</a>
            </div>
            <p class="text-sm text-[var(--text-muted)]">
              © 2025{" "}
              <a href="https://davidosemwegie.com" class="hover:glow-cyan">
                David Osemwegie
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
});
