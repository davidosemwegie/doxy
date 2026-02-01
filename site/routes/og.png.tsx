import { define } from "../utils.ts";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Inter font - we'll fetch it once and cache
let fontData: ArrayBuffer | null = null;

async function getFont(): Promise<ArrayBuffer> {
  if (fontData) return fontData;

  const response = await fetch(
    "https://fonts.gstatic.com/s/inter/v13/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
  );
  fontData = await response.arrayBuffer();
  return fontData;
}

export const handler = define.handlers({
  async GET(_ctx) {
    const font = await getFont();

    const svg = await satori(
      {
        type: "div",
        props: {
          style: {
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0a0a0a",
            fontFamily: "Inter",
          },
          children: [
            {
              type: "div",
              props: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                },
                children: [
                  // ASCII logo representation
                  {
                    type: "div",
                    props: {
                      style: {
                        fontSize: 120,
                        fontWeight: 700,
                        color: "#22d3ee",
                        letterSpacing: "-0.05em",
                        textShadow: "0 0 60px rgba(34, 211, 238, 0.5)",
                      },
                      children: "doxy",
                    },
                  },
                  // Tagline
                  {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: 16,
                        marginTop: 24,
                        fontSize: 36,
                      },
                      children: [
                        {
                          type: "span",
                          props: {
                            style: { color: "#666" },
                            children: "docs",
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: {
                              color: "#22d3ee",
                              textShadow: "0 0 20px rgba(34, 211, 238, 0.5)",
                            },
                            children: "→",
                          },
                        },
                        {
                          type: "span",
                          props: {
                            style: { color: "#fff" },
                            children: "skills",
                          },
                        },
                      ],
                    },
                  },
                  // Description
                  {
                    type: "div",
                    props: {
                      style: {
                        marginTop: 40,
                        fontSize: 24,
                        color: "#888",
                        maxWidth: 600,
                        textAlign: "center",
                      },
                      children: "Generate Claude Code skills from documentation",
                    },
                  },
                ],
              },
            },
            // Footer
            {
              type: "div",
              props: {
                style: {
                  position: "absolute",
                  bottom: 40,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  fontSize: 20,
                  color: "#666",
                },
                children: [
                  {
                    type: "span",
                    props: {
                      style: {
                        padding: "8px 16px",
                        border: "1px solid #333",
                        borderRadius: 8,
                      },
                      children: "/doxy <url>",
                    },
                  },
                  {
                    type: "span",
                    props: {
                      children: "•",
                    },
                  },
                  {
                    type: "span",
                    props: {
                      children: "Claude Code Plugin",
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
            name: "Inter",
            data: font,
            weight: 400,
            style: "normal",
          },
          {
            name: "Inter",
            data: font,
            weight: 700,
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

    return new Response(pngBuffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, immutable",
      },
    });
  },
});
