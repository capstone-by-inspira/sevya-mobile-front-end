import { View, Text , Image, StyleSheet, TouchableOpacity, ImageBackground} from 'react-native'
import { useRouter, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';

const WelcomeThird = () => {
  const router = useRouter();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSkip = () => {
    router.replace('/screens/WelcomeFourth'); 
  };

  return (
    <View>
      <Image
        source={require("../../assets/images/Image1.png")}
        style={stylesImage.image}
      />
      <View style={stylesMain.Background}>

          <Text style={stylesH1.TextH1}>Welcome, Adrian!</Text>
          <View>

            <ImageBackground
            source={require('../../assets/images/LogoBack.png')} // Replace with your image path
            style={stylesBack.backgroundImage}
            >
              <View style={stylesContainer.Container}>
                <Text style={stylesContainerText.ContainerText}>Get targeted recommendations for each patient using AI Care Plan: create a simple and effective routine with just one click.</Text>
                <Image
                style={stylesContainerText.ContainerImage}
                source={require("../../assets/images/Welcome3.png")}
                />
              </View>
      

              <TouchableOpacity onPress={handleSkip}>
                <Text style={styles.skipLink}>Skip</Text>
              </TouchableOpacity>

            </ImageBackground>
          </View>
      </View>
    </View>
  )
}

const stylesImage = StyleSheet.create({
    image: {
      width: "100%", 
      // maxHeight: 200,
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
      height:'100%',
    },
  });
  
  const stylesH1 = StyleSheet.create({
    TextH1: {
      color: 'white',  
      fontFamily: 'Radley',
      fontSize: 32,
      fontWeight: '400', 
      paddingTop: 40,
      paddingBottom: 30,
      textAlign: 'center',
    },
  });
  
  const stylesContainer = StyleSheet.create({
    Container: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      borderWidth: 3,
      borderColor: 'rgba(255, 255, 255, 0.79)', 
      borderRadius: 40, 
      paddingTop: 25,
      paddingBottom: 0,
      paddingLeft: 25,
      paddingRight: 25,
      margin: 30,
      marginBlockStart: 0,
      alignItems: 'center',
    },
  });
  
  const stylesContainerText = StyleSheet.create({
    ContainerText: {
      fontFamily: 'Lato',
      fontSize: 20,
      fontWeight: '500', 
      textAlign: 'center',
      color: 'white',
      lineHeight: 28,
    },
    ContainerImage: {
        marginBottom: -70,
        padding: 0,
    },
  });
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    skipLink: {
      color: 'white', 
      marginTop: 0, 
      fontFamily: 'Lato',
      fontSize: 16,
      fontWeight: '400', 
      textAlign: 'right',
      paddingRight: 25,
      paddingStart: 0,
      paddingBottom: 0,
    },
  });
  
  const stylesBack = StyleSheet.create({
    backgroundImage: {
      height: 450,
    },
  });  

export default WelcomeThird