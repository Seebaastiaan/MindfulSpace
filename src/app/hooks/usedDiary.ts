import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { useCallback, useState } from "react";

// Interfaces
interface DiaryEntry {
  id: string;
  text: string;
  date: string;
}

interface WeeklyAnalysis {
  weeklyEmotions: {
    day: string;
    emotion: string;
    intensity: number;
    sentiment: "positive" | "neutral" | "negative";
    color: string;
  }[];
  overallMood: string;
  recommendation: string;
  dominantEmotions: string[];
  moodTrend: "improving" | "stable" | "declining";
}

export function useSentimentAnalysis() {
  const [analysis, setAnalysis] = useState<WeeklyAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Verificar si el usuario tiene suficientes entradas
  const canAnalyze = useCallback(async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    const diaryRef = collection(db, "users", userId, "diario");
    const diaryQuery = query(diaryRef, orderBy("createdAt", "desc"), limit(3));
    const snapshot = await getDocs(diaryQuery);
    return snapshot.size >= 3;
  }, []);

  // Realizar análisis de sentimientos
  const analyzeSentiments = useCallback(
    async (userId: string) => {
      if (!userId) {
        setError("Usuario no autenticado");
        return;
      }

      const hasEnoughEntries = await canAnalyze(userId);
      if (!hasEnoughEntries) {
        setError(
          "Necesitas al menos 3 entradas en tu diario para realizar el análisis"
        );
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // 🔹 Obtener últimas 7 entradas del diario
        const diaryRef = collection(db, "users", userId, "diario");
        const diaryQuery = query(
          diaryRef,
          orderBy("createdAt", "desc"),
          limit(7)
        );
        const snapshot = await getDocs(diaryQuery);

        const diaryEntries: DiaryEntry[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as { text: string; date: string }),
        }));

        // 🔹 Enviar las entradas al endpoint para generar el análisis
        const response = await fetch("/api/analyze-sentiments", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, diaryEntries }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error al analizar sentimientos");
        }

        if (data.success && data.analysis) {
          setAnalysis(data.analysis);
          console.log("✅ Análisis guardado con ID:", data.analysisId);

          if (data.warning) {
            console.warn("⚠️ Advertencia en análisis:", data.warning);
          }
        } else {
          throw new Error("Formato de respuesta inválido");
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setError(errorMessage);
        console.error("Error en análisis de sentimientos:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [canAnalyze]
  );

  return {
    analysis,
    isLoading,
    error,
    analyzeSentiments,
    canAnalyze,
  };
}
