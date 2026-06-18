// /api/scan-receipt.js
// Vercel Serverless Function — runs on the server, keeps the Anthropic API key secret.
// Frontend calls POST /api/scan-receipt with { image: base64String, mediaType: "image/jpeg" }

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { image, mediaType } = req.body || {};
  if (!image) {
    return res.status(400).json({ error: "Missing image" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server is missing ANTHROPIC_API_KEY" });
  }

  const prompt = `這是一張韓國收據的照片。請辨識內容並只回傳JSON，不要有任何前言或Markdown標記，格式如下：
{
  "store": "店名（翻譯成繁體中文，括號附原韓文）",
  "amount_krw": 數字（總金額，韓元，不含貨幣符號）,
  "items": ["品項1（中文翻譯）", "品項2（中文翻譯）"],
  "tax_included": true或false,
  "category": "從這些選項選一個：美食、購物、交通、住宿、娛樂、醫美、其他",
  "payment": "現金或信用卡，如果看不出來就填'未知'",
  "date": "YYYY-MM-DD格式，如果收據上有日期就用收據日期，否則留空字串"
}
如果無法辨識某欄位，amount_krw給0，其他給合理預設值。只回傳JSON本身。`;

  try {
    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: image } },
            { type: "text", text: prompt }
          ]
        }]
      })
    });

    if (!anthropicRes.ok) {
      const errText = await anthropicRes.text();
      console.error("Anthropic API error:", errText);
      return res.status(502).json({ error: "Anthropic API error" });
    }

    const data = await anthropicRes.json();
    const textBlock = (data.content || []).find(b => b.type === "text");
    let jsonText = textBlock ? textBlock.text : "{}";
    jsonText = jsonText.replace(/```json|```/g, "").trim();

    let parsed;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("Failed to parse model output as JSON:", jsonText);
      return res.status(502).json({ error: "Could not parse receipt data" });
    }

    return res.status(200).json(parsed);

  } catch (err) {
    console.error("scan-receipt handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
