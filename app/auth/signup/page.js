"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "../../page.module.css";

const SignUp = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (session) return null;

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      await signIn("google", { 
        callbackUrl: "/dashboard",
        redirect: true
      });
    } catch (error) {
      console.error("Sign up failed:", error);
      setError("Sign-up failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.leftColumn}>
          <div className={styles.welcomeBox}>
            <h1>Welcome Back</h1>
            <p>Already have an account? Sign in to continue.</p>
            <Link href="/auth/signin" className={styles.switchBtn}>
              Sign In
            </Link>
          </div>
        </div>
        
        <div className={styles.rightColumn}>
          <main className={styles.main}>
            <h1 className={styles.title}>Create Account</h1>
            <p className={styles.subtitle}>Sign up to get started</p>
            
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}
            
            <button 
              className={`${styles.googleButton} ${isLoading ? styles.loading : ''}`}
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? (
                <div className={styles.spinner}></div>
              ) : (
                <Image 
                  src="/images/google.svg" 
                  alt="Google logo" 
                  width={20} 
                  height={20}
                />
              )}
              {isLoading ? 'Creating account...' : 'Sign up with Google'}
            </button>
            
            <div className={styles.divider}>
              <span>Already have an account?</span>
            </div>
            
            <Link href="/auth/signin" className={styles.switchLink}>
              Sign in instead
            </Link>
          </main>
        </div>
      </div>
    </section>
  );
};

export default SignUp;