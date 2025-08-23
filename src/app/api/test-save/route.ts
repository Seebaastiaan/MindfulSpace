// /api/test-save/route.ts
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId)
      return NextResponse.json({ success: false, error: "Falta userId" });

    const docRef = await addDoc(
      collection(db, `users/${userId}/sentiment_analysis`),
      {
        test: "ok",
        createdAt: serverTimestamp(),
      }
    );

    return NextResponse.json({ success: true, id: docRef.id });
  } catch (err) {
    console.error("Error guardando análisis:", err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
}
