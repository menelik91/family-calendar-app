'use client';

import { useMemo, useState } from 'react';
import { addMonths, compareAsc, formatISO, startOfMonth } from 'date-fns';
import { CalendarMonth } from '@/components/calendar-month';
import { EventForm } from '@/components/event-form';
import { EventList } from '@/components/event-list';
import { createClient } from '@/lib/supabase/client';
import { CalendarEvent, EventWithMember, Family, FamilyMember } from '@/lib/types';
import { SignOutButton } from '@/components/sign-out-button';

export function DashboardClient({
  family,
  members,
  initialEvents,
  userDisplayName
}: {
  family: Family;
  members: FamilyMember[];
  initialEvents: EventWithMember[];
  userDisplayName: string;
}) {
  const supabase = useMemo(() => createClient(), []);
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<EventWithMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));
  const [error, setError] = useState<string | null>(null);

  const upcomingEvents = [...events].sort((a, b) => compareAsc(new Date(a.starts_at), new Date(b.starts_at)));

  async function handleSave(values: {
    title: string;
    starts_at: string;
    ends_at: string;
    category: string;
    notes: string;
    assigned_member_id: string;
  }, eventId?: string) {
    setLoading(true);
    setError(null);

    const payload = {
      family_id: family.id,
      title: values.title,
      starts_at: new Date(values.starts_at).toISOString(),
      ends_at: new Date(values.ends_at).toISOString(),
      category: values.category || null,
      notes: values.notes || null,
      assigned_member_id: values.assigned_member_id || null
    };

    try {
      if (eventId) {
        const { data, error } = await supabase
          .from('events')
          .update(payload)
          .eq('id', eventId)
          .select('*')
          .single();

        if (error) throw error;
        const member = members.find((item) => item.id === data.assigned_member_id) ?? null;
        setEvents((prev) => prev.map((item) => (item.id === eventId ? { ...(data as CalendarEvent), member } : item)));
        setSelectedEvent(null);
      } else {
        const { data, error } = await supabase.from('events').insert(payload).select('*').single();
        if (error) throw error;
        const member = members.find((item) => item.id === data.assigned_member_id) ?? null;
        setEvents((prev) => [{ ...(data as CalendarEvent), member }, ...prev]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Errore durante il salvataggio');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(eventId: string) {
    const confirmed = window.confirm('Eliminare questo evento?');
    if (!confirmed) return;

    const { error } = await supabase.from('events').delete().eq('id', eventId);
    if (error) {
      setError(error.message);
      return;
    }
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    if (selectedEvent?.id === eventId) setSelectedEvent(null);
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Calendario condiviso</p>
          <h1 className="text-2xl font-bold text-slate-900">{family.name}</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ciao {userDisplayName || 'utente'} • Codice invito: <span className="font-semibold">{family.invite_code}</span>
          </p>
        </div>
        <SignOutButton />
      </header>

      {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <section className="mb-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {members.map((member) => (
            <div key={member.id} className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: member.color }} />
              {member.display_name}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, -1))}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
          >
            Mese precedente
          </button>
          <button
            onClick={() => setCurrentMonth((prev) => addMonths(prev, 1))}
            className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700"
          >
            Mese successivo
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        <div className="space-y-6">
          <CalendarMonth currentMonth={currentMonth} events={events} />
          <EventList events={upcomingEvents} onEdit={setSelectedEvent} onDelete={handleDelete} />
        </div>

        <div className="space-y-6">
          <EventForm members={members} selectedEvent={selectedEvent} onSubmit={handleSave} onCancel={() => setSelectedEvent(null)} loading={loading} />
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Note MVP</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>• Web app pensata per 4 membri</li>
              <li>• Nessuna integrazione esterna</li>
              <li>• Nessuna notifica push</li>
              <li>• Design minimale e funzionale</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
