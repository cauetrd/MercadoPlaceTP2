"use client";

import { apiService } from "@/service/api/api";
import { CreateUserDto } from "@/service/api/api.types";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const [formData, setFormData] = useState<CreateUserDto>({
    email: "",
    name: "",
    password: "",
    latitude: 0,
    longitude: 0,
    isAdmin: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocalização não é suportada pelo seu navegador.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
        }));
        setLocationError(null);
      },
      (error) => {
        let errorMessage = "Erro ao obter localização.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Usuário negou a solicitação de Geolocalização.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Localização indisponível.";
            break;
          case error.TIMEOUT:
            errorMessage = "A solicitação de Geolocalização expirou.";
            break;
        }
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (formData) {
        const response = await apiService.post("auth/register", formData);
        if (response) {
          localStorage.setItem("access_token", response.access_token);
          console.log("Registration successful", response);
          router.push("/feed");
        } else {
          setError("Registro falhou, tente novamente.");
        }
      }
    } catch (err) {
      setError("Registro falhou, tente novamente.");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen w-full bg-gray-100 p-4">
      <article className="border flex flex-col items-center justify-center p-6 rounded-lg bg-white shadow-md max-w-md w-full">
        <h1 className="font-bold mb-4 text-2xl text-center">Criar Conta</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="flex flex-col">
            <label htmlFor="name" className="font-medium mb-1">
              Nome:
            </label>
            <input
              className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>

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
            />
          </div>

          {/* Location Section */}
          <div className="flex flex-col">
            <label className="font-medium mb-2">Localização:</label>

            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={getLocation}
                className="px-4 py-2 rounded-md font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                "📍 Usar minha localização"
              </button>

              {formData.latitude && formData.longitude && (
                <div className="text-sm text-green-600 bg-green-50 p-2 rounded">
                  ✅ Localização obtida: {formData.latitude.toFixed(6)},{" "}
                  {formData.longitude.toFixed(6)}
                </div>
              )}

              {locationError && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  ❌ {locationError}
                </div>
              )}

              <div className="text-xs text-gray-500">
                A localização nos ajuda a mostrar mercados próximos a você
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-600 bg-red-50 p-2 rounded text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="rounded-md bg-blue-600 hover:bg-blue-700 text-white self-center px-6 py-2 font-bold transition-colors"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </article>
    </main>
  );
}
