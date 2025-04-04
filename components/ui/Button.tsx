import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import { globalStyles } from "@/styles/globalStyles";


interface ButtonProps {
  handleButtonClick: () => void;
  buttonText: string;
  disabled?: boolean;
  buttonColor?: string;
  style?: ViewStyle;
}

const Button: React.FC<ButtonProps> = ({ handleButtonClick, buttonText, disabled, buttonColor, style }) => {
  return (
    <TouchableOpacity onPress={handleButtonClick}
      style={[ 
        globalStyles.button,
        { backgroundColor: buttonColor || '#25578E', opacity: disabled ? 0.5 : 1 }, 
        style
      ]}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7} 
    >
      <Text style={globalStyles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default Button;

