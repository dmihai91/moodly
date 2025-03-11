import React, { useState, useEffect } from 'react';
import { Bell, Clock, Calendar, Trash2, Plus, X } from 'lucide-react';
import { getReminders, deleteReminder, updateReminder } from '@/utils/notifications';
import { ReminderDialog } from '@/components/ReminderDialog';
import type { Reminder } from '@/types';

export function RemindersSection() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderDialog, setShowReminderDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReminders = async () => {
    const data = await getReminders();
    setReminders(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  const handleDelete = async (id: string) => {
    const success = await deleteReminder(id);
    if (success) {
      setReminders(prev => prev.filter(r => r.id !== id));
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const reminder = await updateReminder(id, { active: !currentActive });
    if (reminder) {
      setReminders(prev => prev.map(r => r.id === id ? reminder : r));
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bell className="w-6 h-6 text-purple-500 dark:text-purple-400" />
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200">Reminders</h2>
        </div>
        <button
          onClick={() => setShowReminderDialog(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Reminder</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : reminders.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-400">No reminders set</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
            Create a reminder to get notifications about your mood check-ins
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <div
              key={reminder.id}
              className={`p-4 rounded-lg border transition-colors ${
                reminder.active
                  ? 'border-primary-200 dark:border-primary-800 bg-primary-50/50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{reminder.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{reminder.message}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleActive(reminder.id, reminder.active)}
                    className={`p-1 rounded-lg transition-colors ${
                      reminder.active
                        ? 'text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30'
                        : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Clock className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(reminder.id)}
                    className="p-1 rounded-lg text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{reminder.time}</span>
                </div>
                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{reminder.days.map(d => d.slice(0, 3)).join(', ')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        onSuccess={() => {
          fetchReminders();
          setShowReminderDialog(false);
        }}
      />
    </div>
  );
}