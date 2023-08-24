import { ImageResponse } from "next/server"

// Route segment config
export const runtime = "edge"

// Image metadata
export const alt =
  "Open source Netflix clone project using bleed-edge tech stack."
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Open source project using bleeding-edge stack. Drizzle ORM + Neon
        postgres + Clerk auth + Shadcn/ui + everything new in Next.js 13 (server
        components, server actions, streaming ui, parallel routes, intercepting
        routes).
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
    },
  )
}
