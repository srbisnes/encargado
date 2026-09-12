"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { MOVES, ORDERS, QUESTIONS, STORE } from "../lib/mock";
import { DEFAULT_POLICY, evaluateAnswer, suggestAnswer } from "../lib/policy";
import type { NextMove, Policy, Question } from "../lib/types";

function money(n: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

export function CommandCenter() {
  const [policy, setPolicy] = useState<Policy>(DEFAULT_POLICY);
  const [questions, setQuestions] = useState<Question[]>(QUESTIONS);
  const [moves, setMoves] = useState<NextMove[]>(MOVES);
  const [selectedId, setSelectedId] = useState(QUESTIONS[0].id);
  const [draft, setDraft] = useState(() => suggestAnswer(QUESTIONS[0], DEFAULT_POLICY));
  const [toast, setToast] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const selected = questions.find((q) => q.id === selectedId) ?? questions[0];
  const localCheck = useMemo(() => evaluateAnswer(selected, draft, policy), [selected, draft, policy]);

  function pick(q: Question) {
    setSelectedId(q.id);
    setDraft(q.draft || suggestAnswer(q, policy));
  }

  async function runPolicy() {
    setChecking(true);
    try {
      const res = await fetch("/api/agent/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: selected, draft, policy }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.error || "No se pudo evaluar");
        return localCheck;
      }
      return data as { allowed: boolean; reasons: string[] };
    } catch {
      setToast("Red caída. Se usó el chequeo local.");
      return localCheck;
    } finally {
      setChecking(false);
    }
  }

  async function publish() {
    const result = await runPolicy();
    if (!result.allowed) {
      setQuestions((qs) =>
        qs.map((q) =>
          q.id === selected.id
            ? { ...q, status: "bloqueada" as const, draft, blockReason: result.reasons[0] }
            : q
        )
      );
      setToast("Bloqueado por política. No se publicó.");
      return;
    }
    setQuestions((qs) =>
      qs.map((q) => (q.id === selected.id ? { ...q, status: "publicada" as const, draft } : q))
    );
    setMoves((ms) => [
      {
        id: `MV-${Date.now()}`,
        title: "Respuesta publicada (demo)",
        detail: `${selected.id} solo en sandbox. No salió a ningún marketplace.`,
        runAt: "ahora",
        status: "ejecutado",
        kind: "respuesta",
      },
      ...ms,
    ]);
    setToast("Publicada en sandbox. Cero impacto afuera.");
  }

  function schedule() {
    setMoves((ms) => [
      {
        id: `MV-${Date.now()}`,
        title: "Próximo movimiento agendado",
        detail: `Revisar ${selected.id}. El agente no cobra ni escribe por fuera.`,
        runAt: "en 3 h",
        status: "programado",
        kind: "recordatorio",
      },
      ...ms,
    ]);
    setToast("Movimiento programado en la cola local.");
  }

  return (
    <div className="min-h-screen bg-[#0b0b0c] text-[#f6f4ea]">
      <header className="flex items-center justify-between border-b border-[#23221d] px-5 py-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="grid h-8 w-8 place-items-center rounded bg-[#ffe600] text-xs font-extrabold text-black">E</Link>
          <div>
            <p className="text-sm font-extrabold">ENCARGADO</p>
            <p className="font-mono text-[10px] text-[#9a9584]">{STORE.name} · {STORE.reputation} · by elcryptoboy</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-[#3a372c] px-3 py-1 font-mono text-[10px] uppercase text-[#7dffb3]">pagos off</span>
          <Link href="/seguridad" className="text-xs text-[#9a9584]">seguridad</Link>
        </div>
      </header>

      <section className="grid gap-3 border-b border-[#23221d] px-5 py-4 sm:grid-cols-4">
        {[
          ["Ventas 30d", String(STORE.sales30d)],
          ["Preguntas abiertas", String(questions.filter((q) => q.status !== "publicada").length)],
          ["Órdenes demo", String(ORDERS.length)],
          ["Cola de movimientos", String(moves.filter((m) => m.status === "programado").length)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-xl border border-[#2a281f] bg-[#131311] px-4 py-3">
            <p className="font-mono text-[10px] uppercase text-[#9a9584]">{l}</p>
            <p className="mt-1 text-2xl font-extrabold">{v}</p>
          </div>
        ))}
      </section>

      <div className="grid gap-0 lg:grid-cols-[280px_1fr_320px]">
        <aside className="border-b border-[#23221d] lg:border-b-0 lg:border-r">
          <p className="px-4 py-3 font-mono text-[10px] uppercase text-[#9a9584]">Bandeja</p>
          {questions.map((q) => (
            <button key={q.id} onClick={() => pick(q)} className={`block w-full border-b border-[#23221d] px-4 py-3 text-left ${q.id === selected.id ? "bg-[#1b1a14]" : ""}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold">{q.listing}</span>
                <StatusChip status={q.status} />
              </div>
              <p className="mt-1 line-clamp-2 text-xs text-[#9a9584]">{q.text}</p>
            </button>
          ))}
        </aside>

        <section className="border-b border-[#23221d] p-5 lg:border-b-0 lg:border-r">
          <p className="font-mono text-[10px] uppercase text-[#ffe600]">{selected.id} · stock {selected.stock} · {selected.buyer}</p>
          <h2 className="mt-2 text-2xl font-extrabold">{selected.listing}</h2>
          <blockquote className="mt-4 rounded-xl border border-[#2a281f] bg-[#0f0f0d] p-4 text-sm text-[#ddd8c6]">“{selected.text}”</blockquote>
          <label className="mt-5 block text-xs font-semibold text-[#9a9584]">Borrador del agente</label>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={7} className="mt-2 w-full resize-y rounded-xl border border-[#2a281f] bg-[#0f0f0d] p-3 text-sm outline-none focus:border-[#ffe600]" />
          <div className="mt-3 rounded-xl border border-[#2a281f] p-3 text-sm">
            {localCheck.allowed ? (
              <p className="text-[#7dffb3]">Política OK · listo para sandbox</p>
            ) : (
              <ul className="space-y-1 text-[#ff6b6b]">{localCheck.reasons.map((r) => (<li key={r}>{r}</li>))}</ul>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button onClick={() => setDraft(suggestAnswer(selected, policy))} className="rounded-full border border-[#3a372c] px-4 py-2 text-sm">Regenerar</button>
            <button onClick={schedule} className="rounded-full border border-[#3a372c] px-4 py-2 text-sm">Programar próximo paso</button>
            <button disabled={checking} onClick={publish} className="rounded-full bg-[#ffe600] px-4 py-2 text-sm font-extrabold text-black disabled:opacity-60">{checking ? "Chequeando…" : "Publicar en sandbox"}</button>
          </div>
        </section>

        <aside className="p-5">
          <h3 className="text-sm font-extrabold">Política</h3>
          <label className="mt-4 flex items-center justify-between text-sm">Auto-publicar<input type="checkbox" checked={policy.autoPublishAnswers} onChange={(e) => setPolicy({ ...policy, autoPublishAnswers: e.target.checked })} /></label>
          <label className="mt-3 flex items-center justify-between text-sm">Permitir promesa de reembolso<input type="checkbox" checked={policy.allowRefundPromise} onChange={(e) => setPolicy({ ...policy, allowRefundPromise: e.target.checked })} /></label>
          <label className="mt-3 block text-sm">Tope de descuento {policy.maxDiscountPct}%<input type="range" min={0} max={20} value={policy.maxDiscountPct} onChange={(e) => setPolicy({ ...policy, maxDiscountPct: Number(e.target.value) })} className="mt-2 w-full" /></label>
          <h3 className="mt-8 text-sm font-extrabold">Órdenes demo</h3>
          <ul className="mt-3 space-y-2">{ORDERS.map((o) => (<li key={o.id} className="rounded-xl border border-[#2a281f] p-3"><p className="text-sm font-semibold">{o.id}</p><p className="text-xs text-[#9a9584]">{o.listing} · {money(o.amountArs)} · {o.status}</p><p className="mt-1 font-mono text-[10px] text-[#6e6a5c]">{o.mockPreferenceId}</p></li>))}</ul>
          <h3 className="mt-8 text-sm font-extrabold">Próximos movimientos</h3>
          <ul className="mt-3 space-y-2">{moves.map((m) => (<li key={m.id} className="rounded-xl border border-[#2a281f] p-3"><div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold">{m.title}</p><StatusChip status={m.status} /></div><p className="mt-1 text-xs text-[#9a9584]">{m.detail}</p><p className="mt-1 font-mono text-[10px] text-[#6e6a5c]">{m.runAt}</p></li>))}</ul>
        </aside>
      </div>

      {toast && (<button onClick={() => setToast(null)} className="fixed bottom-5 right-5 max-w-xs rounded-full bg-[#ffe600] px-4 py-2 text-left text-sm font-bold text-black">{toast}</button>)}
    </div>
  );
}

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    nueva: "text-[#ffe600]", sugerida: "text-[#cfcab8]", publicada: "text-[#7dffb3]", bloqueada: "text-[#ff6b6b]",
    programado: "text-[#ffe600]", ejecutado: "text-[#7dffb3]", cancelado: "text-[#9a9584]", bloqueado: "text-[#ff6b6b]",
  };
  return <span className={`font-mono text-[10px] uppercase ${map[status] || ""}`}>{status}</span>;
}
