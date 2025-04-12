import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, age, experience, industry } = body;

  const prompt = `
あなたは履歴書の作成アシスタントです。
以下の情報を元に、職務経歴書を日本語で丁寧に作成してください。

---
名前: ${name}
年齢: ${age}
職歴: ${experience}
志望業界: ${industry}
---
`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    }),
  });

    const rawText = await response.text();

  if (!response.ok) {
    console.error("OpenAI API Error", response.status, rawText);
    return NextResponse.json({ result: "AIの生成に失敗しました（" + response.status + "）" });
  }

  const data = JSON.parse(rawText);
  const aiMessage = data.choices?.[0]?.message?.content || "生成に失敗しました。";

  return NextResponse.json({ result: aiMessage });
}
