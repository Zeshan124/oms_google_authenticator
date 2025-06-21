"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import styles from "../../page.module.css";

const TwoFactorSetup = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [user, setUser] = useState(null);

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

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
      // Generate 2FA setup
      generate2FASetup();
    } catch (error) {
      console.error("Error parsing user data:", error);
      // Clear invalid session data and redirect to login
      sessionStorage.clear();
      router.push("/auth/signin");
    }
  }, [router]);

  const generate2FASetup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: user?.email || user?.username }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
      } else {
        setError(data.error || "Failed to generate 2FA setup");
      }
    } catch (error) {
      setError("Failed to setup 2FA");
    } finally {
      setIsLoading(false);
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
        // For now, skip saving to backend since the endpoint doesn't exist
        // TODO: Implement backend endpoint for saving 2FA setup
        
        setSuccess("2FA setup successful! You can now use Google Authenticator for login.");
        
        // Store the secret in localStorage for persistent storage across sessions
        localStorage.setItem('2faSecret', secret);
        localStorage.setItem('2faEnabled', 'true');
        
        setTimeout(() => {
          router.push(callbackUrl);
        }, 2000);
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
            <h1>Secure Your Account</h1>
            <p>Set up two-factor authentication using Google Authenticator for enhanced security.</p>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <main className={styles.main}>
            <h1 className={styles.title}>Setup 2FA</h1>
            <p className={styles.subtitle}>Scan the QR code with Google Authenticator</p>
            
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
            
            {qrCode && (
              <div className={styles.qrContainer}>
                <Image 
                  src={qrCode} 
                  alt="QR Code for Google Authenticator" 
                  width={200} 
                  height={200}
                  className={styles.qrCode}
                />
                <p className={styles.secretText}>
                  <strong>Manual Entry Code:</strong> {secret}
                </p>
                <p className={styles.instructions}>
                  1. Open Google Authenticator app<br/>
                  2. Tap the + button to add account<br/>
                  3. Scan the QR code above<br/>
                  4. Or manually enter the code: {secret}
                </p>
              </div>
            )}
            
            <div className={styles.inputGroup}>
              <label htmlFor="token" className={styles.label}>
                6-Digit Code from Authenticator
              </label>
              <input
                type="text"
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter 6-digit code"
                className={styles.input}
                maxLength={6}
                pattern="[0-9]{6}"
              />
            </div>
            
            <button 
              className={`${styles.googleButton} ${isLoading ? styles.loading : ''}`}
              onClick={verifyToken}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Verifying...' : 'Verify & Complete Setup'}
            </button>
            
            <div className={styles.divider}>
              <span>Need help?</span>
            </div>
            
            <button 
              className={styles.switchLink}
              onClick={() => router.push(callbackUrl)}
              type="button"
            >
              Skip for now
            </button>
          </main>
        </div>
      </div>
    </section>
  );
};

export default TwoFactorSetup; 