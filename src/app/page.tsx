"use client";

import Redirect from "@/components/Redirect";
import { StructuredData } from "@/components/StructuredData";
import { auth, googleProvider } from "@/lib/firebase";
import {
  signInWithPopup,
  signInWithRedirect,
  signOut,
  User,
} from "firebase/auth";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Detectar si ya hay un usuario logueado
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser); // Actualizar estado con el usuario actual (null o user)
    });
    return () => unsubscribe();
  }, []);

  // Solo limpiar autoselección de Google, NO hacer signOut si hay usuario válido
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Solo deshabilitar autoselección de Google, no cerrar sesión existente
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).google?.accounts?.id?.disableAutoSelect?.();

        // Si no hay usuario después de un tiempo, asegurarse de que no hay sesiones fantasma
        setTimeout(() => {
          if (!auth.currentUser && !user) {
            // Solo hacer signOut si definitivamente no hay usuario
            signOut(auth).catch(() => {
              // Ignorar errores si no hay sesión que cerrar
            });
          }
        }, 1000);
      } catch (err) {
        console.warn("Error en inicialización de auth:", err);
      }
    };

    initializeAuth();
  }, [user]);

  // Testimonials carousel
  useEffect(() => {
    const testimonials = [
      {
        name: "María González",
        role: "Psicóloga",
        text: "Una herramienta increíble para el autoconocimiento emocional. Mis pacientes han mostrado mejoras significativas.",
        rating: 5,
      },
      {
        name: "Carlos Ruiz",
        role: "Usuario",
        text: "Me ayudó a entender mis patrones emocionales y a desarrollar mejores hábitos de autocuidado.",
        rating: 5,
      },
      {
        name: "Ana Martínez",
        role: "Terapeuta",
        text: "La combinación de diario personal y análisis de IA es revolucionaria para el bienestar mental.",
        rating: 5,
      },
    ];

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const loginWithGoogle = async () => {
    if (loading) return;
    setLoading(true);

    try {
      if (!auth) throw new Error("Firebase Auth no está inicializado");

      const canUseSessionStorage = (() => {
        try {
          const testKey = "__test__";
          sessionStorage.setItem(testKey, testKey);
          sessionStorage.removeItem(testKey);
          return true;
        } catch {
          return false;
        }
      })();

      if (canUseSessionStorage) {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
      } else {
        await signInWithRedirect(auth, googleProvider);
      }
    } catch (err) {
      console.error("Error en login:", err);
      alert(
        "No se pudo iniciar sesión. Revisa tu navegador o usa otro sin modo incógnito."
      );
    } finally {
      setLoading(false);
    }
  };

  const openDemo = () => {
    // Abrir en una nueva pestaña con una URL de demo
    window.open("/demo", "_blank");
  };

  const features = [
    {
      icon: BookOpen,
      title: "Diario Personal Inteligente",
      description:
        "Escribe tus pensamientos y reflexiones diarias de forma segura y privada",
    },
    {
      icon: Brain,
      title: "Análisis de Sentimientos con IA",
      description:
        "Nuestra IA analiza tus entradas para identificar patrones emocionales",
    },
    {
      icon: TrendingUp,
      title: "Seguimiento de Tendencias",
      description:
        "Visualiza tu progreso emocional y bienestar a lo largo del tiempo",
    },
    {
      icon: MessageCircle,
      title: "Chatbot de Apoyo Emocional",
      description:
        "Conversa con nuestro asistente inteligente cuando necesites apoyo",
    },
    {
      icon: Shield,
      title: "Privacidad y Seguridad",
      description:
        "Tus datos están protegidos con encriptación de nivel empresarial",
    },
    {
      icon: Sparkles,
      title: "Insights Personalizados",
      description:
        "Recibe recomendaciones personalizadas para mejorar tu bienestar",
    },
  ];

  const testimonials = [
    {
      name: "María González",
      role: "Psicóloga",
      text: "Una herramienta increíble para el autoconocimiento emocional. Mis pacientes han mostrado mejoras significativas.",
      rating: 5,
    },
    {
      name: "Carlos Ruiz",
      role: "Usuario",
      text: "Me ayudó a entender mis patrones emocionales y a desarrollar mejores hábitos de autocuidado.",
      rating: 5,
    },
    {
      name: "Ana Martínez",
      role: "Terapeuta",
      text: "La combinación de diario personal y análisis de IA es revolucionaria para el bienestar mental.",
      rating: 5,
    },
  ];

  const benefits = [
    "Mejora tu autoconocimiento emocional",
    "Identifica patrones y triggers",
    "Desarrolla hábitos saludables",
    "Acceso 24/7 a apoyo emocional",
    "Seguimiento científico del progreso",
    "Privacidad y seguridad garantizadas",
  ];

  if (user) {
    return <Redirect />;
  }

  return (
    <>
      <StructuredData />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <header className="relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 opacity-10"></div>

          {/* Navigation */}
          <nav className="relative px-4 py-6 max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                MindfulSpace
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Características
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Testimonios
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Beneficios
              </a>
            </div>
          </nav>

          {/* Hero Section */}
          <div className="relative px-4 py-16 max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Tu{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Diario Emocional
                  </span>{" "}
                  Inteligente
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Descubre patrones emocionales, recibe apoyo personalizado con
                  IA y mejora tu bienestar mental con nuestro asistente
                  inteligente disponible 24/7.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <button
                    onClick={loginWithGoogle}
                    disabled={loading}
                    className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-70 disabled:hover:scale-100"
                  >
                    <div className="flex items-center justify-center space-x-3">
                      {loading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                      ) : (
                        <>
                          <svg className="w-6 h-6" viewBox="0 0 24 24">
                            <path
                              fill="currentColor"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="currentColor"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="currentColor"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          <span>Continuar con Google</span>
                        </>
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                  </button>

                  <button
                    onClick={openDemo}
                    className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group"
                  >
                    Ver Demo
                    <Eye className="w-5 h-5 inline-block ml-2 group-hover:scale-110 transition-transform duration-300" />
                  </button>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span>Gratis para empezar</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span>100% Privado</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span>Hecho con amor</span>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="relative z-10 bg-white rounded-3xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        Hoy me siento...
                      </div>
                      <div className="text-sm text-gray-500">
                        Análisis de IA en tiempo real
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 mb-4">
                    <p className="text-gray-700 italic">
                      &ldquo;Hoy fue un día productivo en el trabajo. Me siento
                      optimista sobre el nuevo proyecto...&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex space-x-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        😊 Positivo
                      </span>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        🚀 Motivado
                      </span>
                    </div>
                    <TrendingUp className="w-6 h-6 text-green-500" />
                  </div>
                </div>

                <div className="absolute top-4 left-4 w-full h-full bg-gradient-to-r from-indigo-100 to-purple-100 rounded-3xl -z-10"></div>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características que transforman tu bienestar
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tecnología avanzada al servicio de tu salud mental y crecimiento
              personal
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials"
          className="py-20 px-4 bg-gradient-to-r from-gray-50 to-indigo-50"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros usuarios
            </h2>

            <div className="relative overflow-hidden">
              <div className="bg-white rounded-3xl shadow-2xl p-8 mx-4">
                <div className="flex justify-center mb-6">
                  {[...Array(testimonials[currentTestimonial].rating)].map(
                    (_, i) => (
                      <Star
                        key={i}
                        className="w-6 h-6 text-yellow-400 fill-current"
                      />
                    )
                  )}
                </div>

                <blockquote className="text-xl text-gray-700 italic mb-8 leading-relaxed">
                  &ldquo;{testimonials[currentTestimonial].text}&rdquo;
                </blockquote>

                <div>
                  <div className="font-semibold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-indigo-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>

              <div className="flex justify-center mt-8 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      currentTestimonial === index
                        ? "bg-indigo-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-20 px-4 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8">
                ¿Por qué elegir MindfulSpace?
              </h2>

              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700 group-hover:text-indigo-600 transition-colors duration-300">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button
                  onClick={loginWithGoogle}
                  disabled={loading}
                  className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold text-lg hover:shadow-xl hover:shadow-indigo-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-70"
                >
                  <div className="flex items-center space-x-3">
                    {loading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <>
                        <span>Comenzar ahora</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white transform rotate-2 hover:rotate-0 transition-transform duration-300">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-4">
                    Análisis Emocional Semanal
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Alegría</span>
                      <div className="w-24 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div className="w-4/5 h-full bg-yellow-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Calma</span>
                      <div className="w-24 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div className="w-3/5 h-full bg-blue-300 rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Energía</span>
                      <div className="w-24 h-2 bg-white bg-opacity-30 rounded-full overflow-hidden">
                        <div className="w-4/6 h-full bg-green-300 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-20 rounded-xl p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="font-semibold">Insight de la semana</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Tus niveles de energía aumentaron un 15% esta semana.
                    ¡Mantén esos hábitos positivos!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-xl text-gray-600">
                Resolvemos tus dudas sobre MindfulSpace
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "¿Es MindfulSpace gratuito?",
                  answer:
                    "Sí, MindfulSpace es completamente gratuito para empezar. Ofrecemos todas las funciones básicas sin costo alguno, incluyendo el diario emocional, análisis de sentimientos y el chatbot de apoyo.",
                },
                {
                  question: "¿Mis datos están seguros?",
                  answer:
                    "Absolutamente. Utilizamos encriptación de nivel empresarial y seguimos las mejores prácticas de seguridad para proteger tu información personal. Tus datos nunca se comparten con terceros sin tu consentimiento.",
                },
                {
                  question: "¿Cómo funciona el análisis de sentimientos?",
                  answer:
                    "Utilizamos inteligencia artificial avanzada para analizar el contenido de tus entradas del diario y identificar patrones emocionales. La IA examina el lenguaje, tono y contexto para proporcionar insights valiosos sobre tu bienestar mental.",
                },
                {
                  question: "¿Puedo usar MindfulSpace en mi teléfono?",
                  answer:
                    "Sí, MindfulSpace está completamente optimizado para todos los dispositivos, incluyendo teléfonos móviles, tablets y computadoras de escritorio. Puedes acceder desde cualquier navegador web moderno.",
                },
                {
                  question:
                    "¿El chatbot puede reemplazar a un terapeuta profesional?",
                  answer:
                    "No, nuestro chatbot es una herramienta de apoyo emocional, pero no reemplaza la atención profesional. Si experimentas problemas graves de salud mental, te recomendamos buscar ayuda de un profesional calificado.",
                },
                {
                  question: "¿Cómo empiezo a usar MindfulSpace?",
                  answer:
                    "Es muy simple: solo necesitas hacer clic en 'Continuar con Google', autorizar el acceso y comenzar a escribir en tu diario. El proceso toma menos de 2 minutos y puedes empezar a recibir insights inmediatamente.",
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-8 hover:shadow-lg transition-shadow duration-300"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                    <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed ml-12">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-8">
              Comienza tu viaje hacia el bienestar mental hoy
            </h2>
            <p className="text-xl text-indigo-100 mb-12 leading-relaxed">
              Únete a miles de usuarios que han transformado su relación con sus
              emociones. Es gratis, es privado y está disponible cuando lo
              necesites.
            </p>

            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="group px-12 py-6 bg-white text-indigo-600 rounded-3xl font-bold text-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-70"
            >
              <div className="flex items-center space-x-3">
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span>Empezar gratis con Google</span>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                  </>
                )}
              </div>
            </button>

            <p className="text-indigo-200 text-sm mt-6">
              Sin tarjeta de crédito • Configuración en 2 minutos • Privacidad
              garantizada
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-xl font-bold">MindfulSpace</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Tu compañero de confianza para el bienestar mental y el
                  crecimiento emocional.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Producto</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Características
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Seguridad
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Privacidad
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Recursos</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Blog
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Guías
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Soporte
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Empresa</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Sobre nosotros
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Contacto
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors">
                      Términos
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
              <p>&copy; 2025 MindfulSpace. Hecho con amor para eve ❤️.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
