// app/(home)/signin/page.tsx
import { handleSignIn } from "./actions";

export default function SignInPage() {
  return (
    <main className="max-w-md mx-auto p-4">
      <h1>Connexion</h1>
      {/* Formulaire Server Action */}
      <form action={handleSignIn} method="POST" className="flex flex-col gap-4">
        <label>
          Email
          <input name="email" type="email" required className="border p-2 rounded" />
        </label>
        <label>
          Mot de passe
          <input name="password" type="password" required className="border p-2 rounded" />
        </label>
        <button type="submit" className="btn btn-primary">Se connecter</button>
      </form>
    </main>
  );
}
