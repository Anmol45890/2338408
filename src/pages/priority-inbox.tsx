import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useNotifications } from "@/hooks/useNotifications";
import { useLocalRead } from "@/hooks/useLocalRead";
import { calculatePriority } from "@/utils/priority";
import NotificationList from "@/components/NotificationList";

export default function PriorityInboxPage() {
  const [limit] = useState(50);
  const [topN, setTopN] = useState(10);

  const { data, loading, error, refetch } = useNotifications({ page: 1, limit });
  const { markRead, isRead } = useLocalRead();

  const top = calculatePriority(data || [], topN);

  return (
    <Box>
      <Stack spacing={2} direction="row" alignItems="center" mb={2}>
        <Typography variant="h5">Priority Inbox</Typography>
        <Select value={topN} onChange={(e) => setTopN(Number(e.target.value))} size="small">
          <MenuItem value={10}>Top 10</MenuItem>
          <MenuItem value={15}>Top 15</MenuItem>
          <MenuItem value={20}>Top 20</MenuItem>
        </Select>
        <Button onClick={() => refetch()}>Refresh</Button>
      </Stack>

      {error && (
        <Box>
          <Typography color="error">{error}</Typography>
          <Button onClick={() => refetch()}>Retry</Button>
        </Box>
      )}

      <NotificationList notifications={top} loading={loading} onOpen={(id) => markRead(id)} isRead={(id) => isRead(id)} />
    </Box>
  );
}
