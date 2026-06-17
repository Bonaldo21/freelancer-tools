"use client";
import { signIn } from "next-auth/react";
import { Wrench } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 to-gray-900 px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white text-xl">
              Freelancer<span className="text-emerald-400">Tools</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-white mb-2">Entrar na sua conta</h1>
          <p className="text-gray-400 text-sm">Acesse suas ferramentas e gerencie seu plano.</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="group w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-bold py-4 px-6 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg"
          >
            {/* Google icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continuar com Google
          </button>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <p className="text-gray-500 text-xs leading-relaxed">
              Ao entrar, você concorda com nossos{" "}
              <a href="#" className="text-emerald-400 hover:underline">Termos de uso</a>{" "}
              e{" "}
              <a href="#" className="text-emerald-400 hover:underline">Política de privacidade</a>.
            </p>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          <Link href="/" className="hover:text-gray-400 transition-colors">
            ← Voltar ao início
          </Link>
        </p>
      </div>
    </div>
  );
}
