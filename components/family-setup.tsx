'use client';

import { FormEvent, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { generateFamilyCode } from '@/lib/utils';

export function FamilySetup({ userId, profileName }: { userId: string; profileName: string }) {
  const supabase = useMemo(() => createClient(), []);
  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [familyName, setFamilyName] = useState('Famiglia');
  const [inviteCode, setInviteCode] = useState('');
  const [displayName, setDisplayName] = useState(profileName || '');
  const [color, setColor] = useState('#BFDBFE');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createFamily(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const code = generateFamilyCode();

    const { data: family, error: familyError } = await supabase
      .from('families')
      .insert({ name: familyName, invite_code: code, created_by: userId })
      .select()
      .single();

    if (familyError) {
      setError(familyError.message);
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from('family_members').insert({
      family_id: family.id,
      user_id: userId,
      display_name: displayName,
      color
    });

    if (memberError) {
      setError(memberError.message);
      setLoading(false);
      return;
    }

    setMessage(`Famiglia creata. Codice invito: ${code}`);
    window.location.reload();
  }

  async function joinFamily(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data: family, error: familyError } = await supabase
      .from('families')
      .select('*')
      .eq('invite_code', inviteCode.toUpperCase())
      .single();

    if (familyError || !family) {
      setError('Codice famiglia non trovato.');
      setLoading(false);
      return;
    }

    const { error: memberError } = await supabase.from('family_members').insert({
      family_id: family.id,
      user_id: userId,
      display_name: displayName,
      color
    });

    if (memberError) {
      setError(memberError.message);
      setLoading(false);
      return;
    }

    setMessage('Ingresso nella famiglia completato.');
    window.location.reload();
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">Configura la tua famiglia</h2>
      <p className="mt-2 text-sm text-slate-600">Crea un calendario condiviso oppure entra con un codice invito.</p>

      <div className="mt-4 flex gap-2 rounded-xl bg-slate-100 p-1">
        <button
          type="button"
          className={`flex-1 rounded-lg px-3 py-2 ${mode === 'create' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          onClick={() => setMode('create')}
        >
          Crea famiglia
        </button>
        <button
          type="button"
          className={`flex-1 rounded-lg px-3 py-2 ${mode === 'join' ? 'bg-white shadow-sm' : 'text-slate-600'}`}
          onClick={() => setMode('join')}
        >
          Entra con codice
        </button>
      </div>

      <form className="mt-6 space-y-4" onSubmit={mode === 'create' ? createFamily : joinFamily}>
        {mode === 'create' && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Nome famiglia</span>
            <input
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </label>
        )}

        {mode === 'join' && (
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Codice invito</span>
            <input
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-slate-300 px-3 py-2 uppercase"
              placeholder="AB12CD"
              required
            />
          </label>
        )}

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Nome visualizzato</span>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Colore</span>
          <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-11 w-full rounded-xl border border-slate-300" />
        </label>

        {message && <p className="rounded-xl bg-green-50 px-3 py-2 text-sm text-green-700">{message}</p>}
        {error && <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button type="submit" disabled={loading} className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white">
          {loading ? 'Attendi...' : mode === 'create' ? 'Crea e continua' : 'Entra nel calendario'}
        </button>
      </form>
    </div>
  );
}
