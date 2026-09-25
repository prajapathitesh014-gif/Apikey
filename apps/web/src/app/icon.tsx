import { ImageResponse } from "next/og";

export const size = {
  width: 48,
  height: 48,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: "linear-gradient(135deg, #ff7a18 0%, #ea580c 60%, #9a3412 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "12px",
          border: "2px solid #fed7aa",
          boxShadow: "0 0 16px rgba(249, 115, 22, 0.6)",
          color: "white",
        }}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#1c0a03" stroke="#fed7aa" strokeWidth="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="white" strokeWidth="2.5" />
          <circle cx="12" cy="16" r="1.5" fill="#fef08a" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
