import React from "react";
import { Tabs } from "expo-router";
import { useThemeColors } from '@/hooks/useThemeColors';
import { BookOpen, Compass, BarChart, User } from "lucide-react-native";

export default function TabLayout() {
  const themeColors = useThemeColors();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.primary,
        tabBarInactiveTintColor: themeColors.inactive,
        tabBarStyle: {
          backgroundColor: themeColors.card,
          borderTopWidth: 0,
          height: 70,
          paddingBottom: 12,
          paddingTop: 5,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 12,
          opacity: 1.0,
        },
        tabBarHideOnKeyboard: false,
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
        name="explore"
        options={{
          title: "Explore",
          headerShown: false,
          tabBarIcon: ({ color }) => <Compass size={22} color={color} />,
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
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color }) => <User size={22} color={color} />,
        }}
      />

      {/* Hidden screens that should still have tabs */}
      <Tabs.Screen
        name="lesson/[id]"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/bookmarks"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/completed"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/javascript-notes"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/interview-prep"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/practice-quiz"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/interview-quiz"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/learning-roadmap"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/design-patterns"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/coding-questions"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/design-patterns/[id]"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/coding-questions/[id]"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/javascript-notes/[id]"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="explore/interview-prep/[id]"
        options={{
          href: null, // Hide from tab bar
          headerShown: false,
        }}
      />
    </Tabs>
  );
}