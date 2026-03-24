import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardClient } from '@/components/dashboard-client';
import { FamilySetup } from '@/components/family-setup';
import { EventWithMember, Family, FamilyMember } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('family_members')
    .select('family_id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!membership) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-12">
        <FamilySetup userId={user.id} profileName={(user.user_metadata?.display_name as string) ?? ''} />
      </main>
    );
  }

  const { data: family } = await supabase.from('families').select('*').eq('id', membership.family_id).single();

  const { data: members } = await supabase
    .from('family_members')
    .select('*')
    .eq('family_id', membership.family_id)
    .order('created_at', { ascending: true });

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('family_id', membership.family_id)
    .order('starts_at', { ascending: true });

  const memberMap = new Map((members ?? []).map((member) => [member.id, member]));
  const hydratedEvents: EventWithMember[] = (events ?? []).map((event) => ({
    ...event,
    member: event.assigned_member_id ? memberMap.get(event.assigned_member_id) ?? null : null
  }));

  return (
    <DashboardClient
      family={family as Family}
      members={(members ?? []) as FamilyMember[]}
      initialEvents={hydratedEvents}
      userDisplayName={membership.display_name}
    />
  );
}
