import { Brain, Heart, Lightbulb, RefreshCw, Smile, Star } from "lucide-react";
import { useEffect, useState } from "react";

interface Tip {
  title: string;
  content: string;
  icon: typeof Lightbulb;
  category: string;
  gradient: string;
}

// Tips constantes fuera del componente
const TIPS: Tip[] = [
  // Mindfulness
  {
    title: "Respiración 4-7-8",
    content:
      "Inhala 4 segundos, mantén 7, exhala 8. Perfecto para calmar la ansiedad.",
    icon: Brain,
    category: "Mindfulness",
    gradient: "from-purple-400 to-indigo-500",
  },
  {
    title: "Técnica 5-4-3-2-1",
    content:
      "Conecta con el presente: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas.",
    icon: Star,
    category: "Mindfulness",
    gradient: "from-indigo-400 to-purple-500",
  },
  {
    title: "Pausa consciente",
    content:
      "Antes de revisar tu teléfono, toma 3 respiraciones profundas y pregúntate qué necesitas realmente.",
    icon: Brain,
    category: "Mindfulness",
    gradient: "from-teal-400 to-blue-500",
  },
  // Gratitud
  {
    title: "Tres bendiciones",
    content:
      "Cada mañana, identifica 3 cosas por las que te sientes genuinamente agradecido hoy.",
    icon: Heart,
    category: "Gratitud",
    gradient: "from-rose-400 to-pink-500",
  },
  {
    title: "Carta mental",
    content:
      "Escribe mentalmente una nota de agradecimiento a alguien que haya impactado positivamente tu vida.",
    icon: Heart,
    category: "Gratitud",
    gradient: "from-pink-400 to-rose-500",
  },
  {
    title: "Momento dorado",
    content:
      "Antes de dormir, revive el mejor momento del día con todos los detalles sensoriales.",
    icon: Star,
    category: "Gratitud",
    gradient: "from-amber-400 to-orange-500",
  },
  // Autocuidado
  {
    title: "Hidratación mindful",
    content:
      "Bebe agua lentamente, sintiendo cómo cada sorbo nutre tu cuerpo y energiza tu mente.",
    icon: Smile,
    category: "Autocuidado",
    gradient: "from-blue-400 to-cyan-500",
  },
  {
    title: "Micro-movimiento",
    content:
      "Cada hora, levántate y haz 10 estiramientos suaves. Tu cuerpo y mente te lo agradecerán.",
    icon: Smile,
    category: "Autocuidado",
    gradient: "from-green-400 to-emerald-500",
  },
  {
    title: "Desintoxicación digital",
    content:
      "Establece 30 minutos libres de pantallas antes de dormir para mejorar tu descanso.",
    icon: Brain,
    category: "Autocuidado",
    gradient: "from-violet-400 to-purple-500",
  },
  // Motivación
  {
    title: "Regla de los 2 minutos",
    content:
      "Si algo toma menos de 2 minutos, hazlo ahora. Si toma más, programa cuándo lo harás.",
    icon: Star,
    category: "Productividad",
    gradient: "from-orange-400 to-red-500",
  },
  {
    title: "Celebra lo pequeño",
    content:
      "Reconoce cada pequeño logro del día. Cada paso cuenta en tu crecimiento personal.",
    icon: Smile,
    category: "Motivación",
    gradient: "from-yellow-400 to-orange-500",
  },
  {
    title: "Yo futuro",
    content:
      "En cada decisión pregúntate: '¿Mi yo de mañana me agradecerá esta elección?'",
    icon: Lightbulb,
    category: "Reflexión",
    gradient: "from-emerald-400 to-teal-500",
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
    }, 400);
  };

  // Cargar tip inicial
  useEffect(() => {
    setCurrentTip(getTipOfTheDay());
  }, []);

  if (!currentTip) return null;

  const IconComponent = currentTip.icon;

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${currentTip.gradient} opacity-5 rounded-xl`}
      ></div>

      <div className="relative p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-xl bg-gradient-to-r ${currentTip.gradient} flex items-center justify-center`}
            >
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900">Tip del Día</h3>
          </div>

          <button
            onClick={getRandomTip}
            disabled={isLoading}
            className="p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 cursor-pointer group"
            title="Nuevo tip"
          >
            <RefreshCw
              className={`w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-300 ${
                isLoading ? "animate-spin" : "group-hover:rotate-180"
              }`}
            />
          </button>
        </div>

        {/* Contenido */}
        <div className="space-y-3">
          {/* Category badge */}
          <div
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${currentTip.gradient} text-white`}
          >
            {currentTip.category}
          </div>

          <div className="flex items-start space-x-3">
            <div
              className={`w-10 h-10 rounded-2xl bg-gradient-to-r ${currentTip.gradient} flex items-center justify-center flex-shrink-0`}
            >
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 space-y-2">
              <h4 className="font-bold text-gray-900 leading-tight">
                {currentTip.title}
              </h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentTip.content}
              </p>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 flex space-x-1">
          {TIPS.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                TIPS.indexOf(currentTip) === index
                  ? `bg-gradient-to-r ${currentTip.gradient} w-6`
                  : "bg-gray-200 w-2"
              }`}
            />
          ))}
        </div>

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-r ${currentTip.gradient} animate-pulse`}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
