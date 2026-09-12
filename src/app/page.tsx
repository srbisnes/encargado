import Link from "next/link";

export default function HomePage() {
  return (
    <main className="grid-noise min-h-screen">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-[#ffe600] text-sm font-extrabold text-black">
            E
          </span>
          <div>
            <p className="text-sm font-extrabold tracking-tight">ENCARGADO</p>
            <p className="font-mono text-[10px] uppercase text-[#9a9584]">
              by elcryptoboy
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-4 text-sm text-[#cfcab8]">
          <Link href="/seguridad" className="hover:text-white">
            Seguridad
          </Link>
          <Link
            href="/app"
            className="rounded-full bg-[#ffe600] px-4 py-2 font-bold text-black"
          >
            Abrir demo
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-10">
        <p className="mb-4 inline-flex rounded-full border border-[#3a372c] px-3 py-1 font-mono text-[11px] uppercase tracking-widest text-[#ffe600]">
          Demo funcional · sin cobros reales · tienda estilo marketplace
        </p>
        <h1 className="max-w-4xl text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          El encargado de tu tienda
          <span className="block text-[#ffe600]">no improvisa.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-[#cfcab8]">
          Preguntas de compradores, respuestas sugeridas y el próximo
          movimiento programado. La política corta lo que un agente no debería
          decir: descuentos locos, stock inventado, WhatsApp por izquierda,
          reembolsos fantasmas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/app"
            className="yellow-glow rounded-full bg-[#ffe600] px-6 py-3 text-sm font-extrabold text-black"
          >
            Entrar al puesto
          </Link>
          <Link
            href="/seguridad"
            className="rounded-full border border-[#3a372c] px-6 py-3 text-sm font-semibold text-white"
          >
            Qué no hace esta demo
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-4 px-6 pb-24 sm:grid-cols-3">
        {[
          {
            k: "01",
            t: "Lee la pregunta",
            d: "Stock, listing y texto del comprador. Nada de scrapear cuentas ajenas.",
          },
          {
            k: "02",
            t: "Propone, no publica",
            d: "El agente redacta. La política evalúa. Vos confirmás.",
          },
          {
            k: "03",
            t: "Agenda el siguiente paso",
            d: "Recordatorio, pausa por reclamo o etiqueta. Sin ejecutar plata.",
          },
        ].map((card) => (
          <article
            key={card.k}
            className="rounded-2xl border border-[#2a281f] bg-[#131311] p-5"
          >
            <p className="font-mono text-xs text-[#ffe600]">{card.k}</p>
            <h2 className="mt-3 text-xl font-bold">{card.t}</h2>
            <p className="mt-2 text-sm text-[#9a9584]">{card.d}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
