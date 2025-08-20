import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      console.log("No se recibió texto");
      return NextResponse.json(
        { error: "No se recibió texto" },
        { status: 400 }
      );
    }

    console.log("Enviando a Google Gemini:", text);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Modelo actualizado y GRATIS
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 200,
      },
    });

    const prompt = `Como psicólogo empático y comprensivo especializado en apoyo emocional, responde de manera cálida, positiva y profesional a esta persona que dice: "${text}"

Características de tu respuesta:
- Empática y comprensiva
- Breve pero significativa
- Enfocada en validar emociones y ofrecer apoyo
- En español
- Tono cálido y profesional
- No uses jerga técnica
- No uses muletillas
- Varía tus inicios de frase, evita repetir siempre "Entiendo". 

Respuesta empática:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response) {
      throw new Error("No se recibió respuesta del modelo");
    }

    const generatedText =
      response.text() ||
      "Lo siento, no pude generar una respuesta en este momento. ¿Podrías contarme un poco más sobre cómo te sientes?";

    console.log("Respuesta de Gemini:", generatedText);

    return NextResponse.json({
      result: generatedText.trim(),
    });
  } catch (err: unknown) {
    console.error("Error de Google Gemini:", err);

    // Mensaje de error más empático para el usuario
    const errorMessage =
      err instanceof Error && err.message.includes("API_KEY")
        ? "Error de configuración. Por favor verifica tu API key."
        : "Lo siento, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo?";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
