"use client";

import { apiService } from "@/service/api/api";
import { LoginDto } from "@/service/api/api.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState<LoginDto>({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (formData) {
        const response = await apiService.post("auth/login", formData);
        if (response) {
          localStorage.setItem("access_token", response.access_token);
          console.log("Login successful", response);
          router.push("/feed");
        } else {
          setError("Login falhou, tente novamente.");
        }
      }
    } catch (err) {
      setError("Login falhou, tente novamente.");
    }
  };

  return (
    <main className="flex items-center justify-center h-screen width-full bg-gray-100">
      <article className="border flex flex-col items-center justify-center p-4 rounded-lg bg-white shadow-md">
        <h1 className="font-bold mb-2 text-xl">Faça seu login!</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div>
            <label htmlFor="email">Email:</label>
            <input
              className="border rounded-md p-1 mx-2"
              type="email"
              id="email"
              name="email"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label htmlFor="password">Senha:</label>
            <input
              className="border rounded-md p-1 mx-2"
              type="password"
              id="password"
              name="password"
              required
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button
            type="submit"
            className="rounded-md bg-blue-200 self-center p-2 font-bold"
          >
            Login
          </button>
        </form>
      </article>
    </main>
  );
}
