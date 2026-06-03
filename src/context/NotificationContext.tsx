import React, { createContext, useState, useEffect, useContext } from "react";

interface NotificationContextType {
  readIds: Set<string>;
  markAsRead: (id: string) => void;
  markAllAsRead: (ids: string[]) => void;
  isRead: (id: string) => boolean;
}

const NotificationContext = createContext<NotificationContextType>({
  readIds: new Set(),
  markAsRead: () => {},
  markAllAsRead: () => {},
  isRead: () => false,
});

export const useNotificationsContext = () => useContext(NotificationContext);

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Load viewed notification IDs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("viewed_notifications");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setReadIds(new Set(parsed));
        }
      }
    } catch (err) {
      console.error("Failed to parse read notification IDs:", err);
    }
  }, []);

  const markAsRead = (id: string) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem("viewed_notifications", JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const markAllAsRead = (ids: string[]) => {
    setReadIds((prev) => {
      const next = new Set(prev);
      let changed = false;
      ids.forEach((id) => {
        if (!next.has(id)) {
          next.add(id);
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem("viewed_notifications", JSON.stringify(Array.from(next)));
        return next;
      }
      return prev;
    });
  };

  const isRead = (id: string) => readIds.has(id);

  return (
    <NotificationContext.Provider value={{ readIds, markAsRead, markAllAsRead, isRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
