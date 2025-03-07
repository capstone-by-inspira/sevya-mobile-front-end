import { View, Text, Image, Button, StyleSheet } from "react-native";

// NameBar Component
interface NameBarProps {
  userName: string;
}

export const DashNameBar: React.FC<NameBarProps> = ({ userName }) => {
  return (
    <View style={dashStyle.container}>
      <Text style={styles.nameText}>Hi, {userName}!</Text>
      <Image
        source={require("../assets/placeholder.jpg")}
        style={stylesImage.image}
      />
    </View>
  );
};

const dashStyle = StyleSheet.create({
  container: {
    height: "40%",
    backgroundColor: "orange",
  },
});

const styles = StyleSheet.create({
  nameText: {
    padding: 10,
    backgroundColor: "white",
    fontSize: 18,
    color: "black",
  },
});

const stylesImage = StyleSheet.create({
  container: {
    flex: 2,
  },
  image: {
    width: "100%", // Adjust width
    maxHeight: 200,
    resizeMode: "cover", // Ensure the whole image fits
  },
});
