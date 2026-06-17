"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Zap, ArrowRight, FileText, Calculator, FileSignature, Receipt } from "lucide-react";

const tools = [
  { href: "/calculadora-preco", icon: Calculator, label: "Calcular preço/hora" },
  { href: "/proposta", icon: FileText, label: "Gerar proposta" },
  { href: "/contrato", icon: FileSignature, label: "Gerar contrato" },
  { href: "/mei", icon: Receipt, label: "Simulador MEI" },
];

function ObrigadoContent() {
  const params = useSearchParams();
  const nome = params.get("nome") || "Freelancer";
  const plano = params.get("plano") === "agencia" ? "Agência" : "Pro";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center">
          {/* Success icon */}
          <div className="relative inline-flex mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-2xl shadow-emerald-200">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-400 opacity-20 animate-ping" />
          </div>

          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            <Zap className="w-4 h-4" />
            Plano {plano} ativado!
          </div>

          <h1 className="text-4xl font-black text-gray-900 mb-3">
            Bem-vindo, {decodeURIComponent(nome)}! 🎉
          </h1>
          <p className="text-gray-500 text-lg mb-10 leading-relaxed">
            Sua assinatura do plano <strong className="text-gray-700">{plano}</strong> foi confirmada.
            Você agora tem acesso a todos os recursos premium do FreelancerTools.
          </p>

          {/* Benefits recap */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 rounded-3xl p-8 mb-8 text-left">
            <h2 className="font-black text-gray-900 mb-4 text-center">O que você desbloqueou:</h2>
            <ul className="space-y-3">
              {[
                "Propostas ilimitadas com templates por nicho",
                "Contratos profissionais personalizados",
                "Sem nenhum anúncio na plataforma",
                "Download de documentos em PDF formatado",
                "Histórico completo de propostas e contratos",
                "Suporte prioritário via WhatsApp",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-gray-700">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Quick access */}
          <h2 className="font-bold text-gray-900 mb-4">Começar a usar agora:</h2>
          <div className="grid grid-cols-2 gap-3 mb-8">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group flex items-center gap-3 p-4 bg-white border-2 border-gray-100 hover:border-emerald-200 rounded-2xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 text-sm font-semibold text-gray-700 hover:text-emerald-600"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                  <t.icon className="w-4 h-4 text-emerald-600" />
                </div>
                {t.label}
                <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>

          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
          >
            Voltar para o início
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="text-gray-400">Carregando...</span></div>}>
      <ObrigadoContent />
    </Suspense>
  );
}
