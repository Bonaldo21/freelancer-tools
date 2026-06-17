"use client";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Zap, Calculator, FileText, FileSignature, Receipt, LogOut, Crown, ArrowRight } from "lucide-react";

const tools = [
  { href: "/calculadora-preco", icon: Calculator, label: "Calculadora Preço/Hora", desc: "Calcule quanto cobrar" },
  { href: "/proposta", icon: FileText, label: "Gerador de Proposta", desc: "Propostas profissionais" },
  { href: "/contrato", icon: FileSignature, label: "Gerador de Contrato", desc: "Contratos por nicho" },
  { href: "/mei", icon: Receipt, label: "Simulador MEI", desc: "Calcule seu DAS" },
];

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!session) {
    redirect("/login");
  }

  const isPro = session.user?.isPro;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            {session.user?.image ? (
              <img src={session.user.image} alt="" className="w-14 h-14 rounded-2xl shadow-md" />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-black text-xl">
                {session.user?.name?.[0] ?? "?"}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-black text-gray-900">
                Olá, {session.user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-500 text-sm">{session.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>

        {/* Status do plano */}
        {isPro ? (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-300" />
              </div>
              <div>
                <div className="font-black text-lg">Plano Pro ativo ✓</div>
                <div className="text-emerald-100 text-sm">Você tem acesso completo a todas as ferramentas.</div>
              </div>
            </div>
            <CheckCircle className="w-8 h-8 text-emerald-200" />
          </div>
        ) : (
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <div className="font-black text-lg">Plano Gratuito</div>
                <div className="text-gray-400 text-sm">Assine o Pro para desbloquear todos os recursos.</div>
              </div>
            </div>
            <Link
              href="/pro#assinar"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-900/30 whitespace-nowrap"
            >
              <Zap className="w-4 h-4" />
              Assinar Pro — R$29/mês
            </Link>
          </div>
        )}

        {/* Ferramentas */}
        <h2 className="font-black text-gray-900 text-lg mb-4">Suas ferramentas</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {tools.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="group bg-white border-2 border-gray-100 hover:border-emerald-200 rounded-2xl p-6 flex items-center gap-4 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors flex-shrink-0">
                <t.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-gray-900 text-sm">{t.label}</div>
                <div className="text-gray-500 text-xs mt-0.5">{t.desc}</div>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
