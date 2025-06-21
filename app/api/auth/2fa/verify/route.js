import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';

export async function POST(request) {
  try {
    const { token, secret } = await request.json();

    // Verify the token
    const verified = speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
      window: 2 // Allow 2 time steps (60 seconds) of tolerance
    });

    if (verified) {
      return NextResponse.json({ verified: true });
    } else {
      return NextResponse.json(
        { error: 'Invalid 2FA token' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('2FA verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    );
  }
} 