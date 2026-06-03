import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocalRead } from "@/hooks/useLocalRead";
import NotificationList from "@/components/NotificationList";

export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [filterType, setFilterType] = useState<string | undefined>(undefined);
  const [search, setSearch] = useState("");

  const { data, total, loading, error, refetch } = useNotifications({ page, limit, notification_type: filterType, search: search || undefined });

  const { markRead, isRead } = useLocalRead();

  return (
    <Box>
      <Stack spacing={2} mb={2} direction="row" alignItems="center">
        <Typography variant="h5">Dashboard</Typography>
        <FormControl sx={{ minWidth: 160 }} size="small">
          <InputLabel>Type</InputLabel>
          <Select value={filterType || ""} label="Type" onChange={(e) => setFilterType(e.target.value || undefined)}>
            <MenuItem value="">All</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
          </Select>
        </FormControl>

        <TextField size="small" placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <Button variant="outlined" onClick={() => refetch()}>
          Refresh
        </Button>
      </Stack>

      {error && (
        <Box>
          <Typography color="error">{error}</Typography>
          <Button onClick={() => refetch()}>Retry</Button>
        </Box>
      )}

      <NotificationList notifications={data} loading={loading} onOpen={(id) => markRead(id)} isRead={(id) => isRead(id)} />

      <Box mt={2} display="flex" justifyContent="center">
        <Pagination count={Math.max(1, Math.ceil((total || data.length) / limit))} page={page} onChange={(_, p) => setPage(p)} />
      </Box>
    </Box>
  );
}
