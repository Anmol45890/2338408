import React from "react";
import { Grid, Card, CardContent, Box, Skeleton } from "@mui/material";

interface SkeletonLoaderProps {
  count?: number;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6 }) => {
  return (
    <Grid container spacing={3}>
      {Array.from(new Array(count)).map((_, idx) => (
        <Grid item xs={12} sm={6} md={4} key={idx}>
          <Card
            sx={{
              borderRadius: 4,
              borderLeft: "6px solid transparent",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              {/* Type Chip Skeleton */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Skeleton variant="rounded" width={110} height={24} sx={{ borderRadius: 2 }} />
                <Skeleton variant="rounded" width={60} height={24} sx={{ borderRadius: 2 }} />
              </Box>

              {/* Message Skeleton */}
              <Skeleton variant="text" width="100%" height={32} />
              <Skeleton variant="text" width="85%" height={32} sx={{ mb: 3 }} />

              {/* Timestamp Footer Skeleton */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
                  pt: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
                  <Skeleton variant="circular" width={16} height={16} />
                  <Skeleton variant="text" width="50%" height={16} />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
