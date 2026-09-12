# ENCARGADO

**El agente que atiende tu tienda — sin improvisar.**  
by **elcryptoboy**

Demo funcional de un command center para sellers: el agente propone respuestas, un **policy engine** corta lo peligroso, y el próximo movimiento queda en cola.

> No está afiliado a Mercado Libre ni a Mercado Pago.  
> Producto de referencia para partners / equipos de producto: patrón *agent + policy + human gate*.

## Demo

- Landing: `/`
- Command center: `/app`
- Seguridad: `/seguridad`
- HTML standalone (sin build): `/encargado.html`

## Qué hace

| Capa | Comportamiento |
|------|----------------|
| Bandeja | Preguntas mock de compradores |
| Agente | Sugiere respuesta según stock / tema |
| Política | Bloquea WhatsApp, stock inventado, reembolsos, descuentos fuera de tope |
| Publicación | Solo sandbox local |
| Cola | Programa el próximo paso (recordatorio / pausa) |
| Pagos | **OFF** — IDs `DEMO-PREF-*-NO-CHARGE` |

## Para implementar en un marketplace real

Ver **[docs/INTEGRATION.md](docs/INTEGRATION.md)**.

1. Implementar `MarketplaceAdapter` con APIs oficiales + OAuth.
2. Llamar siempre a `evaluateAnswer` antes de publicar.
3. Defaults seguros: sin auto-publish, sin promesas de reembolso, humano en reclamos.
4. No procesar cobros desde este módulo.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind 4
- Policy engine: `src/lib/policy.ts`
- Adapter mock: `src/lib/adapters/marketplace.ts`

## Local

```bash
npm install
npm run dev
npm run build
```

No requiere `.env` en modo demo.

## Seguridad

- Sin secretos en el repo
- Sin llamadas de cobro
- `robots: noindex`
- Policy en cliente + API `/api/agent/evaluate`

## Autor

**elcryptoboy** — [@srbisnes](https://github.com/srbisnes)

## License

MIT
