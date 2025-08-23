// pages/Diario.tsx - Versión integrada con análisis de sentimientos (CORREGIDA)
"use client";
import Button from "@/components/Button";
import Cards from "@/components/Cards";
import StreakCard from "@/components/Streak";
import DailyTipCard from "@/components/Tip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import WeeklyEmotionsExample from "@/components/WeeklyEmotions";
import { auth, db } from "@/lib/firebase";
import Typography from "@mui/material/Typography";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

function Diario() {
  const [user, setUser] = useState<User | null>(null);
  const [texto, setTexto] = useState("");
  const [cargando, setCargando] = useState(false);
  const [preguntaActual, setPreguntaActual] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [lastEntryDate, setLastEntryDate] = useState<string | null>(null);
  const [hasWrittenTodayState, setHasWrittenTodayState] = useState(false);
  const [checkingTodayEntry, setCheckingTodayEntry] = useState(true);

  // Nuevos estados para análisis de sentimientos
  const [totalEntries, setTotalEntries] = useState(0);
  const [canAnalyzeEmotions, setCanAnalyzeEmotions] = useState(false);

  // Función unificada para cargar todos los datos del usuario
  const loadUserData = useCallback(async (userId: string) => {
    try {
      setCheckingTodayEntry(true);

      // Cargar en paralelo: racha, estadísticas y verificar entrada de hoy
      const [, , todayEntryExists] = await Promise.all([
        loadStreakData(userId),
        loadDiaryStats(userId),
        checkIfWroteToday(userId),
      ]);

      setHasWrittenTodayState(todayEntryExists);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setCheckingTodayEntry(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Resetear estados cuando cambia de usuario
        setCurrentStreak(0);
        setLastEntryDate(null);
        setHasWrittenTodayState(false);
        setTotalEntries(0);
        setCanAnalyzeEmotions(false);
        setCheckingTodayEntry(true);

        // Cargar datos del usuario actual
        loadUserData(currentUser.uid);
      } else {
        // Limpiar estados cuando no hay usuario
        setCurrentStreak(0);
        setLastEntryDate(null);
        setHasWrittenTodayState(false);
        setTotalEntries(0);
        setCanAnalyzeEmotions(false);
        setCheckingTodayEntry(false);
      }
    });
    return () => unsubscribe();
  }, [loadUserData]);

  // Verificar si el usuario escribió hoy en la base de datos
  const checkIfWroteToday = async (userId: string): Promise<boolean> => {
    try {
      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const diaryRef = collection(db, "users", userId, "diario");
      const todayQuery = query(
        diaryRef,
        where("fecha", ">=", startOfDay),
        where("fecha", "<", endOfDay),
        limit(1)
      );

      const snapshot = await getDocs(todayQuery);
      return !snapshot.empty;
    } catch (error) {
      console.error("Error al verificar entrada de hoy:", error);
      return false;
    }
  };

  // Cargar estadísticas del diario
  const loadDiaryStats = async (userId: string) => {
    try {
      const diaryRef = collection(db, "users", userId, "diario");
      const diaryQuery = query(diaryRef, orderBy("fecha", "desc"));
      const snapshot = await getDocs(diaryQuery);

      const entriesCount = snapshot.size;
      setTotalEntries(entriesCount);
      setCanAnalyzeEmotions(entriesCount >= 3); // Mínimo 3 entradas para análisis

      return entriesCount;
    } catch (error) {
      console.error("Error al cargar estadísticas:", error);
      return 0;
    }
  };

  // Cargar datos de racha desde Firestore
  const loadStreakData = async (userId: string) => {
    try {
      const streakDocRef = doc(db, "users", userId, "streak", "data");
      const streakDoc = await getDoc(streakDocRef);

      if (streakDoc.exists()) {
        const data = streakDoc.data();
        const streakCount = data.count || 0;
        const lastEntry = data.lastEntryDate || null;

        setCurrentStreak(streakCount);
        setLastEntryDate(lastEntry);

        return { count: streakCount, lastEntryDate: lastEntry };
      } else {
        setCurrentStreak(0);
        setLastEntryDate(null);
        return { count: 0, lastEntryDate: null };
      }
    } catch (error) {
      console.error("Error al cargar datos de racha:", error);
      return { count: 0, lastEntryDate: null };
    }
  };

  // Verificar si la racha debe continuar o romperse
  const shouldMaintainStreak = () => {
    if (!lastEntryDate) return true; // Primera vez

    const today = new Date();
    const lastEntry = new Date(lastEntryDate);
    const daysDifference = Math.floor(
      (today.getTime() - lastEntry.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysDifference <= 1; // Mismo día o día siguiente
  };

  // Actualizar racha en Firestore
  const updateStreakInFirestore = async (newStreak: number) => {
    if (!user) return;

    try {
      const streakDocRef = doc(db, "users", user.uid, "streak", "data");
      const today = new Date().toISOString();

      await setDoc(streakDocRef, {
        count: newStreak,
        lastEntryDate: today,
        updatedAt: serverTimestamp(),
      });

      setLastEntryDate(today);
    } catch (error) {
      console.error("Error al actualizar racha:", error);
    }
  };

  const handleGuardar = async () => {
    if (!texto.trim() || !user) return;

    // Verificar nuevamente en tiempo real si ya escribió hoy
    const alreadyWroteToday = await checkIfWroteToday(user.uid);
    if (alreadyWroteToday) {
      alert(
        "Ya escribiste una entrada hoy. ¡Vuelve mañana para mantener tu racha!"
      );
      setTexto("");
      setDialogOpen(false);
      setHasWrittenTodayState(true);
      return;
    }

    try {
      setCargando(true);

      // Guardamos en Firestore
      await addDoc(collection(db, "users", user.uid, "diario"), {
        texto,
        fecha: serverTimestamp(),
      });

      // Actualizar racha
      let newStreak;
      if (shouldMaintainStreak()) {
        newStreak = currentStreak + 1;
      } else {
        newStreak = 1; // Reiniciar racha
      }

      setCurrentStreak(newStreak);
      await updateStreakInFirestore(newStreak);

      // Actualizar estados locales
      const newTotal = totalEntries + 1;
      setTotalEntries(newTotal);
      setCanAnalyzeEmotions(newTotal >= 3);
      setHasWrittenTodayState(true); // Marcar que ya escribió hoy

      setTexto("");
      setDialogOpen(false);

      // Mostrar mensaje de éxito si es la primera vez que puede analizar
      if (newTotal === 3) {
        setTimeout(() => {
          alert(
            "¡Felicidades! Ya tienes suficientes entradas para analizar tus emociones con IA 🎉"
          );
        }, 1000);
      }
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
      alert("Error al guardar la entrada. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const preguntas = [
    "¿Qué te hizo sonreír hoy?",
    "¿Qué fue lo más bonito que viviste hoy?",
    "¿Qué aprendiste de ti mismo hoy?",
    "¿Qué momento del día agradeces más?",
    "¿Qué te dio paz o tranquilidad hoy?",
    "¿Cómo te sientes en este momento?",
    "¿Qué emociones experimentaste hoy?",
    "¿Hubo algo que te preocupó o te alegró especialmente?",
  ];

  const elegirPregunta = () => {
    const randomIndex = Math.floor(Math.random() * preguntas.length);
    setPreguntaActual(preguntas[randomIndex]);
  };

  // Mostrar loading mientras se verifica si escribió hoy
  if (checkingTodayEntry) {
    return (
      <section className="w-full grid grid-cols-10 gap-4 mx-auto">
        <Cards className="col-span-10">
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-2 text-gray-600">Cargando...</span>
          </div>
        </Cards>
      </section>
    );
  }

  return (
    <>
      <section className="w-full grid grid-cols-10 gap-4 mx-auto">
        <Cards className="col-span-10">
          <Typography variant="h4" fontWeight="bold">
            Hola, {user?.displayName?.split(" ")[0]}
          </Typography>
          <Typography variant="h6" fontWeight="semi-bold">
            ¿Cómo te sientes hoy?
          </Typography>

          {/* Mostrar estadísticas del diario */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              📝 Tienes {totalEntries}{" "}
              {totalEntries === 1 ? "entrada" : "entradas"} en tu diario
            </p>
            {canAnalyzeEmotions && (
              <p className="text-xs text-blue-600 mt-1">
                ✨ Ya puedes analizar tus emociones con IA
              </p>
            )}
          </div>

          {/* Mostrar si ya escribió hoy */}
          {hasWrittenTodayState && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700">
                ✅ Ya escribiste hoy. ¡Racha mantenida! Vuelve mañana para
                continuar.
              </p>
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild className="mt-14 cursor-pointer">
              <Button
                onClick={() => {
                  if (!hasWrittenTodayState) {
                    elegirPregunta();
                    setDialogOpen(true);
                  }
                }}
                disabled={hasWrittenTodayState}
              >
                {hasWrittenTodayState
                  ? "Ya escribiste hoy 🎉"
                  : "Escribir como me siento"}
              </Button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Escribe como te sentiste hoy</DialogTitle>
              </DialogHeader>

              <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                <article className="text-center mt-4 p-3 bg-gray-50 rounded-lg">
                  <Typography variant="body2" className="italic">
                    {preguntaActual}
                  </Typography>
                </article>

                <textarea
                  placeholder="Escribe aquí sobre tus emociones, pensamientos y experiencias del día..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full flex-1 p-4 resize-none border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={6}
                />

                {/* Contador de palabras */}
                <div className="text-xs text-gray-500 text-right">
                  {
                    texto
                      .trim()
                      .split(" ")
                      .filter((word) => word.length > 0).length
                  }{" "}
                  palabras
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Button
                  onClick={handleGuardar}
                  disabled={cargando || !texto.trim()}
                  className="w-full cursor-pointer"
                >
                  {cargando ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    "Guardar entrada"
                  )}
                </Button>

                {!canAnalyzeEmotions && totalEntries >= 1 && (
                  <p className="text-xs text-center text-gray-500">
                    Necesitas {3 - totalEntries}{" "}
                    {3 - totalEntries === 1 ? "entrada más" : "entradas más"}{" "}
                    para el análisis emocional
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </Cards>

        <Cards className="col-span-5">
          <StreakCard streak={currentStreak} />
        </Cards>

        <Cards className="col-span-5">
          <DailyTipCard />
        </Cards>

        {/* Análisis emocional - Solo mostrar si tiene suficientes entradas */}
        <Cards className="col-span-10 mb-16">
          {canAnalyzeEmotions ? (
            <WeeklyEmotionsExample />
          ) : (
            <div className="text-center p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🧠</span>
                </div>
                <Typography
                  variant="h6"
                  className="font-semibold text-purple-800"
                >
                  Análisis Emocional con IA
                </Typography>
                <Typography variant="body2" className="text-purple-600 mt-2">
                  Descubre patrones en tus emociones y recibe recomendaciones
                  personalizadas
                </Typography>
              </div>

              <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-200 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Progreso
                  </span>
                  <span className="text-sm text-gray-500">
                    {totalEntries}/3 entradas
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min((totalEntries / 3) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {totalEntries === 0
                    ? "Comienza escribiendo en tu diario para desbloquear esta función"
                    : `Necesitas ${3 - totalEntries} entrada${
                        3 - totalEntries !== 1 ? "s" : ""
                      } más`}
                </p>
              </div>
            </div>
          )}
        </Cards>
      </section>
    </>
  );
}

export default Diario;
