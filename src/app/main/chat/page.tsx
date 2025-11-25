"use client";
import { auth, db, googleProvider } from "@/lib/firebase";
import PersonIcon from "@mui/icons-material/Person";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import type { User } from "firebase/auth";
import { signInWithPopup } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type Message = {
  id?: string;
  text: string;
  sender: "user" | "bot";
  createdAt: Timestamp; // Cambio de any a Timestamp
};

export default function ChatPage() {
  const [user, setUser] = useState<User | null>(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll automático al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages]);

  // Escuchar autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Escuchar mensajes del usuario
  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "users", user.uid, "chat"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Message;
          msgs.push({ ...data, id: doc.id });
        });

        // Ordenar por timestamp
        msgs.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return a.createdAt.toMillis() - b.createdAt.toMillis();
        });

        setMessages(msgs);
      },
      (error) => {
        console.error("Error al escuchar Firestore:", error);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Login con Google
  const signIn = async () => {
    try {
      setIsLoading(true);
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim() || !user || isTyping) return;

    const userMessage = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      // Guardar mensaje del usuario
      await addDoc(collection(db, "users", user.uid, "chat"), {
        text: userMessage,
        sender: "user",
        createdAt: serverTimestamp(),
      });

      // Enviar a tu API (si quieres análisis de sentimientos, etc.)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      let botMessage = data.result || "Lo siento, no pude procesar tu mensaje.";

      // Si es una respuesta de emergencia, agregar un pequeño indicador
      if (data.isEmergencyResponse) {
        botMessage +=
          "\n\n💙 *Respuesta de apoyo automático - El servicio de IA está temporalmente no disponible*";
      }

      // Guardar respuesta del bot
      await addDoc(collection(db, "users", user.uid, "chat"), {
        text: botMessage,
        sender: "bot",
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Error completo:", err);

      // Guardar mensaje de error también
      if (user) {
        await addDoc(collection(db, "users", user.uid, "chat"), {
          text: "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.",
          sender: "bot",
          createdAt: serverTimestamp(),
        });
      }
    } finally {
      setIsTyping(false);
    }
  };

  // Manejar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-96 p-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-white/50">
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <span className="text-3xl">💬</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            Chat de Apoyo Emocional
          </h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Inicia sesión para comenzar a conversar con nuestro asistente de
            apoyo emocional
          </p>
          <button
            onClick={signIn}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:shadow-xl disabled:opacity-60 text-white font-semibold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Cargando...</span>
              </div>
            ) : (
              "🔐 Iniciar sesión con Google"
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg p-6 border border-white/50">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
            <span className="text-2xl">💬</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Chat de Apoyo Emocional
            </h1>
            <div className="text-green-600 text-sm flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Asistente disponible 24/7
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/50 flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                <SmartToyIcon
                  className="text-white"
                  style={{ fontSize: "2rem" }}
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                ¡Hola! Soy tu asistente de apoyo emocional
              </h3>
              <p className="text-gray-600 max-w-md leading-relaxed">
                Puedes contarme cómo te sientes, compartir tus preocupaciones o
                simplemente charlar. Estoy aquí para escucharte y brindarte
                apoyo cuando lo necesites.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-3 text-center">
                  <p className="text-green-700 font-medium text-sm">
                    💝 Apoyo emocional
                  </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-center">
                  <p className="text-blue-700 font-medium text-sm">
                    🧘 Mindfulness
                  </p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3 text-center">
                  <p className="text-purple-700 font-medium text-sm">
                    💭 Reflexiones
                  </p>
                </div>
                <div className="bg-pink-50 border border-pink-200 rounded-2xl p-3 text-center">
                  <p className="text-pink-700 font-medium text-sm">
                    🌱 Crecimiento personal
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-xs lg:max-w-md ${
                      msg.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
                          : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <PersonIcon />
                      ) : (
                        <SmartToyIcon />
                      )}
                    </div>

                    <div
                      className={`px-4 py-3 rounded-2xl shadow-sm max-w-full ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-sm"
                          : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                      }`}
                    >
                      <p className="text-sm break-words leading-relaxed">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-md animate-pulse">
                      <SmartToyIcon />
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 px-6 py-4 rounded-2xl rounded-bl-sm shadow-lg">
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2.5 h-2.5 bg-green-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                          <span className="text-green-700 text-sm font-medium animate-pulse">
                            Pensando...
                          </span>
                        </div>
                        <div className="w-48 h-1 bg-green-200 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex space-x-4">
            <input
              className="flex-1 border-2 border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              onKeyDown={handleKeyPress}
              disabled={isTyping}
            />

            <button
              className={`px-6 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center min-w-[120px] ${
                isTyping || !input.trim()
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transform"
              }`}
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
            >
              {isTyping ? (
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <div className="flex items-center space-x-2">
                  <SendIcon />
                  <span className="hidden sm:block">Enviar</span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
