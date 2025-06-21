"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, fallback = null }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status from storage
    const user = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    const is2FAVerified = localStorage.getItem('2faVerified');
    
    if (!user || !token) {
      const currentUrl = window.location.pathname;
      router.push(`/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    // Check if 2FA is verified (for returning users)
    const has2FAEnabled = localStorage.getItem('2faEnabled');
    if (has2FAEnabled && !is2FAVerified) {
      const currentUrl = window.location.pathname;
      router.push(`/auth/2fa-verify?callbackUrl=${encodeURIComponent(currentUrl)}`);
      return;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return fallback;
  }

  return children;
}