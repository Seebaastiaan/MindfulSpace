"use client";

import { BookOpen, Home, MessageCircle, Sparkles } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  {
    icon: Home,
    label: "Inicio",
    path: "/main",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: MessageCircle,
    label: "Chat",
    path: "/main/chat",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: BookOpen,
    label: "Diario",
    path: "/main/diario",
    color: "from-purple-500 to-indigo-500",
  },
  {
    icon: Sparkles,
    label: "Insights",
    path: "/main/bonito",
    color: "from-pink-500 to-rose-500",
  },
];

export default function Bottomsidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(0);

  // Actualizar tab activo basado en la ruta
  useEffect(() => {
    const currentTab = tabs.findIndex(
      (tab) =>
        pathname === tab.path ||
        (tab.path !== "/main" && pathname?.startsWith(tab.path))
    );
    if (currentTab !== -1) {
      setActiveTab(currentTab);
    }
  }, [pathname]);

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    router.push(tabs[index].path);
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg border-t border-gray-200/50 shadow-2xl shadow-gray-900/10">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex justify-around items-center">
          {tabs.map((tab, index) => {
            const Icon = tab.icon;
            const isActive = activeTab === index;

            return (
              <button
                key={index}
                onClick={() => handleTabClick(index)}
                className={`
                  relative flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-300 group
                  ${isActive ? "transform scale-110" : "hover:scale-105"}
                `}
              >
                {/* Background gradient for active tab */}
                {isActive && (
                  <div
                    className={`
                    absolute inset-0 bg-gradient-to-r ${tab.color} 
                    rounded-2xl opacity-15 blur-sm
                  `}
                  />
                )}

                {/* Icon container */}
                <div
                  className={`
                  relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300
                  ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} shadow-lg text-white`
                      : "text-gray-400 group-hover:text-gray-600 group-hover:bg-gray-50"
                  }
                `}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? "animate-pulse" : ""}`}
                  />
                </div>

                {/* Label */}
                <span
                  className={`
                  text-xs font-medium mt-1 transition-all duration-300
                  ${
                    isActive
                      ? "text-gray-900 font-semibold"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                `}
                >
                  {tab.label}
                </span>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="absolute -top-1 w-1 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
