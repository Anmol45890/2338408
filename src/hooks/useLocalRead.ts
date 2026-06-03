import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "viewedNotifications";

export function useLocalRead() {
  const [readSet, setReadSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const arr: string[] = JSON.parse(raw);
        setReadSet(new Set(arr));
      }
    } catch (e) {
      setReadSet(new Set());
    }
  }, []);

  const markRead = useCallback((id: string) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      next.add(id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(next)));
      } catch (e) {}
      return next;
    });
  }, []);

  const isRead = useCallback((id: string) => readSet.has(id), [readSet]);

  return { readSet, markRead, isRead } as const;
}
