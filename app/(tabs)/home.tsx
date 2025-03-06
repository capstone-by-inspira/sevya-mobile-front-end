import { View, Text, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import AuthGuard from "../../components/AuthGuard";
import { deleteSecureData } from "../../services/secureStorage"; // Secure storage import
import Button from "@/components/ui/Button";
import TodaysShift from "@/components/TodaysShift";
import { getDocumentById, getDocumentByKeyValue } from '@/services/api'
import { getSecureData } from "@/services/secureStorage";
import { useEffect, useState } from "react";

export default function Home() {
  
  const router = useRouter();

  

  const logout = async () => {
    await deleteSecureData("token");
    await deleteSecureData("user");
    router.replace("/login");
  };

  return (
    <AuthGuard>
      <View style={{backgroundColor: '#F0F6FF', display: 'flex', flexDirection: "column", width: "100%", flex: 1}}>
        <View style={{height: 150}}>
          <Image
          style={{ width: 'auto', height: 150, borderRadius: 0, margin: 0}}
            source={{
              uri: 'https://images.unsplash.com/photo-1584515933487-779824d29309',
            }}
          />
        </View>
        <TodaysShift />
        <Button handleButtonClick={logout} buttonText="Logout" />
      </View>
    </AuthGuard>
  );
}
