"use client";

import { useState } from "react";
import Image from "next/image";
import { LoginForm } from "@/components/LoginForm";
import { RegisterForm } from "@/components/RegisterForm";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative z-10">
        <div className="flex mb-6">
          <button
            className={`flex-1 py-2 ${
              activeTab === "login"
                ? "text-[#2C3E50] border-b-2 border-[#2C3E50]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 ${
              activeTab === "register"
                ? "text-[#2C3E50] border-b-2 border-[#2C3E50]"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab("register")}
          >
            Register
          </button>
        </div>
        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
      <Image
        src="https://images.pexels.com/photos/26601041/pexels-photo-26601041.jpeg"
        alt="Building on a waterfront"
        layout="fill"
        objectFit="cover"
        className="absolute inset-0 z-0"
      />
    </div>
  );
}
