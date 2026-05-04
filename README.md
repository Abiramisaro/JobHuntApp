# ⚡ JobHunt — React Native Multi-Step Flow App

> A guided multi-step career profile builder built with React Native (Expo).  
> Users fill in their job preferences across 5–6 steps, with real-time validation, offline protection, local persistence, and backend sync.

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Folder Structure](#4-folder-structure)
5. [App Flow & Navigation](#5-app-flow--navigation)
6. [Screens](#6-screens)
7. [Components](#7-components)
8. [State Management](#8-state-management)
9. [Internet Connection Handling](#9-internet-connection-handling)
10. [API Integration](#10-api-integration)
11. [Local Persistence & Resume](#11-local-persistence--resume)
12. [Validation](#12-validation)
13. [Design System](#13-design-system)
14. [Constants & Configuration](#14-constants--configuration)
15. [Known Assumptions](#15-known-assumptions)
16. [Future Improvements](#16-future-improvements)

---

## 1. Project Overview

JobHunt is a **multi-step onboarding flow** that collects a user's career preferences across structured steps. It is built as an Expo-managed React Native project using JavaScript.

### Core Features

| Feature | Description |
|---|---|
| Multi-step flow | 5 steps (6 when "Other" job type is selected) |
| Progress indicator | Animated blue progress bar + "Step N of M" badge |
| Conditional flow | Step 3 (Custom Requirements) only appears when user picks "Other (Custom)" on Step 2 |
| Form validation | Continue button is blocked until all required fields are filled |
| Internet checking | 3-layer system: banner, modal blocker, full-page wall |
| Local persistence | Progress auto-saved to AsyncStorage on every answer change |
| Resume capability | App reopens to the exact step the user was on |
| Backend sync | POST /progress and GET /progress via REST API with exponential backoff retry |
| Summary screen | Full review of all answers with per-section Edit navigation |

---

## 2. Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `expo` | ~51.0.0 | Managed workflow, build tooling |
| `react` | 18.2.0 | UI library |
| `react-native` | 0.74.1 | Mobile framework |
| `@react-navigation/native` | ^6.1.17 | Navigation container |
| `@react-navigation/native-stack` | ^6.9.26 | Stack navigator |
| `@react-native-async-storage/async-storage` | 1.23.1 | Local persistence |
| `@react-native-community/netinfo` | ^11.3.1 | Real-time network monitoring |
| `react-native-safe-area-context` | 4.10.1 | Safe area provider + SafeAreaView |
| `react-native-screens` | 3.31.1 | Native screen optimization |
| `react-native-gesture-handler` | ~2.16.1 | Gesture support for navigation |
| `@expo/vector-icons` | ^14.0.0 | Ionicons icon set |
| `expo-status-bar` | ~1.12.1 | Status bar styling |

---

## 3. Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on your physical device, OR an iOS Simulator / Android Emulator

### Installation

```bash
# 1. Unzip the project
unzip JobHunt.zip
cd JobHunt

# 2. Install dependencies
npm install

# 3. Start the dev server
npx expo start
```

### Running on a device

```bash
# iOS Simulator
npx expo start --ios

# Android Emulator
npx expo start --android

# Physical device — scan the QR code in Expo Go
npx expo start
```

### Switching the backend URL

Open `src/utils/api.js` and replace:

```js
const BASE_URL = "https://jsonplaceholder.typicode.com";
```

with your real backend URL. The payload shape sent on every step save:

```json
{
  "currentStepId": "jobType",
  "answers": { "desiredRole": "Product Manager", "experienceLevel": "senior" },
  "savedAt": "2025-05-04T10:30:00.000Z"
}
```

---

## 4. Folder Structure

```
JobHunt/
├── App.js                          Root component — provider tree
├── index.js                        Expo entry point
├── app.json                        Expo configuration
├── babel.config.js                 Babel preset (expo)
├── package.json                    Dependencies
│
└── src/
    ├── components/                 Reusable UI components
    │   ├── Dropdown.js             Modal bottom-sheet picker
    │   ├── ExperienceChip.js       Entry / Mid / Senior segmented selector
    │   ├── Header.js               App header with logo, title, step badge, back arrow
    │   ├── InfoCard.js             Blue informational tip card
    │   ├── NetworkBanner.js        Slide-in/out offline status strip
    │   ├── NetworkBlocker.js       Modal gate — blocks Continue when offline
    │   ├── PrimaryButton.js        Filled / outline button with disabled + loading states
    │   ├── ProgressBar.js          Animated progress fill bar
    │   ├── RadioCard.js            Large selectable card with icon + checkmark
    │   ├── SectionLabel.js         Section heading with optional REQUIRED badge
    │   ├── SkillChip.js            Active chip, suggested chip, culture tag
    │   ├── StyledInput.js          Text input with icon, focus border, hint, char count
    │   └── SyncIndicator.js        Cloud sync status row (syncing/saved/offline/error)
    │
    ├── screens/                    One file per screen
    │   ├── ProfileStep.js          Step 1 — Desired role, experience level
    │   ├── JobTypeStep.js          Step 2 — Full-time / Part-time / Contract / Internship / Other
    │   ├── CustomRequirementsStep.js  Step 3 (conditional) — Free-text custom job needs
    │   ├── LocationStep.js         Step 3/4 — Working style + preferred cities
    │   ├── SalaryStep.js           Step 4/5 — Salary range + availability
    │   ├── SkillsStep.js           Step 5/6 — Skills, company size, culture tags
    │   ├── SummaryScreen.js        Final review — collapsible sections, edit links, confirm
    │   └── NoInternetScreen.js     Full-page offline wall shown at cold launch
    │
    ├── navigation/
    │   └── AppNavigator.js         Stack navigator + network gate logic
    │
    ├── context/
    │   └── FlowContext.js          Global state — answers, step, sync, persist, navigate
    │
    ├── hooks/
    │   ├── useNetworkStatus.js     NetInfo subscriber — isOffline, justCameOnline, checkNow
    │   └── useStepValidation.js    Returns true when all required fields are filled
    │
    ├── utils/
    │   ├── api.js                  ApiService — POST/GET /progress with retry
    │   └── storage.js              StorageService — AsyncStorage save/load/clear
    │
    └── constants/
        ├── colors.js               All color tokens
        ├── layout.js               Spacing, radius, font sizes, font weights
        └── flowConfig.js           Step IDs, options data, getVisibleSteps()
```

---

## 5. App Flow & Navigation

### Provider Tree (App.js)

```
GestureHandlerRootView
  └── SafeAreaProvider
        └── FlowProvider  (global state)
              └── AppNavigator
```

### Navigation Stack

```
AppNavigator
  ├── ProfileStep            ("ProfileStep")
  ├── JobTypeStep            ("JobTypeStep")
  ├── CustomRequirementsStep ("CustomRequirementsStep")  ← conditional
  ├── LocationStep           ("LocationStep")
  ├── SalaryStep             ("SalaryStep")
  ├── SkillsStep             ("SkillsStep")
  └── SummaryScreen          ("SummaryScreen")
```

All screens use `headerShown: false` — every screen renders its own `<Header>` component for full control.

### Conditional Flow Logic

```
flowConfig.js → getVisibleSteps(answers)
```

```
Standard flow (5 steps):
  profile → jobType → location → salary → skills → summary

When jobType === "other" (6 steps):
  profile → jobType → customRequirements → location → salary → skills → summary
```

`getVisibleSteps()` is called on every render inside `FlowContext`. The step count badge ("Step N of M") and the `goNext()` destination both update dynamically the moment the user selects "Other (Custom)".

### Navigation Decision in AppNavigator

```
App launch
  │
  ├── isLoading === true OR network not yet determined
  │     └── <ActivityIndicator />
  │
  ├── isOffline === true   (hard offline at cold launch)
  │     └── <NoInternetScreen />
  │
  └── Online
        └── <NavigationContainer> with full Stack
```

> **Important:** All hooks in `AppNavigator` are declared before any conditional `return`. This is required by the Rules of Hooks — conditional returns may only appear after all hook calls.

---

## 6. Screens

### ProfileStep — Step 1

**File:** `src/screens/ProfileStep.js`  
**Required fields:** `desiredRole`, `experienceLevel`  
**Optional fields:** `yearsOfExperience`

Layout uses `KeyboardAvoidingView → Header → ProgressBar → NetworkBanner → ScrollView → Footer`. The footer with the Continue button is always pinned at the bottom. The form scrolls independently so the button is always reachable regardless of content height.

| Field | Component | Type |
|---|---|---|
| Desired Role | `StyledInput` | Text |
| Experience Level | `ExperienceChip` | Radio (Entry/Mid/Senior) |
| Years of Experience | `Dropdown` | Select (optional) |

---

### JobTypeStep — Step 2

**File:** `src/screens/JobTypeStep.js`  
**Required fields:** `jobType`

Displays five `RadioCard` options. Selecting "Other (Custom)" adds Step 3 to the visible flow dynamically.

| Option | Value | Conditional effect |
|---|---|---|
| Full-time | `fulltime` | No extra step |
| Part-time | `parttime` | No extra step |
| Contract | `contract` | No extra step |
| Internship | `internship` | No extra step |
| Other (Custom) | `other` | **Adds CustomRequirementsStep** |

---

### CustomRequirementsStep — Step 3 (Conditional)

**File:** `src/screens/CustomRequirementsStep.js`  
**Shown when:** `answers.jobType === "other"`  
**Required fields:** `customRequirements`  
**Optional fields:** `priorityMatch` (toggle)

Free-text area (max 500 characters) with a live character count. A Priority Match toggle lets users flag their request as urgent.

---

### LocationStep — Step 3 or 4

**File:** `src/screens/LocationStep.js`  
**Required fields:** `workingStyle`, `preferredCities` (at least one)

| Field | Component | Type |
|---|---|---|
| Working Style | `RadioCard` × 3 | Radio (Remote/Hybrid/On-site) |
| Preferred Cities | Custom chip input | Multi-select with suggestions |

City suggestions are static (`CITY_SUGGESTIONS` in `flowConfig.js`). Tapping a suggestion adds it as a blue chip. Tapping a chip removes it.

---

### SalaryStep — Step 4 or 5

**File:** `src/screens/SalaryStep.js`  
**Required fields:** `salaryMin`, `salaryMax`, `availability`

| Field | Component | Type |
|---|---|---|
| Minimum salary | `StyledInput` | Numeric text |
| Maximum salary | `StyledInput` | Numeric text |
| Availability | `Dropdown` | Select from 5 options |

---

### SkillsStep — Step 5 or 6

**File:** `src/screens/SkillsStep.js`  
**Required fields:** `skills` (≥1), `companySize`  
**Optional fields:** `cultureTags`

| Section | Component | Behaviour |
|---|---|---|
| Key Skills | `SkillChip` + `SuggestedSkillChip` | Add from suggestions, remove with × |
| Company Size | `RadioCard` × 3 | Single select |
| Culture Fit Tags | `CultureTag` | Multi-select toggle chips |

---

### SummaryScreen

**File:** `src/screens/SummaryScreen.js`

Displays all collected answers in collapsible section cards. Each section has an **EDIT** button that calls `goToStep(stepId, navigation)` to navigate directly back to that step. After editing, the user returns to the summary by pressing Continue through subsequent steps.

A "Confirm & Save" button triggers a 1.2-second simulated API call, clears AsyncStorage, and shows a success screen. The success screen has a "Start over" button that resets all state and navigates back to Step 1.

---

### NoInternetScreen

**File:** `src/screens/NoInternetScreen.js`

Shown only when `isOffline === true` at cold launch. Uses React Native's built-in `<SafeAreaView>` (not the hook) so it renders safely even before the `SafeAreaProvider` fully hydrates. The "Try Again" button calls `checkNow()` from `useNetworkStatus`, which re-fetches the current network state and triggers a re-render in `AppNavigator`.

---

## 7. Components

### Header

**File:** `src/components/Header.js`

Does **not** use `useSafeAreaInsets()`. Instead uses `Platform.OS` + `StatusBar.currentHeight` to compute a safe top padding without requiring the provider context. This makes it safe in all render paths.

| Prop | Type | Description |
|---|---|---|
| `title` | string | Left-side label |
| `stepLabel` | string | Right-side badge (e.g. "Step 2 of 5") |
| `onBack` | function | If provided, shows a `‹` back chevron |
| `showLogo` | boolean | Renders the ⚡ logo box |

---

### ProgressBar

**File:** `src/components/ProgressBar.js`

A 3px-tall animated bar. Uses `Animated.timing` on the width from `"0%"` to `"100%"`. The animation runs on every step change with a 350ms duration.

| Prop | Type | Description |
|---|---|---|
| `current` | number | Current step (1-based) |
| `total` | number | Total visible steps |

---

### NetworkBanner

**File:** `src/components/NetworkBanner.js`

A 40px-tall strip that slides in from above using `Animated.spring` (translateY from -40 to 0). It reads from `useNetworkStatus()` and has no props it needs to manage itself — it is fully self-contained.

**Behaviour contract:**

| Situation | Banner |
|---|---|
| Always online at mount | Never appears |
| Goes offline | Slides DOWN (red). Stays until online. Never auto-dismisses. |
| Comes back online | Turns GREEN instantly. Auto-dismisses after 3 seconds. |

| Prop | Type | Description |
|---|---|---|
| `onRetry` | function | Called after Retry tap and connection confirmed |

---

### NetworkBlocker

**File:** `src/components/NetworkBlocker.js`

A `Modal` with a spring pop-in card animation. Triggered by each step screen's `handleNext` when `isOffline === true`. Auto-dismisses via a `useEffect` watching `isOffline` — the moment connectivity returns, `onDismiss()` is called and the parent navigates forward without the user needing to tap again.

| Prop | Type | Description |
|---|---|---|
| `visible` | boolean | Controls modal visibility |
| `onDismiss` | function | Called when connection restored — parent calls `goNext()` |

---

### PrimaryButton

**File:** `src/components/PrimaryButton.js`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | — | Button text |
| `onPress` | function | — | Press handler |
| `disabled` | boolean | `false` | Grays out, blocks press |
| `loading` | boolean | `false` | Shows spinner |
| `variant` | `"filled"` \| `"outline"` | `"filled"` | Visual style |

---

### RadioCard

**File:** `src/components/RadioCard.js`

Large tappable card with an icon box, label, subtitle, and a checkmark when selected. Used for Job Type, Working Style, and Company Size options.

| Prop | Type | Description |
|---|---|---|
| `icon` | string | Ionicons name |
| `label` | string | Primary text |
| `sub` | string | Subtitle text |
| `selected` | boolean | Active state |
| `onPress` | function | Selection handler |

---

### ExperienceChip

**File:** `src/components/ExperienceChip.js`

A row of equal-width tappable chips for the Entry / Mid / Senior selector. Shows the level label and year range sub-label.

| Prop | Type | Description |
|---|---|---|
| `options` | array | `[{ value, label, sub }]` |
| `value` | string | Currently selected value |
| `onChange` | function | `(value) => void` |

---

### StyledInput

**File:** `src/components/StyledInput.js`

A bordered text input with focus state (blue border), optional left icon, optional hint text below, and optional character count for multiline mode.

| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Placeholder text |
| `value` | string | Controlled value |
| `onChangeText` | function | Change handler |
| `iconName` | string | Optional Ionicons left icon |
| `multiline` | boolean | Enables multiline mode |
| `maxLength` | number | Shows char count when multiline |
| `hint` | string | Helper text below (single-line only) |

---

### Dropdown

**File:** `src/components/Dropdown.js`

A trigger button that opens a `Modal` bottom sheet with a `FlatList` of options. Selected option highlighted in blue. Closes by tapping the backdrop or selecting an item.

| Prop | Type | Description |
|---|---|---|
| `placeholder` | string | Text when nothing selected |
| `options` | array | `[{ value, label }]` |
| `value` | string | Currently selected value |
| `onChange` | function | `(value) => void` |

---

### SkillChip / SuggestedSkillChip / CultureTag

**File:** `src/components/SkillChip.js`

Three related chip components exported from the same file:

- **`SkillChip`** — blue filled chip with × remove button (active selected skill)
- **`SuggestedSkillChip`** — outline chip with `+` prefix (tap to add)
- **`CultureTag`** — toggleable tag, turns green with ✓ when selected

---

### SectionLabel

**File:** `src/components/SectionLabel.js`

A row with a section heading on the left and an optional orange REQUIRED badge on the right.

| Prop | Type | Description |
|---|---|---|
| `label` | string | Section title |
| `required` | boolean | Shows REQUIRED badge |

---

### SyncIndicator

**File:** `src/components/SyncIndicator.js`

A small icon + text row shown in each step's footer. Hidden when `status === "idle"`.

| Status | Icon | Colour | Label |
|---|---|---|---|
| `syncing` | cloud-upload | Grey | Saving… |
| `saved` | checkmark-circle | Green | Saved |
| `offline` | cloud-offline | Amber | Offline — saved locally |
| `error` | alert-circle | Red | Save failed + Retry button |

---

### InfoCard

**File:** `src/components/InfoCard.js`

A blue-tinted card with an info icon and descriptive text. Used on the Salary screen to explain availability importance.

---

## 8. State Management

All state is managed through a single React Context: **`FlowContext`**.

### State Shape

```js
{
  answers: {},           // All user inputs keyed by field ID
  currentStepId: "profile",  // Which step the user is on
  syncStatus: "idle",    // "idle" | "syncing" | "saved" | "offline" | "error"
  isLoading: true,       // True while AsyncStorage is being read on mount
  isComplete: false,     // True after Confirm & Save
}
```

### Exposed Actions

| Action | Signature | Description |
|---|---|---|
| `setAnswer` | `(key, value) => void` | Updates one field in answers, triggers debounced save |
| `goNext` | `(navigation) => void` | Advances to next visible step, navigates screen |
| `goBack` | `(navigation) => void` | Goes to previous visible step, calls `navigation.goBack()` |
| `goToStep` | `(stepId, navigation) => void` | Jumps to a specific step (used by Summary EDIT buttons) |
| `completeFlow` | `() => Promise` | Marks flow done, clears storage |
| `resetFlow` | `(navigation) => Promise` | Clears all state + storage, returns to Step 1 |
| `retrySave` | `() => void` | Re-triggers the debounced persist function |
| `getStepLabel` | `(stepId) => { current, total }` | Returns step number info for the Header badge |

### Save Debounce

`persist(stepId, answers)` is debounced at **700ms**. On every `setAnswer` call:

1. The debounce timer resets.
2. After 700ms of inactivity, `StorageService.save()` writes to AsyncStorage.
3. Then `ApiService.saveProgress()` posts to the backend.
4. `syncStatus` updates accordingly (`syncing → saved` or `syncing → offline/error`).

This means rapid typing in a text field does not trigger an API call on every keystroke — only after the user pauses.

---

## 9. Internet Connection Handling

The system has **four layers**, each with a distinct responsibility:

### Layer 1 — `useNetworkStatus` hook

**File:** `src/hooks/useNetworkStatus.js`

Single source of truth. Subscribes to `NetInfo.addEventListener` for live changes and calls `NetInfo.fetch()` immediately on mount.

**Offline definition:**
```js
isOffline =
  netState.isConnected === false
  OR
  (netState.isConnected === true AND netState.isInternetReachable === false)
```

The second case covers situations where a device is connected to a Wi-Fi network but has no actual internet access (e.g. captive portal, no WAN).

**Returns:**

| Value | Type | Description |
|---|---|---|
| `isOffline` | boolean | True when no usable internet |
| `justCameOnline` | boolean | True for exactly 3s after reconnecting |
| `connectionType` | string | `"wifi"` \| `"cellular"` \| `"none"` \| `"unknown"` |
| `determined` | boolean | False until the first NetInfo response arrives |
| `checkNow()` | function | Imperative re-check, returns `Promise<boolean>` |

---

### Layer 2 — NetworkBanner (mid-session drops)

Placed just below `<ProgressBar />` on every step screen. Fully self-contained — no props required beyond an optional `onRetry`.

**Timing:**
- Offline → slides DOWN, red, stays until online (no auto-dismiss)
- Back online → turns green, auto-dismisses after **3 seconds**
- Always online at mount → never appears

---

### Layer 3 — NetworkBlocker (forward navigation gate)

Every step screen's `handleNext` function follows this pattern:

```js
const handleNext = useCallback(() => {
  if (isOffline) {
    setBlockerVisible(true); // show modal
    return;                  // do NOT navigate
  }
  goNext(navigation);        // normal navigation
}, [isOffline, goNext, navigation]);
```

The modal auto-dismisses the instant `isOffline` becomes false:

```js
useEffect(() => {
  if (visible && !isOffline) {
    onDismiss?.(); // parent then calls goNext()
  }
}, [isOffline, visible]);
```

This means the user never has to tap anything after reconnecting — the app advances automatically.

---

### Layer 4 — NoInternetScreen (cold launch wall)

In `AppNavigator`, after all hooks are declared:

```js
if (isOffline) {
  return <NoInternetScreen onRetry={handleRetry} checking={retryChecking} />;
}
```

This is a full-page replacement for the NavigationContainer. The user cannot enter the app until connectivity is confirmed.

---

### Network State Summary Table

| `isConnected` | `isInternetReachable` | State | Banner | Blocker on Continue | Cold launch |
|---|---|---|---|---|---|
| `true` | `true` | ✅ Online | Hidden | Navigates normally | Normal flow |
| `false` | any | ❌ Offline | Red, stays | Shown | Full-page wall |
| `true` | `false` | ⚠️ No internet | Red, stays | Shown | Full-page wall |
| `true` | `true` (was false) | 🔄 Reconnected | Green, 3 s | Auto-dismissed | — |
| `null` | `null` | ⏳ Determining | — | — | Spinner |

---

## 10. API Integration

**File:** `src/utils/api.js`  
**Backend (demo):** `https://jsonplaceholder.typicode.com`

### Endpoints

#### POST /progress — Save user progress

Called after every step answer change (debounced 700ms).

**Request:**
```json
{
  "currentStepId": "salary",
  "answers": {
    "desiredRole": "Product Manager",
    "experienceLevel": "senior",
    "jobType": "fulltime",
    "workingStyle": "hybrid",
    "preferredCities": ["Bangalore", "Mumbai"],
    "salaryMin": "80000",
    "salaryMax": "120000",
    "availability": "1 month notice"
  },
  "savedAt": "2025-05-04T10:30:00.000Z"
}
```

**Response:** Backend echoes the saved record with an ID.

#### GET /progress — Retrieve saved progress

Called on mount to check if there is server-side progress to restore. In the demo, local AsyncStorage drives resume logic (the JSONPlaceholder GET returns placeholder data, not real progress).

---

### Retry Logic

`fetchWithRetry(url, options, retries = 3)` wraps every API call with exponential backoff:

| Attempt | Wait before retry |
|---|---|
| 1st retry | 500ms |
| 2nd retry | 1000ms |
| 3rd retry | 2000ms |
| After 3 retries | Throws error |

---

### Offline Check Before Request

`assertOnline()` is called at the start of every API method:

```js
async function assertOnline() {
  const state = await NetInfo.fetch();
  const offline = state.isConnected === false
    || (state.isConnected === true && state.isInternetReachable === false);
  if (offline) throw new Error("NO_INTERNET");
}
```

`FlowContext` catches `"NO_INTERNET"` specifically and sets `syncStatus = "offline"` (amber, not red) so the UI distinguishes "not synced yet" from "API error".

---

## 11. Local Persistence & Resume

**File:** `src/utils/storage.js`  
**Key:** `"jobhunt_progress_v1"` in AsyncStorage

### StorageService Methods

| Method | Description |
|---|---|
| `save(currentStepId, answers)` | Serializes and writes full state. Called on every debounced answer change. |
| `load()` | Reads and parses stored state. Returns `null` if nothing saved. |
| `clear()` | Removes the key. Called on flow completion and reset. |

### Restore on Mount

In `FlowContext`:

```js
useEffect(() => {
  (async () => {
    const saved = await StorageService.load();
    if (saved?.currentStepId && saved?.answers) {
      setAnswers(saved.answers);       // restore all answers
      setCurrentStepId(saved.currentStepId); // restore position
    }
    setIsLoading(false);
  })();
}, []);
```

`AppNavigator` shows a spinner while `isLoading === true`. Once restored, the navigator renders from the saved `currentStepId` — the user continues exactly where they left off.

---

## 12. Validation

**File:** `src/hooks/useStepValidation.js`

```js
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
```

Each screen declares its required fields as a constant:

```js
const REQUIRED = ["desiredRole", "experienceLevel"];
const isValid = useStepValidation(REQUIRED, answers);
```

The `isValid` boolean is passed directly to `<PrimaryButton disabled={!isValid} />`. No error messages are shown — the button simply stays grey until all required fields have a non-empty value.

---

## 13. Design System

### Colors — `src/constants/colors.js`

All colors are named semantically, never used as raw hex values in component files.

| Token | Value | Usage |
|---|---|---|
| `PRIMARY` | `#2563EB` | Buttons, borders, selected states, icons |
| `PRIMARY_LIGHT` | `#EFF6FF` | Selected card backgrounds, tip cards |
| `PRIMARY_MID` | `#BFDBFE` | Icon box backgrounds |
| `TEXT_PRIMARY` | `#0F172A` | Headings, body text |
| `TEXT_SECONDARY` | `#64748B` | Subtitles, labels |
| `TEXT_MUTED` | `#94A3B8` | Placeholders, hints, disabled text |
| `BORDER` | `#E2E8F0` | Card borders, input borders, dividers |
| `BG` | `#F8FAFC` | Page backgrounds (used on Summary) |
| `SUCCESS` | `#10B981` | Saved indicator, culture tag selected |
| `DANGER` | `#EF4444` | Required asterisk, error states |
| `WARNING` | `#F59E0B` | Offline-but-saved-locally indicator |

### Spacing — `src/constants/layout.js`

```js
SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 }
RADIUS  = { sm: 6, md: 10, lg: 14, xl: 20, full: 9999 }
```

### Typography

```js
FONT_SIZE   = { xs: 11, sm: 13, base: 15, md: 17, lg: 20, xl: 24, xxl: 28 }
FONT_WEIGHT = { regular: "400", medium: "500", semibold: "600", bold: "700" }
```

### Screen Layout Pattern

Every step screen follows the same shell structure:

```
KeyboardAvoidingView (root, flex:1)
  ├── Header           (fixed, handles status bar padding internally)
  ├── ProgressBar      (fixed, 3px animated bar)
  ├── NetworkBanner    (fixed, 40px, hidden unless offline/just-reconnected)
  ├── ScrollView       (flex:1 — fills remaining space, content scrolls)
  │     └── form fields, tips, etc.
  └── Footer View      (fixed at bottom — SyncIndicator + buttons)

<NetworkBlocker />     (Modal, outside the layout flow)
```

---

## 14. Constants & Configuration

### flowConfig.js

The single source of truth for all step data.

**Step IDs:**
```js
STEP_IDS = {
  PROFILE, JOB_TYPE, CUSTOM_REQUIREMENTS,
  LOCATION, SALARY, SKILLS, SUMMARY
}
```

**`getVisibleSteps(answers)`** — returns the ordered array of step IDs the user should see, filtering out `CUSTOM_REQUIREMENTS` unless `answers.jobType === "other"`.

**`STEP_SCREEN`** — maps step IDs to React Navigation screen names:
```js
{ profile: "ProfileStep", jobType: "JobTypeStep", ... }
```

**Option arrays** — all dropdown/radio/chip data lives here:

| Export | Used in |
|---|---|
| `EXPERIENCE_LEVELS` | ProfileStep — ExperienceChip |
| `YEARS_OPTIONS` | ProfileStep — Dropdown |
| `JOB_TYPE_OPTIONS` | JobTypeStep — RadioCard list |
| `WORKING_STYLES` | LocationStep — RadioCard list |
| `CITY_SUGGESTIONS` | LocationStep — suggestion chips |
| `AVAILABILITY_OPTIONS` | SalaryStep — Dropdown |
| `SUGGESTED_SKILLS` | SkillsStep — SuggestedSkillChip list |
| `COMPANY_SIZES` | SkillsStep — RadioCard list |
| `CULTURE_TAGS` | SkillsStep — CultureTag list |

Adding new options to any of these arrays automatically updates every screen that uses them — no component code changes needed.

---

## 15. Known Assumptions

- **Backend is mocked.** `jsonplaceholder.typicode.com` is used as a real HTTP endpoint to demonstrate fetch, retry, and error handling. `GET /progress` always returns `null` so resume logic is driven entirely by AsyncStorage. Replace `BASE_URL` in `src/utils/api.js` to connect a real backend.

- **No authentication.** There is no user login, session token, or user ID. In a production app, the `SESSION_ID` constant in `api.js` should be replaced with a real auth-derived identifier.

- **Salary is text, not validated numerically.** Min/max salary fields accept any text. A real app should validate that min < max and both are positive numbers.

- **City input is suggestion-only.** The city input field captures text but only adds cities when the user taps a suggestion chip. Free-text city entry would require pressing Enter or a dedicated Add button.

- **Status bar height is approximate on iOS.** `Header.js` uses a static `44px` paddingTop on iOS. This covers standard iPhones. Devices with dynamic islands or unusual notch sizes may need adjustment.

---

## 16. Future Improvements

| Area | Improvement |
|---|---|
| Authentication | Add Expo Auth Session for Google/LinkedIn OAuth |
| Backend | Replace JSONPlaceholder with a real Node/Firebase backend |
| Salary validation | Validate min < max, numeric-only, locale-aware formatting |
| Skill search | Connect `StyledInput` on SkillsStep to a real skills API (e.g. LinkedIn Skills API) |
| City search | Replace static suggestions with a Places autocomplete API |
| Animations | Add `react-native-reanimated` for smoother page transitions |
| Accessibility | Add `accessibilityLabel`, `accessibilityRole`, `accessibilityHint` to all interactive elements |
| Testing | Add Jest + React Native Testing Library unit tests for `useStepValidation`, `useNetworkStatus`, and `FlowContext` |
| TypeScript | Migrate from `.js` to `.tsx` with strict typing |
| Deep linking | Add Expo Router for URL-based deep linking to specific steps |
| Push notifications | Use Expo Notifications to alert users when matching roles are found |

---

## License

MIT — free to use, modify, and distribute.

---

*Built with ⚡ React Native + Expo*
