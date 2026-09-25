import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalRevenue: 894000,
    activeTenants: 48,
    privateMetrics: {
      churnRate: "1.2%",
      serverCost: "$12,400"
    }
  });
}
