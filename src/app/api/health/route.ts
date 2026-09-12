import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    product: "ENCARGADO",
    by: "elcryptoboy",
    payments: "disabled",
    mode: "demo-sandbox",
  });
}
