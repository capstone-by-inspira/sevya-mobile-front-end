import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/FontAwesome";

interface AudioPlayerProps {
  audioUrl: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playPauseAudio = async () => {
    if (!sound) {
      const { sound: newSound } = await Audio.Sound.createAsync({
        uri: audioUrl,
      });
      setSound(newSound);
      await newSound.playAsync();
      setIsPlaying(true);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
          setIsPlaying(false);
          newSound.unloadAsync();
          setSound(null);
        }
      });
    } else {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    }
  };

  return (
    <View style={styles.audioContainer}>
      <TouchableOpacity onPress={playPauseAudio} style={styles.playButton}>
        <Icon name={isPlaying ? "pause" : "play"} size={24} color="#0078D4" />
      </TouchableOpacity>
      <Text style={styles.audioText}>
        {isPlaying ? "Playing..." : "Voice Note"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  audioContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e1f5fe",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    // marginTop: 10,
  },
  playButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 100,
    marginRight: 10,
  },
  audioText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
});

export default AudioPlayer;
