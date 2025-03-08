
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";



export default function TabLayout() {
  return (
    <Tabs >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
     
         <Tabs.Screen
        name="shifts"
        options={{
          title: "shifts",
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="timer-outline" size={24} color={color} />,
        }}
      />
         <Tabs.Screen
        name="patients"
        options={{
          title: "patients",
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="people-outline" size={24} color={color} />,
        }}
      />
       <Tabs.Screen
        name="settings"
        options={{
          title: "settings",
          headerShown:false,
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
