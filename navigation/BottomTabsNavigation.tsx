import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Patients from '@/app/screens/Patients';
import Shifts from '@/app/screens/Shifts';
import CheckIns from '@/app/screens/CheckIns';
import Home from '@/app/screens/Home';

const Tab = createMaterialBottomTabNavigator();
const BottomTabsNavigation: React.FC = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: '#56021F',
                tabBarIndicatorStyle: { backgroundColor: '#56021F' },
                tabBarStyle: { backgroundColor: '#FFFFFF' },
            }}>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Check-ins" component={CheckIns} />
            <Tab.Screen name="Shifts" component={Shifts} />
            <Tab.Screen name="Patients" component={Patients} />
        </Tab.Navigator>
    );
};
export default BottomTabsNavigation;
