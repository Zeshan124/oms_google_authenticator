"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "../../page.module.css";

const TwoFactorVerify = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [user, setUser] = useState(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  useEffect(() => {
    // Get user data and 2FA secret from storage
    const userData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    const storedSecret = localStorage.getItem('2faSecret');
    
    if (!userData || !token) {
      router.push("/auth/signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      
      // If user has 2FA enabled locally, use stored secret
      if (storedSecret) {
        setSecret(storedSecret);
      } else {
        // Fetch 2FA secret from backend for returning users
        fetch2FASecret();
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid session data and redirect to login
      sessionStorage.clear();
      router.push("/auth/signin");
    }
  }, [router, callbackUrl]);

  const fetch2FASecret = async () => {
    try {
      // For now, skip fetching from backend since the endpoint doesn't exist
      // TODO: Implement backend endpoint for getting 2FA secret
      
      // Since we can't fetch from backend, redirect to setup
      console.log("Backend 2FA secret endpoint not available, redirecting to setup");
      router.push(`/auth/2fa-setup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    } catch (error) {
      console.error("Failed to fetch 2FA secret:", error);
      // User doesn't have 2FA setup yet, redirect to setup
      router.push(`/auth/2fa-setup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }
  };

  const verifyToken = async () => {
    if (!token.trim()) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, secret }),
      });

      const data = await response.json();
      
      if (response.ok && data.verified) {
        // Mark 2FA as verified in localStorage for persistence
        localStorage.setItem('2faVerified', 'true');
        router.push(callbackUrl);
      } else {
        setError(data.error || "Invalid code. Please try again.");
      }
    } catch (error) {
      setError("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.welcomeBox}>
            <h1>Two-Factor Authentication</h1>
            <p>Enter the 6-digit code from your Google Authenticator app to complete login.</p>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <main className={styles.main}>
            <h1 className={styles.title}>Verify 2FA</h1>
            <p className={styles.subtitle}>Enter your authenticator code</p>
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="token" className={styles.label}>
                6-Digit Code
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                className={styles.input}
                maxLength={6}
                pattern="[0-9]{6}"
                autoFocus
              />
            </div>
            
            <button 
              className={`${styles.googleButton} ${isLoading ? styles.loading : ''}`}
              onClick={verifyToken}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Verifying...' : 'Verify & Continue'}
            </button>
            
            <div className={styles.divider}>
              <span>Having trouble?</span>
            </div>
            
            <button 
              className={styles.switchLink}
              onClick={() => router.push("/auth/signin")}
              type="button"
            >
              Try different account
            </button>
          </main>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorVerify; 