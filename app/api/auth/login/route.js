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
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    console.log('Attempting login for username:', username);

    // Call the external login API using axios
    const response = await axiosInstance.post('/user/login', {
      username,
      password,
    });

    console.log('Login response status:', response.status);
    console.log('Login response data:', response.data);

    const data = response.data;

    if (response.status === 200 && data) {
      // The response doesn't have a nested 'user' object, the user data is directly in the response
      // Create a user object from the response data
      const userData = {
        username: data.userName || data.username,
        email: data.email || data.userName || data.username,
        name: data.name || data.userName || data.username,
        userId: data.userId,
        role: data.role,
        roleID: data.roleID,
        branchID: data.branchID,
        branchName: data.branchName,
        branchCode: data.branchCode,
        branchCodeAlias: data.branchCodeAlias,
        storeBranch: data.storeBranch,
        ...data // Include all other properties
      };

      // Check if user needs 2FA setup
      // For now, we'll assume all users need 2FA setup since we don't have backend endpoints
      // In the future, you can implement backend logic to check if user has 2FA enabled
      const needs2FASetup = true; // This will be determined by the frontend based on session storage
      
      return NextResponse.json({
        success: true,
        user: userData,
        token: data.token,
        needs2FASetup,
        message: 'Login successful. Please setup 2FA.'
      });
    } else {
      console.error('Login failed with status:', response.status, 'data:', data);
      return NextResponse.json(
        { error: data.message || data.error || 'Login failed' },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Login error:', error);
    
    // Handle axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      
      return NextResponse.json(
        { error: error.response.data?.message || error.response.data?.error || 'Login failed' },
        { status: error.response.status }
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
      return NextResponse.json(
        { error: 'No response from server. Please check your connection.' },
        { status: 503 }
      );
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
      return NextResponse.json(
        { error: 'Failed to connect to server' },
        { status: 500 }
      );
    }
  }
} 