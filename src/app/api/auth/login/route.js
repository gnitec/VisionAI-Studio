import { NextResponse } from 'next/server';
import { verifyUser, createSession } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    const user = await verifyUser(email, password);

    if (user) {
      const session = createSession(user);
      const response = NextResponse.json({
        success: true,
        user
      });

      // Set session cookie
      response.cookies.set('vision_session', session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      });

      return response;
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid email or password" 
    }, { status: 401 });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: "Authentication failed" 
    }, { status: 500 });
  }
}
