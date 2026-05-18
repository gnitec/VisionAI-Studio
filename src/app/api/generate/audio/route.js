import { NextResponse } from 'next/server';
import { saveProject } from '@/lib/db';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, mode } = await request.json();

    console.log(`Generating Audio (${mode}) with Replicate for prompt: ${prompt}`);

    if (!process.env.REPLICATE_API_TOKEN) {
      throw new Error("REPLICATE_API_TOKEN is missing in environment variables.");
    }

    const output = await replicate.run(
      "suno-ai/bark:b76242b40d67c76ab6742e987628a2a9ac019e11d56ab96c4e91ce03b79b2787",
      {
        input: {
          prompt: prompt,
          text_temp: 0.7,
          waveform_temp: 0.7
        }
      }
    );

    const resultUrl = output.audio_out;

    const newProject = saveProject({
      title: prompt.substring(0, 20) + "...",
      type: "Audio-Studio",
      videoUrl: resultUrl,
      style: mode || "Narration"
    });

    return NextResponse.json({
      success: true,
      ...newProject
    });
  } catch (error) {
    console.error("[VisionAI] Audio Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate audio" }, { status: 500 });
  }
}
