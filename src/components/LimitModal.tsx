"use client";
import Link from "next/link";
import { X, Zap, Lock } from "lucide-react";

interface Props {
  tool: "proposta" | "contrato";
  onClose: () => void;
}

const labels = {
  proposta: { limit: 3, name: "propostas" },
  contrato: { limit: 2, name: "contratos" },
};

export default function LimitModal({ tool, onClose }: Props) {
  const { limit, name } = labels[tool];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-orange-500" />
          </div>

          <h2 className="text-xl font-black text-gray-900 mb-2">
            Limite do mês atingido
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Você já usou suas <strong>{limit} {name} gratuitas</strong> deste mês.
            Assine o Pro para gerar ilimitadas.
          </p>

          <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            {["Propostas e contratos ilimitados", "Todos os modelos premium", "Suporte prioritário"].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </div>
                {f}
              </div>
            ))}
          </div>

          <Link
            href="/pro"
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 rounded-2xl transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-emerald-200/50"
          >
            <Zap className="w-4 h-4" />
            Assinar Pro — R$29/mês
          </Link>

          <button
            onClick={onClose}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
          >
            Talvez depois
          </button>
        </div>
      </div>
    </div>
  );
}
