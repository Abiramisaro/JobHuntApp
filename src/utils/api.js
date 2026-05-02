/**
 * ApiService
 * ---------
 * Wraps POST /progress and GET /progress.
 *
 * Uses https://jsonplaceholder.typicode.com as a real HTTP stand-in
 * so the network plumbing (fetch, retry, error handling) is fully
 * demonstrable without needing a custom backend.
 *
 * Replace BASE_URL with your real API to go live.
 */

const BASE_URL = "https://jsonplaceholder.typicode.com";

// Exponential backoff retry wrapper
async function fetchWithRetry(url, options, retries = 3) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      // Wait 500ms, 1000ms, 2000ms …
      await new Promise((r) => setTimeout(r, 500 * Math.pow(2, attempt)));
    }
  }
}

export const ApiService = {
  /**
   * POST /progress
   * Saves the user's current step + answers to the backend.
   */
  async saveProgress(currentStepId, answers) {
    const payload = {
      currentStepId,
      answers,
      savedAt: new Date().toISOString(),
    };

    const res = await fetchWithRetry(`${BASE_URL}/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    return data; // JSONPlaceholder echoes back the body + id
  },

  /**
   * GET /progress
   * Retrieves saved progress from the backend.
   * Returns null if not found or on error.
   */
  async loadProgress() {
    try {
      const res = await fetchWithRetry(`${BASE_URL}/posts/1`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      // Real backend would return the user's actual progress object.
      // JSONPlaceholder returns a placeholder post — we return null
      // so local AsyncStorage drives the resume logic in the demo.
      return null;
    } catch {
      return null;
    }
  },
};
