import React, { useState } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import TopBar from "@/components/TopBar";
import SideNav from "@/components/SideNav";

export default function AppShell({ children, darkMode, onToggleTheme }: any) {
  return (
    <Box sx={{ display: "flex" }}>
      <TopBar onToggleTheme={onToggleTheme} darkMode={darkMode} />
      <SideNav />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Container maxWidth="xl">{children}</Container>
      </Box>
    </Box>
  );
}
