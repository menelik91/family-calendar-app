'use client';

import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek } from 'date-fns';
import { it } from 'date-fns/locale';
import { EventWithMember } from '@/lib/types';
import { cn } from '@/lib/utils';

export function CalendarMonth({ currentMonth, events }: { currentMonth: Date; events: EventWithMember[] }) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 1 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 1 })
  });

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{format(currentMonth, 'MMMM yyyy', { locale: it })}</h2>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
        {['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'].map((day) => (
          <div key={day} className="py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const dayEvents = events.filter((event) => isSameDay(new Date(event.starts_at), day));
          return (
            <div
              key={day.toISOString()}
              className={cn(
                'min-h-28 rounded-xl border p-2',
                isSameMonth(day, currentMonth) ? 'border-slate-200 bg-white' : 'border-slate-100 bg-slate-50 text-slate-400'
              )}
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium">{format(day, 'd')}</span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className="truncate rounded-lg px-2 py-1 text-xs font-medium text-slate-800"
                    style={{ backgroundColor: event.member?.color ?? '#E2E8F0' }}
                    title={`${event.title} • ${event.member?.display_name ?? 'Senza assegnazione'}`}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-xs text-slate-500">+{dayEvents.length - 3} altri</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
