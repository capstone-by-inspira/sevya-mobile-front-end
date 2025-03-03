
import { View, Text } from "react-native";

interface Shift {
  id: number
  caregiver_id: number
  caregiver_name: string
  patient_id: number
  start_time: string
  end_time: string
  admin_id: number
  status: string
}
export default function shifts() {
  return (
    <View>
      <Text>Shifts Screen</Text>
    </View>
  );
}
