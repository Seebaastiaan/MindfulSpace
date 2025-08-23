// components/WeeklyEmotions.tsx
"use client";

import { auth, db } from "@/lib/firebase";
import Typography from "@mui/material/Typography";
import { User, onAuthStateChanged } from "firebase/auth";
import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Minus,
  Trash2,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import Button from "./Button";

interface DailyEmotion {
  day: string;
  emotion: string;
  intensity: number;
  sentiment: "positive" | "neutral" | "negative";
  color: string;
}

interface WeeklyAnalysis {
  weeklyEmotions: DailyEmotion[];
  overallMood: string;
  recommendation: string;
  dominantEmotions: string[];
  moodTrend: "improving" | "stable" | "declining";
}

interface AnalysisDocument {
  id: string;
  userId: string;
  analysis: WeeklyAnalysis;
  entriesCount: number;
  analysisDate: string;
  createdAt: Timestamp | Date | null;
}

interface DiaryEntry {
  id: string;
  text: string;
  date: string;
  userId: string;
  createdAt?: Timestamp | string;
}

const emotionEmojis: Record<string, string> = {
  feliz: "😊",
  preocupado: "😟",
  emocionado: "🤩",
  neutral: "😐",
  cansado: "😴",
  relajado: "😌",
  melancólico: "😔",
  ansioso: "😰",
  enojado: "😠",
  triste: "😢",
  motivado: "💪",
  confundido: "😕",
  reflexivo: "🤔",
  tranquilo: "😌",
  pensativo: "💭",
  agradecido: "🙏",
  esperanzado: "🌟",
  determinado: "💪",
  optimista: "😊",
  sereno: "🕊️",
};

const WeeklyEmotionsChart: React.FC<{
  analysis: WeeklyAnalysis;
  title?: string;
}> = ({ analysis, title = "Mis emociones de la semana" }) => {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="w-4 h-4" />;
      case "declining":
        return <TrendingDown className="w-4 h-4" />;
      case "stable":
        return <Minus className="w-4 h-4" />;
      default:
        return <Minus className="w-4 h-4" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "improving":
        return "text-green-600 bg-green-50";
      case "declining":
        return "text-red-600 bg-red-50";
      case "stable":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case "improving":
        return "Mejorando";
      case "declining":
        return "Empeorando";
      case "stable":
        return "Estable";
      default:
        return "Sin cambios";
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border">
      <Typography variant="h6" className="text-center mb-6 font-semibold">
        {title}
      </Typography>

      {/* Bar Chart */}
      <div className="flex items-end justify-center space-x-3 mb-6 h-32">
        {analysis.weeklyEmotions.map((day, index) => (
          <div
            key={index}
            className="flex flex-col items-center group relative"
          >
            <div
              className="w-7 rounded-full opacity-80 transition-all duration-300 hover:opacity-100 hover:scale-105 cursor-pointer"
              style={{
                height: `${Math.max(day.intensity * 100, 15)}px`,
                backgroundColor: day.color,
                minHeight: "15px",
              }}
            />
            <div className="absolute -top-12 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
              {day.emotion} ({Math.round(day.intensity * 100)}%)
            </div>
          </div>
        ))}
      </div>

      {/* Days and Emojis */}
      <div className="flex justify-center space-x-3 mb-6">
        {analysis.weeklyEmotions.map((day, index) => {
          const dayDate = new Date(day.day);
          const dayName = dayDate.toLocaleDateString("es-ES", {
            weekday: "short",
          });

          return (
            <div key={index} className="flex flex-col items-center space-y-1">
              <div className="text-xl">
                {emotionEmojis[day.emotion] || "🙂"}
              </div>
              <div className="text-xs text-gray-500 font-medium">{dayName}</div>
            </div>
          );
        })}
      </div>

      {/* Analysis Summary */}
      <div className="mt-6 pt-4 border-t border-gray-100 space-y-4">
        {/* Overall Mood and Trend */}
        <div className="flex justify-center space-x-6">
          <div className="text-center">
            <p className="text-sm text-gray-600">Estado general</p>
            <p className="font-semibold text-lg text-gray-800">
              {analysis.overallMood}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Tendencia</p>
            <div
              className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full font-medium text-sm ${getTrendColor(
                analysis.moodTrend
              )}`}
            >
              {getTrendIcon(analysis.moodTrend)}
              <span>{getTrendText(analysis.moodTrend)}</span>
            </div>
          </div>
        </div>

        {/* Dominant Emotions */}
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Emociones dominantes</p>
          <div className="flex justify-center flex-wrap gap-2">
            {analysis.dominantEmotions.map((emotion, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {emotionEmojis[emotion] || "🙂"} {emotion}
              </span>
            ))}
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
          <div className="flex items-start space-x-2">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-medium text-blue-900 mb-1">
                Recomendación personalizada
              </p>
              <p className="text-sm text-blue-800">{analysis.recommendation}</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center space-x-6 text-xs text-gray-500 pt-2">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Positivo</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Neutral</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>Negativo</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoadingSpinner = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
    <p className="text-sm text-gray-600">{message}</p>
  </div>
);

const WeeklyEmotionsExample: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisDocument[]>(
    []
  );
  const [currentAnalysisIndex, setCurrentAnalysisIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingStep, setLoadingStep] = useState<string>("");

  const loadAnalysisHistory = useCallback(async () => {
    if (!user) return;

    console.log("Loading analysis history for user:", user.uid);
    setIsLoadingHistory(true);
    setError(null); // Clear any previous errors

    try {
      const url = `/api/sentiment-history?userId=${user.uid}&limit=10`;
      console.log("Fetching from URL:", url);

      const response = await fetch(url);
      console.log("History API response status:", response.status);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("History API response data:", data);

      if (data.success && data.analyses) {
        console.log("Found", data.analyses.length, "analyses");
        setAnalysisHistory(data.analyses);
        setCurrentAnalysisIndex(0);
      } else {
        console.warn("No se encontraron análisis previos", data);
        setAnalysisHistory([]);
        // Don't set error here, just empty history
      }
    } catch (error) {
      console.error("Error cargando historial:", error);
      // Set error only if it's a real error, not just empty results
      setError(
        `Error cargando historial: ${
          error instanceof Error ? error.message : "Error desconocido"
        }`
      );
      setAnalysisHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // Load analysis history when user is available
  useEffect(() => {
    if (user) {
      loadAnalysisHistory();
    } else {
      setAnalysisHistory([]);
      setIsLoadingHistory(false);
    }
  }, [user, loadAnalysisHistory]);

  const fetchDiaryEntries = async (userId: string): Promise<DiaryEntry[]> => {
    try {
      console.log("Fetching diary entries for user:", userId);
      const diaryRef = collection(db, `users/${userId}/diario`);
      const diaryQuery = query(diaryRef, orderBy("fecha", "desc"), limit(7));
      const snapshot = await getDocs(diaryQuery);
      const entries: DiaryEntry[] = [];

      console.log("Found", snapshot.size, "diary entries");

      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Processing entry:", doc.id, data);

        const dateString = data.fecha?.toDate
          ? data.fecha.toDate().toISOString().split("T")[0]
          : data.fecha || new Date().toISOString().split("T")[0];

        const entry = {
          id: doc.id,
          text: data.texto || data.text || "",
          date: dateString,
          userId,
          createdAt: data.fecha,
        };

        console.log("Created entry object:", entry);
        entries.push(entry);
      });

      console.log("Final entries array:", entries);
      return entries;
    } catch (err) {
      console.error("Error in fetchDiaryEntries:", err);
      throw new Error(err instanceof Error ? err.message : "Error desconocido");
    }
  };

  const handleAnalyze = async () => {
    if (!user) {
      setError("Debes estar autenticado para analizar tus emociones");
      return;
    }

    console.log("Starting analysis for user:", user.uid);
    setIsLoading(true);
    setError(null);
    setLoadingStep("Preparando análisis...");

    try {
      setLoadingStep("Obteniendo entradas del diario...");
      console.log("Fetching diary entries...");

      const diaryEntries = await fetchDiaryEntries(user.uid);
      console.log("Fetched entries:", diaryEntries);

      const validEntries = diaryEntries.filter(
        (e) => e.text?.trim().length > 10
      );

      console.log("Valid entries after filtering:", validEntries);
      console.log("Valid entries count:", validEntries.length);

      if (validEntries.length < 3) {
        const errorMsg = `Necesitas al menos 3 entradas válidas con más de 10 caracteres. Solo tienes ${validEntries.length}.`;
        console.log("Not enough valid entries:", errorMsg);
        setError(errorMsg);
        return;
      }

      setLoadingStep("Analizando emociones con IA...");
      console.log("Sending request to analyze-sentiments API...");

      const requestBody = {
        userId: user.uid,
        diaryEntries: validEntries,
      };
      console.log("Request body:", requestBody);

      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error("Timeout: La solicitud tardó demasiado")),
          30000
        )
      );

      const fetchPromise = fetch("/api/analyze-sentiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      // Race between fetch and timeout
      const response = (await Promise.race([
        fetchPromise,
        timeoutPromise,
      ])) as Response;

      console.log("API response status:", response.status);
      console.log("API response ok:", response.ok);

      const data = await response.json();
      console.log("API response data:", data);

      if (!response.ok || !data.success) {
        const errorMsg =
          data?.error || `Error en el análisis. Status: ${response.status}`;
        console.error("API error:", errorMsg);
        throw new Error(errorMsg);
      }

      if (!data.analysis) {
        console.error("No analysis data received");
        throw new Error("No se recibieron datos de análisis");
      }

      console.log("Analysis successful, reloading history...");
      setLoadingStep("Guardando resultado...");

      // Wait a bit before reloading to ensure the data is written to the database
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Reload analysis history to get the new analysis
      await loadAnalysisHistory();

      console.log("Analysis complete!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      console.error("Error in handleAnalyze:", err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingStep("");
    }
  };

  const navigateAnalysis = (direction: "prev" | "next") => {
    if (direction === "prev" && currentAnalysisIndex > 0) {
      setCurrentAnalysisIndex(currentAnalysisIndex - 1);
    } else if (
      direction === "next" &&
      currentAnalysisIndex < analysisHistory.length - 1
    ) {
      setCurrentAnalysisIndex(currentAnalysisIndex + 1);
    }
  };

  const deleteAnalysis = async (analysisId: string) => {
    if (!user) return;

    if (!confirm("¿Estás seguro de que quieres eliminar este análisis?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/sentiment-history?userId=${user.uid}&analysisId=${analysisId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Remove from local state
        const newHistory = analysisHistory.filter((a) => a.id !== analysisId);
        setAnalysisHistory(newHistory);

        // Adjust current index if necessary
        if (
          currentAnalysisIndex >= newHistory.length &&
          newHistory.length > 0
        ) {
          setCurrentAnalysisIndex(newHistory.length - 1);
        } else if (newHistory.length === 0) {
          setCurrentAnalysisIndex(0);
        }
      } else {
        setError("Error al eliminar el análisis");
      }
    } catch (error) {
      setError("Error al eliminar el análisis");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Helper function to safely convert createdAt to Date
  const getDateFromCreatedAt = (createdAt: Timestamp | Date | null): Date => {
    if (!createdAt) return new Date();
    if (createdAt instanceof Date) return createdAt;
    if ("toDate" in createdAt) return createdAt.toDate();
    return new Date();
  };

  if (isLoadingHistory) {
    return <LoadingSpinner message="Cargando análisis anteriores..." />;
  }

  const currentAnalysis = analysisHistory[currentAnalysisIndex];

  return (
    <div className="space-y-6">
      {/* Show error if there's one */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 underline hover:no-underline"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Analysis History Navigation */}
      {analysisHistory.length > 0 ? (
        <>
          {/* Navigation Header */}
          <div className="bg-white p-4 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Historial de Análisis
                  </h3>
                  <p className="text-sm text-gray-600">
                    {formatDate(
                      currentAnalysis.analysisDate ||
                        getDateFromCreatedAt(currentAnalysis.createdAt)
                          .toISOString()
                          .split("T")[0]
                    )}{" "}
                    • {currentAnalysis.entriesCount} entradas
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateAnalysis("prev")}
                  disabled={currentAnalysisIndex === 0}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-sm text-gray-600 px-3">
                  {currentAnalysisIndex + 1} de {analysisHistory.length}
                </span>

                <button
                  onClick={() => navigateAnalysis("next")}
                  disabled={currentAnalysisIndex === analysisHistory.length - 1}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteAnalysis(currentAnalysis.id)}
                  className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                  title="Eliminar análisis"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Current Analysis Display */}
          <WeeklyEmotionsChart analysis={currentAnalysis.analysis} />

          {/* New Analysis Button */}
          <div className="text-center">
            {isLoading ? (
              <LoadingSpinner message={loadingStep || "Procesando..."} />
            ) : (
              <button
                onClick={handleAnalyze}
                disabled={!user}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Crear nuevo análisis
              </button>
            )}
          </div>
        </>
      ) : (
        /* No Analysis Yet */
        <div className="bg-white p-6 rounded-2xl shadow-sm border text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-blue-600" />
          </div>
          <Typography variant="h6" className="font-semibold">
            Análisis Emocional Semanal
          </Typography>
          <Typography
            variant="body2"
            className="text-gray-600 pb-4 max-w-md mx-auto"
          >
            Descubre patrones en tus emociones con inteligencia artificial.
            Analiza tus entradas de diario para obtener insights personalizados.
          </Typography>

          {isLoading ? (
            <LoadingSpinner message={loadingStep || "Procesando..."} />
          ) : (
            <Button onClick={handleAnalyze} disabled={!user}>
              Comenzar primer análisis
            </Button>
          )}

          {!user && (
            <p className="text-xs text-gray-500">
              Inicia sesión para usar esta función
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyEmotionsExample;
