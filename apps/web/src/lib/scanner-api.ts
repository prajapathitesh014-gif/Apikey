import { ScanItem, FindingItem } from "@/types";

export async function fetchDemoSpec(): Promise<any> {
  const res = await fetch("/api/demo/spec");
  if (!res.ok) {
    const fallback = await fetch("http://localhost:4000/api/demo/spec").catch(() => null);
    if (fallback && fallback.ok) return fallback.json();
    throw new Error("Failed to load demo spec");
  }
  return res.json();
}

export async function startScan(params: {
  targetUrl: string;
  openApiContent: string;
  authHeaderUserA?: string;
  authHeaderUserB?: string;
}): Promise<{ scanId: string; status: string }> {
  const res = await fetch("/api/scans/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params)
  });

  if (!res.ok) {
    const fallback = await fetch("http://localhost:4000/api/scans/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params)
    }).catch(() => null);

    if (fallback && fallback.ok) return fallback.json();
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to initiate scan");
  }

  return res.json();
}

export async function getScanStatus(scanId: string): Promise<ScanItem> {
  const res = await fetch(`/api/scans/${scanId}`);
  if (!res.ok) {
    const fallback = await fetch(`http://localhost:4000/api/scans/${scanId}`).catch(() => null);
    if (fallback && fallback.ok) return fallback.json();
    throw new Error("Failed to fetch scan");
  }
  return res.json();
}

export function createScanEventSource(
  scanId: string,
  onEvent: (event: any) => void
): () => void {
  let eventSource: EventSource | null = null;
  try {
    eventSource = new EventSource(`http://localhost:4000/api/scans/${scanId}/events`);
    eventSource.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        onEvent(data);
      } catch (err) {
        console.error("SSE parse error:", err);
      }
    };
  } catch {}

  return () => {
    if (eventSource) eventSource.close();
  };
}
