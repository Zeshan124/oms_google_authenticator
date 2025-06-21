import ProtectedRoute from "../../components/ProtectedRoute";
import UserProfile from "../../components/UserProfile";
import Link from "next/link";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="dashboard">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <UserProfile />
        </header>
        <main className="dashboard-main">
          <div className="dashboard-content">
            <div className="welcome-card">
              <h2>Welcome to Your Dashboard!</h2>
              <p>You have successfully signed in with your account.</p>
            </div>
            
            <div className="feature-grid">
              <div className="feature-card">
                <h3>🔐 Secure Authentication</h3>
                <p>Your account is protected with custom authentication</p>
              </div>
              
              <div className="feature-card">
                <h3>🔒 Two-Factor Authentication</h3>
                <p>Add an extra layer of security with Google Authenticator</p>
                <Link href="/dashboard/2fa-setup" className="feature-link">
                  Setup 2FA →
                </Link>
              </div>
              
              <div className="feature-card">
                <h3>⚡ Fast Login</h3>
                <p>Quick and secure authentication process</p>
              </div>
              
              <div className="feature-card">
                <h3>📱 Responsive Design</h3>
                <p>Works seamlessly across all your devices</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}