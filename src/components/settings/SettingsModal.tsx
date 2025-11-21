/**
 * Settings Modal Component
 * User preferences and application settings
 */

import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Switch } from 'react-native';

import { settingsManager, UserSettings } from '../../features/settings/SettingsManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(() => settingsManager.getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const loadSettings = () => {
        setSettings(settingsManager.getSettings());
        setHasChanges(false);
      };
      loadSettings();
    }
  }, [isOpen]);

  const handleSettingChange = <K extends keyof UserSettings>(
    key: K,
    value: UserSettings[K]
  ): void => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    settingsManager.updateSettings(settings);
    setHasChanges(false);
    onClose();
  };

  const handleReset = () => {
    settingsManager.resetSettings();
    setSettings(settingsManager.getSettings());
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <View className="w-full max-w-2xl rounded-lg bg-gray-800 shadow-xl">
        {/* Header */}
        <View className="flex-row items-center justify-between border-b border-gray-700 p-6">
          <Text className="text-2xl font-bold text-white">Settings</Text>
          <Pressable onPress={onClose} className="rounded-lg p-2 hover:bg-gray-700">
            <Text className="text-2xl text-gray-400">×</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView className="max-h-[70vh] p-6">
          {/* General Settings */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-white">General</Text>

            <View className="space-y-4">
              {/* Theme */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Theme</Text>
                  <Text className="text-sm text-gray-400">Choose your preferred color scheme</Text>
                </View>
                <View className="flex-row gap-2">
                  {(['light', 'dark', 'auto'] as const).map((theme) => (
                    <Pressable
                      key={theme}
                      onPress={() => handleSettingChange('theme', theme)}
                      className={`rounded px-4 py-2 ${
                        settings.theme === theme ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <Text className="capitalize text-white">{theme}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Language */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Language</Text>
                  <Text className="text-sm text-gray-400">Select your preferred language</Text>
                </View>
                <View className="flex-row gap-2">
                  {(['en', 'es', 'fr', 'de', 'zh'] as const).map((lang) => (
                    <Pressable
                      key={lang}
                      onPress={() => handleSettingChange('language', lang)}
                      className={`rounded px-4 py-2 ${
                        settings.language === lang ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <Text className="uppercase text-white">{lang}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Currency */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Currency</Text>
                  <Text className="text-sm text-gray-400">Display prices in your currency</Text>
                </View>
                <View className="flex-row gap-2">
                  {(['USD', 'EUR', 'GBP', 'JPY'] as const).map((currency) => (
                    <Pressable
                      key={currency}
                      onPress={() => handleSettingChange('currency', currency)}
                      className={`rounded px-4 py-2 ${
                        settings.currency === currency ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <Text className="text-white">{currency}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Trading Settings */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-white">Trading</Text>

            <View className="space-y-4">
              {/* Default Slippage */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Default Slippage Tolerance</Text>
                  <Text className="text-sm text-gray-400">
                    Applied to all trades unless specified
                  </Text>
                </View>
                <View className="flex-row gap-2">
                  {[0.5, 1.0, 2.0].map((slippage) => (
                    <Pressable
                      key={slippage}
                      onPress={() => handleSettingChange('defaultSlippage', slippage)}
                      className={`rounded px-4 py-2 ${
                        settings.defaultSlippage === slippage ? 'bg-blue-600' : 'bg-gray-600'
                      }`}
                    >
                      <Text className="text-white">{slippage}%</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Auto Router */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Auto Router</Text>
                  <Text className="text-sm text-gray-400">Automatically find best swap routes</Text>
                </View>
                <Switch
                  value={settings.autoRouter}
                  onValueChange={(value) => handleSettingChange('autoRouter', value)}
                />
              </View>

              {/* Expert Mode */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Expert Mode</Text>
                  <Text className="text-sm text-gray-400">Disable transaction confirmations</Text>
                </View>
                <Switch
                  value={settings.expertMode}
                  onValueChange={(value) => handleSettingChange('expertMode', value)}
                />
              </View>
            </View>
          </View>

          {/* Notification Settings */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-white">Notifications</Text>

            <View className="space-y-4">
              {/* Enable Notifications */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Enable Notifications</Text>
                  <Text className="text-sm text-gray-400">Show transaction notifications</Text>
                </View>
                <Switch
                  value={settings.notifications.enabled}
                  onValueChange={(value) =>
                    handleSettingChange('notifications', {
                      ...settings.notifications,
                      enabled: value,
                    })
                  }
                />
              </View>

              {/* Sound */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Sound</Text>
                  <Text className="text-sm text-gray-400">Play sound for notifications</Text>
                </View>
                <Switch
                  value={settings.notifications.sound}
                  onValueChange={(value) =>
                    handleSettingChange('notifications', {
                      ...settings.notifications,
                      sound: value,
                    })
                  }
                  disabled={!settings.notifications.enabled}
                />
              </View>

              {/* Browser Notifications */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Browser Notifications</Text>
                  <Text className="text-sm text-gray-400">Show desktop notifications</Text>
                </View>
                <Switch
                  value={settings.notifications.browser}
                  onValueChange={(value) =>
                    handleSettingChange('notifications', {
                      ...settings.notifications,
                      browser: value,
                    })
                  }
                  disabled={!settings.notifications.enabled}
                />
              </View>
            </View>
          </View>

          {/* Privacy Settings */}
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold text-white">Privacy</Text>

            <View className="space-y-4">
              {/* Save Transaction History */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Save Transaction History</Text>
                  <Text className="text-sm text-gray-400">Store transactions locally</Text>
                </View>
                <Switch
                  value={settings.saveHistory}
                  onValueChange={(value) => handleSettingChange('saveHistory', value)}
                />
              </View>

              {/* Analytics */}
              <View className="flex-row items-center justify-between rounded-lg bg-gray-700 p-4">
                <View className="flex-1">
                  <Text className="font-medium text-white">Analytics</Text>
                  <Text className="text-sm text-gray-400">Help improve the app</Text>
                </View>
                <Switch
                  value={settings.analytics}
                  onValueChange={(value) => handleSettingChange('analytics', value)}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="flex-row items-center justify-between border-t border-gray-700 p-6">
          <Pressable
            onPress={handleReset}
            className="rounded-lg bg-gray-700 px-6 py-3 hover:bg-gray-600"
          >
            <Text className="font-semibold text-white">Reset to Defaults</Text>
          </Pressable>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="rounded-lg bg-gray-700 px-6 py-3 hover:bg-gray-600"
            >
              <Text className="font-semibold text-white">Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={!hasChanges}
              className={`rounded-lg px-6 py-3 ${
                hasChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600'
              }`}
            >
              <Text className="font-semibold text-white">Save Changes</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SettingsModal;
