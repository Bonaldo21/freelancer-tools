"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdBanner from "@/components/AdBanner";
import { Calculator, TrendingUp, AlertCircle, Info, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

function currency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function CalculadoraPreco() {
  const [form, setForm] = useState({
    salarioDesejado: 5000,
    horasMes: 160,
    diasFerias: 30,
    custosMensais: 800,
    impostos: 15,
    lucro: 20,
  });

  const [resultado, setResultado] = useState({
    precoHora: 0,
    precoHoraComLucro: 0,
    precoHoraSugerido: 0,
    faturamentoNecessario: 0,
    horasUteisAno: 0,
  });

  useEffect(() => {
    const horasUteisAno = form.horasMes * 12 - (form.diasFerias / 30) * form.horasMes;
    const horasUteisMes = horasUteisAno / 12;
    const faturamentoNecessario =
      form.salarioDesejado + form.custosMensais + (form.salarioDesejado * form.impostos) / 100;
    const precoHora = faturamentoNecessario / horasUteisMes;
    const precoHoraComLucro = precoHora * (1 + form.lucro / 100);
    const precoHoraSugerido = Math.ceil(precoHoraComLucro / 5) * 5;
    setResultado({ precoHora, precoHoraComLucro, precoHoraSugerido, faturamentoNecessario, horasUteisAno });
  }, [form]);

  const level =
    resultado.precoHoraSugerido < 50 ? { label: "Júnior", color: "from-blue-400 to-cyan-500", badge: "bg-blue-100 text-blue-700" }
    : resultado.precoHoraSugerido < 120 ? { label: "Pleno", color: "from-emerald-400 to-teal-500", badge: "bg-emerald-100 text-emerald-700" }
    : { label: "Sênior", color: "from-violet-500 to-purple-600", badge: "bg-violet-100 text-violet-700" };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-cyan-500 px-6 py-12 text-white">
        <div className="max-w-5xl mx-auto flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shadow-lg">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black">Calculadora de Preço/Hora</h1>
            <p className="text-blue-100 mt-1">Descubra quanto você deve cobrar para atingir seus objetivos.</p>
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full -mt-4">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
            <h2 className="font-black text-gray-900 text-lg mb-6 flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 text-xs font-black">1</span>
              Seus dados financeiros
            </h2>
            <div className="space-y-6">
              <Slider label="Salário líquido desejado" value={form.salarioDesejado} min={1000} max={30000} step={500} format={currency} color="blue" onChange={(v) => setForm(p => ({ ...p, salarioDesejado: v }))} />
              <Slider label="Horas trabalhadas por mês" value={form.horasMes} min={20} max={240} step={4} format={(v) => `${v}h`} color="blue" onChange={(v) => setForm(p => ({ ...p, horasMes: v }))} />
              <Slider label="Dias de férias por ano" value={form.diasFerias} min={0} max={60} step={5} format={(v) => `${v} dias`} color="blue" onChange={(v) => setForm(p => ({ ...p, diasFerias: v }))} />
              <Slider label="Custos mensais (internet, software…)" value={form.custosMensais} min={0} max={5000} step={100} format={currency} color="blue" onChange={(v) => setForm(p => ({ ...p, custosMensais: v }))} />
              <Slider label="Impostos estimados" value={form.impostos} min={0} max={40} step={1} format={(v) => `${v}%`} color="blue" onChange={(v) => setForm(p => ({ ...p, impostos: v }))} />
              <Slider label="Margem de lucro" value={form.lucro} min={0} max={100} step={5} format={(v) => `${v}%`} color="blue" onChange={(v) => setForm(p => ({ ...p, lucro: v }))} />
            </div>
          </div>

          {/* Results */}
          <div className="space-y-5">
            {/* Main result */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${level.color} rounded-3xl p-8 text-white text-center shadow-2xl`}>
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]" />
              <div className="relative">
                <div className="text-white/70 text-sm font-medium mb-1">Seu preço/hora sugerido</div>
                <div className="text-6xl font-black mb-2">{currency(resultado.precoHoraSugerido)}</div>
                <div className="text-white/70 text-sm mb-4">por hora de trabalho</div>
                <span className={`inline-block ${level.badge} text-sm font-bold px-4 py-1.5 rounded-full`}>
                  Perfil {level.label}
                </span>
              </div>
            </div>

            {/* Grid cards */}
            <div className="grid grid-cols-2 gap-4">
              <ResultCard icon={<AlertCircle className="w-4 h-4 text-orange-500" />} label="Preço mínimo/hora" value={currency(resultado.precoHora)} tip="Cobrar abaixo = prejuízo" />
              <ResultCard icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} label="Com lucro incluído" value={currency(resultado.precoHoraComLucro)} tip="Inclui sua margem" />
              <ResultCard icon={<Info className="w-4 h-4 text-blue-500" />} label="Faturamento mensal" value={currency(resultado.faturamentoNecessario)} tip="Bruto necessário" />
              <ResultCard icon={<Calculator className="w-4 h-4 text-violet-500" />} label="Horas úteis/ano" value={`${Math.round(resultado.horasUteisAno)}h`} tip="Descontando férias" />
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-800 leading-relaxed">
                    <strong>Dica pro:</strong> Para orçar projetos, multiplique seu preço/hora pelas horas estimadas e adicione <strong>20% de buffer</strong> para imprevistos e reuniões.
                  </p>
                </div>
              </div>
            </div>

            <Link href="/proposta" className="group flex items-center justify-center gap-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.02] active:scale-95">
              Gerar proposta com esse valor
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <AdBanner slot="2847391056" format="horizontal" className="mt-8 rounded-2xl bg-gray-100 min-h-[90px]" />
      </main>
      <Footer />
    </div>
  );
}

function Slider({ label, value, min, max, step, format, color, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; color: string; onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const thumbColor = color === "blue" ? "#3b82f6" : color === "orange" ? "#f97316" : "#8b5cf6";
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-black text-blue-600 bg-blue-50 px-3 py-0.5 rounded-full">{format(value)}</span>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ background: `linear-gradient(to right, ${thumbColor} ${pct}%, #e5e7eb ${pct}%)` }}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
        />
      </div>
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}

function ResultCard({ label, value, icon, tip }: { label: string; value: string; icon: React.ReactNode; tip: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <div className="text-xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">{value}</div>
      <div className="text-xs text-gray-400 mt-1">{tip}</div>
    </div>
  );
}
