import { Flame, Star, Target, Trophy, Zap } from "lucide-react";
import { useEffect, useState } from "react";

interface StreakCardProps {
  streak?: number;
}

export default function StreakCard({ streak = 0 }: StreakCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [prevStreak, setPrevStreak] = useState(streak);

  // Función para activar la animación cuando se actualiza la racha
  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Escuchar cambios en la prop streak para activar animación
  useEffect(() => {
    if (streak > prevStreak && streak > 0) {
      triggerAnimation();
    }
    setPrevStreak(streak);
  }, [streak, prevStreak]);

  const getStreakInfo = () => {
    if (streak >= 30)
      return {
        level: "Leyenda",
        color: "from-purple-500 to-pink-500",
        bgColor: "from-purple-50 to-pink-50",
        icon: Trophy,
        emoji: "👑",
        message: "¡Eres una leyenda!",
      };
    if (streak >= 14)
      return {
        level: "Experto",
        color: "from-orange-500 to-red-500",
        bgColor: "from-orange-50 to-red-50",
        icon: Zap,
        emoji: "⚡",
        message: "¡Hábito consolidado!",
      };
    if (streak >= 7)
      return {
        level: "Avanzado",
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50",
        icon: Flame,
        emoji: "🔥",
        message: "¡Una semana completa!",
      };
    if (streak >= 3)
      return {
        level: "En progreso",
        color: "from-blue-500 to-cyan-500",
        bgColor: "from-blue-50 to-cyan-50",
        icon: Target,
        emoji: "🎯",
        message: "¡Formando el hábito!",
      };
    if (streak > 0)
      return {
        level: "Comenzando",
        color: "from-indigo-500 to-blue-500",
        bgColor: "from-indigo-50 to-blue-50",
        icon: Star,
        emoji: "⭐",
        message: "¡Buen comienzo!",
      };
    return {
      level: "Sin racha",
      color: "from-gray-400 to-gray-500",
      bgColor: "from-gray-50 to-gray-100",
      icon: Star,
      emoji: "💪",
      message: "¡Comienza tu racha!",
    };
  };

  const getNextTarget = () => {
    if (streak >= 30) return 50;
    if (streak >= 14) return 30;
    if (streak >= 7) return 14;
    if (streak >= 3) return 7;
    return 3;
  };

  const getProgress = () => {
    const target = getNextTarget();
    if (streak >= 30) return 100; // Máximo alcanzado
    return Math.min((streak / target) * 100, 100);
  };

  const streakInfo = getStreakInfo();
  const Icon = streakInfo.icon;
  const nextTarget = getNextTarget();
  const progress = getProgress();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div
          className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${streakInfo.color} flex items-center justify-center shadow-md`}
        >
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm">Racha Diaria</h3>
          <p className="text-xs text-gray-500">{streakInfo.level}</p>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-3">
        {/* Emoji y contador */}
        <div className="flex items-center space-x-3">
          <div
            className={`text-3xl transition-transform duration-300 ${
              isAnimating ? "animate-bounce scale-110" : ""
            }`}
          >
            {streakInfo.emoji}
          </div>
          <div className="text-center">
            <div
              className={`text-3xl font-bold transition-all duration-300 ${
                isAnimating ? "text-orange-500 scale-110" : "text-gray-900"
              }`}
            >
              {streak}
            </div>
            <p className="text-xs text-gray-500 font-medium">
              {streak === 1 ? "día" : "días"}
            </p>
          </div>
        </div>

        {/* Mensaje motivacional */}
        <p className="text-center text-xs font-medium text-gray-600">
          {streakInfo.message}
        </p>

        {/* Barra de progreso (solo si no es leyenda) */}
        {streak < 30 && (
          <div className="w-full space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Siguiente nivel</span>
              <span className="text-xs text-gray-500 font-medium">
                {nextTarget} días
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${streakInfo.color} transition-all duration-700 ease-out`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 text-center">
              {nextTarget - streak} días restantes
            </p>
          </div>
        )}
      </div>

      {/* Efecto de celebración */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="text-4xl animate-ping opacity-60">✨</div>
        </div>
      )}

      {/* Background decorativo */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${streakInfo.bgColor} rounded-xl opacity-50 -z-10`}
      ></div>
    </div>
  );
}
