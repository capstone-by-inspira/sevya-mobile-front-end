import { View, Text , Image, StyleSheet, ImageBackground} from 'react-native'
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
      <ImageBackground
            source={require('../../assets/images/welcomeBack.png')} 
            style={stylesMain.Background}
            >
        <View style={stylesMain.Background1}> 

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
      </ImageBackground>
    </View>
  )
}

const stylesImage = StyleSheet.create({
    image: {
      width: "100%", 
      //maxHeight: 200,
      resizeMode: "cover", 
      padding: 0,
      margin: 0,
    },
  });
  
  const stylesMain = StyleSheet.create({
    mainContainer:{

    },
    Background: {
      fontFamily: 'Lato-Regular',
      fontSize: 16,
      fontWeight: '400',    
      alignItems: 'center',
      marginBlockStart: -43, 
      //position: 'absolute',
      //top:503,
      width: '100%',
      height:'100%',
      resizeMode:"cover",
    },
    Background1: {
      marginBottom: 20, 
      alignItems: 'center',
    }
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
      paddingBottom: 40,
      paddingTop: 110,
    },
    ContainerText2: {
      fontFamily: 'Radley',
      fontSize: 22,
      fontWeight: '400',
      textAlign: 'center',
      color: '#fff',
      paddingBottom: 30,
      paddingTop: 25,
      fontStyle: 'normal',
      lineHeight: 22,
      },
    ContainerImage: {
        marginBottom: 0,
        padding: 0,
    },
  });

export default WelcomeFourth;