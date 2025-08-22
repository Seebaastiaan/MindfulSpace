// app/api/diario/route.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json(
        { error: "No se recibió texto" },
        { status: 400 }
      );
    }

    console.log("Texto recibido del usuario:", text);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 300,
      },
    });

    const prompt = `El usuario escribió en su diario lo siguiente: "${text}".
    
Responde como un psicólogo empático, resaltando de manera positiva lo que escribió, 
dando un breve consejo de bienestar y reforzando sus emociones de manera cálida y profesional.
En español, breve pero significativo.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response) {
      throw new Error("No se recibió respuesta del modelo");
    }

    const generatedText =
      response.text() ||
      "No pude generar una reflexión en este momento, intenta nuevamente más tarde.";

    console.log("Respuesta de Gemini:", generatedText);

    return NextResponse.json({
      result: generatedText.trim(),
    });
  } catch (err: unknown) {
    console.error("Error de Google Gemini en Diario:", err);

    const errorMessage =
      err instanceof Error && err.message.includes("API_KEY")
        ? "Error de configuración. Por favor verifica tu API key."
        : "Lo siento, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo?";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
