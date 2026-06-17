"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import AdBanner from "@/components/AdBanner";
import { Receipt, CheckCircle, XCircle, AlertCircle, TrendingUp } from "lucide-react";

const MEI_LIMITE_ANUAL = 81000;
const MEI_LIMITE_MENSAL = MEI_LIMITE_ANUAL / 12;

// Tabela DAS 2024 (valores aproximados)
const DAS_COMERCIO = 76.90;
const DAS_SERVICO = 80.90;
const DAS_TRANSPORTADOR = 82.90;

function currency(val: number) {
  return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function MeiPage() {
  const [form, setForm] = useState({
    faturamentoMensal: 5000,
    tipo: "servico" as "comercio" | "servico" | "transportador",
    despesasMensais: 1000,
    funcionario: false,
  });

  const [resultado, setResultado] = useState({
    dasMensal: 0,
    inssAnual: 0,
    faturamentoAnual: 0,
    margemLiquidaMensal: 0,
    percentualImposto: 0,
    situacao: "ok" as "ok" | "alerta" | "limite",
    faturamentoRestante: 0,
  });

  useEffect(() => {
    const das =
      form.tipo === "comercio" ? DAS_COMERCIO :
      form.tipo === "transportador" ? DAS_TRANSPORTADOR : DAS_SERVICO;

    const dasComFuncionario = form.funcionario ? das + 103.37 : das;
    const faturamentoAnual = form.faturamentoMensal * 12;
    const inssAnual = dasComFuncionario * 12;
    const margemLiquidaMensal = form.faturamentoMensal - dasComFuncionario - form.despesasMensais;
    const percentualImposto = (dasComFuncionario / form.faturamentoMensal) * 100;
    const faturamentoRestante = MEI_LIMITE_ANUAL - faturamentoAnual;
    const situacao =
      faturamentoAnual > MEI_LIMITE_ANUAL ? "limite" :
      faturamentoAnual > MEI_LIMITE_ANUAL * 0.8 ? "alerta" : "ok";

    setResultado({ dasMensal: dasComFuncionario, inssAnual, faturamentoAnual, margemLiquidaMensal, percentualImposto, situacao, faturamentoRestante });
  }, [form]);

  const tipoLabel = { comercio: "Comércio/Indústria", servico: "Prestação de Serviços", transportador: "Transportador Autônomo" };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <PageHeader icon={Receipt} title="Simulador MEI" description="Calcule seu imposto mensal (DAS) e veja se seu faturamento está dentro do limite." gradient="from-orange-500 to-rose-500" />
      <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full -mt-4">

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Inputs */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <h2 className="font-bold text-gray-900 mb-5">Seus dados MEI</h2>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de atividade</label>
                  <div className="grid grid-cols-1 gap-2">
                    {(["comercio", "servico", "transportador"] as const).map((t) => (
                      <label key={t} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${form.tipo === t ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-gray-200"}`}>
                        <input type="radio" name="tipo" value={t} checked={form.tipo === t} onChange={() => setForm((p) => ({ ...p, tipo: t }))} className="accent-orange-500" />
                        <span className="text-sm font-medium text-gray-700">{tipoLabel[t]}</span>
                        <span className="ml-auto text-xs text-gray-500">DAS: {currency(t === "comercio" ? DAS_COMERCIO : t === "transportador" ? DAS_TRANSPORTADOR : DAS_SERVICO)}/mês</span>
                      </label>
                    ))}
                  </div>
                </div>

                <SliderMEI
                  label="Faturamento mensal estimado"
                  value={form.faturamentoMensal}
                  min={500}
                  max={8000}
                  step={100}
                  format={currency}
                  onChange={(v) => setForm((p) => ({ ...p, faturamentoMensal: v }))}
                />

                <SliderMEI
                  label="Despesas mensais (custos fixos)"
                  value={form.despesasMensais}
                  min={0}
                  max={5000}
                  step={100}
                  format={currency}
                  onChange={(v) => setForm((p) => ({ ...p, despesasMensais: v }))}
                />

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.funcionario}
                    onChange={(e) => setForm((p) => ({ ...p, funcionario: e.target.checked }))}
                    className="w-4 h-4 accent-orange-500"
                  />
                  <span className="text-sm text-gray-700">Tenho 1 funcionário contratado</span>
                  <span className="text-xs text-gray-400">(+R$103,37/mês no DAS)</span>
                </label>
              </div>
            </div>

            {/* Info cards */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 space-y-1">
              <strong>Limites MEI 2024:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Faturamento anual máximo: {currency(MEI_LIMITE_ANUAL)}</li>
                <li>• Faturamento mensal médio: {currency(MEI_LIMITE_MENSAL)}</li>
                <li>• Máximo de 1 funcionário com salário mínimo</li>
                <li>• Não pode ter sócio ou ser sócio de outra empresa</li>
              </ul>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Situação */}
            <div className={`rounded-2xl p-6 border-2 ${
              resultado.situacao === "ok" ? "bg-emerald-50 border-emerald-200" :
              resultado.situacao === "alerta" ? "bg-yellow-50 border-yellow-300" :
              "bg-red-50 border-red-300"
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {resultado.situacao === "ok" && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                {resultado.situacao === "alerta" && <AlertCircle className="w-6 h-6 text-yellow-600" />}
                {resultado.situacao === "limite" && <XCircle className="w-6 h-6 text-red-600" />}
                <span className={`font-bold text-lg ${
                  resultado.situacao === "ok" ? "text-emerald-700" :
                  resultado.situacao === "alerta" ? "text-yellow-700" : "text-red-700"
                }`}>
                  {resultado.situacao === "ok" && "Dentro do limite MEI ✓"}
                  {resultado.situacao === "alerta" && "Atenção: próximo do limite!"}
                  {resultado.situacao === "limite" && "Acima do limite MEI!"}
                </span>
              </div>
              <p className={`text-sm ${
                resultado.situacao === "ok" ? "text-emerald-600" :
                resultado.situacao === "alerta" ? "text-yellow-600" : "text-red-600"
              }`}>
                {resultado.situacao === "ok" && `Você ainda tem ${currency(resultado.faturamentoRestante)} disponíveis no ano.`}
                {resultado.situacao === "alerta" && `Apenas ${currency(resultado.faturamentoRestante)} restam para o limite anual. Considere abrir uma ME.`}
                {resultado.situacao === "limite" && "Seu faturamento ultrapassa o limite MEI. Você deve migrar para ME ou EPP."}
              </p>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-orange-100 transition-all duration-200 group">
                <div className="text-xs text-gray-500 mb-1 font-medium">DAS mensal</div>
                <div className="text-2xl font-black text-orange-500 group-hover:scale-105 transition-transform origin-left">{currency(resultado.dasMensal)}</div>
                <div className="text-xs text-gray-400 mt-1">Boleto obrigatório todo mês</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-200 group">
                <div className="text-xs text-gray-500 mb-1 font-medium">DAS anual (INSS)</div>
                <div className="text-2xl font-black text-gray-900 group-hover:scale-105 transition-transform origin-left">{currency(resultado.inssAnual)}</div>
                <div className="text-xs text-gray-400 mt-1">Total que você pagará no ano</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="text-xs text-gray-500 mb-1 font-medium">Margem líquida mensal</div>
                <div className={`text-2xl font-black group-hover:scale-105 transition-transform origin-left ${resultado.margemLiquidaMensal >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {currency(resultado.margemLiquidaMensal)}
                </div>
                <div className="text-xs text-gray-400 mt-1">Após DAS e despesas</div>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-200 group">
                <div className="text-xs text-gray-500 mb-1 font-medium">% de imposto</div>
                <div className="text-2xl font-black text-blue-600 group-hover:scale-105 transition-transform origin-left">{resultado.percentualImposto.toFixed(1)}%</div>
                <div className="text-xs text-gray-400 mt-1">Sobre seu faturamento</div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-violet-600" />
                <span className="font-bold text-sm text-gray-900">Faturamento anual projetado</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      resultado.situacao === "ok" ? "bg-emerald-500" :
                      resultado.situacao === "alerta" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${Math.min((resultado.faturamentoAnual / MEI_LIMITE_ANUAL) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-700">
                  {((resultado.faturamentoAnual / MEI_LIMITE_ANUAL) * 100).toFixed(0)}%
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>{currency(resultado.faturamentoAnual)} / ano</span>
                <span>Limite: {currency(MEI_LIMITE_ANUAL)}</span>
              </div>
            </div>
          </div>
        </div>
        <AdBanner slot="2847391056" format="horizontal" className="mt-8 rounded-2xl bg-gray-100 min-h-[90px]" />
      </main>
      <Footer />
    </div>
  );
}

function SliderMEI({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-bold text-orange-600">{format(value)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-orange-500"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format(min)}</span><span>{format(max)}</span>
      </div>
    </div>
  );
}
