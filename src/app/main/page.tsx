"use client";
import LogoutButton from "@/components/LogOut";
export default function MainPage() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center pb-16">
        <h1>
          {" "}
          <LogoutButton />
        </h1>
      </div>
      <div className="fixed bottom-0 left-0 right-0"></div>
    </>
  );
}
