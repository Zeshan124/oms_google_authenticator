"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getCookie, clearAuthCookies } from "../utils/cookies";

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get user data from cookies
    const userData = getCookie("userData");
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing user data:", error);
        // Clear invalid cookie data
        clearAuthCookies();
      }
    }
  }, []);

  if (!user) return null;

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      // Clear authentication cookies
      clearAuthCookies();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userData");
      localStorage.removeItem("2faSecret");
      localStorage.removeItem("2faEnabled");
      localStorage.removeItem("2faVerified");

      // Optionally clear 2FA data too (uncomment the lines below if you want complete logout)
      // localStorage.removeItem('2faSecret');
      // localStorage.removeItem('2faEnabled');
      // localStorage.removeItem('2faVerified');

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      setIsSigningOut(false);
    }
  };

  return (
    <div className="user-profile">
      <div className="profile-info">
        <div className="user-details">
          <p className="username">{user.name || user.username}</p>
          <p className="email">{user.email || user.username}</p>
          <div className="user-meta">
            <span className="provider">Custom Account</span>
            {localStorage.getItem("2faEnabled") && (
              <span className="verified">✓ 2FA Enabled</span>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={handleSignOut}
        className={`sign-out-btn ${isSigningOut ? "loading" : ""}`}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </button>
    </div>
  );
}
