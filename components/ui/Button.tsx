import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";

interface ButtonProps {
  handleButtonClick: () => void;
  buttonText: string;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[]; // Accepts external styles
}

const Button: React.FC<ButtonProps> = ({
  handleButtonClick,
  buttonText,
  disabled,
  style,
}) => {
  return (
    <TouchableOpacity
      onPress={handleButtonClick}
      disabled={disabled}
      style={[styles.button, style]} // Merge styles
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#25578E",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Button;
