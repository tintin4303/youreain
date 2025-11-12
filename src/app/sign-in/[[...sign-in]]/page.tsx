// src/app/sign-in/[[...sign-in]]/page.tsx
"use client";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  const { resolvedTheme } = useTheme();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <SignIn
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
        afterSignInUrl="/"
        appearance={{
          baseTheme: resolvedTheme === "dark" ? dark : undefined,
          variables: {
            colorPrimary: "#6366f1",
            colorBackground: resolvedTheme === "dark" ? "#111827" : "#ffffff",
            colorInputBackground: resolvedTheme === "dark" ? "#1f2937" : "#f9fafb",
            colorText: resolvedTheme === "dark" ? "#f3f4f6" : "#111827",
          },
          elements: {
            formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white font-medium",
            card: "shadow-xl rounded-2xl border border-gray-200 dark:border-gray-700",
            headerTitle: "text-2xl font-bold",
            headerSubtitle: "text-sm text-gray-600 dark:text-gray-400",
          },
        }}
      />
    </div>
  );
}