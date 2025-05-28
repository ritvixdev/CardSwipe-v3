import React from "react";
import { Tabs } from "expo-router";
import { useThemeColors } from '@/hooks/useThemeColors';
import { BookOpen, Bookmark, BarChart, Settings } from "lucide-react-native";

export default function TabLayout() {
  const themeColors = useThemeColors();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactive,
        tabBarStyle: {
          backgroundColor: themeColors.background,
          borderTopColor: themeColors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Learn",
          headerShown: false,
          tabBarIcon: ({ color }) => <BookOpen size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          title: "Bookmarks",
          headerShown: false,
          tabBarIcon: ({ color }) => <Bookmark size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          headerShown: false,
          tabBarIcon: ({ color }) => <BarChart size={22} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          headerShown: false,
          tabBarIcon: ({ color }) => <Settings size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}