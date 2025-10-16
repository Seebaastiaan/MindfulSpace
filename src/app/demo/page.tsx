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
import { useMemo, useState } from "react";

export default function DemoPage() {
  const [currentView, setCurrentView] = useState("dashboard");

  // Memoizar datos para evitar recreaciones innecesarias
  const demoData = useMemo(
    () => ({
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
    }),
    []
  );

  const demoEntries = useMemo(
    () => [
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
    ],
    []
  );

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
        {/* Renderizar solo la vista actual para mejorar performance */}
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

            {/* Recent Entries - Simplificado */}
            <Cards variant="gradient">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Entradas Recientes
              </h2>
              <div className="space-y-3">
                {demoEntries.slice(0, 2).map((entry, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg p-4 border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {entry.date}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        {entry.mood}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-2 text-sm leading-relaxed">
                      {entry.content.substring(0, 100)}...
                    </p>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {entry.sentiment}
                    </span>
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

            <div className="space-y-3">
              {demoEntries.map((entry, index) => (
                <Cards key={index} variant="bordered">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">{entry.date}</span>
                    <span className="text-xs font-medium text-indigo-600">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2 leading-relaxed text-sm">
                    {entry.content.substring(0, 150)}...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      {entry.sentiment}
                    </span>
                    <Heart className="w-3 h-3 text-gray-400" />
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

            <Cards variant="bordered" className="h-80">
              <div className="space-y-3 h-full flex flex-col">
                <div className="flex-1 space-y-2 overflow-y-auto">
                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-green-50 rounded p-2 max-w-xs">
                      <p className="text-xs text-gray-700">
                        ¡Hola! Soy tu asistente. ¿Cómo te sientes?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 justify-end">
                    <div className="bg-purple-500 text-white rounded p-2 max-w-xs">
                      <p className="text-xs">
                        Me siento abrumado con el trabajo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Brain className="w-3 h-3 text-white" />
                    </div>
                    <div className="bg-green-50 rounded p-2 max-w-sm">
                      <p className="text-xs text-gray-700">
                        Entiendo. Prueba estos consejos:
                        <br />• Descansos cada hora
                        <br />• Prioriza tareas importantes
                        <br />• Respiración profunda 5 min
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-2 border-t">
                  <input
                    type="text"
                    placeholder="Mensaje demo..."
                    className="flex-1 px-3 py-1 border border-gray-200 rounded text-sm"
                    disabled
                  />
                  <button className="px-3 py-1 bg-purple-500 text-white rounded text-sm">
                    <ArrowRight className="w-3 h-3" />
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

            {/* Emotion Distribution - Optimizada */}
            <Cards variant="bordered">
              <div className="flex items-center space-x-3 mb-6">
                <PieChart className="w-6 h-6 text-indigo-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Distribución Emocional
                </h2>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                {demoData.emotions.slice(0, 6).map((emotion, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3 border">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-1">
                        <span className="text-lg">{emotion.icon}</span>
                        <span className="font-medium text-sm text-gray-900">
                          {emotion.emotion}
                        </span>
                      </div>
                      <span className="text-sm font-bold text-gray-600">
                        {emotion.count}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded h-1.5">
                      <div
                        className="bg-indigo-500 h-1.5 rounded"
                        style={{ width: `${emotion.count}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </Cards>

            {/* Insights Cards - Simplificadas */}
            <Cards variant="bordered">
              <div className="flex items-center space-x-3 mb-4">
                <Zap className="w-6 h-6 text-yellow-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Recomendaciones
                </h2>
              </div>

              <div className="space-y-3">
                <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🌅</span>
                    <div>
                      <h4 className="font-medium text-yellow-800 text-sm">
                        Mantén tus rutinas matutinas
                      </h4>
                      <p className="text-yellow-700 text-xs">
                        Mayor positividad en las mañanas. ¡Sigue así!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🎯</span>
                    <div>
                      <h4 className="font-medium text-green-800 text-sm">
                        Excelente progreso
                      </h4>
                      <p className="text-green-700 text-xs">
                        Bienestar aumentado 15% en las últimas semanas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Cards>
          </div>
        )}
      </div>

      {/* CTA Footer - Simplificado */}
      <div className="bg-purple-600 text-white p-6 mt-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-2">¿Te gusta lo que ves?</h2>
          <p className="text-purple-100 mb-4 text-sm">
            Registrate gratis y comienza tu viaje hacia un mejor bienestar
          </p>
          <button
            onClick={() => window.open("/", "_blank")}
            className="px-6 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100"
          >
            Empezar Gratis
          </button>
        </div>
      </div>
    </div>
  );
}
