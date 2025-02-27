import { View, Text , Button} from 'react-native'
import React, { useEffect } from "react";

import { useRouter } from 'expo-router'
import { saveSecureData } from "../../services/secureStorage"; // Import Secure Storage utility


const InfoScreen = () => {
    const router = useRouter();

    useEffect(() => {
        const setFirstLogin = async () => {
            await saveSecureData("first_time_login", 'true');
        };
        setFirstLogin();
    }, []);


  return (
    <View>
      <Text>Welcome to Sevya</Text>
      <Button title="Let's Go" onPress={() => router.replace("/(tabs)/home")} />

    </View>
  )
}

export default InfoScreen