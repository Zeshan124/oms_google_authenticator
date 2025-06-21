import { NextResponse } from 'next/server';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export async function POST(request) {
  try {
    const { email, username } = await request.json();
    const userIdentifier = email || username;

    // Generate a new secret for the user
    const secret = speakeasy.generateSecret({
      name: `Google Authenticator (${userIdentifier})`,
      issuer: 'Your App Name',
      length: 20
    });

    // Generate QR code
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    // In a real application, you would save this secret to your database
    // associated with the user account
    // For now, we'll just return it to be stored in session storage

    return NextResponse.json({
      secret: secret.base32,
      qrCode: qrCodeUrl,
      otpauthUrl: secret.otpauth_url
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    );
  }
} 