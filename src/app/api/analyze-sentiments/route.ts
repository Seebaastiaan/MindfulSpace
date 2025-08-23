// src/app/api/analyze-sentiments/route.ts
import { db } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

// --- TIPOS ---
interface DiaryEntry {
  id: string;
  text: string;
  date: string;
  userId: string;
  createdAt?: FirebaseFirestore.Timestamp | string | Date;
}

interface WeeklyEmotion {
  day: string;
  emotion: string;
  intensity: number;
  sentiment: "positive" | "neutral" | "negative";
  color: string;
}

interface Analysis {
  overallMood: string;
  moodTrend: "improving" | "stable" | "declining";
  recommendation: string;
  weeklyEmotions: WeeklyEmotion[];
  dominantEmotions: string[];
}

interface RequestBody {
  userId: string;
  diaryEntries: DiaryEntry[];
}

// Función para analizar sentimientos basado en palabras clave
function analyzeSentiment(text: string): {
  emotion: string;
  intensity: number;
  sentiment: "positive" | "neutral" | "negative";
  color: string;
} {
  const lowerText = text.toLowerCase().trim();

  console.log("🔍 Analizando texto:", lowerText);

  // Palabras clave para diferentes emociones (incluyendo errores comunes de escritura)
  const emotionKeywords = {
    triste: {
      keywords: [
        "triste",
        "tristeza",
        "llorar",
        "lloro",
        "dolor",
        "pena",
        "melancolia",
        "deprimido",
        "mal",
      ],
      sentiment: "negative" as const,
      color: "#EF4444",
      intensity: 0.8,
    },
    feliz: {
      keywords: [
        "feliz",
        "peliz",
        "contento",
        "alegre",
        "bien",
        "genial",
        "happy",
        "joy",
        "bueno",
      ],
      sentiment: "positive" as const,
      color: "#10B981",
      intensity: 0.8,
    },
    ansioso: {
      keywords: [
        "ansioso",
        "ansiedad",
        "nervioso",
        "preocupado",
        "estres",
        "estrés",
        "agobiado",
      ],
      sentiment: "negative" as const,
      color: "#F59E0B",
      intensity: 0.7,
    },
    enojado: {
      keywords: [
        "enojado",
        "molesto",
        "furioso",
        "ira",
        "rabia",
        "irritado",
        "cabreado",
      ],
      sentiment: "negative" as const,
      color: "#DC2626",
      intensity: 0.9,
    },
    cansado: {
      keywords: ["cansado", "agotado", "fatiga", "exhausto", "sin energia"],
      sentiment: "neutral" as const,
      color: "#6B7280",
      intensity: 0.6,
    },
    motivado: {
      keywords: ["motivado", "energia", "entusiasmo", "animado", "inspirado"],
      sentiment: "positive" as const,
      color: "#8B5CF6",
      intensity: 0.9,
    },
    relajado: {
      keywords: ["relajado", "tranquilo", "calma", "paz", "sereno"],
      sentiment: "positive" as const,
      color: "#06B6D4",
      intensity: 0.7,
    },
  };

  // Buscar emociones en el texto
  for (const [emotion, data] of Object.entries(emotionKeywords)) {
    for (const keyword of data.keywords) {
      if (lowerText.includes(keyword)) {
        console.log(
          `✅ Encontrado: "${keyword}" → ${emotion} (${data.sentiment})`
        );
        return {
          emotion,
          intensity: data.intensity,
          sentiment: data.sentiment,
          color: data.color,
        };
      }
    }
  }

  console.log("⚪ No se encontraron palabras clave, usando neutral");

  // Emoción neutral por defecto
  return {
    emotion: "neutral",
    intensity: 0.5,
    sentiment: "neutral" as const,
    color: "#3B82F6",
  };
}

// Función para generar análisis completo
function generateAnalysis(entries: DiaryEntry[]): Analysis {
  console.log("📊 Generando análisis para", entries.length, "entradas");

  // Ordenar entradas por fecha (más antigua primero)
  const sortedEntries = entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const emotions = sortedEntries.map((entry) => {
    console.log(`📝 Procesando entrada: "${entry.text.substring(0, 30)}..."`);
    const sentiment = analyzeSentiment(entry.text);
    return {
      day: entry.date,
      ...sentiment,
    };
  });

  console.log(
    "🎭 Emociones detectadas:",
    emotions.map((e) => `${e.day}: ${e.emotion} (${e.sentiment})`)
  );

  // Calcular estado de ánimo general
  const positiveCount = emotions.filter(
    (e) => e.sentiment === "positive"
  ).length;
  const negativeCount = emotions.filter(
    (e) => e.sentiment === "negative"
  ).length;
  const neutralCount = emotions.filter((e) => e.sentiment === "neutral").length;

  console.log(
    `📈 Conteos: Positivo(${positiveCount}) Negativo(${negativeCount}) Neutral(${neutralCount})`
  );

  let overallMood: string;
  if (positiveCount > negativeCount && positiveCount > neutralCount) {
    overallMood = "Mayormente Positivo";
  } else if (negativeCount > positiveCount && negativeCount > neutralCount) {
    overallMood = "Mayormente Negativo";
  } else if (positiveCount === negativeCount && positiveCount > neutralCount) {
    overallMood = "Mixto";
  } else {
    overallMood = "Neutral";
  }

  // Calcular tendencia (comparando primera mitad con segunda mitad)
  const midpoint = Math.ceil(emotions.length / 2);
  const firstHalf = emotions.slice(0, midpoint);
  const secondHalf = emotions.slice(midpoint);

  const firstHalfScore = firstHalf.reduce((sum, e) => {
    if (e.sentiment === "positive") return sum + 1;
    if (e.sentiment === "negative") return sum - 1;
    return sum;
  }, 0);

  const secondHalfScore = secondHalf.reduce((sum, e) => {
    if (e.sentiment === "positive") return sum + 1;
    if (e.sentiment === "negative") return sum - 1;
    return sum;
  }, 0);

  let moodTrend: "improving" | "stable" | "declining";
  if (secondHalfScore > firstHalfScore) {
    moodTrend = "improving";
  } else if (secondHalfScore < firstHalfScore) {
    moodTrend = "declining";
  } else {
    moodTrend = "stable";
  }

  console.log(
    `📊 Tendencia: ${moodTrend} (primera mitad: ${firstHalfScore}, segunda mitad: ${secondHalfScore})`
  );

  // Emociones dominantes
  const emotionCounts: Record<string, number> = {};
  emotions.forEach((e) => {
    emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
  });

  const dominantEmotions = Object.entries(emotionCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion);

  console.log("🏆 Emociones dominantes:", dominantEmotions);

  // Recomendación personalizada
  let recommendation: string;
  if (negativeCount >= positiveCount && negativeCount > 0) {
    recommendation =
      "Has tenido algunos días difíciles. Considera hacer actividades que disfrutes, hablar con alguien de confianza, o buscar momentos de relajación.";
  } else if (positiveCount > negativeCount) {
    recommendation =
      "¡Vas por buen camino! Sigue manteniendo las actividades que te hacen sentir bien.";
  } else {
    recommendation =
      "Mantén un equilibrio saludable. Continúa registrando tus emociones para identificar patrones.";
  }

  const analysis = {
    overallMood,
    moodTrend,
    recommendation,
    weeklyEmotions: emotions,
    dominantEmotions,
  };

  console.log("✅ Análisis completado:", analysis);

  return analysis;
}

// --- ENDPOINT POST ---
export async function POST(req: Request) {
  try {
    // Verificar variables de entorno
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.error("❌ Variables de entorno de Firebase faltantes");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Configuración de Firebase incompleta",
        }),
        { status: 500 }
      );
    }

    const body: RequestBody = await req.json();
    const { userId, diaryEntries } = body;

    if (!userId || !diaryEntries || diaryEntries.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: "Parámetros inválidos" }),
        { status: 400 }
      );
    }

    console.log(
      "📊 Analizando",
      diaryEntries.length,
      "entradas para usuario:",
      userId
    );

    // Generar análisis basado en el contenido real
    const analysis = generateAnalysis(diaryEntries);

    try {
      // Guardar en Firestore
      const docRef = db
        .collection("users")
        .doc(userId)
        .collection("sentiment_analysis")
        .doc();

      await docRef.set({
        createdAt: FieldValue.serverTimestamp(),
        analysisDate: new Date().toISOString(),
        analysis,
        entriesCount: diaryEntries.length,
        userId,
      });

      console.log("✅ Análisis guardado correctamente con ID:", docRef.id);

      return new Response(
        JSON.stringify({
          success: true,
          analysis,
          analysisId: docRef.id,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (firestoreError) {
      console.error("❌ Error guardando en Firestore:", firestoreError);

      // Devolver el análisis aunque no se haya guardado
      return new Response(
        JSON.stringify({
          success: true,
          analysis,
          warning: "Análisis generado pero no guardado en la base de datos",
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error: unknown) {
    console.error("❌ Error general en POST /api/analyze-sentiments:", error);
    const message =
      error instanceof Error ? error.message : "Error desconocido";

    return new Response(
      JSON.stringify({
        success: false,
        error: "Error interno del servidor",
        details: message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
