'use client';

export default function NotificationsSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Notifications Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Configure how you receive notifications about orders, updates, and other important events.
        </p>
      </div>

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <h2 className="text-lg font-medium text-gray-900">Coming Soon</h2>
            <p className="mt-2 text-sm text-gray-500">
              Notification preferences and settings will be available here in a future update.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 