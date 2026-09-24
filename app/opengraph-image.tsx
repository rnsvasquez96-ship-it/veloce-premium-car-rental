import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";

export const alt =
  "VELOCE — Drive exceptional. Premium performance cars in Metro Manila.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function SocialCover() {
  const car = await readFile(
    join(process.cwd(), "public", "images", "porsche-911.png"),
  );

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          position: "relative",
          overflow: "hidden",
          background: "#11160f",
          color: "#efefea",
          padding: "48px",
          flexDirection: "column",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        {/* Background wordmark */}
        <div
          style={{
            position: "absolute",
            top: "80px",
            left: "-20px",
            fontSize: "170px",
            fontWeight: 700,
            letterSpacing: "-10px",
            color: "rgba(255,255,255,0.05)",
            lineHeight: 1,
          }}
        >
          VELOCE
        </div>

        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "18px",
            letterSpacing: "5px",
            zIndex: 2,
          }}
        >
          <span>VELOCE</span>
          <span
            style={{
              color: "#b4bea9",
              fontSize: "14px",
            }}
          >
            METRO MANILA / PHILIPPINES
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            display: "flex",
            marginTop: "34px",
            fontSize: "98px",
            fontWeight: 600,
            letterSpacing: "-6px",
            lineHeight: 0.95,
            zIndex: 2,
            maxWidth: "760px",
          }}
        >
          DRIVE EXCEPTIONAL.
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            marginTop: "18px",
            fontSize: "24px",
            color: "rgba(239,239,234,0.72)",
            maxWidth: "560px",
            lineHeight: 1.3,
            zIndex: 2,
          }}
        >
          Premium performance cars curated for personal journeys.
        </div>

        {/* Shadow under car */}
        <div
          style={{
            position: "absolute",
            bottom: "88px",
            left: "255px",
            width: "830px",
            height: "48px",
            borderRadius: "999px",
            background:
              "radial-gradient(ellipse, rgba(0,0,0,0.9) 0%, transparent 70%)",
          }}
        />

        {/* Car image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${car.toString("base64")}`}
          alt=""
          width={940}
          height={397}
          style={{
            position: "absolute",
            top: "178px",
            left: "210px",
            objectFit: "contain",
          }}
        />

        {/* Bottom divider */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            left: "48px",
            right: "48px",
            bottom: "40px",
            paddingTop: "18px",
            borderTop: "1px solid #46513b",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "14px",
            letterSpacing: "3px",
          }}
        >
          <span>EXCEPTIONAL MACHINES. PERSONAL JOURNEYS.</span>

          <span
            style={{
              color: "#d8ff3e",
            }}
          >
            THE COLLECTION →
          </span>
        </div>
      </div>
    ),
    size,
  );
}