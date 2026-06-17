import { Wrench } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-500 py-12 px-6 mt-auto">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="font-black text-white text-lg">
                Freelancer<span className="text-emerald-400">Tools</span>
              </span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Ferramentas gratuitas para freelancers brasileiros fecharem mais negócios com profissionalismo.
            </p>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-12">
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Ferramentas</div>
              <ul className="space-y-2 text-sm">
                {[
                  ["/calculadora-preco", "Calculadora Preço/Hora"],
                  ["/proposta", "Gerador de Proposta"],
                  ["/contrato", "Gerador de Contrato"],
                  ["/mei", "Simulador MEI"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-emerald-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Produto</div>
              <ul className="space-y-2 text-sm">
                {[
                  ["/pro", "Plano Pro"],
                  ["#", "Blog"],
                  ["#", "Sobre"],
                  ["mailto:contato@freelancertools.com.br", "Contato"],
                ].map(([href, label]) => (
                  <li key={label}>
                    <Link href={href} className="hover:text-emerald-400 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© 2026 FreelancerTools. Todos os direitos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition-colors">Termos de uso</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
