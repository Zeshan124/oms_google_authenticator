import Link from 'next/link';

export default function Home() {
  return (
    <div className="home">
      <main className="home-main">
        <h1>Welcome to Our App</h1>
        <p>Sign in to access your dashboard</p>
        <div className="home-buttons">
          <Link href="/auth/signin" className="btn btn-primary">
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn btn-secondary">
            Sign Up
          </Link>
        </div>
      </main>
    </div>
  );
}