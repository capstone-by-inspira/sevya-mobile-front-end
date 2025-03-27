import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
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
    <TouchableOpacity onPress={handleButtonClick} 
    style={[
      styles.button, 
      disabled && styles.disabledButton, 
      { backgroundColor: buttonColor ? buttonColor : '#25578E' },
      style,]} 
    disabled={disabled}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 20,
    width: 'auto',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#D3D3D3',
  },
});
