import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import React, { useRef, useState } from 'react';

const Welcome = () => {
  const router = useRouter();
  const carouselRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleSkip = () => {
    router.replace('/Welcome/Welcome4');
  };

  const carouselItems = [
    {
      image: require("../../assets/images/Welcome1.png"),
      text: "On Sevya, you have easy Shift Management, Easy Check-In and Shift Schedule Overview, to check daily your shifts and manage it efficiently.",
    },
    {
      image: require("../../assets/images/Welcome2.png"),
      text: "You can count on our Multilingual Support to translate notes instantly and Voice-to-Text Documentation Recording, to convert updates into text seamlessly.",
    },
    {
      image: require("../../assets/images/Welcome3.png"),
      text: "Get targeted recommendations for each patient using AI Care Plan: create a simple and effective routine with just one click.",
    },
  ];

  console.log("Carousel Items: ", carouselItems);


  const renderItem = ({ item }) => (
    <View style={stylesContainer.container}>
      <Text style={stylesContainer.text}>{item.text}</Text>
      <Image source={item.image} style={stylesContainer.image} />
    </View>
  );

  return (
    <View style={stylesMain.container}>
      <Image source={require("../../assets/images/Image1.png")} style={stylesImage.image} />
      
      <View style={stylesMain.background}>
        <Text style={stylesH1.text}>Welcome, Adrian!</Text>
        
        <ImageBackground source={require('../../assets/images/LogoBack.png')} style={stylesBack.backgroundImage}>
          <Carousel
            ref={carouselRef}
            data={carouselItems}
            renderItem={renderItem}
            sliderWidth={Dimensions.get('window').width}
            itemWidth={Dimensions.get('window').width - 60}
            onSnapToItem={(index) => setActiveSlide(index)}
            loop={false}
          />
          
          <Pagination
            dotsLength={carouselItems.length}
            activeDotIndex={activeSlide}
            containerStyle={stylesPagination.container}
            dotStyle={stylesPagination.dot}
            inactiveDotStyle={stylesPagination.inactiveDot}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
          />
          
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipLink}>Skip</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    </View>
  );
};

const stylesImage = StyleSheet.create({
  image: {
    width: "100%",
    maxHeight: 200,
    resizeMode: "cover",
  },
});

const stylesMain = StyleSheet.create({
  container: {
    flex: 1, // Ensures proper layout
  },
  background: {
    backgroundColor: '#18385B',
  },
});

const stylesH1 = StyleSheet.create({
  text: {
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
  container: {
    flexDirection: 'column',
    gap: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.79)',
    borderRadius: 40,
    padding: 25,
    margin: 30,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Lato',
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    color: 'white',
    lineHeight: 28,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
});

const stylesBack = StyleSheet.create({
  backgroundImage: {
    height: 450,
  },
});

const stylesPagination = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
  },
  inactiveDot: {
    backgroundColor: 'white',
  },
});

const styles = StyleSheet.create({
  skipLink: {
    color: 'white',
    fontFamily: 'Lato',
    fontSize: 16,
    fontWeight: '400',
    textAlign: 'right',
    paddingRight: 25,
    paddingBottom: 100,
  },
});

export default Welcome;