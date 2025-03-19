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
  console.log("Raw Text in parsePlanText:", text);
  if (!text.trim()) return [];

  const lines = text.split(/\r?\n/);
  // console.log("Split Lines:", lines);

  const sections: Section[] = [];
  let currentSection: Section | null = null;

  lines.forEach((line) => {
    // console.log("Processing Line:", line);

    const match = line.match(/^\*\s+\*\*(.+?)\*\*\s*:?/); // Updated regex

    if (match) {
      // console.log(`Matched Section Title: ${match[1]}`);

      if (currentSection) sections.push(currentSection); // Save previous section

      currentSection = { title: match[1].trim(), items: [] };
    } else if (currentSection && line.trim()) {
      // console.log(
      //   `Adding to Section: ${currentSection.title} → ${line.trim()}`
      // );
      currentSection.items.push(line.trim());
    }
  });

  if (currentSection) sections.push(currentSection);
  // console.log("Final Parsed Sections:", sections);

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

    //  console.log("Decoded Plan Text:", decodedPlanText); // 🔍 Check if data is correct

     const sections = parsePlanText(decodedPlanText);

    //  console.log("Parsed Plan from Function:", sections); // 🔥 Debug parsed data

     setParsedPlan(sections);
   }
 }, [plan, navigation]);


  // ✅ Log inside another useEffect to capture the updated state
  // useEffect(() => {
  //   console.log("=====================================");
  //   console.log("Updated Parsed Plan:", parsedPlan);
  //   console.log("Updated Parsed Plan Length:", parsedPlan.length);
  //   console.log("=====================================");
  // }, [parsedPlan]);


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
