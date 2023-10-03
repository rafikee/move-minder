import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "workouts"; // the key for the active dataset

export interface Workout {
  id: number; // unique id and also how chapters are sorted
  name: string; // name of chapter
  enabled: boolean; // whether or not chapter is in tracker
}

// Clear data for testing
export const clearData = async () => {
  AsyncStorage.clear();
};

// Get chapter data from asyncsotarge
export const getData = async (): Promise<Workout[]> => {
  try {
    const storedData = await AsyncStorage.getItem(STORAGE_KEY);
    if (storedData !== null) {
      return JSON.parse(storedData);
    } else {
      const defaultData = resetData();
      return defaultData;
    }
  } catch (error) {
    console.log("Error retrieving data:", error);
  }
  return [];
};

// Set chapter data to async storage
// Stores it twice, once in data and once in the respective format
export const setData = async (data: Workout[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.log("Error saving data:", error);
  }
};

export const resetData = (): Workout[] => {
  return [
    { id: 1, name: "Push-ups", enabled: true },
    { id: 2, name: "Pull-ups", enabled: true },
  ];
};
