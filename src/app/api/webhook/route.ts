import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === "payment" && data?.id) {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      const payment = await res.json();

      const { status, payer, external_reference, transaction_amount } = payment;

      console.log(`[Webhook MP] Pagamento ${status}`);
      console.log(`  Email: ${payer?.email}`);
      console.log(`  Referência: ${external_reference}`);
      console.log(`  Valor: R$${transaction_amount}`);

      if (status === "approved") {
        // Aqui você liberaria o acesso Pro para o usuário
        // Ex: await db.ativarPro({ email: payer.email, referencia: external_reference })
        console.log(`[Webhook MP] ✅ Acesso Pro ativado para ${payer?.email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Erro no webhook." }, { status: 500 });
  }
}
