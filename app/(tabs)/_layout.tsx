import React from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import Header from '@/components/Header';
import BottomTabsNavigation from '@/navigation/BottomTabsNavigation';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <>
      <Header />
      <BottomTabsNavigation />
    </>
  );
}
