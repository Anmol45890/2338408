import { useState, useEffect, useCallback } from "react";
import apiClient from "../services/api";
import { Notification, NotificationType } from "../types";
import { useLogs } from "./useLogs";

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search and query parameters
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5); // API requires limit between 5 and 10
  const [typeFilter, setTypeFilter] = useState<NotificationType | "All">("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { log } = useLogs();

  const fetchNotifications = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {
        page,
        limit,
      };
      if (typeFilter !== "All") {
        params.notification_type = typeFilter;
      }

      await log(
        "frontend",
        "info",
        "useNotifications",
        `Fetching notifications: page=${page}, limit=${limit}, type=${typeFilter}${isRetry ? " (retry)" : ""}`
      );

      const res = await apiClient.get<{ notifications: Notification[] }>("/notifications", { params });
      const fetched = res.data.notifications || [];
      setNotifications(fetched);

      await log(
        "frontend",
        "info",
        "useNotifications",
        `Successfully fetched ${fetched.length} notifications`
      );
    } catch (err: any) {
      const errMsg = err.response?.data?.errors 
        ? JSON.stringify(err.response.data.errors) 
        : err.message || "Failed to fetch notifications";
        
      setError(errMsg);
      await log(
        "frontend",
        "error",
        "useNotifications",
        `Error fetching notifications: ${errMsg}`
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, typeFilter, log]);

  // Refetch whenever query inputs change
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Apply client-side text filtering on message content
  const filteredNotifications = notifications.filter((n) => {
    if (!searchQuery) return true;
    return n.Message.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return {
    notifications: filteredNotifications,
    rawNotifications: notifications,
    loading,
    error,
    page,
    setPage,
    limit,
    setLimit,
    typeFilter,
    setTypeFilter,
    searchQuery,
    setSearchQuery,
    retry: () => fetchNotifications(true),
  };
}
