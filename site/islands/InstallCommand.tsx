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
    <div class="terminal-box flex items-center justify-between p-3 gap-3">
      <code class="text-sm text-[var(--text-secondary)] overflow-x-auto whitespace-nowrap">
        <span class="text-[var(--text-muted)]">$</span>{" "}
        {command}
      </code>
      <button
        onClick={copyToClipboard}
        class="flex-shrink-0 p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        title="Copy to clipboard"
      >
        {copied.value ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
