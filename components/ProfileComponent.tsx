import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { AppContext } from "./AppContext"; // Adjust path as needed
import { getSecureData, deleteSecureData } from "../services/secureStorage"; // Import secure storage
import * as ImagePicker from "expo-image-picker";
import { updateDocument } from "../services/api"; // Import your uploadImage and updateDocument functions
import { auth } from "@/config/firebase";
import { Icon } from "react-native-paper";
import { formatDateOnly, formatLocalDate } from "@/services/utils";
import axios from "axios";
import { capitalize } from "@/services/utils";
import Button from "@/components/ui/Button";
import { useRouter } from "expo-router";

import SevyaLoader from "@/components/SevyaLoader";
const ProfileScreen = () => {
  const context = useContext(AppContext);

  if (!context) {
    return <Text>Error: AppContext not found</Text>;
  }

  const { isAuth, caregivers, patients, shifts, fetchData, token } = context;

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    await deleteSecureData("first_time_login");
    router.replace("/login");
  };

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
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* {!loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )} */}
      {loading ? <SevyaLoader /> : <></>}
      <ImageBackground
        source={require("../assets/images/wrapper1.png")}
        style={styles.backgroundImage}
      >
        <View style={styles.imageContainer1}>
          <View style={styles.imageContainer}>
            <Image
              source={
                profileImage
                  ? { uri: profileImage }
                  : require("../assets/images/placeholder-image.jpg")
              } // Replace with your placeholder
              style={styles.profileImage}
            />
            <Text style={styles.caregiverName}>
              {capitalize(caregivers.firstName)}{" "}
              {capitalize(caregivers.lastName)}
            </Text>
            <Text style={styles.caregiver}>Caregiver</Text>
            <TouchableOpacity
              style={styles.changeImageText}
              onPress={pickImage}
            >
              <Text style={styles.buttonText}>Change Profile Image</Text>
              <Icon source="pencil" size={18} color="#CEE8F2" />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>

      <View style={styles.detailsContainer}>
        <Text style={styles.detailText2}>Personal Info</Text>
        <Text style={styles.detailText}>
          <Image
            source={require("../assets/images/Mail.png")}
            style={styles.icons}
          />
          <Text> Email:</Text> {caregivers.email}
        </Text>
        <Text style={styles.detailText3}>
          <Image
            source={require("../assets/images/Phone.png")}
            style={styles.icons}
          />
          <Text> Phone number:</Text> {caregivers.phoneNumber}
        </Text>
        <Text style={styles.detailText1}>Work Info</Text>
        <Text style={styles.detailText}>
          <Image
            source={require("../assets/images/User.png")}
            style={styles.icons}
          />
          <Text> Total Patients Assigned:</Text> {patients.length}
        </Text>
        <Text style={styles.detailText}>
          <Image
            source={require("../assets/images/Clock.png")}
            style={styles.icons}
          />
          <Text> Total Shifts:</Text> {shifts?.length}
        </Text>

        {/*<Text style={styles.detailText}>
          <Text style={{ fontWeight: "bold" }}>Availability:</Text> {formatLocalDate(caregivers.availability)}
        </Text>*/}

        {/* Add other user details here */}
      </View>

      <View style={styles.logout}>
        <Button handleButtonClick={logout} buttonText="Logout" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "transparent",
  },
  loadingOverlay: {
    display: "flex",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  imageContainer1: {
    marginLeft: -30,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
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
  caregiverName: {
    color: "white",
    fontSize: 16,
    paddingTop: 6,
  },
  caregiver: {
    color: "white",
    fontSize: 12,
    paddingBottom: 6,
    paddingTop: 6,
  },
  changeImageText: {
    color: "white",
    marginTop: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "#CEE8F2",
    padding: 10,
    borderRadius: 24,
  },
  buttonText: {
    color: "white",
  },
  detailsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width: 400,
    backgroundColor: "#F8FBFF",
  },
  detailText: {
    display: "flex",
    columnGap: 35,
    fontSize: 16,
    marginBottom: 15,
    color: "#424242",
  },
  detailText1: {
    fontSize: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E2E2",
    paddingTop: 10,
    marginBottom: 20,
    color: "#424242",
    fontStyle: "italic",
    marginRight: 20,
  },
  detailText2: {
    fontSize: 16,
    paddingTop: 10,
    marginBottom: 20,
    color: "#424242",
    fontStyle: "italic",
  },
  detailText3: {
    fontSize: 16,
    marginBottom: 20,
    color: "#424242",
  },
  backgroundImage: {
    width: "110%",
    height: 308,
    padding: 0,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  icons: {
    height: 16,
    paddingTop: 1,
  },
  logout: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileScreen;
