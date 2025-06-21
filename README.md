This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# Custom Authentication with 2FA

This project implements a custom authentication system with two-factor authentication using Google Authenticator.

## Features

- **Custom Login API**: Integrates with your backend authentication system
- **Two-Factor Authentication**: Uses Google Authenticator for enhanced security
- **Smart 2FA Flow**: 
  - First-time users see QR code setup
  - Returning users only need to enter OTP
- **Session Management**: Uses session storage for client-side state
- **Responsive Design**: Works on all devices

## Authentication Flow

### First-Time Users
1. User visits the website and logs in with username/password
2. System checks if user has 2FA enabled
3. If not enabled, user is redirected to 2FA setup page
4. User scans QR code with Google Authenticator app
5. User verifies setup by entering 6-digit code
6. 2FA secret is saved to backend
7. User is redirected to dashboard

### Returning Users
1. User logs in with username/password
2. System checks if user has 2FA enabled
3. If enabled, user is redirected to 2FA verification page
4. User enters 6-digit code from Google Authenticator
5. User is redirected to dashboard

## API Endpoints

### Authentication
- `POST /api/auth/login` - Custom login with username/password
- `POST /api/auth/2fa/setup` - Generate 2FA setup (QR code + secret)
- `POST /api/auth/2fa/verify` - Verify 2FA token
- `POST /api/auth/2fa/save` - Save 2FA secret to backend
- `POST /api/auth/2fa/get-secret` - Get user's 2FA secret from backend

### External API Integration
The system integrates with your backend API at `https://boms.qistbazaar.pk/api/user/`:
- `POST /login` - User authentication
- `POST /2fa/setup` - Save 2FA setup
- `POST /2fa/secret` - Get user's 2FA secret

## Pages

- `/auth/signin` - Login page with username/password form
- `/auth/2fa-setup` - 2FA setup page (QR code + verification)
- `/auth/2fa-verify` - 2FA verification page (for returning users)
- `/dashboard` - Protected dashboard page
- `/test-2fa` - Test page for 2FA functionality

## Components

- `ProtectedRoute` - Route protection component
- `UserProfile` - User profile display component

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

No environment variables are required for the basic setup. The system uses session storage for client-side state management.

## Security Notes

- 2FA secrets are stored securely in your backend
- Session data is stored in browser session storage
- All API calls use HTTPS
- 2FA verification includes time window tolerance for clock skew

## Testing

Use the `/test-2fa` page to test your 2FA setup after completing the initial configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
