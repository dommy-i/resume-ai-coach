import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("📨 LINE Webhook 受信:", JSON.stringify(body, null, 2));

  const userId = body.events?.[0]?.source?.userId;
  const messageText = body.events?.[0]?.message?.text;

  console.log("👤 userId:", userId);
  console.log("📝 message:", messageText);

  return NextResponse.json({ received: true });
}
