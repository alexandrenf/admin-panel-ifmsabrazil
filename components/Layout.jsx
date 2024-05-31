"use client";

import { useState, ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  CssBaseline,
  IconButton,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styled from "@emotion/styled";

const drawerWidth = 240;

const theme = createTheme({
  palette: {
    primary: {
      main: "#6200ea",
    },
    secondary: {
      main: "#03dac6",
    },
  },
  typography: {
    fontFamily: "Poppins, sans-serif",
  },
});

const Main = styled("main")`
  flex-grow: 1;
  padding: 24px; /* Use a fixed value for padding */
  margin-left: ${(props) => (props.open ? drawerWidth : 0)}px;
  transition: margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,
    width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms; /* Use fixed values for transitions */
  width: ${(props) => (props.open ? `calc(100% - ${drawerWidth}px)` : "100%")};
`;

const AppBarStyled = styled(AppBar)`
  transition: margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms,
    width 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms; /* Use fixed values for transitions */
  ${(props) =>
    props.open &&
    `
      width: calc(100% - ${drawerWidth}px);
      margin-left: ${drawerWidth}px;
    `}
`;

const DrawerHeader = styled("div")`
  display: flex;
  align-items: center;
  padding: 0 8px; /* Use a fixed value for padding */
  ${(props) => props.theme.mixins.toolbar};
  justify-content: flex-end;
`;

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const router = useRouter();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleNavigation = (path) => {
    router.push(path);
    if (mobileOpen) {
      handleDrawerToggle();
    }
  };

  const drawer = (
    <div>
      <DrawerHeader theme={theme}>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === "ltr" ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </DrawerHeader>
      <List>
        {["Notícias", "EBs", "Páginas"].map((text) => (
          <ListItem
            button
            key={text}
            onClick={() =>
              handleNavigation(
                `/admin/${text
                  .toLowerCase()
                  .replace("í", "i")
                  .replace("ã", "a")}`
              )
            }
          >
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBarStyled position="fixed" open={drawerOpen}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={drawerOpen ? handleDrawerClose : handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            {drawerOpen ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap>
            Admin Panel
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Main open={drawerOpen}>
        <DrawerHeader theme={theme} />
        {children}
      </Main>
    </ThemeProvider>
  );
}
