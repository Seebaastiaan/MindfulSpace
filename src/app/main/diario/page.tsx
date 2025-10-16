// pages/Diario.tsx - Versión integrada con análisis de sentimientos (CORREGIDA)
"use client";
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
import { onAuthStateChanged, User } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

interface DiaryEntryData {
  id: string;
  texto: string;
  fecha: Timestamp;
}

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

  // Estados para mostrar entradas y eliminación
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntryData[]>([]);
  const [showEntries, setShowEntries] = useState(false);
  const [loadingEntries, setLoadingEntries] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<DiaryEntryData | null>(
    null
  );
  const [deletingEntry, setDeletingEntry] = useState(false);

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

  // Cargar entradas del diario
  const loadDiaryEntries = useCallback(async () => {
    if (!user) return;

    try {
      setLoadingEntries(true);
      const diaryRef = collection(db, "users", user.uid, "diario");
      const diaryQuery = query(diaryRef, orderBy("fecha", "desc"));
      const snapshot = await getDocs(diaryQuery);

      const entries: DiaryEntryData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        texto: doc.data().texto,
        fecha: doc.data().fecha,
      }));

      setDiaryEntries(entries);
    } catch (error) {
      console.error("Error al cargar entradas:", error);
    } finally {
      setLoadingEntries(false);
    }
  }, [user]);

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
        // Cargar entradas del diario
        loadDiaryEntries();
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
  }, [loadUserData, loadDiaryEntries]);

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

  // Función para iniciar eliminación
  const handleDeleteEntry = (entry: DiaryEntryData) => {
    setEntryToDelete(entry);
    setDeleteConfirmOpen(true);
  };

  // Función para confirmar eliminación
  const confirmDeleteEntry = async () => {
    if (!user || !entryToDelete) return;

    try {
      setDeletingEntry(true);

      // Eliminar de Firestore
      await deleteDoc(doc(db, "users", user.uid, "diario", entryToDelete.id));

      // Actualizar estado local
      setDiaryEntries((prev) =>
        prev.filter((entry) => entry.id !== entryToDelete.id)
      );
      setTotalEntries((prev) => prev - 1);

      // Recalcular si puede analizar emociones
      const newTotal = totalEntries - 1;
      setCanAnalyzeEmotions(newTotal >= 3);

      // Cerrar modal
      setDeleteConfirmOpen(false);
      setEntryToDelete(null);

      // Recargar datos del usuario para actualizar racha si es necesario
      await loadUserData(user.uid);
    } catch (error) {
      console.error("Error al eliminar entrada:", error);
      alert("Error al eliminar la entrada. Por favor, intenta de nuevo.");
    } finally {
      setDeletingEntry(false);
    }
  };

  // Función para cancelar eliminación
  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEntryToDelete(null);
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
      <div className="space-y-6">
        {/* Header principal */}
        <Cards variant="glass" className="col-span-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">📖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hola, {user?.displayName?.split(" ")[0]}
              </h1>
              <p className="text-gray-600">¿Cómo te sientes hoy?</p>
            </div>
          </div>

          {/* Estadísticas del diario */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">📝</span>
                </div>
                <div>
                  <p className="text-blue-700 font-medium">
                    {totalEntries} {totalEntries === 1 ? "entrada" : "entradas"}
                  </p>
                  <p className="text-blue-600 text-sm">en tu diario</p>
                </div>
              </div>
            </div>

            {canAnalyzeEmotions && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-lg">✨</span>
                  </div>
                  <div>
                    <p className="text-purple-700 font-medium">IA Activada</p>
                    <p className="text-purple-600 text-sm">
                      Análisis disponible
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mensaje si ya escribió hoy */}
          {hasWrittenTodayState && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-100 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-lg">✅</span>
                </div>
                <div>
                  <p className="text-green-700 font-medium">
                    ¡Entrada completada!
                  </p>
                  <p className="text-green-600 text-sm">
                    Racha mantenida. Vuelve mañana para continuar.
                  </p>
                </div>
              </div>
            </div>
          )}

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild className="cursor-pointer">
              <button
                onClick={() => {
                  if (!hasWrittenTodayState) {
                    elegirPregunta();
                    setDialogOpen(true);
                  }
                }}
                disabled={hasWrittenTodayState}
                className={`
                  w-full p-4 rounded-2xl font-semibold text-lg transition-all duration-300
                  ${
                    hasWrittenTodayState
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                  }
                `}
              >
                {hasWrittenTodayState
                  ? "Ya escribiste hoy 🎉"
                  : "✍️ Escribir como me siento"}
              </button>
            </DialogTrigger>
            <DialogContent className="flex flex-col max-h-[80vh] rounded-3xl border-0 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
                  ✍️ Escribe como te sentiste hoy
                </DialogTitle>
              </DialogHeader>

              <div className="flex-1 flex flex-col gap-6 overflow-y-auto">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border border-indigo-100">
                  <p className="text-indigo-700 italic text-center font-medium">
                    {preguntaActual}
                  </p>
                </div>

                <textarea
                  placeholder="Escribe aquí sobre tus emociones, pensamientos y experiencias del día..."
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  className="w-full flex-1 p-6 resize-none border-2 border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-300 min-h-[200px]"
                />

                {/* Contador de palabras */}
                <div className="text-sm text-gray-500 text-right bg-gray-50 rounded-lg px-3 py-2">
                  {
                    texto
                      .trim()
                      .split(" ")
                      .filter((word) => word.length > 0).length
                  }{" "}
                  palabras escritas
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handleGuardar}
                  disabled={cargando || !texto.trim()}
                  className={`
                    w-full p-4 rounded-2xl font-semibold text-lg transition-all duration-300
                    ${
                      cargando || !texto.trim()
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
                    }
                  `}
                >
                  {cargando ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Guardando...</span>
                    </div>
                  ) : (
                    "💾 Guardar entrada"
                  )}
                </button>

                {!canAnalyzeEmotions && totalEntries >= 1 && (
                  <div className="text-center p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                    <p className="text-sm text-yellow-700">
                      Necesitas {3 - totalEntries}{" "}
                      {3 - totalEntries === 1 ? "entrada más" : "entradas más"}{" "}
                      para activar el análisis emocional con IA
                    </p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </Cards>

        {/* Cards de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Cards variant="bordered">
            <StreakCard streak={currentStreak} />
          </Cards>

          <Cards variant="bordered">
            <DailyTipCard />
          </Cards>
        </div>

        {/* Análisis emocional */}
        <Cards variant="gradient" className="mb-16">
          {canAnalyzeEmotions ? (
            <WeeklyEmotionsExample />
          ) : (
            <div className="text-center p-8">
              <div className="mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Análisis Emocional con IA
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Descubre patrones en tus emociones y recibe recomendaciones
                  personalizadas para tu bienestar mental
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-100 max-w-md mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-700">
                    Tu Progreso
                  </span>
                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {totalEntries}/3 entradas
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min((totalEntries / 3) * 100, 100)}%`,
                    }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  {totalEntries === 0
                    ? "🌟 Comienza escribiendo en tu diario para desbloquear esta función"
                    : `✨ Solo ${3 - totalEntries} entrada${
                        3 - totalEntries !== 1 ? "s" : ""
                      } más para activar el análisis`}
                </p>
              </div>
            </div>
          )}
        </Cards>

        {/* Sección de entradas existentes */}
        {diaryEntries.length > 0 && (
          <Cards>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-800">
                  Mis Entradas
                </h3>
                <button
                  onClick={() => setShowEntries(!showEntries)}
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 text-sm font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {showEntries ? "Ocultar" : "Ver Entradas"}
                </button>
              </div>

              {showEntries && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {loadingEntries ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
                      <p className="text-gray-500 mt-2">Cargando entradas...</p>
                    </div>
                  ) : (
                    diaryEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-sm text-gray-500 font-medium">
                            {entry.fecha
                              ? new Date(
                                  entry.fecha.seconds * 1000
                                ).toLocaleDateString("es-ES", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })
                              : "Fecha no disponible"}
                          </span>
                          <button
                            onClick={() => handleDeleteEntry(entry)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all duration-200"
                            title="Eliminar entrada"
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
                          </button>
                        </div>
                        <p className="text-gray-700 leading-relaxed line-clamp-3">
                          {entry.texto}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </Cards>
        )}

        {/* Modal de confirmación de eliminación */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 max-w-md mx-auto">
            <DialogHeader className="text-center pb-4">
              <DialogTitle className="text-xl font-bold text-gray-800 mb-2">
                ¿Eliminar entrada?
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </DialogHeader>

            <div className="text-center space-y-4">
              <p className="text-gray-600">
                Esta acción no se puede deshacer. Tu entrada del diario se
                eliminará permanentemente.
              </p>

              {entryToDelete && (
                <div className="bg-gray-50 p-3 rounded-lg text-left max-h-24 overflow-y-auto">
                  <p className="text-sm text-gray-600 font-medium mb-1">
                    {entryToDelete.fecha
                      ? new Date(
                          entryToDelete.fecha.seconds * 1000
                        ).toLocaleDateString("es-ES")
                      : "Fecha no disponible"}
                  </p>
                  <p className="text-sm text-gray-700 line-clamp-2">
                    {entryToDelete.texto}
                  </p>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={cancelDelete}
                  disabled={deletingEntry}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-200 font-medium disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmDeleteEntry}
                  disabled={deletingEntry}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {deletingEntry ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Eliminando...</span>
                    </>
                  ) : (
                    <span>Eliminar</span>
                  )}
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

export default Diario;
