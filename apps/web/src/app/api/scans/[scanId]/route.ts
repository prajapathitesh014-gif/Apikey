import { NextRequest, NextResponse } from "next/server";
import { getScanById } from "@/lib/scanner-engine/orchestrator";
import { INITIAL_SCANS } from "@/lib/mock-data";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ scanId: string }> }
) {
  const { scanId } = await params;
  const scan = getScanById(scanId) || INITIAL_SCANS.find((s) => s.id === scanId) || INITIAL_SCANS[0];

  if (!scan) {
    return NextResponse.json({ error: "Scan not found" }, { status: 404 });
  }

  return NextResponse.json(scan);
}
