import { NextRequest, NextResponse } from "next/server";
import { markUserAsPro } from "@/lib/db";
import pool from "@/lib/db";
import { createHmac } from "crypto";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
const WEBHOOK_SECRET = process.env.MP_WEBHOOK_SECRET;

function validarAssinatura(req: NextRequest, body: string): boolean {
  if (!WEBHOOK_SECRET) return true; // sem secret configurado, passa
  const xSignature = req.headers.get("x-signature");
  const xRequestId = req.headers.get("x-request-id");
  const url = new URL(req.url);
  const dataId = url.searchParams.get("data.id") ?? "";

  if (!xSignature) return false;

  const parts = Object.fromEntries(xSignature.split(",").map((p) => p.trim().split("=")));
  const ts = parts["ts"];
  const v1 = parts["v1"];

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = createHmac("sha256", WEBHOOK_SECRET).update(manifest).digest("hex");

  return hmac === v1;
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    if (!validarAssinatura(req, rawBody)) {
      console.warn("[Webhook] Assinatura inválida — ignorado");
      return NextResponse.json({ error: "Assinatura inválida." }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
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
        console.log(`[Webhook] ✅ Pro ativado para ${payment.payer.email}`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}
