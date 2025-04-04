import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ImageBackground } from 'react-native';
import { AppContext } from './AppContext'; // Adjust path as needed
import { getSecureData } from '../services/secureStorage'; // Import secure storage
import * as ImagePicker from 'expo-image-picker';
import { updateDocument } from '../services/api'; // Import your uploadImage and updateDocument functions
import { auth } from '@/config/firebase';
import { Icon } from 'react-native-paper';
import { formatDateOnly, formatLocalDate } from '@/services/utils';
const ProfileScreen = () => {

  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData, token } = context;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (caregivers && caregivers.profileImage) {
        setProfileImage(caregivers.profileImage);
      }
    };

    fetchProfileImage();
  }, [caregivers]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(false);
      //   try {
      //     const uploadResult = await uploadImage(result.assets[0].uri, `profileImages/${userData.uid}`, token);

      //     if (uploadResult.success && uploadResult.url) {
      //       setProfileImage(uploadResult.url);
      //       await updateUserData(uploadResult.url);
      //     } else {
      //       console.error("Image upload failed:", uploadResult.error);
      //     }
      //   } catch (error) {
      //     console.error("Error picking and uploading image:", error);
      //   } finally {
      //     setLoading(false);
      //   }
    }
  };

  const updateUserData = async (imageUrl: string) => {
    if (caregivers && token) {
      try {
        await updateDocument('caregivers', caregivers.uid, { profileImage: imageUrl }, token);
        const updatedUser = { ...caregivers, profileImage: imageUrl };
        fetchData()
        // await getSecureData("user", JSON.stringify(updatedUser));
        // fetchData();
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  if (!caregivers) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* <View> */}

      
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <ImageBackground
        source={require("../assets/images/wrapper1.png")}
        style={styles.backgroundImage}
      >
      <View style={styles.imageContainer1}>
        <View style={styles.imageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/images/placeholder-image.jpg')} // Replace with your placeholder
            style={styles.profileImage}
          />
          <Text style={styles.caregiverName}>{caregivers.firstName} {caregivers.lastName}</Text> 
          <Text style={styles.caregiver}>Caregiver</Text>
          <Text style={styles.changeImageText} onPress={pickImage}>
            Change Profile Image  
            <Icon source="pencil" size={18} color="#CEE8F2" />
          </Text>
        </View>
      </View>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText2}>Personal Info</Text>
        <Text style={styles.detailText}>
          <Image source={require('../assets/images/Mail.png')}
          style={styles.icons}/>
          <Text>    Email:</Text> {caregivers.email}
        </Text>
        <Text style={styles.detailText3}>
          <Image source={require('../assets/images/Phone.png')}
          style={styles.icons}/>
          <Text>    Phone number:</Text> {caregivers.phoneNumber}
        </Text>
        <Text style={styles.detailText1}>Work Info</Text>
        <Text style={styles.detailText}>
          <Image source={require('../assets/images/User.png')}
          style={styles.icons}/>
          <Text>    Total Patients Assigned:</Text> {patients.length}
        </Text>
        <Text style={styles.detailText}>
          <Image source={require('../assets/images/Clock.png')}
          style={styles.icons}/>
          <Text>    Total Shifts:</Text> {shifts?.length}
        </Text>
        

      {/*<Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Availability:</Text> {formatLocalDate(caregivers.availability)}
        </Text>*/}

        {/* Add other user details here */}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer1: {
    paddingLeft:110,
  },
  imageContainer: {
//    alignSelf: 'center' ,
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 200,
    borderWidth: 6,
    borderColor: "#CEE8F2", 
    alignItems: "center",
    backgroundColor: "#FFF",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  caregiverName:{
    color:'white',
    fontSize:16,
    paddingTop:6,
  },
  caregiver:{
    color:'white',
    fontSize:12,
    paddingBottom:6,
    paddingTop:6,
  },
  changeImageText: {
    color: '#CEE8F2',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#CEE8F2',
    padding: 10,
    borderRadius: 24,
  },
  detailsContainer: {
    paddingLeft: 20,
    paddingTop:10,
    width: 400,
    backgroundColor: '#F8FBFF',
  },
  detailText: {
    display:'flex',
    columnGap:35,
    fontSize: 16,
    marginBottom: 15,
    color: '#424242',

  },
  detailText1: {
    fontSize: 16,
    borderTopWidth: 1,       
    borderTopColor: '#E2E2E2', 
    paddingTop:10,
    marginBottom: 20,
    color: '#424242',
    fontStyle:'italic',
    marginRight:20,
  },
  detailText2: {
    fontSize: 16,
    paddingTop:10,
    marginBottom: 20,
    color: '#424242',
    fontStyle:'italic',
  },
  detailText3: {
    fontSize: 16,
    marginBottom: 20,
    color: '#424242',
  },
  backgroundImage: {
    width: "110%",
    height: 308,
    padding:0,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  icons:{
    height: 16,
    paddingTop:1,
  },
});

export default ProfileScreen;