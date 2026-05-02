// ─── Flow step IDs ───────────────────────────────────────────────────────────
export const STEP_IDS = {
  PROFILE: "profile",
  JOB_TYPE: "jobType",
  CUSTOM_REQUIREMENTS: "customRequirements", // conditional: only when jobType === "other"
  LOCATION: "location",
  SALARY: "salary",
  SKILLS: "skills",
  SUMMARY: "summary",
};

// ─── All possible steps (in order) ──────────────────────────────────────────
export const ALL_STEPS = [
  STEP_IDS.PROFILE,
  STEP_IDS.JOB_TYPE,
  STEP_IDS.CUSTOM_REQUIREMENTS, // skipped unless jobType === "other"
  STEP_IDS.LOCATION,
  STEP_IDS.SALARY,
  STEP_IDS.SKILLS,
  STEP_IDS.SUMMARY,
];

/**
 * Returns the ordered list of visible step IDs based on current answers.
 * This drives the conditional flow logic.
 */
export const getVisibleSteps = (answers) => {
  return ALL_STEPS.filter((id) => {
    if (id === STEP_IDS.CUSTOM_REQUIREMENTS) {
      return answers?.jobType === "other";
    }
    return true;
  });
};

// ─── Screen name map (step ID → navigator screen name) ───────────────────────
export const STEP_SCREEN = {
  [STEP_IDS.PROFILE]: "ProfileStep",
  [STEP_IDS.JOB_TYPE]: "JobTypeStep",
  [STEP_IDS.CUSTOM_REQUIREMENTS]: "CustomRequirementsStep",
  [STEP_IDS.LOCATION]: "LocationStep",
  [STEP_IDS.SALARY]: "SalaryStep",
  [STEP_IDS.SKILLS]: "SkillsStep",
  [STEP_IDS.SUMMARY]: "SummaryScreen",
};

// ─── Experience levels (Step 1) ───────────────────────────────────────────────
export const EXPERIENCE_LEVELS = [
  { value: "entry", label: "Entry", sub: "0-2 years" },
  { value: "mid", label: "Mid", sub: "3-5 years" },
  { value: "senior", label: "Senior", sub: "6+ years" },
];

export const YEARS_OPTIONS = [
  { value: "1", label: "1 year" },
  { value: "2", label: "2 years" },
  { value: "3", label: "3 years" },
  { value: "4", label: "4 years" },
  { value: "5", label: "5 years" },
  { value: "6", label: "6 years" },
  { value: "7", label: "7 years" },
  { value: "8", label: "8 years" },
  { value: "9", label: "9 years" },
  { value: "10+", label: "10+ years" },
];

// ─── Job type options (Step 2) ────────────────────────────────────────────────
export const JOB_TYPE_OPTIONS = [
  {
    value: "fulltime",
    label: "Full-time",
    sub: "Standard 35-40 hours per week, long-term commitment.",
    icon: "briefcase-outline",
  },
  {
    value: "parttime",
    label: "Part-time",
    sub: "Reduced hours, usually between 15-30 hours per week.",
    icon: "time-outline",
  },
  {
    value: "contract",
    label: "Contract",
    sub: "Fixed-term projects or freelance arrangements.",
    icon: "document-text-outline",
  },
  {
    value: "internship",
    label: "Internship",
    sub: "Entry-level roles for students or career changers.",
    icon: "school-outline",
  },
  {
    value: "other",
    label: "Other (Custom)",
    sub: "Specific work arrangements or special requirements.",
    icon: "options-outline",
  },
];

// ─── Working styles (Step 3 – Location) ──────────────────────────────────────
export const WORKING_STYLES = [
  {
    value: "remote",
    label: "Fully Remote",
    sub: "Work from anywhere in the world, no office visits required.",
    icon: "globe-outline",
  },
  {
    value: "hybrid",
    label: "Hybrid",
    sub: "A mix of home and office. Usually 2-3 days on-site.",
    icon: "business-outline",
  },
  {
    value: "onsite",
    label: "On-site",
    sub: "Full-time presence at the company's physical office.",
    icon: "location-outline",
  },
];

export const CITY_SUGGESTIONS = [
  "New York, NY",
  "San Francisco, CA",
  "Austin, TX",
  "London, UK",
  "Berlin, DE",
];

// ─── Availability options (Step 4 – Salary) ──────────────────────────────────
export const AVAILABILITY_OPTIONS = [
  { value: "immediate", label: "Immediately available" },
  { value: "2weeks", label: "2 weeks notice" },
  { value: "1month", label: "1 month notice" },
  { value: "2months", label: "2 months notice" },
  { value: "3months+", label: "3+ months notice" },
];

// ─── Suggested skills (Step 5) ────────────────────────────────────────────────
export const SUGGESTED_SKILLS = [
  "TypeScript",
  "Node.js",
  "Product Management",
  "Python",
  "SQL",
  "AWS",
  "React",
  "UI Design",
  "Figma",
  "Go",
  "Kotlin",
  "Docker",
];

// ─── Company size options (Step 5) ───────────────────────────────────────────
export const COMPANY_SIZES = [
  {
    value: "startup",
    label: "Startup",
    sub: "1-50 employees. Fast-paced and high impact.",
    icon: "flash-outline",
  },
  {
    value: "midmarket",
    label: "Mid-Market",
    sub: "51-500 employees. Stability meets growth.",
    icon: "people-outline",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    sub: "500+ employees. Clear structure and scale.",
    icon: "grid-outline",
  },
];

// ─── Culture fit tags (Step 5) ────────────────────────────────────────────────
export const CULTURE_TAGS = [
  { value: "remote-first", label: "Remote-first" },
  { value: "flat-hierarchy", label: "Flat Hierarchy" },
  { value: "high-growth", label: "High Growth" },
  { value: "diverse-team", label: "Diverse Team" },
  { value: "pet-friendly", label: "Pet Friendly" },
  { value: "wlb", label: "Work-Life Balance" },
];
