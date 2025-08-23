import { useEffect, useState } from "react";
interface StreakCardProps {
  streak?: number;
  onStreakUpdate?: () => void;
}
export default function StreakCard({
  streak = 0,
  onStreakUpdate,
}: StreakCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  // Función para activar la animación cuando se actualiza la racha
  const triggerAnimation = () => {
    setIsAnimating(true);

    // Reset animation después de 600ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Escuchar cambios en la prop streak para activar animación
  useEffect(() => {
    if (streak > 0) {
      triggerAnimation();
    }
  }, [streak]);

  return (
    <div className="flex flex-col justify-center">
      {/* Header con título */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">Racha</h3>
      </div>

      {/* Contenido principal */}
      <div className="flex items-center justify-center space-x-3">
        {/* Fuego animado */}
        <div className={`relative ${isAnimating ? "animate-bounce" : ""}`}>
          <div className="text-3xl transform transition-transform duration-200 hover:scale-110">
            🔥
          </div>
          {/* Efecto de brillo cuando se anima */}
          {isAnimating && (
            <div className="absolute inset-0 text-3xl animate-ping opacity-75">
              ✨
            </div>
          )}
        </div>

        {/* Contador de racha */}
        <div className="text-center">
          <div
            className={`text-2xl font-bold text-gray-800 transition-all duration-300 ${
              isAnimating ? "text-orange-500 scale-110" : ""
            }`}
          >
            {streak}
          </div>
          <div className="text-xs text-gray-500 font-medium">
            {streak === 1 ? "día" : "días"}
          </div>
        </div>
      </div>

      {/* Mensaje motivacional */}
      <div className="mt-3 text-center">
        {streak >= 7 ? (
          <p className="text-xs text-green-600 font-medium">¡Increíble! 🎉</p>
        ) : streak >= 3 ? (
          <p className="text-xs text-orange-600 font-medium">¡Vas bien! 💪</p>
        ) : streak > 0 ? (
          <p className="text-xs text-gray-500">¡Sigue así!</p>
        ) : (
          <p className="text-xs text-gray-400">Comienza tu racha</p>
        )}
      </div>
    </div>
  );
}
