import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { concept } = await request.json();

    console.log(`[Storyboard] Generating storyboard for: ${concept} using OpenAI`);

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
            "content": "You are an expert video director and storyboard artist. Output ONLY valid JSON containing an array of exactly 3 objects. Do NOT wrap the JSON in markdown code blocks. Each object represents a scene with the following keys: id (number), title (string), description (string), prompt (detailed visual prompt for AI image generator)."
          },
          {
            "role": "user", 
            "content": `Create a 3-part storyboard for the concept: ${concept}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("[Storyboard Error]:", errText);
      throw new Error("Failed to fetch from OpenRouter.");
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();

    if (content.startsWith("```json")) {
      content = content.replace(/^```json/, "");
      content = content.replace(/```$/, "");
      content = content.trim();
    }

    const parsedScenes = JSON.parse(content);
    
    // Add default thumbnails to the generated scenes
    const scenes = parsedScenes.map((scene, index) => {
      const thumbnails = [
        "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400",
        "https://images.unsplash.com/photo-1545156521-77bd85671d30?w=400",
        "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=400"
      ];
      return {
        ...scene,
        thumbnail: thumbnails[index % thumbnails.length]
      };
    });

    return NextResponse.json({
      success: true,
      scenes
    });

  } catch (error) {
    console.error("[Storyboard Error]:", error);
    return NextResponse.json({ success: false, error: "Failed to generate storyboard" }, { status: 500 });
  }
}
