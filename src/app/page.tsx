"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Calculator, FileText, FileSignature, Receipt,
  ArrowRight, Star, CheckCircle, Zap, Users, TrendingUp, Clock,
} from "lucide-react";

const tools = [
  {
    icon: Calculator,
    title: "Calculadora de Preço/Hora",
    desc: "Descubra exatamente quanto cobrar pelo seu trabalho com base nos seus custos reais, horas disponíveis e margem de lucro.",
    href: "/calculadora-preco",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    iconColor: "text-blue-600",
    shadow: "shadow-blue-200/50",
    border: "hover:border-blue-200",
    badge: "Mais usado",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    icon: FileText,
    title: "Gerador de Proposta",
    desc: "Gere propostas comerciais profissionais e personalizadas por nicho em menos de 2 minutos. Impressione seus clientes.",
    href: "/proposta",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    shadow: "shadow-emerald-200/50",
    border: "hover:border-emerald-200",
    badge: null,
    badgeColor: "",
  },
  {
    icon: FileSignature,
    title: "Gerador de Contrato",
    desc: "Crie contratos simples e eficazes para proteger seu trabalho, com cláusulas de prazo, pagamento e propriedade intelectual.",
    href: "/contrato",
    gradient: "from-violet-500 to-purple-600",
    bg: "bg-violet-50",
    iconColor: "text-violet-600",
    shadow: "shadow-violet-200/50",
    border: "hover:border-violet-200",
    badge: null,
    badgeColor: "",
  },
  {
    icon: Receipt,
    title: "Simulador MEI",
    desc: "Calcule quanto você pode faturar como MEI, qual o imposto mensal e se vale a pena abrir ou manter seu CNPJ.",
    href: "/mei",
    gradient: "from-orange-400 to-rose-500",
    bg: "bg-orange-50",
    iconColor: "text-orange-600",
    shadow: "shadow-orange-200/50",
    border: "hover:border-orange-200",
    badge: "Novo",
    badgeColor: "bg-orange-100 text-orange-700",
  },
];

const stats = [
  { icon: Users, value: "+12.000", label: "freelancers ativos", color: "text-emerald-500" },
  { icon: Zap, value: "4 ferramentas", label: "100% gratuitas", color: "text-blue-500" },
  { icon: TrendingUp, value: "R$0", label: "para usar tudo", color: "text-violet-500" },
  { icon: Clock, value: "2 min", label: "para gerar proposta", color: "text-orange-500" },
];

const testimonials = [
  { name: "Ana Lima", role: "Designer Freelancer", initials: "AL", color: "from-pink-400 to-rose-500", text: "A calculadora de preço mudou minha vida. Parei de cobrar barato e hoje faturei R$7k no mês.", stars: 5 },
  { name: "Carlos Souza", role: "Dev Full Stack", initials: "CS", color: "from-blue-400 to-cyan-500", text: "O gerador de contrato me salvou de um cliente caloteiro. Simples, direto e funcional.", stars: 5 },
  { name: "Juliana Matos", role: "Social Media", initials: "JM", color: "from-emerald-400 to-teal-500", text: "Uso todas as ferramentas toda semana. Profissionaliza muito meu trabalho sem gastar nada.", stars: 5 },
];

const proFeatures = [
  "Sem anúncios na plataforma",
  "15+ templates por nicho",
  "Histórico de propostas e contratos",
  "Download em PDF formatado",
  "Calculadora avançada de impostos",
  "Suporte prioritário por WhatsApp",
];

export default function Home() {
  const { data: session } = useSession();
  const isPro = session?.user?.isPro;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32 px-6 text-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-500/5 blur-3xl" />
          {/* Grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            100% gratuito · Sem cadastro · Sem enrolação
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-6 animate-fade-in-up animate-delay-100">
            Ferramentas para<br />
            <span className="shimmer-text">freelancers brasileiros</span>
          </h1>

          <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up animate-delay-200">
            Calcule seu preço, gere propostas, crie contratos e simule seu MEI.
            Tudo em um só lugar, de graça.
          </p>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in-up animate-delay-300">
            <Link
              href="/calculadora-preco"
              className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-6 sm:px-8 py-4 rounded-2xl text-base sm:text-lg transition-all duration-300 shadow-2xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 active:scale-95"
            >
              Calcular meu preço/hora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/proposta"
              className="group inline-flex items-center justify-center gap-2 border border-gray-700 hover:border-emerald-500/50 bg-white/5 hover:bg-white/10 text-white font-semibold px-6 sm:px-8 py-4 rounded-2xl text-base sm:text-lg transition-all duration-300 hover:scale-105 active:scale-95"
            >
              Gerar proposta grátis
              <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </div>

          {/* Floating tool pills */}
          <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-in-up animate-delay-400">
            {["Calculadora de Preço", "Proposta Comercial", "Contrato Profissional", "Simulador MEI"].map((label, i) => (
              <span
                key={label}
                className="text-xs font-medium bg-white/10 border border-white/10 text-gray-300 px-4 py-2 rounded-full animate-float"
                style={{ animationDelay: `${i * 0.5}s` }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center group">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
              <div className="text-sm text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Escolha uma ferramenta
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Todas gratuitas, sem precisar criar conta. Use agora mesmo.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className={`group relative p-8 rounded-3xl border-2 border-gray-100 ${t.border} bg-white hover:shadow-2xl ${t.shadow} transition-all duration-300 hover:-translate-y-1 overflow-hidden`}
              >
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${t.gradient} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-300 rounded-3xl`} />

                <div className="relative">
                  <div className="flex items-start justify-between mb-5">
                    <div className={`w-14 h-14 rounded-2xl ${t.bg} flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                      <t.icon className={`w-7 h-7 ${t.iconColor}`} />
                    </div>
                    {t.badge && (
                      <span className={`${t.badgeColor} text-xs font-bold px-3 py-1.5 rounded-full`}>
                        {t.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                    {t.title}
                  </h3>
                  <p className="text-gray-500 leading-relaxed mb-5 text-sm">{t.desc}</p>

                  <div className={`inline-flex items-center gap-2 font-bold text-sm bg-gradient-to-r ${t.gradient} bg-clip-text text-transparent`}>
                    Abrir ferramenta
                    <ArrowRight className={`w-4 h-4 ${t.iconColor} group-hover:translate-x-1.5 transition-transform duration-200`} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-4">
              Quem usa, recomenda
            </h2>
            <p className="text-gray-500 text-lg">+12.000 freelancers já usam o FreelancerTools.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="group bg-white p-8 rounded-3xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 text-sm">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-xs font-black shadow-md`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro CTA — esconde para usuários Pro */}
      {!isPro && <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 md:p-16 text-center">
            {/* decorations */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-teal-500/20 blur-3xl" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 text-sm font-semibold px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                Plano Pro — Para freelancers sérios
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
                Quer ainda mais recursos?
              </h2>
              <p className="text-gray-400 text-base sm:text-xl mb-10 max-w-2xl mx-auto">
                No plano Pro você desbloqueia templates premium, sem anúncios, histórico completo e muito mais.
              </p>

              <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-left max-w-2xl mx-auto mb-10">
                {proFeatures.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/pro"
                className="group inline-flex items-center gap-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-black px-10 py-4 rounded-2xl text-lg transition-all duration-300 shadow-2xl shadow-emerald-900/50 hover:shadow-emerald-700/50 hover:scale-105 active:scale-95"
              >
                Assinar Pro por R$29/mês
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-gray-600 text-sm mt-4">Garantia de 7 dias · Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>}

      <Footer />
    </div>
  );
}
