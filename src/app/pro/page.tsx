"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle, Zap, Shield, Star, Loader2, Lock } from "lucide-react";
import Link from "next/link";

const features = [
  { free: "3 propostas/mês", pro: "Propostas ilimitadas" },
  { free: "Templates básicos", pro: "15+ templates por nicho" },
  { free: "Contrato genérico", pro: "Contratos por tipo de serviço" },
  { free: "Download em .txt", pro: "Download em PDF formatado" },
  { free: "Anúncios na plataforma", pro: "Sem nenhum anúncio" },
  { free: "Sem histórico", pro: "Histórico completo de documentos" },
  { free: "Calculadora básica", pro: "Calculadora avançada (IRPF, pró-labore)" },
  { free: "Suporte por e-mail", pro: "Suporte via WhatsApp" },
];

export default function ProPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-500 to-teal-700 text-white py-20 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4" />
              Plano Pro — Para freelancers sérios
            </div>
            <h1 className="text-5xl font-black mb-4">Pare de perder tempo.<br />Feche mais contratos.</h1>
            <p className="text-emerald-100 text-xl mb-8">
              Acesse todos os recursos premium do FreelancerTools por menos do que um café por semana.
            </p>
            <div className="inline-flex flex-col items-center bg-white rounded-2xl p-8 shadow-2xl text-gray-900">
              <div className="text-sm text-gray-500 mb-1">Plano Pro</div>
              <div className="text-6xl font-black text-emerald-600 mb-1">R$29</div>
              <div className="text-gray-500 mb-6">/mês · Cancele quando quiser</div>
              <Link
                href="#assinar"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-10 py-4 rounded-xl text-lg transition-colors w-full text-center"
              >
                Assinar agora
              </Link>
              <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Garantia de 7 dias ou seu dinheiro de volta
              </p>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-black text-gray-900 text-center mb-16">Grátis vs Pro</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="grid grid-cols-3 bg-gray-50 border-b border-gray-100">
                <div className="p-4 text-sm font-medium text-gray-500">Recurso</div>
                <div className="p-4 text-sm font-bold text-gray-700 text-center">Gratuito</div>
                <div className="p-4 text-sm font-bold text-emerald-600 text-center bg-emerald-50">Pro — R$29/mês</div>
              </div>
              {features.map((f, i) => (
                <div key={i} className={`grid grid-cols-3 border-b border-gray-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}>
                  <div className="p-4 text-sm text-gray-700">{f.free}</div>
                  <div className="p-4 flex justify-center">
                    <span className="text-sm text-gray-400">{f.free}</span>
                  </div>
                  <div className="p-4 flex items-center gap-2 bg-emerald-50/50">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-emerald-700">{f.pro}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 px-6 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Quem já assinou</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Pedro Alves", role: "Dev Freelancer", text: "O PDF formatado das propostas é incrível. Meus clientes ficam impressionados com o profissionalismo." },
                { name: "Camila Torres", role: "Designer", text: "Uso o histórico toda semana. Nunca mais perdi uma proposta antiga ou fiquei procurando contratos." },
                { name: "Bruno Costa", role: "Consultor de TI", text: "R$29/mês é nada comparado ao tempo que economizo. Já fechei R$15k esse mês com as ferramentas." },
              ].map((t) => (
                <div key={t.name} className="bg-white p-6 rounded-2xl shadow-sm">
                  <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map((i) => <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{t.text}&quot;</p>
                  <div className="text-sm font-bold text-gray-900">{t.name} <span className="font-normal text-gray-500">· {t.role}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Checkout form */}
        <section id="assinar" className="py-24 px-6">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Assinar Pro</h2>
            <p className="text-center text-gray-500 mb-8">R$29/mês · Cancele a qualquer momento</p>
            <CheckoutForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function CheckoutForm({ plano = "pro" }: { plano?: "pro" | "agencia" }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const valor = plano === "agencia" ? "R$127" : "R$29";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const res = await fetch("/api/assinar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, nome, plano }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErro(data.error || "Erro ao processar. Tente novamente.");
        return;
      }

      // Em dev usa sandbox, em produção usa link real
      const isDev = window.location.hostname === "localhost";
      window.location.href = isDev ? data.sandbox_init_point : data.init_point;
    } catch {
      setErro("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Nome completo</label>
        <input
          type="text"
          required
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 hover:border-gray-300 transition-colors"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
        <input
          type="email"
          required
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 hover:border-gray-300 transition-colors"
        />
        <p className="text-xs text-gray-400 mt-1.5">Use o mesmo e-mail da sua conta Mercado Pago.</p>
      </div>

      {erro && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700">
          {erro}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Redirecionando para o pagamento...
          </>
        ) : (
          <>
            <Lock className="w-4 h-4" />
            Assinar {plano === "agencia" ? "Agência" : "Pro"} — {valor}/mês
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
        <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Pagamento seguro</span>
        <span>·</span>
        <span>Garantia de 7 dias</span>
        <span>·</span>
        <span>Cancele quando quiser</span>
      </div>

      <div className="border-t border-gray-100 pt-4 text-center">
        <p className="text-xs text-gray-400">
          Você será redirecionado para o checkout seguro do{" "}
          <span className="font-semibold text-blue-500">Mercado Pago</span>.
          <br />Aceita PIX, cartão de crédito e boleto.
        </p>
      </div>
    </form>
  );
}
