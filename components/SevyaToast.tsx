// import React from "react";
// import { View, Text } from "react-native";
// import Animated, { FadeInUp, FadeOutUp } from "react-native-reanimated";

// interface SevyaToastProps {
//   message: any;
// }

// const SevyaToast: React.FC<SevyaToastProps> = ({ message }) => {
//     console.log(message, 'message');
// //   if (!message) return null; // Don't render if there's no message

//   return (
//     <Animated.View
//       entering={FadeInUp}
//       exiting={FadeOutUp}
//       style={{
//         position: "absolute",
//         top: 70,
//         width: "90%",
//         backgroundColor: "#20639B",
//         borderRadius: 5,
//         padding: 20,
//         flexDirection: "row",
//         justifyContent: "flex-start",
//         alignItems: "center",
//         shadowColor: "#003049",
//         shadowOpacity: 0.4,
//         shadowRadius: 2,
//         shadowOffset: { width: 0, height: 1 },
//         elevation: 2,
//         zIndex: 1000, // Ensure it's on top
//         alignSelf: "center",
//       }}
//     >
//       <View>
//         <Text style={{
//           color: "#F6F4F4",
//           fontWeight: "bold",
//           marginLeft: 10,
//           fontSize: 16,
//         }}>Info</Text>
//         <Text style={{
//           color: "#F6F4F4",
//           fontWeight: "500",
//           marginLeft: 10,
//           fontSize: 14,
//         }}>
//           {typeof message === "object" ? JSON.stringify(message) : message}
//         </Text>
//       </View>
//     </Animated.View>
//   );
// };

// export default SevyaToast;
