import { define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(_ctx) {
    try {
      if (typeof Deno !== "undefined" && Deno.openKv) {
        const kv = await Deno.openKv();
        // Increment install count
        await kv.atomic()
          .sum(["installs"], 1n)
          .commit();
      }
    } catch {
      // KV not available
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },
});
