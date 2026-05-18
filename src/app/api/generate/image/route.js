import { NextResponse } from 'next/server';
import Replicate from 'replicate';
import { saveProject } from '@/lib/db';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request) {
  try {
    const { prompt, aspectRatio } = await request.json();
    const hasToken = process.env.REPLICATE_API_TOKEN && process.env.REPLICATE_API_TOKEN !== 'your_replicate_token_here';

    console.log(`[VisionAI] Image Gen: ${prompt}`);

    if (hasToken) {
      const output = await replicate.run(
        "black-forest-labs/flux-1.1-pro",
        {
          input: {
            prompt: prompt,
            aspect_ratio: aspectRatio || "1:1",
            output_format: "jpg",
            output_quality: 90
          }
        }
      );

      const project = {
        title: prompt.substring(0, 20),
        type: 'Image',
        imageUrl: output,
        date: new Date().toISOString()
      };
      saveProject(project);

      return NextResponse.json({ success: true, imageUrl: output });
    }

    // Mock response if no token
    await new Promise(r => setTimeout(r, 2000));
    return NextResponse.json({ 
      success: true, 
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' 
    });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
