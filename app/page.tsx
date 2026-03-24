import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-8 px-6 py-16">
      <div className="max-w-2xl text-center">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
          Family Calendar MVP
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Un calendario familiare semplice, veloce e senza abbonamenti.
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Web app minimale per 4 utenti con login, calendario mensile, lista eventi e gestione condivisa.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <ul className="space-y-3 text-slate-700">
          <li>• Login email/password con Supabase</li>
          <li>• Creazione o join di una famiglia tramite codice</li>
          <li>• Eventi condivisi con colore per membro</li>
          <li>• Vista mese + prossimi eventi</li>
        </ul>
        <div className="mt-6 flex justify-center">
          <Link
            href="/login"
            className="rounded-xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-700"
          >
            Entra nell&apos;app
          </Link>
        </div>
      </div>
    </main>
  );
}
