import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #a78bfa 0%, #7c5cff 100%)",
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M11 8 L11 24 L22 16 Z" fill="white" />
          <circle cx="11" cy="16" r="2.5" fill="#7c5cff" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
