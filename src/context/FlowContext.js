import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { StorageService } from "../utils/storage";
import { ApiService } from "../utils/api";
import {
  STEP_IDS,
  ALL_STEPS,
  getVisibleSteps,
  STEP_SCREEN,
} from "../constants/flowConfig";

// ─── Context ─────────────────────────────────────────────────────────────────
const FlowContext = createContext(null);

// ─── Provider ────────────────────────────────────────────────────────────────
export function FlowProvider({ children }) {
  const [answers, setAnswers] = useState({});
  const [currentStepId, setCurrentStepId] = useState(STEP_IDS.PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState("idle"); // idle | syncing | saved | error
  const [isComplete, setIsComplete] = useState(false);

  const debounceRef = useRef(null);

  // ── Derived ────────────────────────────────────────────────────────────────
  const visibleSteps = getVisibleSteps(answers);
  const currentIndex = visibleSteps.indexOf(currentStepId);
  const totalSteps = visibleSteps.length - 1; // exclude summary from count
  const displayIndex = currentIndex + 1;

  // ── Restore on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const saved = await StorageService.load();
        if (saved?.currentStepId && saved?.answers) {
          setAnswers(saved.answers);
          setCurrentStepId(saved.currentStepId);
        }
      } catch (e) {
        console.warn("[FlowContext] Failed to restore progress:", e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // ── Debounced persist ─────────────────────────────────────────────────────
  const persist = useCallback((stepId, currentAnswers) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSyncStatus("syncing");
      try {
        await StorageService.save(stepId, currentAnswers);
        await ApiService.saveProgress(stepId, currentAnswers);
        setSyncStatus("saved");
        setTimeout(() => setSyncStatus("idle"), 2000);
      } catch (err) {
        // Distinguish offline vs other API error for the UI
        setSyncStatus(err?.message === "NO_INTERNET" ? "offline" : "error");
      }
    }, 700);
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const setAnswer = useCallback(
    (key, value) => {
      setAnswers((prev) => {
        const next = { ...prev, [key]: value };
        persist(currentStepId, next);
        return next;
      });
    },
    [currentStepId, persist]
  );

  const goNext = useCallback(
    (navigation) => {
      const steps = getVisibleSteps(answers);
      const idx = steps.indexOf(currentStepId);
      const nextId = steps[idx + 1];
      if (!nextId) return;
      setCurrentStepId(nextId);
      persist(nextId, answers);
      if (nextId === STEP_IDS.SUMMARY) {
        navigation.navigate(STEP_SCREEN[STEP_IDS.SUMMARY]);
      } else {
        navigation.navigate(STEP_SCREEN[nextId]);
      }
    },
    [answers, currentStepId, persist]
  );

  const goBack = useCallback(
    (navigation) => {
      const steps = getVisibleSteps(answers);
      const idx = steps.indexOf(currentStepId);
      if (idx <= 0) return;
      const prevId = steps[idx - 1];
      setCurrentStepId(prevId);
      persist(prevId, answers);
      navigation.goBack();
    },
    [answers, currentStepId, persist]
  );

  const goToStep = useCallback(
    (stepId, navigation) => {
      setCurrentStepId(stepId);
      setIsComplete(false);
      navigation.navigate(STEP_SCREEN[stepId]);
    },
    []
  );

  const completeFlow = useCallback(async () => {
    setIsComplete(true);
    await StorageService.clear();
  }, []);

  const resetFlow = useCallback(async (navigation) => {
    setAnswers({});
    setCurrentStepId(STEP_IDS.PROFILE);
    setIsComplete(false);
    setSyncStatus("idle");
    await StorageService.clear();
    navigation.reset({ index: 0, routes: [{ name: "ProfileStep" }] });
  }, []);

  const retrySave = useCallback(() => {
    persist(currentStepId, answers);
  }, [currentStepId, answers, persist]);

  // ── Step label helpers ────────────────────────────────────────────────────
  // Returns "Step N of M" for non-summary screens
  const getStepLabel = useCallback(
    (stepId) => {
      const steps = getVisibleSteps(answers).filter(
        (s) => s !== STEP_IDS.SUMMARY
      );
      const idx = steps.indexOf(stepId);
      if (idx < 0) return "";
      return { current: idx + 1, total: steps.length };
    },
    [answers]
  );

  return (
    <FlowContext.Provider
      value={{
        answers,
        currentStepId,
        visibleSteps,
        currentIndex,
        totalSteps,
        displayIndex,
        isLoading,
        syncStatus,
        isComplete,
        setAnswer,
        goNext,
        goBack,
        goToStep,
        completeFlow,
        resetFlow,
        retrySave,
        getStepLabel,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used inside <FlowProvider>");
  return ctx;
}
