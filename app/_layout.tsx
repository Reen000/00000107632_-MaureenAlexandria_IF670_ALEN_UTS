import 'react-native-gesture-handler';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { useContext } from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppProvider, AppContext } from "../src/context/AppContext";

function InnerLayout() {
  const { darkMode } = useContext(AppContext);

  return (
    <ThemeProvider value={darkMode ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>

        <Stack.Screen name="drawer" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <InnerLayout />
      </AppProvider>
    </SafeAreaProvider>
  );
}