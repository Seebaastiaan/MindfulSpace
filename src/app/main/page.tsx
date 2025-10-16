"use client";

import LogoutButton from "@/components/LogOut";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import {
  ArrowRight,
  BookOpen,
  Coffee,
  Heart,
  MessageCircle,
  Moon,
  Sparkles,
  Sun,
  Target,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface DiaryEntry {
  fecha: {
    seconds: number;
  };
}

export default function MainPage() {
  const [user, setUser] = useState<User | null>(null);
  const [totalEntries, setTotalEntries] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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

  const loadUserStats = useCallback(
    async (userId: string) => {
      try {
        // Cargar total de entradas del diario
        const diaryRef = collection(db, "users", userId, "diario");
        const diaryQuery = query(diaryRef, orderBy("fecha", "desc"));
        const snapshot = await getDocs(diaryQuery);

        const entries = snapshot.docs.map((doc) => doc.data()) as DiaryEntry[];
        setTotalEntries(entries.length);

        // Calcular la racha actual basada en las entradas reales
        const streak = calculateStreak(entries);
        setCurrentStreak(streak);
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    },
    [calculateStreak]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await loadUserStats(currentUser.uid);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [loadUserStats]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Buenos días", icon: Sun };
    if (hour < 18) return { text: "Buenas tardes", icon: Coffee };
    return { text: "Buenas noches", icon: Moon };
  };

  const quickActions = [
    {
      title: "Escribir en mi Diario",
      description: "Reflexiona sobre tu día",
      icon: BookOpen,
      color: "from-purple-500 to-indigo-500",
      path: "/main/diario",
      disabled: false,
    },
    {
      title: "Chat de Apoyo",
      description: "Habla con tu asistente emocional",
      icon: MessageCircle,
      color: "from-green-500 to-emerald-500",
      path: "/main/chat",
      disabled: false,
    },
    {
      title: "Ver mis Insights",
      description: "Analiza tus patrones emocionales",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      path: "/main/bonito",
      disabled: totalEntries < 3,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  return (
    <div className="space-y-6">
      {/* Header con saludo */}
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
              <GreetingIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-gray-600 text-sm">{greeting.text}</p>
              <h1 className="text-2xl font-bold text-gray-900">
                {user?.displayName?.split(" ")[0] || "Usuario"}
              </h1>
              <p className="text-gray-500 text-sm">¿Cómo te sientes hoy?</p>
            </div>
          </div>

          <div className="hidden sm:block">
            <LogoutButton />
          </div>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-blue-600 text-sm font-medium">
                Entradas del Diario
              </p>
              <p className="text-2xl font-bold text-blue-900">{totalEntries}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-green-600 text-sm font-medium">Racha Actual</p>
              <p className="text-2xl font-bold text-green-900">
                {currentStreak} días
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-purple-600 text-sm font-medium">
                Progreso Emocional
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {totalEntries >= 3 ? "Activo" : "Nuevo"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold text-gray-900">Acciones Rápidas</h2>
          <Sparkles className="w-5 h-5 text-indigo-500" />
        </div>

        <div className="space-y-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={() => !action.disabled && router.push(action.path)}
                disabled={action.disabled}
                className={`
                  w-full p-6 rounded-2xl shadow-lg border transition-all duration-300 text-left group
                  ${
                    action.disabled
                      ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                      : "bg-white/80 backdrop-blur-sm border-white/50 hover:shadow-xl hover:scale-[1.02] cursor-pointer"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`
                      w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300
                      ${
                        action.disabled
                          ? "bg-gray-200"
                          : `bg-gradient-to-r ${action.color} group-hover:scale-110`
                      }
                    `}
                    >
                      <Icon
                        className={`w-7 h-7 ${
                          action.disabled ? "text-gray-400" : "text-white"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          action.disabled ? "text-gray-400" : "text-gray-900"
                        }`}
                      >
                        {action.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          action.disabled ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {action.disabled
                          ? "Necesitas 3+ entradas para activar"
                          : action.description}
                      </p>
                    </div>
                  </div>

                  {!action.disabled && (
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all duration-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tip motivacional */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-6 text-white">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Tip del día</h3>
            <p className="text-white/90 leading-relaxed">
              La reflexión diaria es una herramienta poderosa para el
              autoconocimiento. Dedica unos minutos cada día a escribir sobre
              tus pensamientos y emociones.
            </p>
          </div>
        </div>
      </div>

      {/* Botón de logout para móvil */}
      <div className="sm:hidden">
        <LogoutButton />
      </div>
    </div>
  );
}
