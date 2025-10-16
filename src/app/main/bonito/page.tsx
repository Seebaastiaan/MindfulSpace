"use client";

import Cards from "@/components/Cards";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Activity,
  BarChart3,
  Brain,
  Heart,
  Moon,
  PieChart,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DiaryEntry {
  fecha: {
    seconds: number;
  };
  contenido: string;
  sentimientos?: string;
  mood?: string;
}

interface EmotionData {
  emotion: string;
  count: number;
  color: string;
  icon: string;
}

interface StreakData {
  current: number;
  longest: number;
  totalDays: number;
}

function Bonito() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalEntries, setTotalEntries] = useState(0);
  // Estados para el modal de eliminación
  const [deleteHistoryOpen, setDeleteHistoryOpen] = useState(false);
  const [deletingHistory, setDeletingHistory] = useState(false);
  const [emotionData, setEmotionData] = useState<EmotionData[]>([
    {
      emotion: "Reflexión",
      count: 35,
      color: "from-purple-400 to-indigo-500",
      icon: "🤔",
    },
    {
      emotion: "Calma",
      count: 25,
      color: "from-blue-400 to-cyan-500",
      icon: "😌",
    },
    {
      emotion: "Motivación",
      count: 20,
      color: "from-green-400 to-emerald-500",
      icon: "💪",
    },
    {
      emotion: "Alegría",
      count: 15,
      color: "from-yellow-400 to-orange-500",
      icon: "😊",
    },
    {
      emotion: "Gratitud",
      count: 5,
      color: "from-pink-400 to-rose-500",
      icon: "🙏",
    },
  ]);
  const [streakData, setStreakData] = useState<StreakData>({
    current: 0,
    longest: 0,
    totalDays: 0,
  });
  const [hasEnoughData, setHasEnoughData] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(0);
  const [writingPatterns, setWritingPatterns] = useState({
    timePattern: "Variado",
    positivity: 75,
    frequentWord: "vida",
  });

  const calculateStreak = useCallback((entries: DiaryEntry[]) => {
    if (entries.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;

    // Convertir las entradas a fechas y ordenar
    const entryDates = entries
      .map((entry) => {
        const entryDate = new Date(entry.fecha.seconds * 1000);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate;
      })
      .sort((a, b) => b.getTime() - a.getTime()); // Más reciente primero

    // Eliminar duplicados (mismo día)
    const uniqueDates = entryDates.filter(
      (date, index, arr) =>
        index === 0 || date.getTime() !== arr[index - 1].getTime()
    );

    // Verificar si hay entrada hoy
    const hasEntryToday = uniqueDates.some(
      (date) => date.getTime() === today.getTime()
    );

    // Empezar desde hoy o ayer dependiendo de si hay entrada hoy
    let checkDate = hasEntryToday
      ? today.getTime()
      : today.getTime() - 24 * 60 * 60 * 1000;

    // Contar días consecutivos hacia atrás
    for (let i = 0; i < uniqueDates.length; i++) {
      if (uniqueDates[i].getTime() === checkDate) {
        streak++;
        checkDate -= 24 * 60 * 60 * 1000; // Retroceder un día
      } else {
        break;
      }
    }

    return streak;
  }, []);

  const calculateLongestStreak = useCallback((entries: DiaryEntry[]) => {
    if (entries.length === 0) return 0;

    const entryDates = entries
      .map((entry) => {
        const entryDate = new Date(entry.fecha.seconds * 1000);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate;
      })
      .sort((a, b) => a.getTime() - b.getTime()); // Más antigua primero

    // Eliminar duplicados
    const uniqueDates = entryDates.filter(
      (date, index, arr) =>
        index === 0 || date.getTime() !== arr[index - 1].getTime()
    );

    let longestStreak = 0;
    let currentStreak = 1;

    for (let i = 1; i < uniqueDates.length; i++) {
      const dayDiff =
        (uniqueDates[i].getTime() - uniqueDates[i - 1].getTime()) /
        (24 * 60 * 60 * 1000);

      if (dayDiff === 1) {
        currentStreak++;
      } else {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    }

    return Math.max(longestStreak, currentStreak);
  }, []);

  const analyzeEmotions = useCallback(
    (entries: DiaryEntry[]): EmotionData[] => {
      if (entries.length === 0) return [];

      // Palabras clave para detectar emociones
      const emotionKeywords = {
        alegria: [
          "alegre",
          "feliz",
          "contento",
          "alegría",
          "felicidad",
          "gozo",
          "sonrisa",
          "risa",
          "disfruté",
          "genial",
          "excelente",
          "increíble",
          "maravilloso",
        ],
        calma: [
          "tranquilo",
          "paz",
          "sereno",
          "relajado",
          "calma",
          "pacífico",
          "silencio",
          "meditación",
          "respiro",
          "sosiego",
        ],
        motivacion: [
          "motivado",
          "energía",
          "fuerza",
          "lograr",
          "objetivo",
          "meta",
          "conseguir",
          "éxito",
          "determinado",
          "enfocado",
        ],
        reflexion: [
          "pienso",
          "reflexión",
          "meditar",
          "considerar",
          "analizar",
          "entender",
          "comprender",
          "darme cuenta",
          "perspectiva",
        ],
        gratitud: [
          "agradecido",
          "gracias",
          "bendecido",
          "afortunado",
          "valorar",
          "apreciar",
          "reconocer",
          "gratitud",
        ],
      };

      const emotionCounts = {
        alegria: 0,
        calma: 0,
        motivacion: 0,
        reflexion: 0,
        gratitud: 0,
      };

      // Analizar cada entrada
      entries.forEach((entry) => {
        const content = (entry.contenido || "").toLowerCase();
        const sentimientos = (entry.sentimientos || "").toLowerCase();
        const fullText = `${content} ${sentimientos}`;

        Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
          const count = keywords.reduce((acc, keyword) => {
            const regex = new RegExp(keyword, "gi");
            const matches = fullText.match(regex);
            return acc + (matches ? matches.length : 0);
          }, 0);
          emotionCounts[emotion as keyof typeof emotionCounts] += count;
        });
      });

      const total = Object.values(emotionCounts).reduce(
        (sum, count) => sum + count,
        0
      );

      if (total === 0) {
        // Si no se encuentran palabras clave, devolver distribución basada en la longitud del texto
        return [
          {
            emotion: "Reflexión",
            count: 35,
            color: "from-purple-400 to-indigo-500",
            icon: "🤔",
          },
          {
            emotion: "Calma",
            count: 25,
            color: "from-blue-400 to-cyan-500",
            icon: "😌",
          },
          {
            emotion: "Motivación",
            count: 20,
            color: "from-green-400 to-emerald-500",
            icon: "💪",
          },
          {
            emotion: "Alegría",
            count: 15,
            color: "from-yellow-400 to-orange-500",
            icon: "😊",
          },
          {
            emotion: "Gratitud",
            count: 5,
            color: "from-pink-400 to-rose-500",
            icon: "🙏",
          },
        ];
      }

      const emotionData: EmotionData[] = [
        {
          emotion: "Alegría",
          count: Math.max(1, Math.round((emotionCounts.alegria / total) * 100)),
          color: "from-yellow-400 to-orange-500",
          icon: "😊",
        },
        {
          emotion: "Calma",
          count: Math.max(1, Math.round((emotionCounts.calma / total) * 100)),
          color: "from-blue-400 to-cyan-500",
          icon: "😌",
        },
        {
          emotion: "Motivación",
          count: Math.max(
            1,
            Math.round((emotionCounts.motivacion / total) * 100)
          ),
          color: "from-green-400 to-emerald-500",
          icon: "💪",
        },
        {
          emotion: "Reflexión",
          count: Math.max(
            1,
            Math.round((emotionCounts.reflexion / total) * 100)
          ),
          color: "from-purple-400 to-indigo-500",
          icon: "🤔",
        },
        {
          emotion: "Gratitud",
          count: Math.max(
            1,
            Math.round((emotionCounts.gratitud / total) * 100)
          ),
          color: "from-pink-400 to-rose-500",
          icon: "🙏",
        },
      ];

      // Asegurar que la suma sea 100%
      const currentSum = emotionData.reduce((sum, e) => sum + e.count, 0);
      if (currentSum !== 100) {
        const difference = 100 - currentSum;
        emotionData[0].count += difference;
      }

      return emotionData.sort((a, b) => b.count - a.count);
    },
    []
  );

  const analyzeWritingPatterns = useCallback((entries: DiaryEntry[]) => {
    if (entries.length === 0)
      return { timePattern: "", positivity: 0, frequentWord: "" };

    // Analizar patrones de tiempo
    const morningEntries = entries.filter((entry) => {
      const hour = new Date(entry.fecha.seconds * 1000).getHours();
      return hour >= 6 && hour < 12;
    });

    const afternoonEntries = entries.filter((entry) => {
      const hour = new Date(entry.fecha.seconds * 1000).getHours();
      return hour >= 12 && hour < 18;
    });

    const nightEntries = entries.filter((entry) => {
      const hour = new Date(entry.fecha.seconds * 1000).getHours();
      return hour >= 18 || hour < 6;
    });

    let timePattern = "Variado";
    if (
      morningEntries.length > afternoonEntries.length &&
      morningEntries.length > nightEntries.length
    ) {
      timePattern = "Mañanas Positivas";
    } else if (
      nightEntries.length > morningEntries.length &&
      nightEntries.length > afternoonEntries.length
    ) {
      timePattern = "Noches Contemplativas";
    }

    // Analizar positividad
    const positiveWords = [
      "bien",
      "mejor",
      "feliz",
      "alegre",
      "genial",
      "excelente",
      "gracias",
      "logré",
      "conseguí",
    ];
    const negativeWords = [
      "mal",
      "triste",
      "difícil",
      "problema",
      "preocupado",
      "stress",
      "cansado",
    ];

    let positiveCount = 0;
    let negativeCount = 0;

    entries.forEach((entry) => {
      // Si 'entry' o 'entry.contenido' son undefined, 'content' será una cadena vacía ('').
      // De esta forma, .toLowerCase() se llama sobre una cadena válida, no sobre undefined.
      const content = (entry?.contenido ?? "").toLowerCase();

      positiveWords.forEach((word) => {
        if (content.includes(word)) positiveCount++;
      });
      negativeWords.forEach((word) => {
        if (content.includes(word)) negativeCount++;
      });
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const positivity =
      totalSentimentWords > 0
        ? Math.round((positiveCount / totalSentimentWords) * 100)
        : 75;

    // Encontrar palabra más frecuente
    const allText = entries
      .map((e) => e?.contenido ?? "")
      .join(" ")
      .toLowerCase();
    const words = allText.split(/\s+/).filter((word) => word.length > 3);
    const wordCount: { [key: string]: number } = {};

    words.forEach((word) => {
      wordCount[word] = (wordCount[word] || 0) + 1;
    });

    const frequentWord =
      Object.entries(wordCount).sort(([, a], [, b]) => b - a)[0]?.[0] || "vida";

    return { timePattern, positivity, frequentWord };
  }, []);

  const calculateWellnessScore = useCallback(
    (entries: DiaryEntry[], currentStreak: number) => {
      if (entries.length === 0) return 0;

      let score = 50; // Base score

      // Puntuación por consistencia (racha)
      score += Math.min(currentStreak * 5, 25);

      // Puntuación por frecuencia de escritura
      const daysWithEntries = new Set(
        entries.map((entry) => {
          const date = new Date(entry.fecha.seconds * 1000);
          return date.toDateString();
        })
      ).size;

      const daysSinceFirst =
        entries.length > 0
          ? (Date.now() - entries[entries.length - 1].fecha.seconds * 1000) /
            (24 * 60 * 60 * 1000)
          : 1;

      const frequency = daysWithEntries / Math.max(daysSinceFirst, 1);
      score += Math.min(frequency * 20, 20);

      // Puntuación por longitud promedio de entradas (engagement)
      const avgLength =
        entries.reduce(
          (sum, entry) => sum + (entry?.contenido?.length ?? 0),
          0
        ) / entries.length;
      if (avgLength > 200) score += 5;
      if (avgLength > 500) score += 5;

      return Math.min(Math.round(score), 100);
    },
    []
  );

  const loadInsightsData = useCallback(
    async (userId: string) => {
      try {
        // Cargar entradas del diario
        const diaryRef = collection(db, "users", userId, "diario");
        const diaryQuery = query(diaryRef, orderBy("fecha", "desc"));
        const snapshot = await getDocs(diaryQuery);

        const entries = snapshot.size;
        setTotalEntries(entries);
        setHasEnoughData(entries >= 3);

        if (entries >= 3) {
          // Obtener datos reales de las entradas
          const allEntries = snapshot.docs.map((doc) =>
            doc.data()
          ) as DiaryEntry[];

          // Calcular datos reales de racha
          const currentStreak = calculateStreak(allEntries);
          const longestStreak = calculateLongestStreak(allEntries);

          setStreakData({
            current: currentStreak,
            longest: longestStreak,
            totalDays: entries,
          });

          // Analizar emociones reales
          const realEmotionData = analyzeEmotions(allEntries);
          setEmotionData(realEmotionData);

          // Analizar patrones de escritura
          const patterns = analyzeWritingPatterns(allEntries);
          setWritingPatterns(patterns);

          // Calcular puntuación de bienestar
          const wellness = calculateWellnessScore(allEntries, currentStreak);
          setWellnessScore(wellness);
        }
      } catch (error) {
        console.error("Error cargando insights:", error);
      }
    },
    [
      calculateStreak,
      calculateLongestStreak,
      analyzeEmotions,
      analyzeWritingPatterns,
      calculateWellnessScore,
    ]
  );

  // Función para eliminar todo el historial de análisis
  const handleDeleteHistory = () => {
    setDeleteHistoryOpen(true);
  };

  // Función para confirmar eliminación del historial
  const confirmDeleteHistory = async () => {
    if (!user) return;

    try {
      setDeletingHistory(true);

      // Eliminar todas las entradas del diario
      const diaryRef = collection(db, "users", user.uid, "diario");
      const snapshot = await getDocs(diaryRef);

      // Eliminar cada entrada
      const deletePromises = snapshot.docs.map((docSnapshot) =>
        deleteDoc(doc(db, "users", user.uid, "diario", docSnapshot.id))
      );

      await Promise.all(deletePromises);

      // Resetear todos los estados a valores iniciales
      setTotalEntries(0);
      setHasEnoughData(false);
      setStreakData({
        current: 0,
        longest: 0,
        totalDays: 0,
      });
      setEmotionData([
        {
          emotion: "Reflexión",
          count: 35,
          color: "from-purple-400 to-indigo-500",
          icon: "🤔",
        },
        {
          emotion: "Calma",
          count: 25,
          color: "from-blue-400 to-cyan-500",
          icon: "😌",
        },
        {
          emotion: "Motivación",
          count: 20,
          color: "from-green-400 to-emerald-500",
          icon: "💪",
        },
        {
          emotion: "Alegría",
          count: 15,
          color: "from-yellow-400 to-orange-500",
          icon: "😊",
        },
        {
          emotion: "Gratitud",
          count: 5,
          color: "from-pink-400 to-rose-500",
          icon: "🙏",
        },
      ]);
      setWellnessScore(0);
      setWritingPatterns({
        timePattern: "Variado",
        positivity: 75,
        frequentWord: "vida",
      });

      // Cerrar modal
      setDeleteHistoryOpen(false);
    } catch (error) {
      console.error("Error al eliminar historial:", error);
      alert("Error al eliminar el historial. Por favor, intenta de nuevo.");
    } finally {
      setDeletingHistory(false);
    }
  };

  // Función para cancelar eliminación
  const cancelDeleteHistory = () => {
    setDeleteHistoryOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadInsightsData(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadInsightsData]);

  const insights = [
    {
      title: "Patrón Dominante",
      value: writingPatterns.timePattern,
      description: writingPatterns.timePattern.includes("Mañanas")
        ? "Tiendes a escribir con más optimismo por las mañanas"
        : writingPatterns.timePattern.includes("Noches")
        ? "Tus entradas nocturnas muestran mayor introspección"
        : "Escribes en diferentes momentos del día",
      icon: writingPatterns.timePattern.includes("Mañanas")
        ? Sun
        : writingPatterns.timePattern.includes("Noches")
        ? Moon
        : Target,
      color: "from-yellow-400 to-orange-500",
    },
    {
      title: "Momento Reflexivo",
      value: writingPatterns.timePattern.includes("Noches")
        ? "Noches Contemplativas"
        : "Reflexión Constante",
      description:
        "Tus entradas muestran un buen nivel de introspección personal",
      icon: Moon,
      color: "from-indigo-400 to-purple-500",
    },
    {
      title: "Progreso Emocional",
      value: `${writingPatterns.positivity}% Positividad`,
      description:
        writingPatterns.positivity >= 70
          ? "Excelente nivel de bienestar emocional en tus escritos"
          : writingPatterns.positivity >= 50
          ? "Buen equilibrio emocional en tus reflexiones"
          : "Hay espacio para mejorar el bienestar emocional",
      icon: TrendingUp,
      color: "from-green-400 to-emerald-500",
    },
    {
      title: "Palabra Frecuente",
      value:
        writingPatterns.frequentWord.charAt(0).toUpperCase() +
        writingPatterns.frequentWord.slice(1),
      description: `"${writingPatterns.frequentWord}" es un tema recurrente en tus reflexiones`,
      icon: Heart,
      color: "from-pink-400 to-rose-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!hasEnoughData) {
    return (
      <div className="space-y-6">
        <Cards variant="glass" className="text-center p-12">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Insights Emocionales con IA
          </h1>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Descubre patrones profundos en tus emociones, tendencias de
            bienestar y recomendaciones personalizadas basadas en tu diario
            personal.
          </p>

          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-700">
                  Progreso para Insights
                </span>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                  {totalEntries}/3 entradas
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
                <div
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 h-4 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((totalEntries / 3) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>

            <p className="text-gray-600 mb-6">
              {totalEntries === 0
                ? "🌟 Comienza escribiendo en tu diario para generar insights"
                : `✨ Solo ${3 - totalEntries} entrada${
                    3 - totalEntries !== 1 ? "s" : ""
                  } más para activar los insights`}
            </p>

            <button
              onClick={() => (window.location.href = "/main/diario")}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              📝 Ir al Diario
            </button>
          </div>
        </Cards>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Cards variant="glass">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tus Insights Emocionales
              </h1>
              <p className="text-gray-600">
                Análisis inteligente de tu bienestar mental
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteHistory}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            title="Eliminar historial completo"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            <span>Eliminar Historial</span>
          </button>
        </div>
      </Cards>

      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Cards variant="bordered" className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalEntries}</p>
          <p className="text-gray-600 text-sm">Entradas Analizadas</p>
        </Cards>

        <Cards variant="bordered" className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {streakData.current}
          </p>
          <p className="text-gray-600 text-sm">Días de Racha Actual</p>
        </Cards>

        <Cards variant="bordered" className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{wellnessScore}%</p>
          <p className="text-gray-600 text-sm">Puntuación de Bienestar</p>
        </Cards>
      </div>

      {/* Análisis de emociones */}
      <Cards variant="gradient">
        <div className="flex items-center space-x-3 mb-6">
          <PieChart className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Distribución Emocional
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emotionData.map((emotion, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{emotion.icon}</span>
                  <span className="font-semibold text-gray-900">
                    {emotion.emotion}
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-600">
                  {emotion.count}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${emotion.color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${emotion.count}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Cards>

      {/* Insights personalizados */}
      <Cards variant="glass">
        <div className="flex items-center space-x-3 mb-6">
          <Sparkles className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Insights Personalizados
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div
                key={index}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-2xl flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-lg font-bold text-gray-800 mb-2">
                      {insight.value}
                    </p>
                    <p className="text-sm text-gray-600">
                      {insight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Cards>

      {/* Recomendaciones */}
      <Cards variant="bordered" className="mb-16">
        <div className="flex items-center space-x-3 mb-6">
          <Zap className="w-6 h-6 text-yellow-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Recomendaciones para ti
          </h2>
        </div>

        <div className="space-y-4">
          {/* Recomendación basada en patrón de tiempo */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">
                {writingPatterns.timePattern.includes("Mañanas")
                  ? "🌅"
                  : writingPatterns.timePattern.includes("Noches")
                  ? "🌙"
                  : "⏰"}
              </span>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">
                  {writingPatterns.timePattern.includes("Mañanas")
                    ? "Mantén tus rutinas matutinas"
                    : writingPatterns.timePattern.includes("Noches")
                    ? "Aprovecha tus momentos nocturnos"
                    : "Establece un horario consistente"}
                </h4>
                <p className="text-yellow-700 text-sm">
                  {writingPatterns.timePattern.includes("Mañanas")
                    ? "Tus entradas muestran mayor positividad cuando escribes por las mañanas. ¡Sigue así!"
                    : writingPatterns.timePattern.includes("Noches")
                    ? "Tus reflexiones nocturnas son profundas y valiosas. Continúa con esta práctica."
                    : "Establecer un horario regular te ayudará a mantener la consistencia."}
                </p>
              </div>
            </div>
          </div>

          {/* Recomendación basada en bienestar */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">
                {wellnessScore >= 80 ? "🎯" : wellnessScore >= 60 ? "💪" : "🧘"}
              </span>
              <div>
                <h4 className="font-semibold text-green-800 mb-1">
                  {wellnessScore >= 80
                    ? "Mantén tu excelente bienestar"
                    : wellnessScore >= 60
                    ? "Continúa fortaleciendo tu bienestar"
                    : "Explora técnicas de mindfulness"}
                </h4>
                <p className="text-green-700 text-sm">
                  {wellnessScore >= 80
                    ? "Tu puntuación de bienestar es excelente. Sigue con tus prácticas actuales."
                    : wellnessScore >= 60
                    ? "Vas por buen camino. Considera añadir más prácticas de autocuidado."
                    : "Podrías beneficiarte de ejercicios de respiración y técnicas de relajación."}
                </p>
              </div>
            </div>
          </div>

          {/* Recomendación basada en consistencia */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
            <div className="flex items-start space-x-3">
              <span className="text-2xl">
                {streakData.current >= 7
                  ? "🏆"
                  : streakData.current >= 3
                  ? "📚"
                  : "🎯"}
              </span>
              <div>
                <h4 className="font-semibold text-blue-800 mb-1">
                  {streakData.current >= 7
                    ? "¡Excelente consistencia!"
                    : streakData.current >= 3
                    ? "Continúa con tu práctica"
                    : "Enfócate en la consistencia"}
                </h4>
                <p className="text-blue-700 text-sm">
                  {streakData.current >= 7
                    ? `Llevas ${streakData.current} días consecutivos. Esta consistencia está impactando positivamente tu bienestar.`
                    : streakData.current >= 3
                    ? `Vas ${streakData.current} días consecutivos. Intenta llegar a una semana completa.`
                    : "La escritura regular fortalece el hábito. Intenta escribir un poco cada día."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Cards>

      {/* Modal de confirmación para eliminar historial */}
      <Dialog open={deleteHistoryOpen} onOpenChange={setDeleteHistoryOpen}>
        <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 max-w-md mx-auto">
          <DialogHeader className="text-center pb-4">
            <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
              ¿Eliminar todo el historial?
            </DialogTitle>
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
          </DialogHeader>

          <div className="text-center space-y-4">
            <p className="text-gray-600">
              Esta acción eliminará{" "}
              <strong>todas las entradas de tu diario</strong> y reseteará
              completamente tu historial de análisis emocional.
            </p>

            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <p className="text-yellow-800 text-sm font-medium mb-1">
                ⚠️ Advertencia
              </p>
              <p className="text-yellow-700 text-sm">
                Se eliminarán {totalEntries} entrada
                {totalEntries !== 1 ? "s" : ""} del diario, tu racha actual de{" "}
                {streakData.current} día{streakData.current !== 1 ? "s" : ""}, y
                todos los insights generados.
              </p>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                onClick={cancelDeleteHistory}
                disabled={deletingHistory}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeleteHistory}
                disabled={deletingHistory}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {deletingHistory ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Eliminando...</span>
                  </>
                ) : (
                  <span>Eliminar Todo</span>
                )}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Bonito;
