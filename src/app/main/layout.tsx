"use client";
import BottomSidebar from "@/components/BottomSideBar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Contenido principal */}
      <div className="flex-1">{children}</div>

      {/* Barra inferior siempre visible */}
      <div className="fixed bottom-0 left-0 right-0">
        <BottomSidebar />
      </div>
    </div>
  );
}
