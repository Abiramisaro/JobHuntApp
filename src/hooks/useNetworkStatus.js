import { useState, useEffect, useCallback, useRef } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * useNetworkStatus
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth for connectivity across the entire app.
 *
 * Returns:
 *   isOffline        – true when the user has NO usable internet
 *   justCameOnline   – true for exactly 3 s after reconnecting (drives green banner)
 *   connectionType   – "wifi" | "cellular" | "none" | "unknown"
 *   checkNow()       – imperative re-check (retry button handler)
 *
 * Logic:
 *   isOffline = isConnected===false
 *            OR (isConnected===true AND isInternetReachable===false)
 *   The second case covers "connected to a network but no real internet"
 *   (e.g. hotel captive portal, LAN with no WAN).
 */
export function useNetworkStatus() {
  const [isOffline, setIsOffline]           = useState(false);
  const [justCameOnline, setJustCameOnline] = useState(false);
  const [connectionType, setConnectionType] = useState("unknown");
  const [determined, setDetermined]         = useState(false); // false = still loading

  const prevOfflineRef  = useRef(null);   // tracks last known offline state
  const onlineTimerRef  = useRef(null);   // clears the "justCameOnline" window

  const applyState = useCallback((netState) => {
    const offline =
      netState.isConnected === false ||
      (netState.isConnected === true && netState.isInternetReachable === false);

    setConnectionType(netState.type ?? "unknown");
    setIsOffline(offline);
    setDetermined(true);

    // If we were offline and are now online → trigger justCameOnline for 3 s
    if (prevOfflineRef.current === true && !offline) {
      setJustCameOnline(true);
      if (onlineTimerRef.current) clearTimeout(onlineTimerRef.current);
      onlineTimerRef.current = setTimeout(() => {
        setJustCameOnline(false);
      }, 3000);
    }

    prevOfflineRef.current = offline;
  }, []);

  useEffect(() => {
    // Immediate fetch on mount
    NetInfo.fetch().then(applyState);

    // Live subscription for every subsequent change
    const unsub = NetInfo.addEventListener(applyState);

    return () => {
      unsub();
      if (onlineTimerRef.current) clearTimeout(onlineTimerRef.current);
    };
  }, [applyState]);

  const checkNow = useCallback(async () => {
    const state = await NetInfo.fetch();
    applyState(state);
    return !(
      state.isConnected === false ||
      (state.isConnected === true && state.isInternetReachable === false)
    );
  }, [applyState]);

  return { isOffline, justCameOnline, connectionType, determined, checkNow };
}
