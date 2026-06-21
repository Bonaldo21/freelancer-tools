"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import LimitModal from "@/components/LimitModal";
import AdBanner from "@/components/AdBanner";
import { FileSignature, CheckCircle, Copy, Download, RotateCcw } from "lucide-react";
import { getUsage, getLimit, hasReachedLimit, incrementUsage } from "@/lib/usageLimit";

const inputCls = "w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-violet-400 bg-white transition-all duration-200 hover:border-gray-300";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

function generateContract(data: {
  freelancerName: string; freelancerCpf: string; freelancerEndereco: string;
  clientName: string; clientCpfCnpj: string; clientEndereco: string;
  servico: string; descricao: string; valor: string; prazo: string;
  formaPagamento: string; revisoes: string;
}) {
  const today = new Date().toLocaleDateString("pt-BR");
  const val = parseFloat(data.valor) || 0;
  const entrada = (val * 0.5).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const restante = (val * 0.5).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const total = val.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return `CONTRATO DE PRESTAÇÃO DE SERVIÇOS

Pelo presente instrumento particular, as partes abaixo identificadas
celebram o presente CONTRATO DE PRESTAÇÃO DE SERVIÇOS, que se regerá
pelas cláusulas e condições seguintes:

════════════════════════════════════════════════
PARTES
════════════════════════════════════════════════

CONTRATADO(A):
Nome: ${data.freelancerName}
CPF: ${data.freelancerCpf}
Endereço: ${data.freelancerEndereco}

CONTRATANTE:
Nome/Razão Social: ${data.clientName}
CPF/CNPJ: ${data.clientCpfCnpj}
Endereço: ${data.clientEndereco}

════════════════════════════════════════════════
CLÁUSULAS
════════════════════════════════════════════════

CLÁUSULA 1 — OBJETO DO CONTRATO
────────────────────────────────
O(A) CONTRATADO(A) se compromete a prestar os seguintes serviços:

Serviço: ${data.servico}

Descrição detalhada:
${data.descricao}

CLÁUSULA 2 — PRAZO DE EXECUÇÃO
────────────────────────────────
2.1. O prazo para conclusão dos serviços é de ${data.prazo} dias corridos,
     contados a partir da data de confirmação do pagamento da entrada
     e aprovação do briefing pelo CONTRATANTE.

2.2. O prazo poderá ser prorrogado mediante acordo entre as partes,
     nos seguintes casos:
     a) Atraso no fornecimento de materiais, informações ou feedback
        pelo CONTRATANTE por mais de 5 dias úteis;
     b) Caso fortuito ou força maior devidamente comunicado.

2.3. São incluídas ${data.revisoes} rodada(s) de revisão. Revisões
     adicionais serão cobradas separadamente.

CLÁUSULA 3 — VALOR E FORMA DE PAGAMENTO
────────────────────────────────────────
3.1. O valor total pelos serviços é de ${total} (${val.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} reais).

3.2. O pagamento será realizado da seguinte forma:
     ${data.formaPagamento === "50/50"
       ? `► Entrada (50%): ${entrada} — no início do projeto\n     ► Entrega final (50%): ${restante} — na entrega do projeto`
       : data.formaPagamento === "33/33/34"
       ? `► Entrada (33%): ${(val * 0.33).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} — no início\n     ► Meio do projeto (33%): ${(val * 0.33).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} — na aprovação do rascunho\n     ► Entrega final (34%): ${(val * 0.34).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} — na entrega`
       : `► Pagamento à vista: ${total} — antes do início do projeto`
     }

3.3. Em caso de atraso no pagamento, incidirão juros de 1% ao mês
     e multa de 2% sobre o valor em aberto.

CLÁUSULA 4 — DIREITOS AUTORAIS E PROPRIEDADE INTELECTUAL
─────────────────────────────────────────────────────────
4.1. Após a quitação integral do contrato, todos os direitos sobre
     os materiais produzidos serão transferidos ao CONTRATANTE.

4.2. Enquanto houver valores em aberto, o(a) CONTRATADO(A) mantém
     os direitos sobre o material produzido.

4.3. O(A) CONTRATADO(A) pode utilizar o projeto em seu portfólio,
     salvo se o CONTRATANTE solicitar sigilo por escrito.

CLÁUSULA 5 — CANCELAMENTO
──────────────────────────
5.1. O CONTRATANTE pode cancelar o contrato a qualquer momento,
     porém os valores já pagos não serão reembolsados.

5.2. Em caso de cancelamento após o início, o CONTRATANTE pagará
     pelos serviços realizados até a data do cancelamento,
     proporcional ao total contratado.

5.3. O(A) CONTRATADO(A) pode rescindir o contrato em caso de
     descumprimento das obrigações pelo CONTRATANTE, mantendo
     o direito aos valores devidos até a data da rescisão.

CLÁUSULA 6 — OBRIGAÇÕES DAS PARTES
────────────────────────────────────
6.1. O(A) CONTRATADO(A) se compromete a:
     a) Executar os serviços com qualidade e profissionalismo;
     b) Comunicar o CONTRATANTE sobre o andamento do projeto;
     c) Respeitar o prazo acordado, salvo nas hipóteses da Cláusula 2.2.

6.2. O CONTRATANTE se compromete a:
     a) Fornecer materiais, informações e feedback em tempo hábil;
     b) Realizar os pagamentos nas datas acordadas;
     c) Nomear um responsável único para aprovações e feedbacks.

CLÁUSULA 7 — CONFIDENCIALIDADE
────────────────────────────────
Ambas as partes se comprometem a manter sigilo sobre informações
confidenciais trocadas durante a execução do contrato pelo período
de 2 anos após o encerramento do mesmo.

CLÁUSULA 8 — DISPOSIÇÕES GERAIS
─────────────────────────────────
8.1. Este contrato é celebrado em caráter irrevogável e irretratável,
     obrigando as partes e seus sucessores.

8.2. Qualquer alteração neste contrato deverá ser feita por escrito
     e assinada por ambas as partes.

8.3. Para dirimir quaisquer dúvidas, as partes elegem o Foro da
     comarca do domicílio do CONTRATADO(A).

════════════════════════════════════════════════
ASSINATURAS
════════════════════════════════════════════════

Local e data: _________________, ${today}


_________________________________
${data.freelancerName}
CPF: ${data.freelancerCpf}
CONTRATADO(A)


_________________________________
${data.clientName}
CPF/CNPJ: ${data.clientCpfCnpj}
CONTRATANTE


_________________________________
Testemunha 1
CPF:


_________________________________
Testemunha 2
CPF:

════════════════════════════════════════════════
Gerado por FreelancerTools · freelancertools.com.br
ATENÇÃO: Este contrato é um modelo e não substitui
assessoria jurídica especializada.
════════════════════════════════════════════════`;
}

export default function ContratoPage() {
  const { data: session } = useSession();
  const isPro = session?.user?.isPro ?? false;
  const [step, setStep] = useState<"form" | "result">("form");
  const [copied, setCopied] = useState(false);
  const [contract, setContract] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("contrato");

  useEffect(() => { setUsage(getUsage("contrato")); }, []);

  const [form, setForm] = useState({
    freelancerName: "", freelancerCpf: "", freelancerEndereco: "",
    clientName: "", clientCpfCnpj: "", clientEndereco: "",
    servico: "", descricao: "", valor: "", prazo: "30",
    formaPagamento: "50/50", revisoes: "2",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasReachedLimit("contrato", isPro)) {
      setShowLimitModal(true);
      return;
    }
    incrementUsage("contrato");
    setUsage(getUsage("contrato"));
    setContract(generateContract(form));
    setStep("result");
  }

  function handleCopy() {
    navigator.clipboard.writeText(contract);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([contract], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contrato-${form.clientName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showLimitModal && <LimitModal tool="contrato" onClose={() => setShowLimitModal(false)} />}
      <Navbar />
      <PageHeader icon={FileSignature} title="Gerador de Contrato" description="Contrato simples e profissional para proteger seu trabalho e garantir o pagamento." gradient="from-violet-600 to-purple-700" />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full -mt-4">

        {!isPro && step === "form" && (
          <div className="mb-4 flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm">
            <span className="text-gray-500">Contratos gratuitos este mês:</span>
            <span className={`font-bold ${usage >= limit ? "text-red-500" : "text-violet-600"}`}>
              {usage}/{limit}
            </span>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wide text-violet-600">Seus dados (Contratado)</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Seu nome completo" required><input name="freelancerName" required placeholder="João da Silva" value={form.freelancerName} onChange={handleChange} className={inputCls} /></Field>
                <Field label="Seu CPF" required><input name="freelancerCpf" required placeholder="000.000.000-00" value={form.freelancerCpf} onChange={handleChange} className={inputCls} /></Field>
                <div className="md:col-span-2">
                  <Field label="Seu endereço completo" required><input name="freelancerEndereco" required placeholder="Rua X, 123 — Cidade/UF" value={form.freelancerEndereco} onChange={handleChange} className={inputCls} /></Field>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wide text-violet-600">Dados do cliente (Contratante)</h2>
              <div className="grid md:grid-cols-2 gap-5">
                <Field label="Nome / razão social" required><input name="clientName" required placeholder="Empresa XYZ Ltda" value={form.clientName} onChange={handleChange} className={inputCls} /></Field>
                <Field label="CPF / CNPJ" required><input name="clientCpfCnpj" required placeholder="00.000.000/0001-00" value={form.clientCpfCnpj} onChange={handleChange} className={inputCls} /></Field>
                <div className="md:col-span-2">
                  <Field label="Endereço completo" required><input name="clientEndereco" required placeholder="Rua Y, 456 — Cidade/UF" value={form.clientEndereco} onChange={handleChange} className={inputCls} /></Field>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-900 mb-5 text-sm uppercase tracking-wide text-violet-600">Detalhes do serviço</h2>
              <div className="space-y-5">
                <Field label="Tipo de serviço" required><input name="servico" required placeholder="Ex: Desenvolvimento de site institucional" value={form.servico} onChange={handleChange} className={inputCls} /></Field>
                <Field label="Descrição detalhada" required>
                  <textarea name="descricao" required rows={4} placeholder="Descreva o que será entregue..." value={form.descricao} onChange={handleChange} className={`${inputCls} resize-none`} />
                </Field>
                <div className="grid md:grid-cols-3 gap-5">
                  <Field label="Valor total (R$)" required><input type="number" name="valor" required min="0" placeholder="5000" value={form.valor} onChange={handleChange} className={inputCls} /></Field>
                  <Field label="Prazo (dias)" required><input type="number" name="prazo" required min="1" value={form.prazo} onChange={handleChange} className={inputCls} /></Field>
                  <Field label="Rodadas de revisão">
                    <select name="revisoes" value={form.revisoes} onChange={handleChange} className={inputCls}>
                      <option value="1">1 revisão</option>
                      <option value="2">2 revisões</option>
                      <option value="3">3 revisões</option>
                      <option value="ilimitadas">Ilimitadas</option>
                    </select>
                  </Field>
                </div>
                <Field label="Forma de pagamento">
                  <select name="formaPagamento" value={form.formaPagamento} onChange={handleChange} className={inputCls}>
                    <option value="50/50">50% entrada + 50% na entrega</option>
                    <option value="33/33/34">33% entrada + 33% meio + 34% entrega</option>
                    <option value="avista">100% à vista antes do início</option>
                  </select>
                </Field>
              </div>
            </section>

            <button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:scale-[1.01] active:scale-95">
              Gerar contrato
            </button>
          </form>
        )}

        {step === "result" && (
          <div>
            <AdBanner slot="2847391056" format="horizontal" className="mb-6 rounded-2xl bg-gray-100 min-h-[90px]" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Contrato gerado!</h2>
                <p className="text-gray-500 text-sm">Revise, copie ou baixe. Recomendamos assinar digitalmente.</p>
              </div>
              <button onClick={() => setStep("form")} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                <RotateCcw className="w-4 h-4" /> Novo contrato
              </button>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 mb-4">
              ⚠️ <strong>Aviso legal:</strong> Este contrato é um modelo genérico. Para projetos de alto valor, consulte um advogado.
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
                <span className="font-medium text-gray-900 text-sm">Contrato — {form.servico}</span>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-2 text-sm border border-gray-200 px-3 py-1.5 rounded-lg hover:border-violet-300 transition-colors">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-2 text-sm bg-violet-600 hover:bg-violet-700 text-white px-3 py-1.5 rounded-lg transition-colors">
                    <Download className="w-4 h-4" /> Baixar
                  </button>
                </div>
              </div>
              <pre className="p-8 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto">{contract}</pre>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
