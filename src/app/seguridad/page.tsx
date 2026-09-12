import Link from "next/link";

export default function SeguridadPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <Link href="/" className="text-sm text-[#ffe600]">
        ← ENCARGADO
      </Link>
      <h1 className="mt-6 text-4xl font-extrabold">Seguridad de la demo</h1>
      <p className="mt-4 text-[#cfcab8]">
        Producto de demostración by elcryptoboy. No está afiliado a Mercado
        Libre ni a Mercado Pago. No procesa pagos. No guarda claves.
      </p>
      <ul className="mt-8 space-y-3 text-sm text-[#ddd8c6]">
        <li>• Cero llamadas a APIs de cobro. Los IDs de preferencia son fake.</li>
        <li>• No hay variables de entorno secretas requeridas.</li>
        <li>• El motor de política corre en el server y otra vez en el cliente.</li>
        <li>• El agente no puede publicar solo si auto-publicar está off.</li>
        <li>• Reclamos y reembolsos quedan bloqueados por default.</li>
        <li>• Robots noindex. Esto no es un marketplace.</li>
      </ul>
      <Link
        href="/app"
        className="mt-10 inline-block rounded-full bg-[#ffe600] px-5 py-2 font-bold text-black"
      >
        Volver a la demo
      </Link>
    </main>
  );
}
