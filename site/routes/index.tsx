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
        <title>doxy — docs → skills</title>
        <meta
          name="description"
          content="Transform any documentation site into Claude Code skills. One command. Instant knowledge."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </Head>

      {/* Main content */}
      <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Hero Section */}
        <header class="mb-16 animate-fade-in">
          <div class="mb-4">
            <pre class="text-[10px] sm:text-[12px] leading-none select-none whitespace-pre text-left" aria-hidden="true">{`██████╗  ██████╗ ██╗  ██╗██╗   ██╗
██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
██║  ██║██║   ██║ ╚███╔╝  ╚████╔╝
██║  ██║██║   ██║ ██╔██╗   ╚██╔╝
██████╔╝╚██████╔╝██╔╝ ██╗   ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝`}</pre>
          </div>
          <p class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">
            docs → skills
          </p>
          <p class="text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-lg">
            Transform any documentation site into Claude Code skills. Point it at docs, get instant knowledge.
          </p>
        </header>

        {/* Install */}
        <section class="mb-16 animate-fade-in animate-delay-1">
          <p class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-4">
            Install in one command
          </p>
          <InstallCommand />
        </section>

        {/* How it works */}
        <section class="mb-16 animate-fade-in animate-delay-2">
          <p class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">
            How it works
          </p>

          <div class="space-y-4">
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
                class="flex items-start gap-6 p-4 terminal-box transition-colors"
              >
                <span class="text-[var(--text-muted)] text-lg font-bold">{step.num}</span>
                <div>
                  <h3 class="font-bold mb-1">{step.title}</h3>
                  <p class="text-sm text-[var(--text-muted)]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Usage Example */}
        <section class="mb-16 animate-fade-in animate-delay-3">
          <p class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">
            Usage
          </p>

          <div class="terminal-box p-4 sm:p-6 overflow-x-auto">
            <code class="block text-sm whitespace-nowrap">
              <span class="text-[var(--text-muted)]">$</span>{" "}
              <span class="text-[var(--text-primary)]">/doxy</span>{" "}
              <span class="text-[var(--text-secondary)]">
                https://react.dev/reference
              </span>
            </code>
            <div class="mt-4 pt-4 border-t border-[var(--border-color)] text-sm text-[var(--text-muted)]">
              <p>→ Crawling react.dev...</p>
              <p>→ Found 47 documentation pages</p>
              <p>→ Generated skills in <span class="text-[var(--text-secondary)]">.claude-plugin/skills/react/</span></p>
            </div>
          </div>
        </section>

        {/* Commands */}
        <section class="mb-16 animate-fade-in animate-delay-4">
          <p class="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-6">
            Commands
          </p>

          <div class="space-y-2">
            {[
              { cmd: "/doxy <url>", desc: "Generate skills from docs" },
              { cmd: "/doxy:init", desc: "Interactive setup wizard" },
              { cmd: "/doxy:list", desc: "List all skills" },
              { cmd: "/doxy:update <name> [url]", desc: "Refresh from source" },
              { cmd: "/doxy:adopt <name> <url>", desc: "Add manifest to existing" },
              { cmd: "/doxy:delete <name>", desc: "Remove a skill" },
              { cmd: "/doxy:help", desc: "Show help" },
            ].map((item) => (
              <div
                key={item.cmd}
                class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4 p-3 terminal-box transition-colors"
              >
                <code class="text-[var(--text-primary)] text-sm">{item.cmd}</code>
                <span class="text-sm text-[var(--text-muted)]">{item.desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stats */}
        <section class="mb-16 animate-fade-in animate-delay-5">
          <div class="flex flex-wrap items-center gap-4 text-sm">
            <span class="tag">{installs.toLocaleString()} installs</span>
            <span class="tag">★ {stars.toLocaleString()}</span>
            <span class="tag">v1.1.0</span>
          </div>
        </section>

        {/* Footer */}
        <footer class="pt-8 border-t border-[var(--border-color)]">
          <div class="flex flex-wrap items-center justify-between gap-6">
            <a href="https://github.com/davidosemwegie/doxy" class="text-sm">GitHub</a>
            <p class="text-sm text-[var(--text-muted)]">
              © 2025{" "}
              <a href="https://davidosemwegie.com">
                David Osemwegie
              </a>
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
});
