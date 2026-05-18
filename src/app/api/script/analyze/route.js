import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { idea } = await request.json();

    console.log(`[VisionAI] Analyzing idea with OpenAI: ${idea}`);

    if (!process.env.OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is missing in environment variables.");
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            "role": "system", 
            "content": "You are a professional video storyboard and script writer. Output ONLY valid JSON containing an array of exactly 3 objects. Do NOT wrap the JSON in markdown code blocks. Each object represents a scene with the following keys: id (number), title (string), script (string), visualPrompt (detailed prompt for AI image generator), camera (string: e.g. Wide Shot, Pan Left), status (string: always 'Pending')."
          },
          {
            "role": "user", 
            "content": `Create a 3-part storyboard for the following idea: ${idea}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[VisionAI] OpenRouter API Error:", errText);
      throw new Error("Failed to fetch from OpenRouter.");
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    // Remove markdown code blocks if the AI still included them
    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "");
      content = content.replace(/```$/, "");
      content = content.trim();
    }

    const storyboard = JSON.parse(content);

    return NextResponse.json({
      success: true,
      storyboard
    });

  } catch (error) {
    console.error("[VisionAI] Script Analysis Error:", error);
    return NextResponse.json({ success: false, error: "Failed to analyze idea" }, { status: 500 });
  }
}
