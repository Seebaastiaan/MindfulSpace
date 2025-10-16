"use client";

import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/firebase";
import { Brain, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function Redirect() {
  const [progress, setProgress] = React.useState(0);
  const [loadingText, setLoadingText] = React.useState("Verificando sesión...");
  const [isAnimating] = React.useState(true);
  const router = useRouter();

  const loadingMessages = React.useMemo(
    () => [
      "Verificando sesión...",
      "Cargando tu espacio personal...",
      "Preparando tus insights...",
      "Casi listo...",
    ],
    []
  );

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let textInterval: ReturnType<typeof setInterval>;
    let messageIndex = 0;

    // Función para iniciar el proceso de carga y redirección
    const startRedirectProcess = () => {
      // Animación de texto
      textInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingText(loadingMessages[messageIndex]);
      }, 800);

      // Animación de progreso más suave
      interval = setInterval(() => {
        setProgress((prev) => {
          const increment = Math.random() * 15 + 5; // Entre 5-20
          const next = prev + increment;
          return next >= 95 ? 95 : next;
        });
      }, 150);

      // Completar carga y redirigir
      setTimeout(() => {
        clearInterval(interval);
        clearInterval(textInterval);
        setProgress(100);
        setLoadingText("¡Listo! Redirigiendo...");

        setTimeout(() => {
          router.push("/main");
        }, 500);
      }, 2000);
    };

    // Verificar estado de autenticación
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Usuario autenticado, iniciar proceso de carga
        startRedirectProcess();
      } else {
        // Usuario no autenticado, redirigir a login después de un delay
        setTimeout(() => {
          router.push("/");
        }, 100);
      }
    });

    // Si ya hay un usuario autenticado al cargar el componente
    if (auth.currentUser) {
      startRedirectProcess();
    }

    // Timeout de seguridad: si después de 10 segundos no se redirige, forzar redirección
    const safetyTimeout = setTimeout(() => {
      if (auth.currentUser) {
        // Si hay usuario, ir al main
        router.push("/main");
      } else {
        // Si no hay usuario, regresar al login
        router.push("/");
      }
    }, 10000);

    return () => {
      unsubscribe();
      if (interval) clearInterval(interval);
      if (textInterval) clearInterval(textInterval);
      clearTimeout(safetyTimeout);
    };
  }, [router, loadingMessages]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-300/10 to-indigo-300/10 rounded-full blur-3xl"></div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center space-y-8 p-8">
        {/* Logo/Icono principal */}
        <div className="relative">
          <div
            className={`
            w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl 
            flex items-center justify-center shadow-2xl transition-all duration-1000
            ${isAnimating ? "animate-pulse scale-105" : "scale-100"}
          `}
          >
            <Brain className="w-12 h-12 text-white" />
          </div>

          {/* Partículas flotantes */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-6 h-6 text-purple-400 animate-bounce" />
          </div>
          <div className="absolute -bottom-2 -left-2">
            <Sparkles
              className="w-4 h-4 text-indigo-400 animate-bounce"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </div>

        {/* Título y descripción */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            MindfulSpace
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Tu espacio personal de bienestar mental
          </p>
        </div>

        {/* Texto de carga animado */}
        <div className="text-center space-y-4">
          <p
            className={`
            text-lg font-semibold text-gray-700 transition-all duration-300 transform
            ${isAnimating ? "scale-105" : "scale-100"}
          `}
          >
            {loadingText}
          </p>
        </div>

        {/* Barra de progreso mejorada */}
        <div className="w-full max-w-md space-y-2">
          <Progress
            value={progress}
            className="h-3 bg-white/50 backdrop-blur-sm shadow-lg border border-white/20 rounded-full overflow-hidden"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>Cargando...</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </div>

        {/* Indicadores de puntos */}
        <div className="flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`
                w-3 h-3 rounded-full transition-all duration-500
                ${
                  progress > i * 33
                    ? "bg-gradient-to-r from-purple-500 to-indigo-500 scale-110"
                    : "bg-gray-300 scale-100"
                }
              `}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Mensaje de bienvenida */}
        <div className="text-center max-w-md">
          <p className="text-gray-600 text-sm leading-relaxed">
            Preparando tu dashboard personalizado con tus estadísticas de
            bienestar y progreso emocional.
          </p>
        </div>
      </div>

      {/* Elementos flotantes decorativos */}
      <div className="absolute top-20 left-20 w-2 h-2 bg-purple-400/30 rounded-full animate-ping"></div>
      <div
        className="absolute top-32 right-32 w-1 h-1 bg-indigo-400/40 rounded-full animate-ping"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-pink-400/30 rounded-full animate-ping"
        style={{ animationDelay: "2s" }}
      ></div>
      <div
        className="absolute bottom-32 right-20 w-1 h-1 bg-purple-400/40 rounded-full animate-ping"
        style={{ animationDelay: "0.5s" }}
      ></div>
    </div>
  );
}
