import { NextRequest, NextResponse } from "next/server";
import { markUserAsPro } from "@/lib/db";
import pool from "@/lib/db";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, data } = body;

    // Assinatura recorrente
    if (type === "subscription_preapproval" && data?.id) {
      const res = await fetch(`https://api.mercadopago.com/preapproval/${data.id}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      const sub = await res.json();
      const email = sub.payer_email;
      const status = sub.status; // authorized | paused | cancelled

      console.log(`[Webhook] Assinatura ${status} — ${email}`);

      if (status === "authorized" && email) {
        await markUserAsPro(email, data.id);
        console.log(`[Webhook] ✅ Pro ativado para ${email}`);
      }

      if (status === "cancelled" && email) {
        await pool.query("UPDATE users SET is_pro=FALSE WHERE email=$1", [email]);
        console.log(`[Webhook] ❌ Pro cancelado para ${email}`);
      }
    }

    // Pagamento avulso (fallback)
    if (type === "payment" && data?.id) {
      const res = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      });
      const payment = await res.json();
      if (payment.status === "approved" && payment.payer?.email) {
        await markUserAsPro(payment.payer.email, data.id);
        console.log(`[Webhook] ✅ Pro ativado (pagamento avulso) para ${payment.payer.email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Erro no webhook." }, { status: 500 });
  }
}
