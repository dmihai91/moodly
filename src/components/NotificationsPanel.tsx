import React, { useState } from 'react';
import { Bell, Trash2, Plus, X } from 'lucide-react';
import { clearNotifications } from '@/utils/notifications';
import { ReminderDialog } from '@/components/ReminderDialog';
import type { Notification } from '@/types';

type NotificationsPanelProps = {
  notifications: Notification[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onNotificationsUpdate: () => void;
};

export function NotificationsPanel({ 
  notifications, 
  onClose,
  onMarkAsRead,
  onNotificationsUpdate
}: NotificationsPanelProps) {
  const [showReminderDialog, setShowReminderDialog] = useState(false);

  const handleClearAll = async () => {
    const success = await clearNotifications();
    if (success) {
      onNotificationsUpdate();
    }
  };

  return (
    <>
      <div className="absolute top-24 right-6 w-80 max-w-[calc(100%-3rem)] bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 z-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
          </div>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="w-8 h-8 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-600 dark:text-gray-400">No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg transition-colors cursor-pointer ${
                  notification.read
                    ? 'bg-gray-50 dark:bg-gray-700/50'
                    : 'bg-primary-50 dark:bg-primary-900/20'
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {notification.title}
                  </h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(notification.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {notification.message}
                </p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => setShowReminderDialog(true)}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Set Reminder</span>
        </button>
      </div>

      <ReminderDialog
        isOpen={showReminderDialog}
        onClose={() => setShowReminderDialog(false)}
        onSuccess={onNotificationsUpdate}
      />
    </>
  );
}