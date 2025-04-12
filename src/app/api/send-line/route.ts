import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  const userId = process.env.USER_LINE_ID!;
  const token = process.env.LINE_ACCESS_TOKEN!;

  const res = await fetch("https://api.line.me/v2/bot/message/push", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      to: userId,
      messages: [{ type: "text", text: message }],
    }),
  });

  const data = await res.json();
  return NextResponse.json({ status: res.status, data });
}
