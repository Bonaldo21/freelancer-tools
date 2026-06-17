const LIMITS = {
  proposta: 3,
  contrato: 2,
};

function getKey(tool: string) {
  const mes = new Date().toISOString().slice(0, 7); // "2026-06"
  return `ft_usage_${tool}_${mes}`;
}

export function getUsage(tool: "proposta" | "contrato"): number {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(getKey(tool)) ?? "0", 10);
}

export function incrementUsage(tool: "proposta" | "contrato") {
  if (typeof window === "undefined") return;
  const atual = getUsage(tool);
  localStorage.setItem(getKey(tool), String(atual + 1));
}

export function hasReachedLimit(tool: "proposta" | "contrato", isPro: boolean): boolean {
  if (isPro) return false;
  return getUsage(tool) >= LIMITS[tool];
}

export function getLimit(tool: "proposta" | "contrato") {
  return LIMITS[tool];
}
