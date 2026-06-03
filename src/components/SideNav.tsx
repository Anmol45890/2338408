import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { useRouter } from "next/router";

const drawerWidth = 240;

export default function SideNav({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const router = useRouter();

  const items = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Priority Inbox", path: "/priority-inbox" },
  ];

  const content = (
    <div>
      <List>
        {items.map((it, i) => (
          <ListItem button key={it.path} onClick={() => router.push(it.path)}>
            <ListItemIcon>{i % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <>
      <Drawer variant="permanent" sx={{ width: drawerWidth, flexShrink: 0 }} open>
        <div style={{ height: 64 }} />
        {content}
      </Drawer>
    </>
  );
}
