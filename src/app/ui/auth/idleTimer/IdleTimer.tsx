'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { signOut, getSession } from 'next-auth/react';
import { useTwilioStore } from '@/store/phoneDevice';

const STORAGE_KEY = 'last_activity_timestamp';
const REFRESH_KEY = 'last_auth_refresh';
const TIMEOUT_MS = 15 * 60 * 1000;
const WARNING_MS = 30 * 1000;
const IDLE_LIMIT = TIMEOUT_MS - WARNING_MS;
const REFRESH_INTERVAL = 60 * 1000;

export function IdleTimer() {
  const isDev = process.env.NODE_ENV === 'development';
  const call = useTwilioStore((state) => state.call);
  const incomingCallsArray = useTwilioStore((state) => state.incomingCallsArray);

  const [showWarning, setShowWarning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  const showWarningRef = useRef(false);
  const timerRefOne = useRef<NodeJS.Timeout | null>(null);
  const timerRefTwo = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    showWarningRef.current = showWarning;
  }, [showWarning]);

  const handleLogout = useCallback(async () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(REFRESH_KEY);
    await signOut({ callbackUrl: '/?reason=expired' });
  }, []);

  const resetTimers = useCallback(() => {
    const dontCloseSession = isDev || call || incomingCallsArray.length > 0;

    if (dontCloseSession) return;

    if (timerRefOne.current) clearTimeout(timerRefOne.current);
    if (timerRefTwo.current) clearTimeout(timerRefTwo.current);

    timerRefOne.current = setTimeout(() => {
      setShowWarning(true);

      timerRefTwo.current = setTimeout(() => {
        setIsExpired(true);
        handleLogout();
      }, WARNING_MS);
    }, IDLE_LIMIT);
  }, [handleLogout, isDev, call, incomingCallsArray]);

  const updateActivity = useCallback(async () => {
    if (showWarningRef.current) return;

    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());

    const lastRefresh = parseInt(localStorage.getItem(REFRESH_KEY) || '0');

    if (now - lastRefresh > REFRESH_INTERVAL) {
      localStorage.setItem(REFRESH_KEY, now.toString());

      try {
        await getSession();
      } catch (error) {
        console.error('Error al refrescar sesión:', error);
      }
    }

    resetTimers();
  }, [resetTimers]);

  const keepSessionAlive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const now = Date.now().toString();
    localStorage.setItem(STORAGE_KEY, now);
    localStorage.setItem(REFRESH_KEY, now);

    await getSession();

    setShowWarning(false);
    resetTimers();
  };

  useEffect(() => {
    const dontCloseSession = isDev || call || incomingCallsArray.length > 0;

    if (dontCloseSession) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];

    resetTimers();

    const handleUserActivity = () => {
      updateActivity();
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setShowWarning(false);
        resetTimers();
      }
    };

    events.forEach((e) => window.addEventListener(e, handleUserActivity));
    window.addEventListener('storage', handleStorage);

    return () => {
      if (timerRefOne.current) clearTimeout(timerRefOne.current);
      if (timerRefTwo.current) clearTimeout(timerRefTwo.current);
      events.forEach((e) => window.removeEventListener(e, handleUserActivity));
      window.removeEventListener('storage', handleStorage);
    };
  }, [updateActivity, resetTimers, isDev, call, incomingCallsArray]);

  const dontCloseSession = isDev || call || incomingCallsArray.length > 0;

  if (dontCloseSession || !showWarning) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center border border-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {isExpired ? 'Session Expired' : 'Your session is about to expire'}
        </h2>
        <p className="mb-8 text-gray-600 leading-relaxed">
          {isExpired
            ? 'Your session has expired due to inactivity. Redirecting...'
            : 'You have been inactive for a while. For your security, we will log you out soon. Do you want to stay connected?'}
        </p>
        {!isExpired && (
          <div className="flex flex-col justify-center items-center gap-3">
            <button
              onClick={keepSessionAlive}
              className="w-full bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md active:scale-95"
            >
              Yes, stay signed in
            </button>
            <button
              onClick={handleLogout}
              className="w-fit text-gray-500 hover:text-gray-700 text-sm font-medium underline"
            >
              Sign out now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
