"use client";

import Redirect from "@/components/Redirect";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export default function HomePage() {
  const [user, setUser] = useState<GoogleUser | null>(null);

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID!}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
        {!user ? (
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              if (credentialResponse.credential) {
                const decoded: GoogleUser = jwtDecode(
                  credentialResponse.credential
                );
                setUser(decoded);
              }
            }}
            onError={() => {
              console.error("❌ Error al iniciar sesión con Google");
            }}
          />
        ) : (
          <Redirect />
        )}
      </div>
    </GoogleOAuthProvider>
  );
}
