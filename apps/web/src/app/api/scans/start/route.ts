import { NextRequest, NextResponse } from "next/server";
import { executeScanPipeline, saveScan } from "@/lib/scanner-engine/orchestrator";
import { ScanItem } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { targetUrl, openApiContent, authHeaderUserA, authHeaderUserB } = body;

    if (!targetUrl || !openApiContent) {
      return NextResponse.json(
        { error: "Missing targetUrl or openApiContent" },
        { status: 400 }
      );
    }

    const scanId = `scan_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    // Execute scan asynchronously
    executeScanPipeline({
      scanId,
      targetUrl,
      openApiRaw: openApiContent,
      authHeaderUserA,
      authHeaderUserB
    }).catch(console.error);

    return NextResponse.json({
      scanId,
      status: "running",
      message: "Security scan initiated successfully"
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
