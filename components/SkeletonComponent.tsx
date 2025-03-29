import React, { useState } from "react";
import { View, Button, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";

export default function App() {
  const [showConfetti, setShowConfetti] = useState(false);

  const handlePress = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 10000); // Reset confetti after animation
  };

  return (
    <View style={styles.container}>
      <Button title="Celebrate 🎉" onPress={handlePress} />

      {showConfetti && (
        <ConfettiCannon 
          count={300} 
          origin={{ x: 0, y: 0 }} // Start from top-center
          fadeOut={true} 
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
});
