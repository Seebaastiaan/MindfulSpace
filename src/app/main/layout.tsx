"use client";
import BottomSidebar from "@/components/BottomSideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Contenido principal */}
      <main className="flex-1 px-4 pt-4 pb-24">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>

      {/* Barra inferior siempre visible */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomSidebar />
      </div>
    </div>
  );
}
