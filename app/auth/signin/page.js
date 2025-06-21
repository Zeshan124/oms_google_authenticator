"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styles from "../../page.module.css";

const SignIn = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });

  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      setError("Please enter both username and password");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      
      console.log('Attempting login with:', { username: formData.username });
      
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (response.ok && data.success) {
        // Validate user data before storing
        if (!data.user || typeof data.user !== 'object') {
          setError("Invalid user data received from server");
          return;
        }

        // Store user data and token in session storage
        try {
          sessionStorage.setItem('user', JSON.stringify(data.user));
          sessionStorage.setItem('token', data.token);
          console.log('Session data stored successfully');
        } catch (error) {
          console.error("Error storing session data:", error);
          setError("Failed to store session data");
          return;
        }
        
        // Check if user already has 2FA setup locally
        const existingSecret = localStorage.getItem('2faSecret');
        const has2FAEnabled = localStorage.getItem('2faEnabled');
        
        if (existingSecret && has2FAEnabled) {
          // User has 2FA setup locally - redirect to verification
          console.log('User has existing 2FA setup, redirecting to verification');
          router.push(`/auth/2fa-verify?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        } else {
          // User needs 2FA setup - redirect to setup
          console.log('User needs 2FA setup, redirecting to setup');
          router.push(`/auth/2fa-setup?callbackUrl=${encodeURIComponent(callbackUrl)}`);
        }
      } else {
        setError(data.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.welcomeBox}>
            <h1>New here?</h1>
            <p>Create an account to get started with our platform.</p>
            <Link href="/auth/signup" className={styles.switchBtn}>
              Sign Up
            </Link>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <main className={styles.main}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Sign in to your account</p>
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="username" className={styles.label}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className={styles.input}
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className={styles.input}
                  required
                />
              </div>
              
              <button 
                className={`${styles.googleButton} ${isLoading ? styles.loading : ''}`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
            
            <div className={styles.divider}>
              <span>New to our platform?</span>
            </div>
            
            <Link href="/auth/signup" className={styles.switchLink}>
              Create an account
            </Link>
          </main>
        </div>
      </div>
    </section>
  );
};

export default SignIn;

export async function GET(request) {
  // Your API logic here
  return new Response('This is the signin API route', { status: 200 });
}