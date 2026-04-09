import React, { useContext } from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { View, Text, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import { AppContext } from '../context/AppContext';

export default function CustomDrawerContent(props: any) {
  const { darkMode, toggleDark } = useContext(AppContext);

  const textColor = darkMode ? '#FFFFFF' : '#000000';
  const activeBg = darkMode ? '#2C2C2E' : '#E5E5EA';

  return (
    <DrawerContentScrollView {...props}>
      
      <DrawerItemList {...props} />

      <TouchableOpacity
        style={[
          styles.themeItem,
          { backgroundColor: darkMode ? '#1C1C1E' : '#FFFFFF' }
        ]}
        onPress={toggleDark}   
      >
        <Text style={[styles.label, { color: textColor }]}>
          Dark Theme
        </Text>

        <Switch
          trackColor={{ false: '#D1D1D6', true: '#34C759' }}
          thumbColor="#FFFFFF"
          value={darkMode}
          onValueChange={toggleDark}
        />
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  themeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 17,      
    paddingVertical: 2,
    marginHorizontal: 10,
    borderRadius: 8,        
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
  },
});