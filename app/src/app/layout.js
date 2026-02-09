import "./globals.css";
import Link from "next/link";
import { auth, signOut } from "../auth";

export const metadata = {
  title: "Hobby OS",
  description: "Manage books, recipes, and finances from one self-hosted app"
};

export default async function RootLayout({ children }) {
  const session = await auth();

  async function logoutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand-link">
            Hobby OS
          </Link>

          {session?.user ? (
            <div className="auth-controls">
              <span className="user-chip">{session.user.email}</span>
              <form action={logoutAction}>
                <button type="submit" className="button-link">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <Link href="/login" className="button-link">
              Sign in
            </Link>
          )}
        </header>
        {children}
      </body>
    </html>
  );
}
