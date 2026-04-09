import { Drawer } from "expo-router/drawer";
import { useContext } from "react";
import { AppContext } from "../../src/context/AppContext";
import CustomDrawerContent from "../../src/components/CustomDrawerContent";

export default function Layout() {
  const { cart, darkMode } = useContext(AppContext);

  const totalItems = cart.reduce((sum: any, item: any) => sum + (item.qty || 0), 0);

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false, 
        drawerStyle: {
          backgroundColor: darkMode ? '#1C1C1E' : '#FFFFFF',
          width: 250,
        },
        sceneStyle: {
          backgroundColor: darkMode ? '#121212' : '#F2F2F7',
        },
        drawerItemStyle: {
          marginHorizontal: 10,
          marginVertical: 2,
        },
        drawerLabelStyle: {
          fontSize: 16,
          fontWeight: '500',
        },
        drawerActiveBackgroundColor: darkMode ? '#2C2C2E' : '#E5E5EA',
        drawerActiveTintColor: darkMode ? '#FFFFFF' : '#007AFF',
        drawerInactiveTintColor: darkMode ? '#FFFFFF' : '#000000',
      }}
    >
      <Drawer.Screen name="index" options={{ title: "Home" }} />
      <Drawer.Screen name="cart" options={{ title: `Cart (${totalItems})` }} />
      <Drawer.Screen name="wishlist" options={{ title: "Wishlist" }} />
      <Drawer.Screen name="history" options={{ title: "History" }} />
      <Drawer.Screen name="profile" options={{ title: "Profile" }} />
    </Drawer>
  );
}