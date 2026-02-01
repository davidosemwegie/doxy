#!/usr/bin/env -S deno run --allow-net --allow-write --allow-read

/**
 * Generates the OG image for the site.
 * Run with: deno task og
 */

import satori from "satori";
import { Resvg, initWasm } from "@resvg/resvg-wasm";

// Fetch fonts (TTF from Google Fonts - satori doesn't support woff2)
const [jetbrainsResponse, ibmPlex400Response, ibmPlex500Response] = await Promise.all([
  fetch(
    "https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxjPQ.ttf"
  ),
  fetch(
    "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD6llzAA.ttf"
  ),
  fetch(
    "https://fonts.gstatic.com/s/ibmplexsans/v23/zYXGKVElMYYaJe8bpLHnCwDKr932-G7dytD-Dmu1swZSAXcomDVmadSD2FlzAA.ttf"
  ),
]);

const jetbrainsFont = await jetbrainsResponse.arrayBuffer();
const ibmPlex400Font = await ibmPlex400Response.arrayBuffer();
const ibmPlex500Font = await ibmPlex500Response.arrayBuffer();

// Initialize WASM
const wasmResponse = await fetch(
  "https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm"
);
const wasmBuffer = await wasmResponse.arrayBuffer();
await initWasm(wasmBuffer);

console.log("Generating OG image...");

// ASCII art logo - simplified for better rendering
const asciiLogo = `██████╗  ██████╗ ██╗  ██╗██╗   ██╗
██╔══██╗██╔═══██╗╚██╗██╔╝╚██╗ ██╔╝
██║  ██║██║   ██║ ╚███╔╝  ╚████╔╝
██║  ██║██║   ██║ ██╔██╗   ╚██╔╝
██████╔╝╚██████╔╝██╔╝ ██╗   ██║
╚═════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝`;

const svg = await satori(
  {
    type: "div",
    props: {
      style: {
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "60px 80px",
        backgroundColor: "#0c0c0c",
        fontFamily: "IBM Plex Sans",
        // Subtle gradient like the site
        background: "radial-gradient(ellipse 100% 100% at 50% 0%, #1a1a1a 0%, #0c0c0c 60%)",
      },
      children: [
        // ASCII Logo
        {
          type: "pre",
          props: {
            style: {
              fontFamily: "JetBrains Mono",
              fontSize: 18,
              lineHeight: 1.1,
              color: "#e8e8e8",
              margin: 0,
              letterSpacing: "-0.02em",
            },
            children: asciiLogo,
          },
        },
        // Section label
        {
          type: "div",
          props: {
            style: {
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "#6b6b6b",
              marginTop: 32,
            },
            children: "docs & codebases → skills",
          },
        },
        // Main headline
        {
          type: "div",
          props: {
            style: {
              fontSize: 42,
              fontWeight: 500,
              color: "#e8e8e8",
              marginTop: 24,
              lineHeight: 1.2,
            },
            children: "Stop copy-pasting from docs.",
          },
        },
        // Description
        {
          type: "div",
          props: {
            style: {
              fontSize: 20,
              color: "#a1a1a1",
              marginTop: 16,
              lineHeight: 1.6,
              maxWidth: 600,
            },
            children: "Point doxy at any docs URL or codebase. Get a Claude Code skill that actually knows it.",
          },
        },
        // Footer with URL
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginTop: "auto",
              paddingTop: 40,
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "JetBrains Mono",
                    fontSize: 16,
                    color: "#6b6b6b",
                    padding: "10px 16px",
                    border: "1px solid #262626",
                    borderRadius: 6,
                    background: "#141414",
                  },
                  children: "doxy.sh",
                },
              },
            ],
          },
        },
      ],
    },
  },
  {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "JetBrains Mono",
        data: jetbrainsFont,
        weight: 400,
        style: "normal",
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlex400Font,
        weight: 400,
        style: "normal",
      },
      {
        name: "IBM Plex Sans",
        data: ibmPlex500Font,
        weight: 500,
        style: "normal",
      },
    ],
  }
);

// Convert SVG to PNG
const resvg = new Resvg(svg, {
  fitTo: {
    mode: "width",
    value: 1200,
  },
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

// Write to static folder
const outputPath = new URL("../static/og.png", import.meta.url);
await Deno.writeFile(outputPath, pngBuffer);

console.log(`✅ OG image generated: static/og.png (${pngBuffer.length} bytes)`);
