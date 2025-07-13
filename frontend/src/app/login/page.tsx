"use client";

import { apiService } from "@/service/api/api";
import { AuthResponse, LoginDto } from "@/service/api/api.types";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginDto>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check if user is already authenticated
  useEffect(() => {
    if (apiService.isAuthenticated()) {
      router.push("/feed");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = (await apiService.login(formData)) as AuthResponse;

      if (response.access_token) {
        console.log("Login successful", response);

        // Get redirect URL from query params or default to feed
        const redirectUrl = searchParams.get("redirect") || "/feed";
        router.push(redirectUrl);
      } else {
        setError("Login falhou, tente novamente.");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login falhou, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <article className="border flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md max-w-md w-full">
        <h1 className="font-bold mb-4 text-2xl text-center">Faça seu login!</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="email" className="font-medium mb-1">
              Email:
            </label>
            <input
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="font-medium mb-1">
              Senha:
            </label>
            <input
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              id="password"
              name="password"
              required
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              disabled={loading}
            />
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-2 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="rounded-md hover:cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white self-center px-6 py-2 font-bold transition-colors"
          >
            {loading ? "Entrando..." : "Login"}
          </button>
        </form>

        <div>
          Ainda não tem uma conta?{" "}
          <button
            onClick={() => router.push("/register")}
            className="text-blue-600 hover:underline hover:cursor-pointer"
          >
            Crie uma conta
          </button>
        </div>
      </article>
    </main>
  );
}
