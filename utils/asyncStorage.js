import * as SecureStore from "expo-secure-store";

class SecureStorage {
  static async setItem(key, value) {
    try {
      // console.log(`Storage ----- Key: ${key}, Value: ${value}`);
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      // console.error(`Error storing the item (${key}):`, error);
    }
  }

  static async getItem(key) {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value;
    } catch (error) {
      // console.error(`Error retrieving the item (${key}):`, error);
    }
  }

  static async deleteItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      // console.error(`Error deleting the item (${key}):`, error);
    }
  }
}

export default SecureStorage;
