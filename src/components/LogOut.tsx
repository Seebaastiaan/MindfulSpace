"use client";

import { auth } from "@/lib/firebase";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth); // Cierra sesión en Firebase
      router.push("/"); // Redirige a la ruta vacía o login
    } catch (err) {
      console.error("Error cerrando sesión:", err);
      alert("No se pudo cerrar sesión. Intenta de nuevo.");
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      size="small"
      onClick={handleLogout}
    >
      Cerrar sesión
    </Button>
  );
}
