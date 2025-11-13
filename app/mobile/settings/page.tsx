/**
 * Mobile Settings Page
 * Settings and preferences for mobile users
 */

'use client';

import { useState } from 'react';
import { AppShell } from '@/components/mobile/AppShell';

export default function MobileSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [haptics, setHaptics] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

  return (
    <AppShell showHeader={false}>
      <div className="min-h-screen bg-gray-50 pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6 rounded-b-3xl shadow-xl">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-blue-100">Customize your experience</p>
        </div>

        {/* Settings */}
        <div className="p-4 space-y-4">
          {/* Account */}
          <section className="bg-white rounded-2xl shadow-sm">
            <h2 className="px-4 pt-4 pb-2 font-bold text-lg">Account</h2>
            <div className="divide-y divide-gray-100">
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Wallet</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Security</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-2xl shadow-sm">
            <h2 className="px-4 pt-4 pb-2 font-bold text-lg">Preferences</h2>
            <div className="divide-y divide-gray-100">
              <div className="px-4 py-4 flex items-center justify-between">
                <span>Notifications</span>
                <input 
                  type="checkbox" 
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="toggle"
                />
              </div>
              <div className="px-4 py-4 flex items-center justify-between">
                <span>Haptic Feedback</span>
                <input 
                  type="checkbox" 
                  checked={haptics}
                  onChange={(e) => setHaptics(e.target.checked)}
                  className="toggle"
                />
              </div>
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Theme</span>
                <span className="text-gray-600">{theme}</span>
              </button>
            </div>
          </section>

          {/* About */}
          <section className="bg-white rounded-2xl shadow-sm">
            <h2 className="px-4 pt-4 pb-2 font-bold text-lg">About</h2>
            <div className="divide-y divide-gray-100">
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Version</span>
                <span className="text-gray-600">1.0.0</span>
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Terms of Service</span>
                <span className="text-gray-400">→</span>
              </button>
              <button className="w-full px-4 py-4 flex items-center justify-between active:bg-gray-50">
                <span>Privacy Policy</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

