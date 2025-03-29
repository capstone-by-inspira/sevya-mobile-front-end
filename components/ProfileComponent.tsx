import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AppContext } from './AppContext'; // Adjust path as needed
import { getSecureData } from '../services/secureStorage'; // Import secure storage
import * as ImagePicker from 'expo-image-picker';
import { updateDocument } from '../services/api'; // Import your uploadImage and updateDocument functions
import { auth } from '@/config/firebase';
import { Icon } from 'react-native-paper';

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

      <View style={styles.imageContainer}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/images/placeholder-image.jpg')} // Replace with your placeholder
          style={styles.profileImage}
        />
        <Text style={styles.changeImageText} onPress={pickImage}>
          Change Profile Image  
          <Icon source="pencil" size={18} color="#1E3A8A" />
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Name:</Text> {caregivers.firstName} {caregivers.lastName}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Email:</Text> {caregivers.email}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Phone:</Text> {caregivers.phoneNumber}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Total Shifts:</Text> {shifts?.length}
        </Text>
        <Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Total Patients Assigned:</Text> {patients.length}
        </Text>
        {/* Add other user details here */}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 80,
    paddingHorizontal: 0,
    marginHorizontal: 0,
    backgroundColor: 'transparent',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
    borderRadius: 200,
    borderWidth: 6,
    borderColor: "#10B981", 
    backgroundColor: "#FFF",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
  },
  changeImageText: {
    color: '#25578E',
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#25578E',
    padding: 10,
    borderRadius: 24,
  },
  detailsContainer: {
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 20,
    width: 400,
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",

  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;