import { useMemo } from "react";

/**
 * Returns true when all required fields for the current step are filled.
 * Pass the list of required field keys and the answers map.
 */
export function useStepValidation(requiredFields, answers) {
  return useMemo(() => {
    return requiredFields.every((key) => {
      const val = answers[key];
      if (val === undefined || val === null || val === "") return false;
      if (Array.isArray(val) && val.length === 0) return false;
      return true;
    });
  }, [requiredFields, answers]);
}
