import { redirect } from "next/navigation";
import { auth, signIn } from "../../auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/books");
  }

  async function loginAction(formData) {
    "use server";

    const email = String(formData.get("email") || "").trim().toLowerCase();

    if (!email) {
      return;
    }

    await signIn("credentials", {
      email,
      redirectTo: "/books"
    });
  }

  return (
    <main className="page auth-page">
      <section className="card auth-card">
        <p className="eyebrow">Sign in</p>
        <h1>Welcome back</h1>
        <p className="subtitle">Use your email to open your personal workspace.</p>

        <form action={loginAction} className="book-form auth-form">
          <input name="email" type="email" placeholder="you@example.com" required />
          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
  );
}
