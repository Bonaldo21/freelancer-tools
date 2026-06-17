import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN!;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://freelancertools.com.br";

export async function POST(req: NextRequest) {
  try {
    const { email, nome, plano } = await req.json();

    if (!email || !nome) {
      return NextResponse.json({ error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }

    const valor = plano === "agencia" ? 127 : 29;
    const nomePlano = plano === "agencia" ? "FreelancerTools Agência" : "FreelancerTools Pro";

    const body = {
      items: [
        {
          title: nomePlano,
          description: "Acesso mensal às ferramentas premium",
          quantity: 1,
          unit_price: valor,
          currency_id: "BRL",
        },
      ],
      payer: { name: nome, email },
      back_urls: {
        success: `${BASE_URL}/obrigado?plano=${plano}&nome=${encodeURIComponent(nome)}`,
        failure: `${BASE_URL}/pagamento-cancelado`,
        pending: `${BASE_URL}/obrigado?plano=${plano}&nome=${encodeURIComponent(nome)}&status=pending`,
      },
      statement_descriptor: "FREELANCERTOOLS",
      external_reference: `${plano}-${email}-${Date.now()}`,
    };

    const res = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("MP error:", data);
      return NextResponse.json(
        { error: data.message || "Erro ao criar preferência de pagamento." },
        { status: res.status }
      );
    }

    return NextResponse.json({
      init_point: data.init_point,
      sandbox_init_point: data.sandbox_init_point,
    });
  } catch (err) {
    console.error("Erro interno:", err);
    return NextResponse.json({ error: "Erro interno do servidor." }, { status: 500 });
  }
}
