import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  // VULNERABILITY: BOLA - Returns Alice's private order regardless of Bearer token
  return NextResponse.json({
    id: orderId,
    ownerUserId: "usr_alice_owner_9841",
    customerName: "Alice Vance (Test Account A)",
    totalAmount: 1420.50,
    currency: "USD",
    billingAddress: "742 Evergreen Terrace, Springfield",
    items: [
      { sku: "SKU-9921", description: "Enterprise Security Key", quantity: 2, price: 710.25 }
    ],
    createdAt: "2026-09-24T10:30:00Z",
    status: "CONFIRMED"
  });
}
