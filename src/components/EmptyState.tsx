import React from "react";
import { Box, Typography, Button } from "@mui/material";
import NotificationsOffIcon from "@mui/icons-material/NotificationsOff";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No Notifications Found",
  description = "We couldn't find any notifications matching your filters or search query.",
  actionLabel,
  onAction,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        py: 8,
        px: 3,
        borderRadius: 4,
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "rgba(17, 24, 39, 0.4)" : "rgba(243, 244, 246, 0.4)",
        border: "1px dashed",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 80,
          height: 80,
          borderRadius: "50%",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(129, 140, 248, 0.1)" : "rgba(79, 70, 229, 0.05)",
          color: "primary.main",
          mb: 3,
          boxShadow: (theme) =>
            theme.palette.mode === "dark" ? "0 0 20px rgba(129, 140, 248, 0.15)" : "none",
        }}
      >
        <NotificationsOffIcon sx={{ fontSize: 40 }} />
      </Box>

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 450, mb: 4 }}>
        {description}
      </Typography>

      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};
