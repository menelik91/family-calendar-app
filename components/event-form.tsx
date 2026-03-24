'use client';

import { FormEvent, useEffect, useState } from 'react';
import { FamilyMember, EventWithMember } from '@/lib/types';

type FormState = {
  title: string;
  starts_at: string;
  ends_at: string;
  category: string;
  notes: string;
  assigned_member_id: string;
};

const emptyForm: FormState = {
  title: '',
  starts_at: '',
  ends_at: '',
  category: '',
  notes: '',
  assigned_member_id: ''
};

function toInputDate(value: string) {
  const date = new Date(value);
  const pad = (num: number) => String(num).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function EventForm({
  members,
  selectedEvent,
  onSubmit,
  onCancel,
  loading
}: {
  members: FamilyMember[];
  selectedEvent: EventWithMember | null;
  onSubmit: (values: FormState, eventId?: string) => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}) {
  const [form, setForm] = useState<FormState>(emptyForm);

  useEffect(() => {
    if (!selectedEvent) {
      setForm(emptyForm);
      return;
    }

    setForm({
      title: selectedEvent.title,
      starts_at: toInputDate(selectedEvent.starts_at),
      ends_at: toInputDate(selectedEvent.ends_at),
      category: selectedEvent.category ?? '',
      notes: selectedEvent.notes ?? '',
      assigned_member_id: selectedEvent.assigned_member_id ?? ''
    });
  }, [selectedEvent]);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    await onSubmit(form, selectedEvent?.id);
    if (!selectedEvent) setForm(emptyForm);
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{selectedEvent ? 'Modifica evento' : 'Nuovo evento'}</h2>
        {selectedEvent && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-slate-500">
            Annulla modifica
          </button>
        )}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Titolo</span>
          <input
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Es. Visita pediatra"
            required
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Inizio</span>
            <input
              type="datetime-local"
              value={form.starts_at}
              onChange={(e) => setForm((prev) => ({ ...prev, starts_at: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Fine</span>
            <input
              type="datetime-local"
              value={form.ends_at}
              onChange={(e) => setForm((prev) => ({ ...prev, ends_at: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              required
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Membro</span>
            <select
              value={form.assigned_member_id}
              onChange={(e) => setForm((prev) => ({ ...prev, assigned_member_id: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
            >
              <option value="">Non assegnato</option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.display_name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Categoria</span>
            <input
              value={form.category}
              onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
              className="w-full rounded-xl border border-slate-300 px-3 py-2"
              placeholder="Scuola, lavoro, sport..."
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Note</span>
          <textarea
            value={form.notes}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="min-h-24 w-full rounded-xl border border-slate-300 px-3 py-2"
            placeholder="Note opzionali"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 font-medium text-white hover:bg-slate-700 disabled:opacity-60"
        >
          {loading ? 'Salvataggio...' : selectedEvent ? 'Aggiorna evento' : 'Aggiungi evento'}
        </button>
      </form>
    </div>
  );
}
