import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';

export const OfflineBanner = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="bg-emerald-600 text-white text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 transition sticky top-0 z-50 shadow">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Internet connection restored. Synchronizing scholarship data with MoTA servers...</span>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="bg-slate-900 text-amber-300 border-b border-amber-500/40 text-xs font-bold py-1.5 px-4 text-center flex items-center justify-center gap-2 sticky top-0 z-50 shadow">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
      <span>
        You are offline. PWA offline cache is active — you can review saved drafts and scheme details.
      </span>
    </div>
  );
};

export default OfflineBanner;
