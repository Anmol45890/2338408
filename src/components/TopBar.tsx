import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import MenuIcon from "@mui/icons-material/Menu";

interface Props {
  onToggleTheme: () => void;
  onMenuClick?: () => void;
  darkMode: boolean;
}

export default function TopBar({ onToggleTheme, onMenuClick, darkMode }: Props) {
  return (
    <AppBar position="fixed" color="primary" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={onMenuClick} sx={{ mr: 2 }}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Campus Notifications
        </Typography>
        <Switch checked={darkMode} onChange={onToggleTheme} color="default" />
      </Toolbar>
    </AppBar>
  );
}
