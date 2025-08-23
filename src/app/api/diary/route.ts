// /api/diary/route.ts
import { db } from "@/lib/firebaseAdmin"; // Cambiar a firebaseAdmin
import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

interface DiaryEntry {
  id?: string;
  text: string;
  date: string;
  userId: string;
  mood?: string;
  tags?: string[];
  createdAt?: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
  updatedAt?: FirebaseFirestore.Timestamp | FirebaseFirestore.FieldValue;
}

// GET - Obtener entradas del diario
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const limitEntries = searchParams.get("limit");

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

    const diaryRef = db
      .collection("users")
      .doc(userId)
      .collection("diario")
      .orderBy("createdAt", "desc");

    let query = diaryRef;

    if (limitEntries && !isNaN(parseInt(limitEntries))) {
      query = diaryRef.limit(parseInt(limitEntries));
    }

    const querySnapshot = await query.get();
    const entries: DiaryEntry[] = [];

    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data(),
      } as DiaryEntry);
    });

    return NextResponse.json({
      success: true,
      entries,
      count: entries.length,
    });
  } catch (error) {
    console.error("Error obteniendo entradas:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener las entradas del diario" },
      { status: 500 }
    );
  }
}

// POST - Crear nueva entrada del diario
export async function POST(req: NextRequest) {
  try {
    const { userId, text, date, mood, tags } = await req.json();

    if (!userId || !text) {
      return NextResponse.json(
        { error: "UserId y text son requeridos" },
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

    const diaryEntry: Omit<DiaryEntry, "id"> = {
      userId,
      text: text.trim(),
      date: date || new Date().toISOString().split("T")[0],
      mood: mood || null,
      tags: Array.isArray(tags) ? tags : [],
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    };

    const diaryRef = db.collection("users").doc(userId).collection("diario");

    const docRef = await diaryRef.add(diaryEntry);

    console.log("Entrada guardada con ID:", docRef.id);

    return NextResponse.json({
      success: true,
      entryId: docRef.id,
      entry: {
        id: docRef.id,
        ...diaryEntry,
      },
    });
  } catch (error) {
    console.error("Error creando entrada:", error);
    return NextResponse.json(
      { success: false, error: "Error al crear la entrada del diario" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar entrada existente
export async function PUT(req: NextRequest) {
  try {
    const { userId, entryId, text, mood, tags } = await req.json();

    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "UserId y entryId son requeridos" },
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

    const updateData: Partial<DiaryEntry> = {
      updatedAt: FieldValue.serverTimestamp(),
    };

    if (text !== undefined) updateData.text = text.trim();
    if (mood !== undefined) updateData.mood = mood;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];

    const entryRef = db
      .collection("users")
      .doc(userId)
      .collection("diario")
      .doc(entryId);

    await entryRef.update(updateData);

    return NextResponse.json({
      success: true,
      message: "Entrada actualizada correctamente",
    });
  } catch (error) {
    console.error("Error actualizando entrada:", error);
    return NextResponse.json(
      { success: false, error: "Error al actualizar la entrada del diario" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar entrada
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const entryId = searchParams.get("entryId");

    if (!userId || !entryId) {
      return NextResponse.json(
        { error: "UserId y entryId son requeridos" },
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

    const entryRef = db
      .collection("users")
      .doc(userId)
      .collection("diario")
      .doc(entryId);

    await entryRef.delete();

    return NextResponse.json({
      success: true,
      message: "Entrada eliminada correctamente",
    });
  } catch (error) {
    console.error("Error eliminando entrada:", error);
    return NextResponse.json(
      { success: false, error: "Error al eliminar la entrada del diario" },
      { status: 500 }
    );
  }
}
