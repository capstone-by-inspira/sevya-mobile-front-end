import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';

interface ButtonProps {
  handleButtonClick: () => void;
  buttonText: string;
  disabled?: boolean;
  buttonColor?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ handleButtonClick, buttonText, disabled, buttonColor, style }) => {
  return (
    <TouchableOpacity 
      onPress={handleButtonClick} 
      style={[
        styles.button, 
        { backgroundColor: buttonColor || '#25578E', opacity: disabled ? 0.5 : 1 }, // Adjust opacity
        style
      ]} 
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7} // Prevent touch effect if disabled
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#25578E",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 45,

  },
  buttonText: {
    color: "#fff",
    fontSize: 15,

  },
});
