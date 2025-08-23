// /api/sentiment-history/route.ts
import { db } from "@/lib/firebaseAdmin"; // Cambiar a firebaseAdmin
import { NextRequest, NextResponse } from "next/server";

interface AnalysisDocument {
  id: string;
  userId: string;
  analysis: Record<string, unknown>;
  entriesCount: number;
  analysisDate: string; // ISO string
  createdAt: string | null; // ISO string or null
}

// Helper function to safely convert Firestore timestamp to ISO string
function timestampToISOString(timestamp: unknown): string | null {
  try {
    if (!timestamp) return null;

    // If it's already a string, return as is
    if (typeof timestamp === "string") return timestamp;

    // If it's a Firebase Admin Timestamp
    if (timestamp && typeof timestamp === "object" && "toDate" in timestamp) {
      const date = (timestamp as FirebaseFirestore.Timestamp).toDate();
      return date.toISOString();
    }

    // If it's a Date object
    if (timestamp instanceof Date) {
      return timestamp.toISOString();
    }

    // If it's a number (unix timestamp)
    if (typeof timestamp === "number") {
      return new Date(timestamp * 1000).toISOString();
    }

    console.warn("Unknown timestamp format:", timestamp);
    return null;
  } catch (error) {
    console.error("Error converting timestamp:", error, timestamp);
    return null;
  }
}

// GET - Obtener historial de análisis o análisis específico
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const analysisId = searchParams.get("analysisId");
    const limitResults = searchParams.get("limit");

    console.log(
      "GET sentiment-history - userId:",
      userId,
      "analysisId:",
      analysisId,
      "limit:",
      limitResults
    );

    if (!userId) {
      return NextResponse.json(
        { error: "UserId es requerido" },
        { status: 400 }
      );
    }

    // Verificar variables de entorno
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.error("❌ Variables de entorno de Firebase faltantes");
      return NextResponse.json(
        {
          success: false,
          error: "Configuración de Firebase incompleta",
        },
        { status: 500 }
      );
    }

    // Si se proporciona analysisId, obtener análisis específico
    if (analysisId) {
      try {
        const analysisRef = db
          .collection("users")
          .doc(userId)
          .collection("sentiment_analysis")
          .doc(analysisId);

        const analysisDoc = await analysisRef.get();

        if (!analysisDoc.exists) {
          return NextResponse.json(
            { error: "Análisis no encontrado" },
            { status: 404 }
          );
        }

        const data = analysisDoc.data();
        console.log("Single analysis data:", data);

        const analysis: AnalysisDocument = {
          id: analysisDoc.id,
          userId: data?.userId || userId,
          analysis: data?.analysis || {},
          entriesCount: data?.entriesCount || 0,
          analysisDate:
            timestampToISOString(data?.analysisDate) ||
            new Date().toISOString(),
          createdAt: timestampToISOString(data?.createdAt),
        };

        return NextResponse.json({ success: true, analysis });
      } catch (error) {
        console.error("Error getting single analysis:", error);
        return NextResponse.json(
          { error: "Error al obtener el análisis específico" },
          { status: 500 }
        );
      }
    }

    // Obtener historial de análisis
    try {
      const analysisRef = db
        .collection("users")
        .doc(userId)
        .collection("sentiment_analysis")
        .orderBy("createdAt", "desc");

      let query = analysisRef;

      if (limitResults && !isNaN(parseInt(limitResults))) {
        query = analysisRef.limit(parseInt(limitResults));
      }

      const querySnapshot = await query.get();

      console.log("Found", querySnapshot.size, "analyses");

      const analyses: AnalysisDocument[] = [];

      querySnapshot.forEach((doc) => {
        try {
          const data = doc.data();
          console.log(
            "Processing doc:",
            doc.id,
            "data keys:",
            Object.keys(data || {})
          );

          const analysis: AnalysisDocument = {
            id: doc.id,
            userId: data?.userId || userId,
            analysis: data?.analysis || {},
            entriesCount: data?.entriesCount || 0,
            analysisDate:
              timestampToISOString(data?.analysisDate) ||
              new Date().toISOString(),
            createdAt: timestampToISOString(data?.createdAt),
          };

          analyses.push(analysis);
        } catch (docError) {
          console.error("Error processing document:", doc.id, docError);
          // Skip this document but continue with others
        }
      });

      console.log("Processed analyses:", analyses.length);

      return NextResponse.json({
        success: true,
        analyses,
        count: analyses.length,
      });
    } catch (firestoreError) {
      console.error("Firestore query error:", firestoreError);

      // Check if it's a missing index error
      if (
        firestoreError instanceof Error &&
        firestoreError.message.includes("index")
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Se requiere crear un índice en Firebase. Por favor, sigue el enlace en la consola de Firebase.",
            details: firestoreError.message,
          },
          { status: 500 }
        );
      }

      throw firestoreError; // Re-throw to be caught by outer catch
    }
  } catch (error) {
    console.error("Error general obteniendo análisis:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json(
      {
        success: false,
        error: "Error al obtener el historial de análisis",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar análisis específico
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const analysisId = searchParams.get("analysisId");

    console.log(
      "DELETE sentiment-history - userId:",
      userId,
      "analysisId:",
      analysisId
    );

    if (!userId || !analysisId) {
      return NextResponse.json(
        { error: "UserId y analysisId son requeridos" },
        { status: 400 }
      );
    }

    // Verificar variables de entorno
    if (
      !process.env.FIREBASE_PROJECT_ID ||
      !process.env.FIREBASE_CLIENT_EMAIL ||
      !process.env.FIREBASE_PRIVATE_KEY
    ) {
      console.error("❌ Variables de entorno de Firebase faltantes");
      return NextResponse.json(
        {
          success: false,
          error: "Configuración de Firebase incompleta",
        },
        { status: 500 }
      );
    }

    const analysisRef = db
      .collection("users")
      .doc(userId)
      .collection("sentiment_analysis")
      .doc(analysisId);

    // Check if document exists before deleting
    const docSnapshot = await analysisRef.get();
    if (!docSnapshot.exists) {
      return NextResponse.json(
        { error: "El análisis no existe" },
        { status: 404 }
      );
    }

    await analysisRef.delete();
    console.log("Analysis deleted successfully:", analysisId);

    return NextResponse.json({
      success: true,
      message: "Análisis eliminado correctamente",
    });
  } catch (error) {
    console.error("Error eliminando análisis:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";

    return NextResponse.json(
      {
        success: false,
        error: "Error al eliminar el análisis",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
