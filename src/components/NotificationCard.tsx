import React from "react";
import { Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { Notification, NotificationType } from "../types";
import { formatTimestamp } from "../utils/date";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import CampaignIcon from "@mui/icons-material/Campaign";
import { useNotificationsContext } from "../context/NotificationContext";
import { useLogs } from "../hooks/useLogs";

interface NotificationCardProps {
  notification: Notification;
}

const TYPE_CONFIGS: Record<
  NotificationType,
  { color: string; label: string; icon: React.ReactNode; weight: number }
> = {
  Placement: {
    color: "#10b981", // Vibrant Emerald Green
    label: "Placement (W3)",
    icon: <BusinessCenterIcon fontSize="small" />,
    weight: 3,
  },
  Result: {
    color: "#f59e0b", // Warm Amber
    label: "Result (W2)",
    icon: <SchoolIcon fontSize="small" />,
    weight: 2,
  },
  Event: {
    color: "#3b82f6", // Electric Blue
    label: "Event (W1)",
    icon: <CampaignIcon fontSize="small" />,
    weight: 1,
  },
};

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const { isRead, markAsRead } = useNotificationsContext();
  const { log } = useLogs();
  const read = isRead(notification.ID);
  const config = TYPE_CONFIGS[notification.Type] || {
    color: "#9ca3af",
    label: "General",
    icon: <CampaignIcon fontSize="small" />,
    weight: 0,
  };

  const handleCardOpen = async () => {
    if (!read) {
      markAsRead(notification.ID);
      await log(
        "frontend",
        "info",
        "NotificationCard",
        `Notification ${notification.ID} marked as read by user`
      );
    }
  };

  return (
    <Card
      onClick={handleCardOpen}
      sx={{
        cursor: "pointer",
        opacity: read ? 0.65 : 1,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        borderLeft: `6px solid ${config.color}`,
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? `0 10px 25px -5px rgba(0,0,0,0.5), 0 0 10px -2px ${config.color}33`
              : `0 10px 25px -5px rgba(0,0,0,0.1), 0 0 10px -2px ${config.color}33`,
        },
      }}
    >
      {/* Unread indicator dot */}
      {!read && (
        <Box
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 10,
            height: 10,
            borderRadius: "50%",
            backgroundColor: config.color,
            boxShadow: `0 0 10px 2px ${config.color}`,
            animation: "pulse 2s infinite",
            "@keyframes pulse": {
              "0%": { transform: "scale(0.95)", opacity: 0.5 },
              "50%": { transform: "scale(1.2)", opacity: 1 },
              "100%": { transform: "scale(0.95)", opacity: 0.5 },
            },
          }}
        />
      )}

      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 2, flexWrap: "wrap" }}>
          <Chip
            icon={config.icon}
            label={config.label}
            size="small"
            sx={{
              backgroundColor: `${config.color}15`,
              color: config.color,
              border: `1px solid ${config.color}33`,
              "& .MuiChip-icon": { color: config.color },
            }}
          />
          {read && (
            <Chip
              icon={<MarkEmailReadIcon fontSize="small" />}
              label="Read"
              size="small"
              variant="outlined"
              sx={{ opacity: 0.8 }}
            />
          )}
        </Box>

        <Typography
          variant="h6"
          component="h2"
          sx={{
            mb: 2.5,
            fontWeight: read ? 500 : 600,
            lineHeight: 1.4,
            color: (theme) => (read ? theme.palette.text.secondary : theme.palette.text.primary),
            wordBreak: "break-word",
          }}
        >
          {notification.Message}
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: (theme) => `1px solid ${theme.palette.divider}`,
            pt: 2,
            mt: 1,
            color: "text.secondary",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
            <AccessTimeIcon fontSize="inherit" sx={{ fontSize: "0.95rem" }} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>
              {formatTimestamp(notification.Timestamp)}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
