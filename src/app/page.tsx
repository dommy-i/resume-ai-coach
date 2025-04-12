"use client";

import { useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [experience, setExperience] = useState("");
  const [industry, setIndustry] = useState("");
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("AIが職務経歴書を作成中です...");

    const res = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, age, experience, industry }),
    });

    const data = await res.json();
    setResult(data.result);
  };

  const handlePdfDownload = async () => {
    const element = document.getElementById("result-content");
    if (!element) {
      alert("PDF保存対象が見つかりません。");
      return;
    }

    const domtoimage = await import("dom-to-image");
    const jsPDF = (await import("jspdf")).jsPDF;

    try {
      const dataUrl = await domtoimage.toPng(element);
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("resume.pdf");

      // ✅ PDF保存後、LINEへ通知を送る
    await fetch("/api/send-line", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message:
          "✅ あなたの職務経歴書が完成しました！\n" +
          "こちらからダウンロードできます → https://your-site.vercel.app/download/resume.pdf",
      }),
    });
    } catch (error) {
      console.error("PDF生成エラー:", error);
      alert("PDFの生成中にエラーが発生しました。");
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">履歴書AIコーチ</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">お名前</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">年齢</label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">職歴</label>
            <textarea
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              rows={3}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">志望業界</label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">選択してください</option>
              <option value="IT業界">IT業界</option>
              <option value="サービス業">サービス業</option>
              <option value="医療・福祉">医療・福祉</option>
              <option value="教育">教育</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition"
          >
            AIに作ってもらう
          </button>
        </form>

        {result && (
          <div>
            <div
              id="result-content"
              style={{
                backgroundColor: "white",
                color: "black",
                padding: "16px",
                border: "1px solid #ccc",
                fontSize: "14px",
                lineHeight: "1.6",
                fontFamily: "sans-serif",
                maxWidth: "600px",
                marginTop: "2rem",
                borderRadius: "8px",
              }}
              className="mt-8"
            >
              <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "8px" }}>
                AIの回答
              </h2>
              {result}
            </div>

            <button
              onClick={handlePdfDownload}
              className="mt-4 w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 transition"
            >
              PDFで保存
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
