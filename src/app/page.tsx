"use client";

import Redirect from "@/components/Redirect";
import { auth, googleProvider } from "@/lib/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { signInWithPopup, User } from "firebase/auth";
import { useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithGoogle = async () => {
    if (loading) return; // evita abrir múltiples popups
    setLoading(true);
    try {
      if (!auth) throw new Error("Firebase Auth no está inicializado");
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
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
