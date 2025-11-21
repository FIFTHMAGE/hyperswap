/**
 * Settings Modal Component
 * User preferences and configuration
 */

import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';

import { settingsManager, UserSettings } from '../../features/settings/SettingsManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [settings, setSettings] = useState<UserSettings>(settingsManager.getSettings());
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const unsubscribe = settingsManager.subscribe((newSettings) => {
      setSettings(newSettings);
      setHasChanges(false);
    });

    return unsubscribe;
  }, []);

  const handleUpdate = (key: keyof UserSettings, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    settingsManager.updateSettings(settings);
    setHasChanges(false);
  };

  const handleReset = () => {
    settingsManager.resetSettings();
    setHasChanges(false);
  };

  if (!isOpen) return null;

  return (
    <View className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <View className="w-full max-w-2xl rounded-lg bg-gray-800 p-6 shadow-xl">
        {/* Header */}
        <View className="mb-6 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-white">Settings</Text>
          <Pressable onPress={onClose} className="rounded-lg p-2 hover:bg-gray-700">
            <Text className="text-2xl text-gray-400">×</Text>
          </Pressable>
        </View>

        {/* Content */}
        <ScrollView className="max-h-[70vh]">
          {/* Theme */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Theme</Text>
            <View className="flex-row gap-2">
              {(['light', 'dark', 'system'] as const).map((theme) => (
                <Pressable
                  key={theme}
                  onPress={() => handleUpdate('theme', theme)}
                  className={`flex-1 rounded-lg p-3 ${
                    settings.theme === theme ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Text className="text-center capitalize text-white">{theme}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Slippage Tolerance */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Slippage Tolerance</Text>
            <View className="flex-row items-center gap-2">
              <View className="flex-1 rounded-lg bg-gray-700 p-3">
                <Text className="text-white">{settings.slippageTolerance}%</Text>
              </View>
              <View className="flex-row gap-2">
                {[0.1, 0.5, 1.0].map((value) => (
                  <Pressable
                    key={value}
                    onPress={() => handleUpdate('slippageTolerance', value)}
                    className={`rounded-lg px-4 py-2 ${
                      settings.slippageTolerance === value ? 'bg-blue-600' : 'bg-gray-700'
                    }`}
                  >
                    <Text className="text-white">{value}%</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>

          {/* Transaction Deadline */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">
              Transaction Deadline (minutes)
            </Text>
            <View className="flex-row gap-2">
              {[10, 20, 30].map((minutes) => (
                <Pressable
                  key={minutes}
                  onPress={() => handleUpdate('transactionDeadline', minutes)}
                  className={`flex-1 rounded-lg p-3 ${
                    settings.transactionDeadline === minutes ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Text className="text-center text-white">{minutes}m</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Currency */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Display Currency</Text>
            <View className="flex-row gap-2">
              {['USD', 'EUR', 'GBP', 'JPY'].map((currency) => (
                <Pressable
                  key={currency}
                  onPress={() => handleUpdate('currency', currency)}
                  className={`flex-1 rounded-lg p-3 ${
                    settings.currency === currency ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Text className="text-center text-white">{currency}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Gas Preference */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Gas Preference</Text>
            <View className="flex-row gap-2">
              {(['standard', 'fast', 'instant'] as const).map((speed) => (
                <Pressable
                  key={speed}
                  onPress={() => handleUpdate('gasPreference', speed)}
                  className={`flex-1 rounded-lg p-3 ${
                    settings.gasPreference === speed ? 'bg-blue-600' : 'bg-gray-700'
                  }`}
                >
                  <Text className="text-center capitalize text-white">{speed}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notifications */}
          <View className="mb-6">
            <Text className="mb-2 text-sm font-semibold text-gray-300">Notifications</Text>
            <View className="space-y-2">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <Pressable
                  key={key}
                  onPress={() =>
                    handleUpdate('notifications', {
                      ...settings.notifications,
                      [key]: !value,
                    })
                  }
                  className="flex-row items-center justify-between rounded-lg bg-gray-700 p-3"
                >
                  <Text className="capitalize text-white">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Text>
                  <View
                    className={`h-6 w-11 rounded-full ${value ? 'bg-blue-600' : 'bg-gray-600'}`}
                  >
                    <View
                      className={`h-6 w-6 rounded-full bg-white transition-transform ${
                        value ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Developer Mode */}
          <View className="mb-6">
            <Pressable
              onPress={() => handleUpdate('developerMode', !settings.developerMode)}
              className="flex-row items-center justify-between rounded-lg bg-gray-700 p-3"
            >
              <View>
                <Text className="font-semibold text-white">Developer Mode</Text>
                <Text className="text-sm text-gray-400">Show technical information</Text>
              </View>
              <View
                className={`h-6 w-11 rounded-full ${
                  settings.developerMode ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <View
                  className={`h-6 w-6 rounded-full bg-white transition-transform ${
                    settings.developerMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </View>
            </Pressable>
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="mt-6 flex-row gap-3">
          <Pressable
            onPress={handleReset}
            className="flex-1 rounded-lg bg-gray-700 py-3 hover:bg-gray-600"
          >
            <Text className="text-center font-semibold text-white">Reset to Defaults</Text>
          </Pressable>
          <Pressable
            onPress={handleSave}
            disabled={!hasChanges}
            className={`flex-1 rounded-lg py-3 ${
              hasChanges ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600'
            }`}
          >
            <Text className="text-center font-semibold text-white">
              {hasChanges ? 'Save Changes' : 'No Changes'}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default SettingsModal;
