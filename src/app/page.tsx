"use client";

import Redirect from "@/components/Redirect";
import { auth, googleProvider } from "@/lib/firebase";
import GoogleIcon from "@mui/icons-material/Google";
import { Button } from "@mui/material";
import { signInWithPopup, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const loginWithGoogle = async () => {
    if (loading) return; // evita abrir múltiples popups
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser(result.user);
    } catch (err) {
      console.error(err);
    }
  };
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-950">
      {!user ? (
        <Button
          startIcon={loading ? null : <GoogleIcon />}
          //onClick={loginWithGoogle}
          onClick={() => router.push("/main")}
          variant="outlined"
          sx={{
            color: "#FFC0CB",
            borderColor: "white",
            "&.Mui-disabled": {
              color: "#FFC0CB",
              borderColor: "#FFC0CB",
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
