import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "jobhunt_progress_v1";

export const StorageService = {
  /** Save current step index + all answers */
  async save(currentStepId, answers) {
    const payload = {
      currentStepId,
      answers,
      savedAt: new Date().toISOString(),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  },

  /** Load saved progress. Returns null if none. */
  async load() {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  },

  /** Clear all saved progress (called on completion / reset) */
  async clear() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  },
};
