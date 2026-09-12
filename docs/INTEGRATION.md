# ENCARGADO — guía de implementación para partners

Producto de demostración **by elcryptoboy**.  
No está afiliado a Mercado Libre S.R.L. ni a Mercado Pago.  
Pensado para que un equipo de producto / partners pueda evaluar el patrón e integrarlo con APIs oficiales.

## Qué problema resuelve

Un agente de IA puede responder preguntas de compradores, pero sin política on-screen:

- inventa stock
- promete reembolsos
- comparte WhatsApp
- ofrece descuentos fuera de tope

ENCARGADO separa:

1. **Sugerencia** (agente / plantillas)
2. **Policy engine** (determinístico, auditable)
3. **Publicación** (solo si la política aprueba + humano o flag controlado)
4. **Cola de próximo movimiento** (recordatorio, pausa por reclamo) sin ejecutar pagos

## Arquitectura

```
UI Command Center
    ↓
PolicyEngine.evaluateAnswer(question, draft, policy)
    ↓ allowed?
MarketplaceAdapter.publishAnswer(..., { policyAllowed: true })
    ↓
Scheduler (próximo movimiento) — local / queue / jobs
```

Pagos: **fuera de alcance en esta demo**. Los IDs `DEMO-PREF-*-NO-CHARGE` no se cobran.

## Cómo lo implementaría un equipo marketplace

1. Reemplazar `MockMarketplaceAdapter` por un adapter que use **solo APIs oficiales** del marketplace (OAuth, scopes mínimos).
2. Mapear preguntas reales → `Question` (`id`, `listing`, `stock`, `text`).
3. Mantener el policy engine como capa **antes** de cualquier `POST` de respuesta.
4. Loguear cada evaluación: `questionId`, `allowed`, `reasons[]`, `actor`.
5. Default seguro:
   - `autoPublishAnswers = false`
   - `allowRefundPromise = false`
   - `requireHumanForClaims = true`
   - `neverSharePersonalData = true`

## Variables de entorno (producción futura)

```bash
# Nunca commitear secretos
MARKETPLACE_CLIENT_ID=
MARKETPLACE_CLIENT_SECRET=
MARKETPLACE_REDIRECT_URI=
# Solo sandbox en demos públicas
ENCARGADO_MODE=demo
```

En esta repo **no hay secretos**. El modo demo no los necesita.

## Seguridad

- No almacenar access tokens en el frontend.
- No dejar que el LLM firme acciones de valor.
- Session / human confirmation para publicar.
- Rate limit por vendedor (`dailyActionCap`).
- Audit log de bloqueos (útil para compliance y soporte).

## Licencia

MIT — ver `LICENSE`. Uso a riesgo propio. Validar términos del marketplace antes de producción.
