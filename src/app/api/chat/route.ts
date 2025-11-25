import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
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

    // Verificar longitud de API key (las keys de Google suelen tener 39 caracteres)
    if (process.env.GOOGLE_API_KEY!.length < 20) {
      throw new Error("API key parece ser inválida");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        topP: 0.9,
        maxOutputTokens: 5000,
      },
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
        },
      ],
    });

    const prompt = `Actúa como un compañero de apoyo emocional inteligente, perspicaz y con los pies en la tierra.
NO eres un médico ni un robot genérico.
El usuario te dice: "${text}"

Tu proceso mental antes de responder:
1. Identifica la emoción oculta (ej. no solo "tristeza", sino "impotencia" o "agotamiento").
2. NO uses clichés vacíos como "Entiendo perfectamente" o "Siento mucho que pases por esto".
3. Busca aportar una pequeña perspectiva nueva o una pregunta que le ayude a entenderse mejor.

Genera tu respuesta final:
- Debe ser en Español neutro y natural.
- Breve (máximo 3 oraciones).
- Estructura: Conecta con la emoción específica + Ofrece un pensamiento que baje la ansiedad o una pregunta reflexiva (no interrogatorio).

Tu respuesta:`;

    const result = await model.generateContent(prompt);
    console.log("Result object:", result);

    const response = await result.response;
    console.log("Response object:", response);

    if (!response) {
      throw new Error("No se recibió respuesta del modelo");
    }

    // Intentar diferentes maneras de obtener el texto
    let generatedText;
    try {
      generatedText = response.text();
      console.log("response.text():", generatedText);
    } catch (textError) {
      console.error("Error al obtener text():", textError);
      // Intentar con candidates
      try {
        if (response.candidates && response.candidates.length > 0) {
          const candidate = response.candidates[0];
          if (
            candidate.content &&
            candidate.content.parts &&
            candidate.content.parts.length > 0
          ) {
            generatedText = candidate.content.parts[0].text;
            console.log("Texto desde candidates:", generatedText);
          }
        }
      } catch (candidateError) {
        console.error("Error al obtener desde candidates:", candidateError);
      }
    }

    // Verificar si la respuesta fue bloqueada por filtros de seguridad
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason && candidate.finishReason !== "STOP") {
        console.log("Respuesta bloqueada por:", candidate.finishReason);
        generatedText =
          "Entiendo que quieres compartir algo conmigo. Me gustaría ayudarte, pero necesito que reformules tu mensaje de una manera diferente para poder responder adecuadamente.";
      }
    }

    if (!generatedText || generatedText.trim() === "") {
      generatedText =
        "Lo siento, no pude generar una respuesta en este momento. ¿Podrías contarme un poco más sobre cómo te sientes?";
    }

    console.log("Respuesta final de Gemini:", generatedText);

    return NextResponse.json({
      result: generatedText.trim(),
    });
  } catch (err: unknown) {
    console.error("Error de Google Gemini:", err);

    let errorMessage =
      "Lo siento, estoy teniendo dificultades técnicas en este momento. ¿Podrías intentar de nuevo?";

    if (err instanceof Error) {
      if (err.message.includes("API_KEY") || err.message.includes("API key")) {
        errorMessage = "Error de configuración. Por favor verifica tu API key.";
      } else if (
        err.message.includes("not found") ||
        err.message.includes("404")
      ) {
        errorMessage =
          "El modelo de IA no está disponible temporalmente. Estoy trabajando en solucionarlo.";
      } else if (
        err.message.includes("quota") ||
        err.message.includes("limit")
      ) {
        errorMessage =
          "He alcanzado el límite de uso por hoy. Inténtalo más tarde.";
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
