"use client";
import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Props {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdBanner({ slot, format = "auto", className = "" }: Props) {
  const { data: session } = useSession();
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  // Usuários Pro não veem anúncios
  if (session?.user?.isPro) return null;

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {}
  }, []);

  return (
    <div className={`overflow-hidden text-center ${className}`}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-1179439300548866"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
