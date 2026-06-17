"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wrench, Menu, X, Zap, LayoutDashboard, Crown } from "lucide-react";
import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";

const links = [
  { href: "/calculadora-preco", label: "Preço/Hora" },
  { href: "/proposta", label: "Proposta" },
  { href: "/contrato", label: "Contrato" },
  { href: "/mei", label: "Simulador MEI" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md shadow-black/5" : "bg-white border-b border-gray-100"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
            <Wrench className="w-4 h-4 text-white" />
          </div>
          <span className="font-black text-gray-900 text-lg tracking-tight">
            Freelancer<span className="text-emerald-500">Tools</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                pathname === l.href
                  ? "text-emerald-700 bg-emerald-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              {l.label}
              {pathname === l.href && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
              )}
            </Link>
          ))}
        </div>

        {/* Auth / Pro CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <>
              {session.user?.isPro && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                  <Crown className="w-3.5 h-3.5 text-yellow-500" /> Pro
                </span>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-xl transition-all"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <LayoutDashboard className="w-4 h-4" />
                )}
                {session.user?.name?.split(" ")[0]}
              </Link>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Entrar
              </button>
              <Link
                href="/pro"
                className="relative inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200/50 hover:scale-105 active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                Pro — R$29/mês
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-white border-t border-gray-100 px-6 py-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                pathname === l.href
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-100 mt-1 space-y-2">
            {session ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                {session.user?.image ? (
                  <img src={session.user.image} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <LayoutDashboard className="w-4 h-4" />
                )}
                {session.user?.name?.split(" ")[0]} {session.user?.isPro && "· Pro ✓"}
              </Link>
            ) : (
              <>
                <button
                  onClick={() => { setOpen(false); signIn("google", { callbackUrl: "/dashboard" }); }}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200"
                >
                  Entrar com Google
                </button>
                <Link
                  href="/pro"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold px-4 py-3 rounded-xl shadow-lg shadow-emerald-200/50"
                >
                  <Zap className="w-4 h-4" />
                  Pro — R$29/mês
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
