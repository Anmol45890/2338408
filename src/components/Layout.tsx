import React, { useState } from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Badge,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InboxIcon from "@mui/icons-material/Inbox";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import SchoolIcon from "@mui/icons-material/School";
import Link from "next/link";
import { useRouter } from "next/router";
import { useThemeContext } from "../context/ThemeContext";
import { useNotificationsContext } from "../context/NotificationContext";

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleColorMode } = useThemeContext();
  const { readIds } = useNotificationsContext();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar Menu Items
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Priority Inbox", icon: <InboxIcon />, path: "/priority" },
  ];

  const drawerContent = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 3 }}>
        <SchoolIcon color="primary" sx={{ fontSize: 28 }} />
        <Typography
          variant="h6"
          noWrap
          sx={{
            fontWeight: 700,
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "linear-gradient(90deg, #c084fc, #818cf8)"
                : "linear-gradient(90deg, #7c3aed, #4f46e5)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Campus Portal
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 3, flexGrow: 1 }}>
        {menuItems.map((item) => {
          const active = router.pathname === item.path;
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <Link href={item.path} passHref style={{ textDecoration: "none", width: "100%" }}>
                <ListItemButton
                  selected={active}
                  onClick={() => isMobile && setMobileOpen(false)}
                  sx={{
                    borderRadius: 3,
                    py: 1.5,
                    px: 2,
                    "&.Mui-selected": {
                      backgroundColor: (theme) =>
                        theme.palette.mode === "dark"
                          ? "rgba(129, 140, 248, 0.15)"
                          : "rgba(79, 70, 229, 0.08)",
                      color: "primary.main",
                      "& .MuiListItemIcon-root": {
                        color: "primary.main",
                      },
                    },
                    "&:hover": {
                      borderRadius: 3,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? "primary.main" : "text.secondary",
                      transition: "color 0.2s",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          );
        })}
      </List>
      <Divider />
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="caption" color="text.secondary">
          Campus Notifications System v1.0
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "rgba(11, 15, 25, 0.8)" : "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            noWrap
            component="h1"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              color: "text.primary",
            }}
          >
            {router.pathname === "/priority" ? "Priority Inbox" : "Notifications Dashboard"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Dark/Light mode toggle */}
            <IconButton onClick={toggleColorMode} color="inherit" sx={{ color: "text.primary" }}>
              {mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer (Sidebar) */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="navigation folders"
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
        >
          {drawerContent}
        </Drawer>
        
        {/* Desktop permanent drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 3, sm: 4 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "background.default",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Toolbar /> {/* Top spacer to clear fixed AppBar */}
        <Box sx={{ flexGrow: 1 }}>{children}</Box>
      </Box>
    </Box>
  );
};
