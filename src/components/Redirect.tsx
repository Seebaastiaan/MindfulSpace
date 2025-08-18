"use client";

import { Progress } from "@/components/ui/progress";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import * as React from "react";

export default function Redirect() {
  const [progress, setProgress] = React.useState(0);
  const router = useRouter();

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        interval = setInterval(() => {
          setProgress((prev) => {
            const next = prev + Math.random() * 90;
            return next >= 97 ? 97 : next;
          });
        }, 200);

        setTimeout(() => {
          clearInterval(interval);
          setProgress(100);
          router.push("/main");
        }, 1000);
      }
    });

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="min-h-screen w-full bg-black flex flex-col items-center justify-center text-white">
      <h1 className="text-2xl mb-6">Redirigiendo...</h1>
      <Progress
        value={progress}
        className="w-[60%] rounded-full bg-gray-800 [--tw-bg-opacity:1] [&>div]:bg-[#FFC0CB]"
      />
    </div>
  );
}
