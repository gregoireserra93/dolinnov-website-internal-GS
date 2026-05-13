"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setError(data.error || "Connexion impossible.");
        setLoading(false);
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setError("Erreur réseau. Réessaie dans un instant.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-dolinnov-black flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-lg bg-dolinnov-green flex items-center justify-center">
            <span className="text-dolinnov-black font-bold text-lg">D</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-dolinnov-black">
          Dolinnov
        </h1>
        <p className="text-sm text-dolinnov-gray-mid mt-1">Outil interne</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-black/5 p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-dolinnov-black mb-2"
            >
              Mot de passe d'accès
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-black/10 bg-white text-dolinnov-black placeholder:text-dolinnov-gray-mid focus:outline-none focus:border-dolinnov-black focus:ring-2 focus:ring-dolinnov-green/40 transition"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || password.length === 0}
            className="w-full py-2.5 rounded-xl bg-dolinnov-black text-white font-medium transition-colors hover:bg-dolinnov-green hover:text-dolinnov-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Connexion…" : "Entrer"}
          </button>
        </form>
      </div>

      <p className="text-xs text-dolinnov-gray-mid text-center mt-6">
        Accès réservé · Dolinnov SAS
      </p>
    </div>
  );
}
