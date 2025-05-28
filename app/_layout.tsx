import { RorkErrorBoundary } from "../.rorkai/rork-error-boundary";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '@/store/useThemeStore';
import { useThemeColors } from '@/hooks/useThemeColors';



export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });
  
  const themeMode = useThemeStore((state) => state.mode);
  const themeColors = useThemeColors();

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <>
        <StatusBar
          barStyle={themeMode === 'dark' ? "light-content" : "dark-content"}
          backgroundColor={themeColors.background}
        />
        <RootLayoutNav />
      </>
    </GestureHandlerRootView>
  );
}

function RootLayoutNav() {
  const themeColors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: themeColors.background,
        },
        headerTintColor: themeColors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: themeColors.background,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="lesson/[id]"
        options={{
          title: "Lesson Details",
          presentation: Platform.OS === 'ios' ? 'modal' : 'card',
          animation: 'slide_from_bottom',
        }}
      />
    </Stack>
  );
}