import React, { createContext, useState, useEffect, useContext } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
  mode: "light" | "dark";
  toggleColorMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "dark",
  toggleColorMode: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("dark"); // Default to dark for premium aesthetics

  useEffect(() => {
    const savedMode = localStorage.getItem("theme_mode");
    if (savedMode === "light" || savedMode === "dark") {
      setMode(savedMode);
    }
  }, []);

  const toggleColorMode = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      localStorage.setItem("theme_mode", newMode);
      return newMode;
    });
  };

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? "#818cf8" : "#4f46e5", // Indigo Accent
      },
      secondary: {
        main: "#ec4899", // Fuchsia Pink Accent
      },
      background: {
        default: mode === "dark" ? "#0b0f19" : "#f8fafc", // Cool deep navy vs soft grey
        paper: mode === "dark" ? "#111827" : "#ffffff", // Slate 900 vs pure white
      },
      text: {
        primary: mode === "dark" ? "#f3f4f6" : "#1f2937",
        secondary: mode === "dark" ? "#9ca3af" : "#4b5563",
      },
      divider: mode === "dark" ? "#1f2937" : "#e5e7eb",
    },
    typography: {
      fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 700,
        letterSpacing: "-0.02em",
      },
      h5: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      h6: {
        fontWeight: 600,
        letterSpacing: "-0.01em",
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: "none",
      },
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundImage: "none",
            border: mode === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
            boxShadow:
              mode === "dark"
                ? "0 4px 20px -2px rgba(0,0,0,0.4)"
                : "0 4px 20px -2px rgba(0,0,0,0.05)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            padding: "8px 16px",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
            borderRadius: 8,
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === "dark" ? "#0b0f19" : "#ffffff",
            borderRight: mode === "dark" ? "1px solid #1f2937" : "1px solid #e5e7eb",
          },
        },
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleColorMode }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};
