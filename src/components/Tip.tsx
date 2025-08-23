import { Brain, Heart, Lightbulb, RefreshCw, Smile, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Tip {
  title: string;
  content: string;
  icon: typeof Lightbulb;
  color: string;
}

// Tips constantes fuera del componente
const TIPS: Tip[] = [
  // Mindfulness
  {
    title: "Respira profundo",
    content: "4 segundos inhala, 4 mantén, 6 exhala. Repite 3 veces.",
    icon: Brain,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  {
    title: "5-4-3-2-1",
    content:
      "5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.",
    icon: Star,
    color: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    title: "Pausa digital",
    content: "Antes de abrir el teléfono, pregúntate: '¿Para qué?'",
    icon: Brain,
    color: "bg-purple-50 border-purple-200 text-purple-700",
  },
  // Gratitud
  {
    title: "3 gracias",
    content:
      "Al despertar, piensa en 3 cosas por las que te sientes agradecido.",
    icon: Heart,
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
  {
    title: "Nota mental",
    content:
      "Escribe mentalmente una nota de agradecimiento a alguien especial.",
    icon: Heart,
    color: "bg-rose-50 border-rose-200 text-rose-700",
  },
  {
    title: "Mejor momento",
    content: "Antes de dormir, recuerda el mejor momento del día.",
    icon: Star,
    color: "bg-amber-50 border-amber-200 text-amber-700",
  },
  // Autocuidado
  {
    title: "Hidrata consciente",
    content: "Bebe un vaso de agua despacio, siente cómo te nutre.",
    icon: Smile,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    title: "Pausa activa",
    content: "Cada hora, levántate y camina 2 minutos.",
    icon: Smile,
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    title: "Límite digital",
    content: "Pon una hora límite para redes sociales hoy.",
    icon: Brain,
    color: "bg-teal-50 border-teal-200 text-teal-700",
  },
  // Motivación
  {
    title: "2 minutos",
    content: "Elige una tarea pendiente y hazla solo por 2 minutos.",
    icon: Star,
    color: "bg-orange-50 border-orange-200 text-orange-700",
  },
  {
    title: "Celebra pequeño",
    content: "¿Hiciste la cama? ¡Genial! Cada pequeño acto cuenta.",
    icon: Smile,
    color: "bg-yellow-50 border-yellow-200 text-yellow-700",
  },
  {
    title: "Tu yo de mañana",
    content: "Pregúntate: '¿Mi yo de mañana me agradecerá esto?'",
    icon: Lightbulb,
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
];

export default function DailyTipCard() {
  const [currentTip, setCurrentTip] = useState<Tip | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Obtener tip del día
  const getTipOfTheDay = (): Tip => {
    const today = new Date();
    const dayOfYear = Math.floor(
      (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return TIPS[dayOfYear % TIPS.length];
  };

  // Obtener tip aleatorio
  const getRandomTip = () => {
    setIsLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TIPS.length);
      setCurrentTip(TIPS[randomIndex]);
      setIsLoading(false);
    }, 300);
  };

  // Cargar tip inicial
  useEffect(() => {
    setCurrentTip(getTipOfTheDay());
  }, []);

  if (!currentTip) return null;

  const IconComponent = currentTip.icon;

  return (
    <div className="flex flex-col justify-center min-h-[120px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div
            className={`p-1.5 rounded-full ${currentTip.color.split(" ")[0]} ${
              currentTip.color.split(" ")[1]
            }`}
          >
            <Lightbulb size={12} className={currentTip.color.split(" ")[2]} />
          </div>
          <h3 className="text-sm font-medium text-gray-600">Tip del día</h3>
        </div>

        <button
          onClick={getRandomTip}
          disabled={isLoading}
          className="p-1 hover:bg-gray-50 rounded-full transition-colors duration-200 cursor-pointer"
          title="Nuevo tip"
        >
          <RefreshCw
            size={12}
            className={`text-gray-400 hover:text-gray-600 transition-all duration-200 ${
              isLoading ? "animate-spin" : "hover:rotate-180"
            }`}
          />
        </button>
      </div>

      {/* Contenido */}
      <div className="flex items-start space-x-3 mb-3">
        <div className="flex-shrink-0">
          <IconComponent size={16} className={currentTip.color.split(" ")[2]} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 text-sm mb-1 leading-tight">
            {currentTip.title}
          </h4>
          <p className="text-gray-600 text-xs leading-relaxed">
            {currentTip.content}
          </p>
        </div>
      </div>

      {/* Indicador */}
      <div
        className={`h-1 rounded-full ${
          currentTip.color.split(" ")[0]
        } opacity-30`}
      ></div>
    </div>
  );
}
