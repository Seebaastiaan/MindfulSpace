"use client";

import Redirect from "@/components/Redirect";
import { auth, googleProvider } from "@/lib/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Detectar si ya hay un usuario logueado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  // Limpiar sesión anterior y deshabilitar autoselección de cuenta Google
  useEffect(() => {
    const cleanPreviousSession = async () => {
      try {
        await signOut(auth); // Cierra sesión en Firebase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).google?.accounts?.id?.disableAutoSelect?.(); // Evita autoselección de cuenta
      } catch (err) {
        console.warn("No se pudo limpiar sesión anterior:", err);
      }
    };
    cleanPreviousSession();
  }, []);

  const loginWithGoogle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase Auth no está inicializado");

      // Detectar si sessionStorage está disponible
      const canUseSessionStorage = (() => {
        try {
          const testKey = "__test__";
          sessionStorage.setItem(testKey, testKey);
          sessionStorage.removeItem(testKey);
          return true;
        } catch {
          return false;
        }
      })();

      if (canUseSessionStorage) {
        // Usar popup normalmente
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
      } else {
        // Fallback a redirect si storage no está disponible
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert(
        "No se pudo iniciar sesión. Revisa tu navegador o usa otro sin modo incógnito."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      {!user ? (
        <Button
          startIcon={loading ? null : <GoogleIcon />}
          onClick={loginWithGoogle}
          variant="outlined"
          sx={{
            color: "#c80323",
            borderColor: "#c80323",
            "&.Mui-disabled": {
              color: "#c80323",
              borderColor: "#c80323",
            },
          }}
          disabled={loading}
        >
          {loading ? "Cargando..." : "Iniciar sesión con Google"}
        </Button>
      ) : (
        <Redirect />
      )}
    </div>
  );
}
