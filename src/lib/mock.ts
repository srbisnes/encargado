import type { NextMove, Order, Question } from "./types";

export const STORE = {
  name: "Puesto Norte · Audio",
  reputation: "MercadoLíder",
  sales30d: 184,
  questionsOpen: 6,
  unpaid: 2,
};

export const QUESTIONS: Question[] = [
  {
    id: "Q-10421",
    listing: "Auriculares Bluetooth ANC Pro",
    sku: "AUD-ANC-01",
    buyer: "lucas_mza",
    askedAt: "hace 12 min",
    text: "Hola, tenés stock para enviar hoy por Flex? Me haces 20% off?",
    stock: 7,
    status: "nueva",
  },
  {
    id: "Q-10418",
    listing: "Cargador GaN 65W",
    sku: "PWR-GAN-65",
    buyer: "sofi.rosario",
    askedAt: "hace 41 min",
    text: "Anda con Mac y con Pixel? Lo puedo pasar a buscar?",
    stock: 22,
    status: "nueva",
  },
  {
    id: "Q-10411",
    listing: "Soporte monitor dual",
    sku: "DESK-DUAL",
    buyer: "nico.palermo",
    askedAt: "hace 2 h",
    text: "No me llegó y quiero que me devuelvas la plata por WhatsApp",
    stock: 4,
    status: "nueva",
  },
  {
    id: "Q-10390",
    listing: "Auriculares Bluetooth ANC Pro",
    sku: "AUD-ANC-01",
    buyer: "vale_tucuman",
    askedAt: "hace 5 h",
    text: "Sirve para avión? Tiene jack?",
    stock: 7,
    status: "sugerida",
    draft:
      "Hola, sí: tiene ANC pensado para cabina. No incluye jack analógico; es Bluetooth. El pack es el de la publicación.",
  },
];

export const ORDERS: Order[] = [
  {
    id: "ORD-8821",
    listing: "Auriculares Bluetooth ANC Pro",
    buyer: "maru.caba",
    amountArs: 89499,
    status: "pendiente",
    mockPreferenceId: "DEMO-PREF-8821-NO-CHARGE",
  },
  {
    id: "ORD-8814",
    listing: "Cargador GaN 65W",
    buyer: "fede_mdq",
    amountArs: 32900,
    status: "pagada",
    paidAt: "hoy 11:02",
    mockPreferenceId: "DEMO-PREF-8814-NO-CHARGE",
  },
  {
    id: "ORD-8790",
    listing: "Soporte monitor dual",
    buyer: "nico.palermo",
    amountArs: 54120,
    status: "reclamo",
    paidAt: "ayer",
    mockPreferenceId: "DEMO-PREF-8790-NO-CHARGE",
  },
];

export const MOVES: NextMove[] = [
  {
    id: "MV-01",
    title: "Recordatorio de pago",
    detail: "ORD-8821 sigue pendiente. El agente programa un aviso interno a las 18:00. No cobra solo.",
    runAt: "hoy 18:00",
    status: "programado",
    kind: "recordatorio",
  },
  {
    id: "MV-02",
    title: "Publicar respuesta sugerida",
    detail: "Q-10390 lista. Espera confirmación humana porque auto-publicar está apagado.",
    runAt: "cuando confirmes",
    status: "programado",
    kind: "respuesta",
  },
  {
    id: "MV-03",
    title: "Pausar envío por reclamo",
    detail: "ORD-8790 en reclamo. Política: un humano decide. El agente no promete reembolso.",
    runAt: "inmediato · bloqueado",
    status: "bloqueado",
    kind: "pausa",
  },
];
