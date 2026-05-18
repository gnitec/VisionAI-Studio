import { NextResponse } from 'next/server';
import { saveProject } from '@/lib/db';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, style, aspectRatio, type } = await request.json();
    console.log(`🎬 Generating ${type || 'Video'} with REAL AI | Prompt: ${prompt}`);

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is missing. Please add it to your .env.local file.");
    }

    let resultUrl = null;
    let resultThumb = null;

    // 1. Handling Thumbnail Generation (Creative Suite)
    if (type === 'Creative-Suite' && prompt.toLowerCase().includes('thumbnail')) {
      console.log("🎨 Using SDXL for Thumbnail...");
      const output = await replicate.run(
        "stability-ai/sdxl:36469dc4f9c0641ebe1bc4229615a9994c6f376f9ef02868c2d628d0e7225126",
        {
          input: {
            prompt: `${prompt}, high quality, professional youtube thumbnail, ${style}`,
            aspect_ratio: "16:9"
          }
        }
      );
      resultThumb = output[0];
    } 
    // 2. Handling Video Generation (Video Studio / Intro / Outro)
    else {
      console.log("📹 Using Luma Dream Machine for Video...");
      // For now, we use a high-quality model available on Replicate
      // Example: Luma or similar video model
      const output = await replicate.run(
        "lucataco/luma-dream-machine:426615b1c944d1ed36d6560935541604a37b12d1b87b70743b1981144a9b6c86",
        {
          input: {
            prompt: `${prompt}, ${style} style, high detail, 4k`,
            aspect_ratio: aspectRatio === '16:9' ? '16:9' : '9:16'
          }
        }
      );
      // Replicate usually returns an array or a direct URL depending on the model
      resultUrl = Array.isArray(output) ? output[0] : output;
    }

    // fallback if AI fails to return anything
    if (!resultUrl && !resultThumb) {
       throw new Error("AI failed to generate a result. The model returned an empty response.");
    }

    const newProject = saveProject({
      title: prompt.substring(0, 30) + (prompt.length > 30 ? "..." : ""),
      type: type || "Video-Studio",
      videoUrl: resultUrl,
      thumbnailUrl: resultThumb,
      style: style || "Cinematic",
      aspectRatio: aspectRatio || "16:9"
    });

    return NextResponse.json({
      success: true,
      ...newProject
    });
  } catch (error) {
    console.error("❌ Generation Error:", error);
    // Extract a clear message from Replicate errors if possible
    const errorMessage = error.message || "AI Generation Failed. Check your Replicate Balance or API Key.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
