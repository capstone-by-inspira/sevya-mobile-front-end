import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ImageBackground
} from "react-native";
import { AppContext } from "./AppContext";
import * as ImagePicker from "expo-image-picker";
import { updateDocument } from "../services/api"; 
import { Icon } from "react-native-paper";
import axios from "axios";
import { globalStyles } from "@/styles/globalStyles";
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
      if (caregivers && caregivers.image) {
        setProfileImage(caregivers.image);
      }
    };

    fetchProfileImage();
  }, [caregivers]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setLoading(false);
      setProfileImage(result.assets[0].uri);
      let imageUrl = null;
      if (profileImage) {
        setLoading(true);
        try {
          imageUrl = await uploadImage(result.assets[0].uri);
          if (imageUrl) {
            await updateUserData(imageUrl);
            setLoading(false);
          } else {
            console.error("Image upload failed, no URL returned.");
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      }
    }
  };

  const updateUserData = async (imageUrl: string) => {
    if (caregivers && token) {
      try {
        await updateDocument(
          "caregivers",
          caregivers.uid,
          { image: imageUrl },
          token
        );
        const updatedUser = { ...caregivers, image: imageUrl };
        fetchData();
        // await getSecureData("user", JSON.stringify(updatedUser));
        // fetchData();
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const uploadImage = async (uri: string) => {
    const mainLink = "https://sevya-admin.site:8808/api/auth/upload";

    try {
      const formData = new FormData();
      formData.append("image", {
        uri,
        name: `image_${Date.now()}.jpg`,
        type: "image/jpeg",
      } as any);
      const uploadResponse = await axios.post(mainLink, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (uploadResponse.status !== 200) {
        throw new Error("Image upload failed.");
      }

      return uploadResponse.data.imageUrl || null;
    } catch (error) {
      console.error("Image upload error:", error);
      return null;
    }
  };

  if (!caregivers) {
    return (
      <View style={globalStyles.profileScreenContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={globalStyles.profileScreenContainer}>
      {loading && (
        <View style={globalStyles.profileScreenLoadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <ImageBackground
        source={require("../assets/images/wrapper1.png")}
        style={globalStyles.profileScreenBackgroundImage}
      >
      <View style={globalStyles.profileScreenImageWrapper}>
        <View style={globalStyles.profileScreenImageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/images/placeholder-image.jpg')} // Replace with your placeholder
            style={globalStyles.profileScreenImage}
          />
          <Text style={globalStyles.profileScreenCaregiverName}>{caregivers.firstName} {caregivers.lastName}</Text> 
          <Text style={globalStyles.profileScreenCaregiver}>Caregiver</Text>
          <Text style={globalStyles.profileScreenChangeImageText} onPress={pickImage}>
            Change Profile Image  
            <Icon source="pencil" size={18} color="#CEE8F2" />
          </Text>
        </View>
      </View>
      </ImageBackground>

      <View style={globalStyles.profileScreenDetailsContainer}>
        <Text style={globalStyles.profileScreenDetailText2}>Personal Info</Text>
        <Text style={globalStyles.profileScreenDetailText}>
          <Image source={require('../assets/images/Mail.png')}
          style={globalStyles.profileScreenIcons}/>
          <Text>    Email:</Text> {caregivers.email}
        </Text>
        <Text style={globalStyles.profileScreenDetailText3}>
          <Image source={require('../assets/images/Phone.png')}
          style={globalStyles.profileScreenIcons}/>
          <Text>    Phone number:</Text> {caregivers.phoneNumber}
        </Text>
        <Text style={globalStyles.profileScreenDetailText1}>Work Info</Text>
        <Text style={globalStyles.profileScreenDetailText}>
          <Image source={require('../assets/images/User.png')}
          style={globalStyles.profileScreenIcons}/>
          <Text>    Total Patients Assigned:</Text> {patients.length}
        </Text>
        <Text style={globalStyles.profileScreenDetailText}>
          <Image source={require('../assets/images/Clock.png')}
          style={globalStyles.profileScreenIcons}/>
          <Text>    Total Shifts:</Text> {shifts?.length}
        </Text>
      </View>
    </View>
  );
};
export default ProfileScreen;
