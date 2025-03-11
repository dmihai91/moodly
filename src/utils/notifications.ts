import { supabase } from '@/utils/supabase';
import type { Notification } from '@/types';

export async function createReminder(data: {
  title: string;
  message: string;
  time: string;
  days: string[];
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data: reminder, error } = await supabase
    .from('reminders')
    .insert([
      {
        user_id: user.user.id,
        ...data
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating reminder:', error);
    return null;
  }

  return reminder;
}

export async function getReminders() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];

  const { data: reminders, error } = await supabase
    .from('reminders')
    .select('*')
    .eq('user_id', user.user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reminders:', error);
    return [];
  }

  return reminders;
}

export async function updateReminder(id: string, data: Partial<{
  title: string;
  message: string;
  time: string;
  days: string[];
  active: boolean;
}>) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return null;

  const { data: reminder, error } = await supabase
    .from('reminders')
    .update(data)
    .eq('id', id)
    .eq('user_id', user.user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating reminder:', error);
    return null;
  }

  return reminder;
}

export async function deleteReminder(id: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id)
    .eq('user_id', user.user.id);

  if (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }

  return true;
}

export async function clearNotifications() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return false;

  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', user.user.id)
    .eq('read', false);

  if (error) {
    console.error('Error clearing notifications:', error);
    return false;
  }

  return true;
}