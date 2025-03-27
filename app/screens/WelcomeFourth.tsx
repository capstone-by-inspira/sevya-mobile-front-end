import { View, Text , Image, StyleSheet } from 'react-native'
import { useRouter, useNavigation } from 'expo-router';
import Button from "@/components/ui/Button";
import { useLayoutEffect } from 'react';

const WelcomeFourth = () => {
  const router = useRouter();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleHomeNavigation = () => {
    router.replace('/(tabs)/home'); 
  };

  return (
    <View>
      <Image
        source={require("../../assets/images/Image2.png")}
        style={stylesImage.image}
      />
      <View style={stylesMain.Background}>     
        <Text style={stylesContainerText.ContainerText}>Everything so you can focus on your best talent: taking care of those in need.</Text>
        <Image
            style={stylesContainerText.ContainerImage}
            source={require("../../assets/images/Logo (1).png")}
        />
        <Text style={stylesContainerText.ContainerText2}>Enjoy Sevya!</Text>
        <Button
          handleButtonClick={handleHomeNavigation} 
          buttonText="Let`s go!"
          buttonColor='#10B981'
          style={{ width: 227 }} 
        />  
      </View>
    </View>
  )
}

const stylesImage = StyleSheet.create({
    image: {
      width: "100%", 
      maxHeight: 200,
      resizeMode: "cover", 
      padding: 0,
      margin: 0,
    },
  });
  
  const stylesMain = StyleSheet.create({
    Background: {
      backgroundColor: '#18385B',  
      fontFamily: 'Lato-Regular',
      fontSize: 16,
      fontWeight: '400', 
      display: 'flex',
      flexDirection: "column",
      gap: 20,
      alignItems: 'center',
      paddingBottom: 250,
      height:'100%',
    },
  });
  
  const stylesContainerText = StyleSheet.create({
    ContainerText: {
      fontFamily: 'Lato',
      fontSize: 16,
      fontWeight: '500', 
      textAlign: 'center',
      color: 'white',
      lineHeight: 28,
      padding: 46,
      paddingBottom: 10,
    },
    ContainerText2: {
      fontFamily: 'Radley',
      fontSize: 22,
      fontWeight: '400',
      textAlign: 'center',
      color: '#fff',
      paddingBottom: 10,
      fontStyle: 'normal',
      lineHeight: 22,
      },
    ContainerImage: {
        marginBottom: 0,
        padding: 0,
    },
  });

export default WelcomeFourth;