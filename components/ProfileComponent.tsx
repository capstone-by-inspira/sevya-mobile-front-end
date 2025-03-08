import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { AppContext } from './AuthGuard'; // Adjust path as needed
import { getSecureData } from '../services/secureStorage'; // Import secure storage
import * as ImagePicker from 'expo-image-picker';
import { updateDocument } from '../services/api'; // Import your uploadImage and updateDocument functions
import { auth } from '@/config/firebase';

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
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText}>
          Name: {caregivers.firstName} {caregivers.lastName}
        </Text>
        <Text style={styles.detailText}>Email: {caregivers.email}</Text>
        <Text style={styles.detailText}>Phone: {caregivers.phoneNumber}</Text>
        <Text style={styles.detailText}>Total Shifts: {shifts.length}</Text>
        <Text style={styles.detailText}>Total Patients Assigned: {patients.length}</Text>


        {/* Add other user details here */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",


    padding: 20,
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
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changeImageText: {
    color: 'blue',
    marginTop: 5,
  },
  detailsContainer: {
    marginTop: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default ProfileScreen;