"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "../page.module.css";

const Test2FA = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Get user data from session storage
    const userData = sessionStorage.getItem('user');
    const token = sessionStorage.getItem('token');
    
    if (!userData || !token) {
      router.push("/auth/signin");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid session data and redirect to login
      sessionStorage.clear();
      router.push("/auth/signin");
    }
  }, [router]);

  const test2FA = async () => {
    if (!token.trim()) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      // Get the secret from localStorage
      const secret = localStorage.getItem('2faSecret');
      
      if (!secret) {
        setError("No 2FA secret found. Please setup 2FA first.");
        return;
      }
      
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, secret }),
      });

      const data = await response.json();
      
      if (response.ok && data.verified) {
        setSuccess("2FA verification successful!");
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
            <h1>Test 2FA</h1>
            <p>Test your two-factor authentication setup.</p>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <main className={styles.main}>
            <h1 className={styles.title}>Test 2FA Verification</h1>
            <p className={styles.subtitle}>Enter a code from your Google Authenticator app</p>
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            {success && (
              <div className={styles.success}>
                {success}
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
              onClick={test2FA}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Testing...' : 'Test 2FA'}
            </button>
            
            <div className={styles.divider}>
              <span>Navigation</span>
            </div>
            
            <button 
              className={styles.switchLink}
              onClick={() => router.push("/dashboard")}
              type="button"
            >
              Go to Dashboard
            </button>
          </main>
        </div>
      </div>
    </section>
  );
};

export default Test2FA; 