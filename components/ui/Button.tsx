import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import React from 'react';

interface ButtonProps {
  handleButtonClick: () => void; 
  buttonText: string; 
}

const Button: React.FC<ButtonProps> = ({ handleButtonClick, buttonText }) => {
  return (
    <TouchableOpacity onPress={handleButtonClick} style={styles.button}>
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#25578E',
    paddingHorizontal: 20,
    paddingVertical: 13,
    margin: 20,
    width: 130,
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
