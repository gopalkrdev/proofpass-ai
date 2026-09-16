function extractJson(text) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("AI returned invalid JSON");
  return JSON.parse(cleaned.slice(first, last + 1));
}

export async function analyzeEvidence({ claim, evidence, sourceUrl }) {
  const demo = process.env.DEMO_MODE === "true" || !process.env.GEMINI_API_KEY;

  if (demo) {
    const evidenceLength = evidence.trim().length;
    const hasUrl = Boolean(sourceUrl?.trim());
    const score = Math.min(92, 55 + (evidenceLength > 120 ? 20 : 8) + (hasUrl ? 17 : 0));

    return {
      mode: "demo",
      verdict: score >= 80 ? "SUPPORTED" : "NEEDS_MORE_EVIDENCE",
      score,
      summary: "Demo assessment: the supplied evidence is structurally consistent with the claim, but this is not an authenticity guarantee.",
      findings: [
        hasUrl ? "A source URL was supplied for additional verification." : "No external source URL was supplied.",
        evidenceLength > 120 ? "The evidence contains enough detail for a basic consistency assessment." : "The evidence is short; additional supporting evidence would improve confidence.",
        "The cryptographic fingerprint proves integrity of this submitted evidence after anchoring."
      ]
    };
  }

  const prompt = `You are an evidence-analysis assistant for ProofPass.
Do not claim that a document or person is authentic unless the supplied evidence actually establishes it.
Return ONLY valid JSON.

Claim:
${claim}

Supporting evidence:
${evidence}

Source URL:
${sourceUrl || "none"}

Return this schema:
{
  "verdict": "SUPPORTED" | "NEEDS_MORE_EVIDENCE" | "CONFLICTING",
  "score": number,
  "summary": string,
  "findings": [string, string, string]
}

Score 0-100. Base it only on the supplied evidence. Mention limitations when evidence is insufficient.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(process.env.GEMINI_MODEL || "gemini-2.5-flash")}:generateContent?key=${encodeURIComponent(process.env.GEMINI_API_KEY)}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
    })
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${body}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini returned no text");

  return { mode: "gemini", ...extractJson(text) };
}
