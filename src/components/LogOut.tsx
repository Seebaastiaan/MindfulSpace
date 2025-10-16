"use client";

import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      alert("No se pudo cerrar sesión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="group flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-xl border border-red-200 hover:border-red-300 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
    >
      <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" />
      <span className="text-sm font-medium">
        {loading ? "Cerrando..." : "Cerrar sesión"}
      </span>
    </button>
  );
}
