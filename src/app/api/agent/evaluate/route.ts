import { NextResponse } from "next/server";
import { DEFAULT_POLICY, evaluateAnswer } from "../../../lib/policy";
import type { Policy, Question } from "../../../lib/types";

export async function POST(req: Request) {
  let body: { question?: Question; draft?: string; policy?: Policy };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  if (!body.question || typeof body.draft !== "string") {
    return NextResponse.json({ error: "Falta question o draft" }, { status: 400 });
  }

  if (body.draft.length > 1200) {
    return NextResponse.json({ error: "Draft demasiado largo" }, { status: 400 });
  }

  const policy = { ...DEFAULT_POLICY, ...(body.policy || {}) };
  const result = evaluateAnswer(body.question, body.draft, policy);

  return NextResponse.json({
    ...result,
    paymentsTouched: false,
    note: "Demo: no se publica en el marketplace ni se cobra.",
  });
}
