import React from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  Typography,
  Button,
  Tabs,
  Tab,
  Alert,
  AlertTitle,
  Paper,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useNotifications } from "../hooks/useNotifications";
import { NotificationCard } from "../components/NotificationCard";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { EmptyState } from "../components/EmptyState";
import { NotificationType } from "../types";

export default function Dashboard() {
  const {
    notifications,
    rawNotifications,
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
    retry,
  } = useNotifications();

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTypeFilter(newValue as NotificationType | "All");
    setPage(1); // Reset page on filter change
  };

  const handleLimitChange = (event: any) => {
    setLimit(Number(event.target.value));
    setPage(1); // Reset page on limit change
  };

  const clearFilters = () => {
    setSearchQuery("");
    setTypeFilter("All");
    setPage(1);
  };

  // Determine if there are more items to paginate
  // Since total count is not returned, if the fetched list count equals the limit, there's likely a next page.
  const hasNextPage = rawNotifications.length === limit;

  return (
    <Box sx={{ py: 1 }}>
      {/* Search and Filters panel */}
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
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search notifications by message text..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth size="medium">
              <InputLabel id="limit-select-label">Page Limit</InputLabel>
              <Select
                labelId="limit-select-label"
                id="limit-select"
                value={limit}
                label="Page Limit"
                onChange={handleLimitChange}
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value={5}>5 per page</MenuItem>
                <MenuItem value={10}>10 per page</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<RefreshIcon />}
              onClick={retry}
              disabled={loading}
              sx={{ width: "100%", borderRadius: 3, py: 1.5 }}
            >
              Refresh API
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2.5 }} />

        {/* Tab Filters */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={typeFilter}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="notification type filters"
            sx={{
              "& .MuiTabs-indicator": {
                height: 3,
                borderRadius: "3px 3px 0 0",
              },
            }}
          >
            <Tab label="All Notifications" value="All" sx={{ fontWeight: 600, py: 2 }} />
            <Tab label="Placement" value="Placement" sx={{ fontWeight: 600, py: 2 }} />
            <Tab label="Result" value="Result" sx={{ fontWeight: 600, py: 2 }} />
            <Tab label="Event" value="Event" sx={{ fontWeight: 600, py: 2 }} />
          </Tabs>
        </Box>
      </Paper>

      {/* Error State */}
      {error && (
        <Alert
          severity="error"
          variant="outlined"
          sx={{ mb: 4, borderRadius: 4, alignItems: "center" }}
          action={
            <Button color="error" size="small" variant="contained" onClick={retry}>
              Retry Fetch
            </Button>
          }
        >
          <AlertTitle sx={{ fontWeight: 700 }}>Connection Error</AlertTitle>
          Unable to fetch notifications. Error detail: {error}
        </Alert>
      )}

      {/* Main Grid View */}
      {loading ? (
        <SkeletonLoader count={limit} />
      ) : notifications.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {notifications.map((notification) => (
              <Grid item xs={12} sm={6} md={4} key={notification.ID}>
                <NotificationCard notification={notification} />
              </Grid>
            ))}
          </Grid>

          {/* Pagination Navigation */}
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 6, gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ChevronLeftIcon />}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              sx={{ borderRadius: 3 }}
            >
              Previous Page
            </Button>
            <Typography variant="body1" sx={{ fontWeight: 600, mx: 1 }}>
              Page {page}
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ChevronRightIcon />}
              onClick={() => setPage((p) => p + 1)}
              disabled={!hasNextPage}
              sx={{ borderRadius: 3 }}
            >
              Next Page
            </Button>
          </Box>
        </>
      ) : (
        <EmptyState
          title={searchQuery ? "No search results" : "Empty Inbox"}
          description={
            searchQuery
              ? `We couldn't find any notifications matching "${searchQuery}".`
              : "No notifications fit the active category query."
          }
          actionLabel="Clear Filters"
          onAction={clearFilters}
        />
      )}
    </Box>
  );
}
