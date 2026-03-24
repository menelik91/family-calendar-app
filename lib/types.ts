export type Family = {
  id: string;
  name: string;
  invite_code: string;
  created_by: string;
  created_at: string;
};

export type FamilyMember = {
  id: string;
  family_id: string;
  user_id: string;
  display_name: string;
  color: string;
  created_at: string;
};

export type CalendarEvent = {
  id: string;
  family_id: string;
  title: string;
  notes: string | null;
  starts_at: string;
  ends_at: string;
  category: string | null;
  assigned_member_id: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
};

export type EventWithMember = CalendarEvent & {
  member: Pick<FamilyMember, 'id' | 'display_name' | 'color'> | null;
};
