/**
 * Tabs - Tab navigation component
 * @module components/ui
 */

import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';

export interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  onTabChange?: (tabId: string) => void;
}

export function Tabs({ tabs, defaultTab, className = '', onTabChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onTabChange?.(tabId);
  };

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <View className={className}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-gray-200"
      >
        <View className="flex-row">
          {tabs.map((tab) => (
            <Pressable
              key={tab.id}
              onPress={() => handleTabChange(tab.id)}
              className={`
                px-4
                py-3
                border-b-2
                ${activeTab === tab.id ? 'border-indigo-600' : 'border-transparent'}
              `}
            >
              <Text
                className={`
                  font-medium
                  ${activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500'}
                `}
              >
                {tab.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="mt-4">{activeTabContent}</View>
    </View>
  );
}
