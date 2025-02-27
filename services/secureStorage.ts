import * as SecureStore from 'expo-secure-store';

/**
 * Save data securely
 * @param key - The key under which the value is stored
 * @param value - The value to store
 */
export const saveSecureData = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY, // Highest security
    });
    console.log(`✅ Saved securely: ${key}`);
  } catch (error) {
    console.error(`❌ Error saving ${key}:`, error);
  }
};

/**
 * Retrieve data securely
 * @param key - The key of the stored value
 * @returns The stored value or null if not found
 */
export const getSecureData = async (key: string): Promise<string | null> => {
  try {
    const value = await SecureStore.getItemAsync(key);
    console.log(`🔍 Retrieved: ${key} = ${value}`);
    return value;
  } catch (error) {
    console.error(`❌ Error retrieving ${key}:`, error);
    return null;
  }
};

/**
 * Delete stored data
 * @param key - The key of the value to delete
 */
export const deleteSecureData = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`🗑️ Deleted: ${key}`);
  } catch (error) {
    console.error(`❌ Error deleting ${key}:`, error);
  }
};
