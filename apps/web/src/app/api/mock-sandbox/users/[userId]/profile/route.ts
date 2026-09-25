import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;

  // VULNERABILITY: Sensitive Object Property Exposure - Leaks password hash and internal flags
  return NextResponse.json({
    id: userId,
    username: "alice_vance",
    email: "alice.vance@sandbox-test.local",
    displayName: "Alice Vance",
    password_hash: "$2b$12$e8Yy8F41Z9vBw6R4L1q.8uu0sXqL9p3Kj0wU9f/9s.8s9s8d",
    ssn: "982-12-XXXX",
    admin_flags: { is_super_admin: false, can_impersonate: true },
    internal_notes: "High-value enterprise sandbox test profile with bypass flags."
  });
}
