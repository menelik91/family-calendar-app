'use client';

import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { EventWithMember } from '@/lib/types';

export function EventList({ events, onEdit, onDelete }: {
  events: EventWithMember[];
  onEdit: (event: EventWithMember) => void;
  onDelete: (eventId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Prossimi eventi</h2>
        <span className="text-sm text-slate-500">{events.length} totali</span>
      </div>

      <div className="space-y-3">
        {events.length === 0 ? (
          <p className="rounded-xl bg-slate-50 px-3 py-4 text-sm text-slate-500">Nessun evento in calendario.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: event.member?.color ?? '#CBD5E1' }} />
                    <h3 className="font-semibold text-slate-900">{event.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-slate-600">
                    {format(new Date(event.starts_at), "EEE d MMM, HH:mm", { locale: it })}
                    {' → '}
                    {format(new Date(event.ends_at), 'HH:mm', { locale: it })}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {event.member?.display_name ?? 'Non assegnato'}
                    {event.category ? ` • ${event.category}` : ''}
                  </p>
                  {event.notes && <p className="mt-2 text-sm text-slate-500">{event.notes}</p>}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(event)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700"
                  >
                    Modifica
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(event.id)}
                    className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600"
                  >
                    Elimina
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
