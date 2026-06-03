import React from "react";
import Grid from "@mui/material/Grid";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import NotificationCard from "@/components/NotificationCard";
import { Notification } from "@/types";

export default function NotificationList({
  notifications,
  loading,
  onOpen,
  isRead,
}: {
  notifications: Notification[];
  loading?: boolean;
  onOpen?: (id: string) => void;
  isRead?: (id: string) => boolean;
}) {
  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={80} />
        <Skeleton variant="rectangular" height={80} />
      </Stack>
    );
  }

  if (!notifications || notifications.length === 0) {
    return <div>No notifications found.</div>;
  }

  return (
    <Grid container spacing={2}>
      {notifications.map((n) => (
        <Grid item xs={12} sm={6} md={4} key={n.id}>
          <NotificationCard notification={n} onOpen={onOpen} isRead={isRead ? isRead(n.id) : false} />
        </Grid>
      ))}
    </Grid>
  );
}
