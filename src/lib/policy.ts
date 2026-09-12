import type { Policy, Question } from "./types";

export const DEFAULT_POLICY: Policy = {
  maxDiscountPct: 5,
  autoPublishAnswers: false,
  allowRefundPromise: false,
  maxAutoRefundArs: 0,
  quietHoursFrom: 23,
  quietHoursTo: 8,
  requireHumanForClaims: true,
  neverInventStock: true,
  neverSharePersonalData: true,
  dailyActionCap: 40,
};

const DISCOUNT_RE = /(\d+)\s*%|diez por ciento|20 por ciento|mitad de precio/i;
const REFUND_RE = /te devuelvo|reembolso|plata de vuelta|te retorno el dinero/i;
const STOCK_LIE_RE = /hay stock|tenemos disponible|sale hoy|lo despacho ya/i;
const PII_RE = /whatsapp|wsp|celular|te paso mi|mi número|instagram/i;

export function evaluateAnswer(question: Question, draft: string, policy: Policy) {
  const reasons: string[] = [];

  if (policy.neverSharePersonalData && PII_RE.test(draft)) {
    reasons.push("La respuesta comparte un canal personal. Eso viola la política y las reglas del marketplace.");
  }

  if (policy.neverInventStock && question.stock <= 0 && STOCK_LIE_RE.test(draft)) {
    reasons.push("El listing no tiene stock. El agente no puede inventar disponibilidad.");
  }

  if (!policy.allowRefundPromise && REFUND_RE.test(draft)) {
    reasons.push("Promesa de reembolso bloqueada. Los reclamos los confirma un humano.");
  }

  const discountMatch = draft.match(DISCOUNT_RE);
  if (discountMatch) {
    const pct = Number(discountMatch[1] || 10);
    if (pct > policy.maxDiscountPct) {
      reasons.push(`Descuento ${pct}% supera el tope de política (${policy.maxDiscountPct}%).`);
    }
  }

  const hour = new Date().getHours();
  const quiet =
    policy.quietHoursFrom > policy.quietHoursTo
      ? hour >= policy.quietHoursFrom || hour < policy.quietHoursTo
      : hour >= policy.quietHoursFrom && hour < policy.quietHoursTo;

  return {
    allowed: reasons.length === 0,
    reasons,
    quietHours: quiet,
    requiresHuman:
      policy.requireHumanForClaims || !policy.autoPublishAnswers || reasons.length > 0,
  };
}

export function suggestAnswer(question: Question, policy: Policy): string {
  if (question.stock <= 0) {
    return `Hola, gracias por escribir. En este momento el aviso "${question.listing}" no tiene unidades disponibles. Si se reponer, se actualiza solo el listing. No te puedo confirmar una fecha que no está publicada.`;
  }

  if (/envio|flex|full|correo/i.test(question.text)) {
    return `Hola, el envío sigue lo que muestra el aviso: si figura Full o Flex, se despacha por ese canal. El costo y el plazo los calcula la plataforma al comprar. No manejo envíos por fuera del checkout.`;
  }

  if (/descuento|precio|oferta|cuotas/i.test(question.text)) {
    return `Hola, el precio publicado es el vigente. Puedo aplicar como máximo un ${policy.maxDiscountPct}% si el dueño lo confirma. Las cuotas las define Mercado Pago en el checkout, no las invento acá.`;
  }

  return `Hola, sí: el producto es el de la publicación "${question.listing}". Lo que ves en el aviso (estado, garantía y stock ${question.stock}) es lo que rige. Si comprás, te llega la confirmación por la plataforma.`;
}
