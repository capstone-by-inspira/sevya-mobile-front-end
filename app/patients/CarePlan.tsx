import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";

// Define the structure of the plan's sections
type CarePlanSection = {
  title: string;
  items: string[];
};

type Section = {
  title: string;
  items: string[];
};

const parsePlanText = (text: string): Section[] => {
  // console.log("Raw Text in parsePlanText:", text);
  if (!text.trim()) return [];

  const lines = text.split(/\r?\n/);
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  lines.forEach((line) => {
    const match = line.match(/^\*\s+\*\*(.+?)\*\*\s*:?(.+)?/); // Detect section titles and optional inline description

    if (match) {
      // Save previous section before starting a new one
      if (currentSection) {
        sections.push(currentSection);
      }
      // Start a new section with the title
      currentSection = { title: match[1].trim(), items: [] };
      // If there's inline content after the title, add it to the items
      if (match[2]?.trim()) {
        currentSection.items.push(match[2].trim());
      }
    } else if (currentSection && line.trim()) {
      // Handle both bulleted & non-bulleted text inside a section
      if (/^[-•*] /.test(line)) {
        currentSection.items.push("• " + line.replace(/^[-•*] /, "").trim());
      } else {
        currentSection.items.push(line.trim());
      }
    }
  });

  // Push the last section if there's any content left
  if (currentSection) {
    sections.push(currentSection);
  }

  return sections;
};



const CarePlan = () => {
  const { plan } = useLocalSearchParams(); // Get AI-generated care plan from params
  const navigation = useNavigation();
  const [parsedPlan, setParsedPlan] = useState<CarePlanSection[]>([]);

 useEffect(() => {
   navigation.setOptions({ title: "AI Care Plan" });
   
   if (plan) {
     const planText = Array.isArray(plan) ? plan.join("\n") : plan;
     const decodedPlanText = decodeURIComponent(planText);
     const sections = parsePlanText(decodedPlanText);
     setParsedPlan(sections);
   }
 }, [plan, navigation]);


  if (!parsedPlan.length) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading care plan...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {parsedPlan.map((section, index) => (
        <View key={index} style={styles.card}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          {section.items.map((item, i) => (
            <Text key={i} style={styles.bulletPoint}>
              {item}
            </Text>
          ))}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    backgroundColor: "#f8f8f8",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#25578E",
    marginBottom: 5,
  },
  bulletPoint: {
    fontSize: 16,
    color: "#4a4a4a",
    marginLeft: 10,
    lineHeight: 22,
  },
});

export default CarePlan;
