import { NextResponse } from "next/server";
import { DEMO_OPENAPI_SPEC } from "@/lib/scanner-engine/demo-spec";

export async function GET() {
  return NextResponse.json(DEMO_OPENAPI_SPEC);
}
