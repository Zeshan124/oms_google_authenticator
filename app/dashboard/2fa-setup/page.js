"use client";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../page.module.css";

const TwoFactorSetupDemo = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const generate2FASetup = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/2fa/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: session?.user?.email }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setError("");
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
        setSuccess("2FA verification successful! Your authenticator is working correctly.");
      } else {
        setError(data.error || "Invalid code. Please try again.");
      }
    } catch (error) {
      setError("Failed to verify code");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!session) {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>2FA Setup Demo</h1>
      <p style={{ marginBottom: "2rem", color: "#666" }}>
        This page demonstrates how to set up Google Authenticator for your account.
      </p>

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

      <div style={{ marginBottom: "2rem" }}>
        <button 
          onClick={generate2FASetup}
          disabled={isLoading}
          className={styles.googleButton}
          style={{ marginBottom: "1rem" }}
        >
          {isLoading ? 'Generating...' : 'Generate 2FA Setup'}
        </button>
      </div>

      {qrCode && (
        <div className={styles.qrContainer}>
          <img 
            src={qrCode} 
            alt="QR Code for Google Authenticator" 
            style={{ width: "200px", height: "200px" }}
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

      {secret && (
        <div className={styles.inputGroup}>
          <label htmlFor="token" className={styles.label}>
            Test 6-Digit Code from Authenticator
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
          />
          <button 
            onClick={verifyToken}
            disabled={isLoading || !token}
            className={styles.googleButton}
            style={{ marginTop: "1rem" }}
          >
            {isLoading ? 'Verifying...' : 'Test Verification'}
          </button>
        </div>
      )}

      <div style={{ marginTop: "2rem", padding: "1rem", background: "#f8f9fa", borderRadius: "8px" }}>
        <h3>How it works:</h3>
        <ol>
          <li>Click "Generate 2FA Setup" to create a new secret</li>
          <li>Scan the QR code with Google Authenticator app</li>
          <li>Enter the 6-digit code from your app to test</li>
          <li>If verification succeeds, your 2FA is working!</li>
        </ol>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link href="/dashboard" className={styles.switchLink}>
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default TwoFactorSetupDemo; 