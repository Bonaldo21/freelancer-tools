import { NextRequest, NextResponse } from "next/server";

// Links do plano de assinatura criados no painel do Mercado Pago
const PLANOS = {
  pro:     "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=e4e2b921b9bf4e04bb18394525226221",
  agencia: "https://www.mercadopago.com.br/subscriptions/checkout?preapproval_plan_id=e4e2b921b9bf4e04bb18394525226221",
};

export async function POST(req: NextRequest) {
  try {
    const { plano } = await req.json();
    const link = PLANOS[plano as keyof typeof PLANOS] ?? PLANOS.pro;
    return NextResponse.json({ init_point: link, sandbox_init_point: link });
  } catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
