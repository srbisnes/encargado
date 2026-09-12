export type QuestionStatus = "nueva" | "sugerida" | "publicada" | "bloqueada";
export type OrderStatus = "pendiente" | "pagada" | "enviada" | "reclamo";
export type MoveStatus = "programado" | "ejecutado" | "cancelado" | "bloqueado";

export type Policy = {
  maxDiscountPct: number;
  autoPublishAnswers: boolean;
  allowRefundPromise: boolean;
  maxAutoRefundArs: number;
  quietHoursFrom: number;
  quietHoursTo: number;
  requireHumanForClaims: boolean;
  neverInventStock: boolean;
  neverSharePersonalData: boolean;
  dailyActionCap: number;
};

export type Question = {
  id: string;
  listing: string;
  sku: string;
  buyer: string;
  askedAt: string;
  text: string;
  stock: number;
  status: QuestionStatus;
  draft?: string;
  blockReason?: string;
};

export type Order = {
  id: string;
  listing: string;
  buyer: string;
  amountArs: number;
  status: OrderStatus;
  paidAt?: string;
  mockPreferenceId: string;
};

export type NextMove = {
  id: string;
  title: string;
  detail: string;
  runAt: string;
  status: MoveStatus;
  kind: "respuesta" | "recordatorio" | "pausa" | "etiqueta";
};
