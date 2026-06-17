"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHeader from "@/components/PageHeader";
import LimitModal from "@/components/LimitModal";
import AdBanner from "@/components/AdBanner";
import { FileText, CheckCircle, Copy, Download, RotateCcw } from "lucide-react";
import { getUsage, getLimit, hasReachedLimit, incrementUsage } from "@/lib/usageLimit";

const nicheTemplates: Record<string, { deliverables: string[]; clausulas: string[] }> = {
  "Desenvolvimento Web": {
    deliverables: [
      "Levantamento de requisitos e prototipagem das telas",
      "Desenvolvimento front-end responsivo (desktop e mobile)",
      "Desenvolvimento back-end e integração com banco de dados",
      "Painel administrativo para gerenciamento de conteúdo",
      "Integração com sistemas de pagamento (se aplicável)",
      "Deploy em servidor e configuração de domínio",
      "Testes de usabilidade e correção de bugs",
      "Documentação técnica e manual de uso",
    ],
    clausulas: [
      "O cliente fornecerá todos os textos, imagens e materiais necessários até 5 dias após o início do projeto.",
      "Alterações de escopo após aprovação do layout serão orçadas separadamente.",
      "O prazo começa a contar após o pagamento da entrada e aprovação do briefing.",
    ],
  },
  "Design UI/UX": {
    deliverables: [
      "Pesquisa de usuário e análise de concorrentes",
      "Wireframes e fluxo de navegação",
      "Design de interface em alta fidelidade (todas as telas)",
      "Protótipo navegável para validação",
      "Guia de estilo (tipografia, cores, componentes)",
      "Exportação dos assets para desenvolvimento",
      "Apresentação e handoff para time de desenvolvimento",
    ],
    clausulas: [
      "O cliente fornecerá o briefing completo e referências visuais antes do início.",
      "O design será entregue em formato Figma com acesso compartilhado.",
      "Revisões após aprovação final serão cobradas por hora.",
    ],
  },
  "Marketing Digital": {
    deliverables: [
      "Diagnóstico completo da presença digital atual",
      "Planejamento estratégico de marketing (90 dias)",
      "Criação e gestão de campanhas pagas (Google Ads / Meta Ads)",
      "Produção de conteúdo para redes sociais (posts + legendas)",
      "Relatório mensal de performance e ROI",
      "Otimização contínua com base nos resultados",
      "Reunião quinzenal de alinhamento",
    ],
    clausulas: [
      "O budget de mídia paga não está incluso no valor da proposta.",
      "O cliente fornecerá acesso às contas de anúncio e analytics.",
      "Resultados dependem de fatores externos como sazonalidade e mercado.",
    ],
  },
  "Social Media": {
    deliverables: [
      "Planejamento mensal de conteúdo com calendário editorial",
      "Criação de artes e posts para Instagram, Facebook e LinkedIn",
      "Redação de legendas com copy persuasivo e hashtags",
      "Agendamento e publicação dos posts",
      "Gestão de comentários e direct messages",
      "Stories e reels semanais",
      "Relatório mensal de métricas e crescimento",
    ],
    clausulas: [
      "O cliente fornecerá login das redes sociais ou acesso via Business Manager.",
      "Fotos e vídeos originais do cliente devem ser enviados até o dia 25 do mês anterior.",
      "Impulsionamento de posts não está incluso no valor.",
    ],
  },
  "Identidade Visual": {
    deliverables: [
      "Pesquisa de referências e briefing criativo",
      "3 conceitos iniciais para escolha do cliente",
      "Desenvolvimento do conceito aprovado",
      "Logotipo em todas as versões (horizontal, vertical, ícone)",
      "Paleta de cores e tipografia oficial",
      "Manual de uso da marca (brandbook)",
      "Arquivos finais em todos os formatos (AI, PDF, PNG, SVG)",
    ],
    clausulas: [
      "O projeto inclui até 2 rodadas de revisão no conceito aprovado.",
      "Mudança de conceito após aprovação será cobrada como novo projeto.",
      "Os direitos autorais são transferidos integralmente após quitação.",
    ],
  },
  "Consultoria de TI": {
    deliverables: [
      "Diagnóstico técnico completo do ambiente atual",
      "Relatório de vulnerabilidades e oportunidades de melhoria",
      "Plano de ação priorizado com cronograma",
      "Apresentação executiva para diretoria",
      "Acompanhamento da implementação das melhorias",
      "Documentação de processos e arquitetura",
      "Treinamento da equipe interna",
    ],
    clausulas: [
      "O cliente garantirá acesso aos sistemas e documentações necessários.",
      "As recomendações são baseadas nas informações fornecidas pelo cliente.",
      "Implementações além do escopo serão orçadas separadamente.",
    ],
  },
  "Copywriting": {
    deliverables: [
      "Pesquisa de persona e mercado",
      "Estratégia de copy e posicionamento",
      "Redação de todos os textos conforme briefing",
      "Revisão e otimização para SEO (se aplicável)",
      "Entrega em Google Docs com comentários explicativos",
      "Uma rodada de ajustes após feedback do cliente",
    ],
    clausulas: [
      "O cliente fornecerá briefing completo com persona, tom de voz e objetivos.",
      "Textos não serão publicados sem quitação total do projeto.",
      "Ajustes solicitados após aprovação final serão cobrados por hora.",
    ],
  },
  "Outro": {
    deliverables: [
      "Reunião de alinhamento e levantamento de requisitos",
      "Planejamento e cronograma do projeto",
      "Execução conforme escopo acordado",
      "Entrega dos materiais e arquivos finais",
      "Revisões dentro do escopo contratado",
      "Suporte pós-entrega por 15 dias",
    ],
    clausulas: [
      "Qualquer alteração de escopo será formalizada por escrito e pode gerar custo adicional.",
      "O prazo inicia após pagamento da entrada e aprovação do briefing.",
      "O suporte não cobre erros causados por terceiros ou alterações feitas pelo cliente.",
    ],
  },
};

const niches = Object.keys(nicheTemplates);

function formatCurrency(val: string) {
  const num = parseFloat(val) || 0;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function generateProposal(data: {
  niche: string; clientName: string; projectName: string;
  projectDesc: string; deadline: string; value: string;
  freelancerName: string; revisions: string;
}) {
  const today = new Date().toLocaleDateString("pt-BR");
  const num = Math.floor(Math.random() * 8000) + 1000;
  const template = nicheTemplates[data.niche] || nicheTemplates["Outro"];
  const val = parseFloat(data.value) || 0;
  const entrada = (val * 0.33).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const meio = (val * 0.33).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const final = (val * 0.34).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return `PROPOSTA COMERCIAL
══════════════════════════════════════════════

Data de emissão: ${today}
Número da proposta: #${num}
Validade: 15 dias

PRESTADOR DE SERVIÇOS
${data.freelancerName}
Especialista em ${data.niche}

CLIENTE
${data.clientName}

══════════════════════════════════════════════
PROJETO: ${data.projectName}
══════════════════════════════════════════════

APRESENTAÇÃO
────────────────────────────────────────────
Prezado(a) ${data.clientName},

Agradeço a oportunidade de apresentar esta proposta para o projeto
"${data.projectName}". Com base nas informações compartilhadas,
preparei uma proposta completa que contempla todas as necessidades
identificadas para alcançar os objetivos do projeto.

DESCRIÇÃO DO PROJETO
────────────────────────────────────────────
${data.projectDesc}

ESCOPO DE ENTREGA
────────────────────────────────────────────
${template.deliverables.map((d, i) => `${i + 1}. ${d}`).join("\n")}

REVISÕES INCLUÍDAS
────────────────────────────────────────────
Esta proposta contempla ${data.revisions} rodada(s) de revisão.
Ajustes além deste limite serão cobrados separadamente.

CRONOGRAMA
────────────────────────────────────────────
• Prazo total de entrega: ${data.deadline} dias corridos
• Início: até 3 dias úteis após pagamento da entrada
• Marcos de acompanhamento: relatórios de progresso semanais
• Reunião de aprovação final antes da entrega

INVESTIMENTO
────────────────────────────────────────────
Valor total: ${formatCurrency(data.value)}

Condições de pagamento:
  ► Entrada (33%): ${entrada} — para início imediato
  ► Meio do projeto (33%): ${meio} — na aprovação do rascunho
  ► Entrega final (34%): ${final} — na entrega do projeto

Formas de pagamento aceitas: PIX, TED/DOC, boleto bancário

CONDIÇÕES GERAIS
────────────────────────────────────────────
${template.clausulas.map((c, i) => `${i + 1}. ${c}`).join("\n")}
${template.clausulas.length + 1}. Esta proposta perde validade após 15 dias da data de emissão.
${template.clausulas.length + 2}. Em caso de cancelamento após o início, o valor pago não é reembolsável.

PRÓXIMOS PASSOS
────────────────────────────────────────────
1. Confirmar aceite desta proposta por escrito
2. Assinar contrato de prestação de serviços
3. Efetuar o pagamento da entrada (${entrada})
4. Início do projeto em até 3 dias úteis

Para qualquer dúvida ou para aceitar esta proposta, entre em contato.

Atenciosamente,

${data.freelancerName}
${data.niche}

══════════════════════════════════════════════
Gerado por FreelancerTools · freelancertools.com.br
══════════════════════════════════════════════`;
}

export default function PropostaPage() {
  const { data: session } = useSession();
  const isPro = session?.user?.isPro ?? false;
  const [step, setStep] = useState<"form" | "result">("form");
  const [copied, setCopied] = useState(false);
  const [proposal, setProposal] = useState("");
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [usage, setUsage] = useState(0);
  const limit = getLimit("proposta");

  useEffect(() => { setUsage(getUsage("proposta")); }, []);

  const [form, setForm] = useState({
    niche: "", clientName: "", projectName: "", projectDesc: "",
    deadline: "30", value: "", freelancerName: "", revisions: "2",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hasReachedLimit("proposta", isPro)) {
      setShowLimitModal(true);
      return;
    }
    incrementUsage("proposta");
    setUsage(getUsage("proposta"));
    setProposal(generateProposal(form));
    setStep("result");
  }

  function handleCopy() {
    navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const blob = new Blob([proposal], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `proposta-${form.clientName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showLimitModal && <LimitModal tool="proposta" onClose={() => setShowLimitModal(false)} />}
      <Navbar />
      <PageHeader icon={FileText} title="Gerador de Proposta Comercial" description="Templates profissionais por nicho, personalizados com seus dados em 2 minutos." gradient="from-emerald-500 to-teal-600" />
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 w-full -mt-4">

        {!isPro && step === "form" && (
          <div className="mb-4 flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-5 py-3 text-sm">
            <span className="text-gray-500">Propostas gratuitas este mês:</span>
            <span className={`font-bold ${usage >= limit ? "text-red-500" : "text-emerald-600"}`}>
              {usage}/{limit}
            </span>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Seu nome / empresa" required>
                <input name="freelancerName" required placeholder="Ex: João Silva" value={form.freelancerName} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Nome do cliente" required>
                <input name="clientName" required placeholder="Ex: Empresa XYZ" value={form.clientName} onChange={handleChange} className={inputCls} />
              </Field>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Nicho / área" required>
                <select name="niche" required value={form.niche} onChange={handleChange} className={inputCls}>
                  <option value="">Selecione...</option>
                  {niches.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Nome do projeto" required>
                <input name="projectName" required placeholder="Ex: Site institucional" value={form.projectName} onChange={handleChange} className={inputCls} />
              </Field>
            </div>
            <Field label="Descrição do projeto" required>
              <textarea name="projectDesc" required rows={4} placeholder="Descreva o que o cliente precisa..." value={form.projectDesc} onChange={handleChange} className={`${inputCls} resize-none`} />
            </Field>
            <div className="grid md:grid-cols-3 gap-6">
              <Field label="Prazo (dias)" required>
                <input type="number" name="deadline" required min="1" value={form.deadline} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Valor do projeto (R$)" required>
                <input type="number" name="value" required min="0" placeholder="5000" value={form.value} onChange={handleChange} className={inputCls} />
              </Field>
              <Field label="Rodadas de revisão">
                <select name="revisions" value={form.revisions} onChange={handleChange} className={inputCls}>
                  <option value="1">1 revisão</option>
                  <option value="2">2 revisões</option>
                  <option value="3">3 revisões</option>
                  <option value="ilimitadas">Ilimitadas</option>
                </select>
              </Field>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 rounded-2xl text-lg transition-all duration-300 shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:scale-[1.01] active:scale-95">
              Gerar proposta profissional
            </button>
          </form>
        )}

        {step === "result" && (
          <div className="animate-fade-in-up">
            <AdBanner slot="2847391056" format="horizontal" className="mb-6 rounded-2xl bg-gray-100 min-h-[90px]" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Proposta gerada! 🎉</h2>
                <p className="text-gray-500 text-sm">Copie ou baixe o texto abaixo.</p>
              </div>
              <button onClick={() => setStep("form")} className="flex items-center gap-2 text-sm border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200">
                <RotateCcw className="w-4 h-4" /> Nova proposta
              </button>
            </div>
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="font-bold text-gray-900 text-sm">Proposta — {form.projectName}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-2 text-sm border border-gray-200 bg-white px-3 py-2 rounded-xl hover:border-emerald-300 hover:text-emerald-600 transition-all duration-200">
                    {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copiado!" : "Copiar"}
                  </button>
                  <button onClick={handleDownload} className="flex items-center gap-2 text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-3 py-2 rounded-xl transition-all duration-200 shadow-md shadow-emerald-200">
                    <Download className="w-4 h-4" /> Baixar
                  </button>
                </div>
              </div>
              <pre className="p-8 text-sm text-gray-700 whitespace-pre-wrap font-mono leading-relaxed overflow-x-auto max-h-[600px] overflow-y-auto">{proposal}</pre>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

const inputCls = "w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 bg-white transition-all duration-200 hover:border-gray-300";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}
