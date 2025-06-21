import { NextResponse } from 'next/server';
import axios from 'axios';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: "https://boms.qistbazaar.pk/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function POST(request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    console.log('Getting 2FA secret for username:', username);

    // Call your backend API to get the user's 2FA secret
    const response = await axiosInstance.post('/user/2fa/secret', {
      username
    });

    console.log('2FA get-secret response status:', response.status);
    console.log('2FA get-secret response data:', response.data);

    const data = response.data;

    if (response.status === 200 && data) {
      return NextResponse.json({
        success: true,
        secret: data.secret,
        enabled: data.enabled
      });
    } else {
      console.error('2FA get-secret failed with status:', response.status, 'data:', data);
      return NextResponse.json(
        { error: data.message || data.error || 'Failed to get 2FA secret' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Get 2FA secret error:', error);
    
    // Handle axios errors
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      return NextResponse.json(
        { error: error.response.data?.message || error.response.data?.error || 'Failed to get 2FA secret' },
        { status: error.response.status }
      );
    } else if (error.request) {
      console.error('No response received:', error.request);
      return NextResponse.json(
        { error: 'No response from server. Please check your connection.' },
        { status: 503 }
      );
    } else {
      console.error('Error setting up request:', error.message);
      return NextResponse.json(
        { error: 'Failed to connect to server' },
        { status: 500 }
      );
    }
  }
} 