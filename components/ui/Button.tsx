import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface ButtonProps {
  handleButtonClick: () => void; 
  buttonText: string; 
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({ handleButtonClick, buttonText, disabled }) => {
  return (
    <TouchableOpacity onPress={handleButtonClick} style={[styles.button, disabled && styles.disabledButton]} disabled={disabled}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#25578E',
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
    backgroundColor: '#D3D3D3', // Gray color when button is disabled
  },
});
