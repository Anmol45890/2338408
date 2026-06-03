import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Grid,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Button,
} from "@mui/material";
import apiClient from "../services/api";
import { Notification, LocalNotification } from "../types";
import { useNotificationsContext } from "../context/NotificationContext";
import { calculatePriority } from "../utils/priority";
import { NotificationCard } from "../components/NotificationCard";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { useLogs } from "../hooks/useLogs";

export default function PriorityInbox() {
  const [nValue, setNValue] = useState<number>(10);
  const [unreadNotifications, setUnreadNotifications] = useState<LocalNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { isRead } = useNotificationsContext();
  const { log } = useLogs();

  const fetchPriorityNotifications = useCallback(async (isRetry = false) => {
    setLoading(true);
    setError(null);
    try {
      await log(
        "frontend",
        "info",
        "PriorityInbox",
        `Fetching priority notifications with N=${nValue}${isRetry ? " (retry)" : ""}`
      );

      // Fetch 4 pages in parallel (40 notifications total) to build a robust pool
      const pages = [1, 2, 3, 4];
      const requests = pages.map((p) =>
        apiClient.get<{ notifications: Notification[] }>("/notifications", {
          params: { page: p, limit: 10 },
        })
      );

      const responses = await Promise.all(requests);

      // Flatten notifications and deduplicate by ID
      const allNotificationsMap: Record<string, Notification> = {};
      responses.forEach((res) => {
        const list = res.data.notifications || [];
        list.forEach((n) => {
          allNotificationsMap[n.ID] = n;
        });
      });

      const uniqueNotifications = Object.values(allNotificationsMap);

      // Filter out notifications that have already been read
      const unreads = uniqueNotifications
        .map((n) => ({
          ...n,
          isRead: isRead(n.ID),
        }))
        .filter((n) => !n.isRead);

      // Calculate priority scores and retrieve top N
      const priorityUnreads = calculatePriority(unreads, nValue);
      setUnreadNotifications(priorityUnreads);

      await log(
        "frontend",
        "info",
        "PriorityInbox",
        `Priority calculation complete. Displaying ${priorityUnreads.length} notifications out of ${unreads.length} unreads`
      );
    } catch (err: any) {
      const errMsg = err.response?.data?.errors 
        ? JSON.stringify(err.response.data.errors) 
        : err.message || "Failed to fetch priority notifications";
      setError(errMsg);
      await log(
        "frontend",
        "error",
        "PriorityInbox",
        `Error loading priority inbox: ${errMsg}`
      );
    } finally {
      setLoading(false);
    }
  }, [nValue, isRead, log]);

  // Fetch notifications on mount and whenever N or unread IDs change
  useEffect(() => {
    fetchPriorityNotifications();
  }, [fetchPriorityNotifications]);

  const handleNChange = (event: any) => {
    setNValue(Number(event.target.value));
  };

  return (
    <Box sx={{ py: 1 }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} sm={8}>
            <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
              The Priority Inbox sorts unread notifications. Placements weigh highest (W3), followed by Results (W2), and Events (W1). Ties are broken by recency. Opening a notification marks it read, which transitions it out of this inbox.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth size="medium">
              <InputLabel id="n-value-select-label">Show Top N Notifications</InputLabel>
              <Select
                labelId="n-value-select-label"
                id="n-value-select"
                value={nValue}
                label="Show Top N Notifications"
                onChange={handleNChange}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value={10}>Top 10 Notifications</MenuItem>
                <MenuItem value={15}>Top 15 Notifications</MenuItem>
                <MenuItem value={20}>Top 20 Notifications</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ mb: 4, borderRadius: 4, alignItems: "center" }}
          action={
            <Button
              color="error"
              size="small"
              variant="contained"
              onClick={() => fetchPriorityNotifications(true)}
            >
              Retry
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Connection Error</AlertTitle>
          Unable to fetch priority inbox. Error detail: {error}
        </Alert>
      )}

      {/* Main Grid View */}
      {loading ? (
        <SkeletonLoader count={6} />
      ) : unreadNotifications.length > 0 ? (
        <Grid container spacing={3}>
          {unreadNotifications.map((notification) => (
            <Grid item xs={12} sm={6} md={4} key={notification.ID}>
              <NotificationCard notification={notification} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <EmptyState
          title="All Caught Up!"
          description="There are no unread notifications to prioritize. Great job!"
        />
      )}
    </Box>
  );
}
