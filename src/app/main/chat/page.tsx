"use client";

import { auth, db, googleProvider } from "@/lib/firebase";
import type { User } from "firebase/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type Message = {
  id?: string;
  text: string;
  sender: "user" | "bot";
  uid?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createdAt: any; // Timestamp de Firestore
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
      console.log("Estado de autenticación:", u ? u.email : "No autenticado");
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Escuchar mensajes en tiempo real solo si hay usuario
  useEffect(() => {
    if (!user) return;

    console.log("Configurando listener de Firestore para:", user.uid);
    const q = query(collection(db, "chat"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data() as Message;
          msgs.push({ ...data, id: doc.id });
        });

        // Filtrar mensajes del usuario actual y del bot
        const filteredMessages = msgs.filter(
          (m) => m.uid === user.uid || m.sender === "bot" || m.uid === "bot"
        );

        console.log("Mensajes recibidos:", filteredMessages.length);
        setMessages(filteredMessages);
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

  // Logout
  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
    }
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!input.trim() || !user || isTyping) return;

    const userMessage = input.trim();
    console.log("Enviando mensaje:", userMessage);

    setInput("");
    setIsTyping(true);

    try {
      // Guardar mensaje del usuario
      await addDoc(collection(db, "chat"), {
        text: userMessage,
        sender: "user",
        uid: user.uid,
        createdAt: serverTimestamp(),
      });

      console.log("Mensaje del usuario guardado en Firestore");

      // Enviar a tu API HuggingFace
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: userMessage }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log("Respuesta de la API:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      // Guardar respuesta del bot
      await addDoc(collection(db, "chat"), {
        text: data.result || "Lo siento, no pude procesar tu mensaje.",
        sender: "bot",
        uid: "bot",
        createdAt: serverTimestamp(),
      });

      console.log("Respuesta del bot guardada en Firestore");
    } catch (err) {
      console.error("Error completo:", err);

      // Guardar mensaje de error
      await addDoc(collection(db, "chat"), {
        text: "Lo siento, hubo un error procesando tu mensaje. Por favor intenta de nuevo.",
        sender: "bot",
        uid: "bot",
        createdAt: serverTimestamp(),
      });
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💬</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Chat de Apoyo Emocional
            </h1>
            <p className="text-gray-600">
              Inicia sesión para comenzar a chatear con nuestro asistente de
              apoyo
            </p>
          </div>
          <button
            onClick={signIn}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <span>🔐</span>
                <span>Iniciar sesión con Google</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-t-2xl shadow-lg p-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Chat de Apoyo Emocional
            </h1>
            <p className="text-gray-600 text-sm">
              Asistente empático disponible 24/7
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">
                {user.displayName || user.email}
              </p>
              <div className="flex items-center justify-end space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500">En línea</span>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition duration-200"
            >
              Salir
            </button>
          </div>
        </div>

        {/* Chat Container */}
        <div className="bg-white shadow-lg h-96 overflow-y-auto p-6 border-x">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                ¡Hola! Soy tu asistente de apoyo emocional
              </h3>
              <p className="text-gray-500 max-w-md">
                Puedes contarme cómo te sientes y estaré aquí para escucharte y
                brindarte apoyo.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={msg.id || i}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                      msg.sender === "user"
                        ? "flex-row-reverse space-x-reverse"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                      }`}
                    >
                      {msg.sender === "user" ? "👤" : "🤖"}
                    </div>
                    <div
                      className={`px-4 py-2 rounded-2xl shadow-sm ${
                        msg.sender === "user"
                          ? "bg-green-500 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-800 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm break-words">{msg.text}</p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm text-white">
                      🤖
                    </div>
                    <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white rounded-b-2xl shadow-lg p-6">
          <div className="flex space-x-4">
            <input
              className="flex-1 border border-gray-300 rounded-full px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu mensaje aquí..."
              onKeyDown={handleKeyPress}
              disabled={isTyping}
            />
            <button
              className={`px-6 py-3 rounded-full font-semibold transition duration-200 ${
                isTyping || !input.trim()
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
              }`}
              onClick={sendMessage}
              disabled={isTyping || !input.trim()}
            >
              {isTyping ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
              ) : (
                "Enviar"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
