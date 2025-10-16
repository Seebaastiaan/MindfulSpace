"use client";

import Cards from "@/components/Cards";
import {
  Activity,
  ArrowRight,
  BarChart3,
  BookOpen,
  Brain,
  ExternalLink,
  Heart,
  MessageCircle,
  PieChart,
  Sparkles,
  Sun,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DemoPage() {
  const [currentView, setCurrentView] = useState("dashboard");
  const [progress, setProgress] = useState(0);

  // Simular progreso de carga
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 50);

    setTimeout(() => clearInterval(interval), 2500);
    return () => clearInterval(interval);
  }, []);

  const demoData = {
    totalEntries: 24,
    currentStreak: 7,
    wellnessScore: 85,
    emotions: [
      {
        emotion: "Alegría",
        count: 45,
        color: "from-yellow-400 to-orange-500",
        icon: "😊",
      },
      {
        emotion: "Calma",
        count: 35,
        color: "from-blue-400 to-cyan-500",
        icon: "😌",
      },
      {
        emotion: "Motivación",
        count: 30,
        color: "from-green-400 to-emerald-500",
        icon: "💪",
      },
      {
        emotion: "Reflexión",
        count: 25,
        color: "from-purple-400 to-indigo-500",
        icon: "🤔",
      },
      {
        emotion: "Gratitud",
        count: 20,
        color: "from-pink-400 to-rose-500",
        icon: "🙏",
      },
    ],
  };

  const demoEntries = [
    {
      date: "15 de Octubre, 2025",
      content:
        "Hoy fue un día increíble en el trabajo. Me siento muy motivado con el nuevo proyecto que empezamos...",
      mood: "😊 Positivo",
      sentiment: "Alegría, Motivación",
    },
    {
      date: "14 de Octubre, 2025",
      content:
        "Pasé tiempo meditando en el parque. La tranquilidad de la naturaleza me ayudó a reflexionar sobre mis objetivos...",
      mood: "😌 Sereno",
      sentiment: "Calma, Reflexión",
    },
    {
      date: "13 de Octubre, 2025",
      content:
        "Agradecido por las pequeñas cosas: mi café matutino, la llamada de mamá, y el hermoso atardecer de hoy...",
      mood: "🙏 Agradecido",
      sentiment: "Gratitud, Alegría",
    },
  ];

  if (progress < 100) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Cargando Demo de MindfulSpace
          </h1>
          <div className="w-80 bg-gray-200 rounded-full h-3 mx-auto overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-gray-600">
            Preparando tu vista previa personalizada...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Demo Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-lg">
                Vista Previa de MindfulSpace
              </h1>
              <p className="text-purple-100 text-sm">
                Explora todas las funciones sin registrarte
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm flex items-center space-x-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Cerrar Demo</span>
            </button>
            <button
              onClick={() => window.open("/", "_blank")}
              className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition-colors text-sm font-semibold"
            >
              Registrarse Gratis
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "diary", label: "Mi Diario", icon: BookOpen },
              { id: "chat", label: "Chat IA", icon: MessageCircle },
              { id: "insights", label: "Insights", icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCurrentView(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                    currentView === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Dashboard View */}
        {currentView === "dashboard" && (
          <div className="space-y-6">
            {/* Welcome Section */}
            <Cards variant="glass">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <Sun className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Buenos días</p>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Usuario Demo
                  </h1>
                  <p className="text-gray-500 text-sm">¿Cómo te sientes hoy?</p>
                </div>
              </div>
            </Cards>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Cards variant="bordered" className="text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-blue-900">
                  {demoData.totalEntries}
                </p>
                <p className="text-blue-600 text-sm font-medium">
                  Entradas del Diario
                </p>
              </Cards>

              <Cards variant="bordered" className="text-center">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-green-900">
                  {demoData.currentStreak} días
                </p>
                <p className="text-green-600 text-sm font-medium">
                  Racha Actual
                </p>
              </Cards>

              <Cards variant="bordered" className="text-center">
                <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <p className="text-2xl font-bold text-purple-900">
                  {demoData.wellnessScore}%
                </p>
                <p className="text-purple-600 text-sm font-medium">
                  Puntuación de Bienestar
                </p>
              </Cards>
            </div>

            {/* Recent Entries */}
            <Cards variant="gradient">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Entradas Recientes
              </h2>
              <div className="space-y-4">
                {demoEntries.slice(0, 2).map((entry, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {entry.date}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {entry.mood}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2">{entry.content}</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Sentimientos detectados:
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {entry.sentiment}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Cards>
          </div>
        )}

        {/* Diary View */}
        {currentView === "diary" && (
          <div className="space-y-6">
            <Cards variant="glass">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">
                  Mi Diario Personal
                </h1>
                <button className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:shadow-lg transition-all duration-300">
                  Nueva Entrada
                </button>
              </div>
            </Cards>

            <div className="space-y-4">
              {demoEntries.map((entry, index) => (
                <Cards key={index} variant="bordered">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">{entry.date}</span>
                    <span className="text-sm font-medium text-indigo-600">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3 leading-relaxed">
                    {entry.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        Análisis IA:
                      </span>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {entry.sentiment}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </Cards>
              ))}
            </div>
          </div>
        )}

        {/* Chat View */}
        {currentView === "chat" && (
          <div className="space-y-6">
            <Cards variant="glass">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Chat de Apoyo Emocional
                  </h1>
                  <p className="text-gray-600">
                    Tu asistente de IA está aquí para ayudarte
                  </p>
                </div>
              </div>
            </Cards>

            <Cards variant="bordered" className="h-96">
              <div className="space-y-4 h-full flex flex-col">
                <div className="flex-1 space-y-3 overflow-y-auto">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 max-w-xs">
                      <p className="text-sm text-gray-700">
                        ¡Hola! Soy tu asistente de bienestar. ¿En qué puedo
                        ayudarte hoy?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 justify-end">
                    <div className="bg-purple-500 text-white rounded-lg p-3 max-w-xs">
                      <p className="text-sm">
                        Me siento un poco abrumado con el trabajo. ¿Tienes algún
                        consejo?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 max-w-sm">
                      <p className="text-sm text-gray-700">
                        Entiendo que te sientes abrumado. Aquí tienes algunas
                        estrategias que podrían ayudarte:
                        <br />
                        <br />
                        1. Toma descansos regulares cada hora 2. Prioriza las
                        tareas más importantes 3. Practica respiración profunda
                        por 5 minutos
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-4 border-t">
                  <input
                    type="text"
                    placeholder="Escribe tu mensaje aquí..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    disabled
                  />
                  <button className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Cards>
          </div>
        )}

        {/* Insights View */}
        {currentView === "insights" && (
          <div className="space-y-6">
            <Cards variant="glass">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Tus Insights Emocionales
                  </h1>
                  <p className="text-gray-600">
                    Análisis inteligente de tu bienestar mental
                  </p>
                </div>
              </div>
            </Cards>

            {/* Emotion Distribution */}
            <Cards variant="gradient">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Distribución Emocional
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {demoData.emotions.map((emotion, index) => (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{emotion.icon}</span>
                        <span className="font-semibold text-gray-900">
                          {emotion.emotion}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {emotion.count}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`bg-gradient-to-r ${emotion.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${emotion.count}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Cards>

            {/* Insights Cards */}
            <Cards variant="bordered">
              <div className="flex items-center space-x-3 mb-6">
                <Zap className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Recomendaciones Personalizadas
                </h2>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-4 border border-yellow-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🌅</span>
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">
                        Mantén tus rutinas matutinas
                      </h4>
                      <p className="text-yellow-700 text-sm">
                        Tus entradas muestran mayor positividad cuando escribes
                        por las mañanas. ¡Sigue así!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 border border-green-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">
                        Excelente progreso emocional
                      </h4>
                      <p className="text-green-700 text-sm">
                        Tu puntuación de bienestar ha aumentado un 15% en las
                        últimas semanas.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">
                        ¡Racha de 7 días!
                      </h4>
                      <p className="text-blue-700 text-sm">
                        Has mantenido una excelente consistencia. Intenta llegar
                        a los 14 días.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Cards>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 mt-12">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">¿Te gusta lo que ves?</h2>
          <p className="text-purple-100 mb-6">
            Registrate gratis y comienza tu viaje hacia un mejor bienestar
            mental
          </p>
          <button
            onClick={() => window.open("/", "_blank")}
            className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Empezar Gratis con Google
          </button>
        </div>
      </div>
    </div>
  );
}
