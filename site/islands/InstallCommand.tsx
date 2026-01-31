import { useSignal } from "@preact/signals";

export default function InstallCommand() {
  const copied = useSignal(false);
  const command = "curl -fsSL doxy.sh/install | bash";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(command);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  };

  return (
    <div class="relative">
      <div class="terminal-box hover-glow transition-all">
        <div class="flex items-center justify-between p-3 sm:p-4 gap-2">
          <code class="flex-1 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
            <span class="text-[var(--text-muted)]">$</span>{" "}
            <span class="text-[var(--text-primary)]">{command}</span>
            {!copied.value && <span class="cursor-blink ml-1"></span>}
          </code>
          <button
            onClick={copyToClipboard}
            class="flex-shrink-0 px-3 sm:px-4 py-2 border border-[var(--border-color)] text-xs uppercase tracking-wider hover:border-[var(--accent-cyan)] hover:text-[var(--accent-cyan)] hover:shadow-[var(--glow-cyan)] transition-all"
            title="Copy to clipboard"
          >
            {copied.value ? (
              <span class="glow-lime">copied!</span>
            ) : (
              <span>copy</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
