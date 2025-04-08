import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { getSecureData } from "../../services/secureStorage";
import { useRouter, useNavigation } from "expo-router";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { saveSecureData } from "../../services/secureStorage"; // Secure Storage utility
import { useLayoutEffect } from "react";
import { BlurView } from "expo-blur";
import { capitalize } from "@/services/utils";
import { LinearGradient } from 'expo-linear-gradient'; // Add this import




const { width: screenWidth } = Dimensions.get("window");



const WelcomeCarousel = () => {
  const slides = [
    {
      id: "1",
      text: (
        <Text>
          On Sevya, you have easy  <Text style={styles.greenText}>Shift Management, Easy Check-In</Text> and{" "}
          <Text style={styles.greenText}>Shift Schedule Overview</Text>, to check daily your shifts and manage it efficiently.
        </Text>
      ),
      image: require("../../assets/images/Welcome1.png"),
    },
    {
      id: "2",
      text: (
        <Text>
          You can count on our <Text style={styles.greenText}>Multilingual Support</Text> to translate notes instantly and{" "}
          <Text style={styles.greenText}>Voice-to-Text Documentation</Text>, to convert updates into text seamlessly.
        </Text>
      ),
      image: require("../../assets/images/Welcome2.png"),
    },
    {
      id: "3",
      text: (
        <Text>
          Get targeted recommendations for each patient using{" "}
          <Text style={styles.greenText}>AI Care Plan</Text> to create a simple and effective routine with just one click.
        </Text>
      ),
      image: require("../../assets/images/Welcome3.png"),
    },
  ];
  
  const [userdata, setUserData] = useState<{ name: string } | null>(null);
  const router = useRouter();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
    const fetchStoredUserData = async () => {
      try {
        const storedUser = await getSecureData("user");
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log(userData.name, "sssss");
          setUserData(userData);
        }
      } catch (error) {
        console.error("Error fetching stored user data:", error);
      }
    };
    fetchStoredUserData();
  }, []);

  useEffect(() => {
    const setFirstLogin = async () => {
      await saveSecureData("first_time_login", "true");
    };
    setFirstLogin();
  }, []);

  const onboardingComplete = async () =>{
    await saveSecureData("first_time_login", "true");
    router.replace("/(tabs)/home");

  }
  const animationStyle = useCallback((value: number) => {
    "worklet";

    const scale = interpolate(value, [-1, 0, 1], [0.1, 1, 0.1]); // Scale effect
    const opacity = interpolate(value, [-0.6, 0, 0.3], [0.1, 1, 0.1]); // Fade effect

    return {
      transform: [{ scale }],
      opacity,
    };
  }, []);

  return (
   
    <LinearGradient
    colors={[ '#BDD9B0','#0D1F3A', '#050F1C']} // Adjust colors to match your design
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={styles.containerMain}
  >
      <View style={styles.carouselMainImage}>
        <Image
          source={require("../../assets/carouselMain.png")}
          style={styles.MainImage}
        />

      </View>

      <View style={styles.conatainerBody}>
    
  
        <View style={styles.carouselMainText}>
          <Text style={styles.textMain}>
            Welcome, {userdata ? capitalize(userdata.name) : "User"}
          </Text>
        
        </View>
      

        <View style={styles.CarouselContainer}>
          <Carousel
            style={{ width: screenWidth, height: 500 }}
            width={screenWidth * 1}
            height={500}
            data={slides}
            customAnimation={animationStyle}
            renderItem={({ index }) => (
              <SlideComponent
                slide={slides[index]}
                index={index}
                router={router}
              />
            )}
            loop // Enables infinite looping
            autoPlay // Enables automatic sliding
            autoPlayInterval={4000} // Changes slide every 4 seconds
            mode="horizontal-stack"
            modeConfig={{
              snapDirection: "left",
              stackInterval: 20,
            }}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={onboardingComplete}
          >
            <Text style={styles.buttonText}>Let's Go</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => router.replace("/(tabs)/home")}>
                  <Text style={styles.skip}>Skip</Text>
                </TouchableOpacity> */}
        </View>
      </View>
    </LinearGradient>

  );
};

const SlideComponent = ({
  slide,
  index,
  router,
}: {
  slide: any;
  index: number;
  router: any;
}) => {
  return (
    <View style={styles.slide}>
      <ImageBackground
        source={require("../../assets/images/LogoBack.png")}
        style={styles.backgroundImage}
      >
        <BlurView intensity={25} style={styles.blurContainer}>
          <View style={styles.content}>
            <Text style={styles.text}>{slide.text}</Text>
            <View style={styles.imageContainer}>
                <Image source={slide.image} style={styles.image} />
            </View>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );
};

export default WelcomeCarousel;

const styles = StyleSheet.create({
  greenText:{
    color: '#BDD9B0',
    fontStyle:'italic',

  },
  blurContainer: {
    width: "auto",
    height: "auto",
    backgroundColor: "rgba(255, 255, 255, 0.1)",

    borderWidth: 3,
    borderColor: "rgba(255, 255, 255, 0.79)",
    borderRadius: 40,
    padding: 20,
    margin: 20,

    alignItems: "center",
    overflow: "hidden",
  },
  containerMain: {
    flex: 1,
    width: "100%",
    backgroundColor: "#18385B",
  },
  MainImage: {
    width: "100%", // This makes sure the image covers the full width of the container
    height: 260, // This ensures the image covers the full height of the container
    resizeMode: "cover", // Ensures the image covers the entire space without distortion
  },
  carouselMainImage: {
    overflow: "hidden", // To prevent overflow issues
    width: "100%",
  },
  conatainerBody: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    flex: 1,
  },
  carouselMainText: {
    marginTop: -10,
    marginBottom:30,
    padding: 0,
    height: 100,
    fontFamily: "Lato-Regular",
    fontSize: 16,
    fontWeight: "400",
  },
  textMain: {
    color: "white",
    fontFamily: "Radley",
    fontSize: 38,
    fontWeight: "400",
    paddingTop: 0,
    textAlign: "center",
  },
  CarouselContainer: {
    width: "100%",
marginTop:"-10%",
    alignItems: "center",
    
  },
  slide: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    width: "100%",
    height: "auto",
    marginTop: 0,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    display: "flex",
    width: "100%",
    height: 350,
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: "500",
    textAlign: "center",
    color: "white",
    lineHeight: 28,
    marginBottom: 10,
  },
  imageContainer:{
    width: '100%',
    height: 250,


  },
  image: {
    width: '100%',
    height: '100%',
    aspectRatio:'2/3',
    resizeMode: "contain",
  },
  skip: {
    color: "white",
    marginTop: 10,
    fontSize: 16,
    textAlign: "right",
  },

  buttonContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  button: {
    width: 150,
    paddingHorizontal: 15,
    paddingVertical: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
    color: "white",
  },
  buttonText: {
    fontSize: 20,
    color: "white",
    fontWeight: "300",
  },
});
