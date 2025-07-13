"use client";

import { apiService } from "@/service/api/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const [checking, setChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiService.isAuthenticated()) {
          try {
            await apiService.get("/users/me");
            router.push("/feed");
          } catch (error) {
            // Token might be expired or invalid
            console.log("Token invalid, redirecting to login");
            router.push("/login");
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        router.push("/login");
      } finally {
        setChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  if (checking) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando autenticação...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          🛒 MercadoPlace
        </h1>
        <p className="text-gray-600 mb-6">
          Bem-vindo ao sistema de marketplace!
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => router.push("/login")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Fazer Login
          </button>
          <button
            onClick={() => router.push("/register")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
          >
            Criar Conta
          </button>
        </div>
      </div>
    </main>
  );
}
