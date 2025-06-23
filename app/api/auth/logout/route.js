import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Create response with success message
    const responseData = {
      success: true,
      message: 'Logged out successfully'
    };

    // Create NextResponse with cleared cookies
    const nextResponse = NextResponse.json(responseData);

    // Clear authentication cookies by setting them to expire immediately
    nextResponse.cookies.set('authToken', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    nextResponse.cookies.set('userData', '', {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    return nextResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Failed to logout' },
      { status: 500 }
    );
  }
} 