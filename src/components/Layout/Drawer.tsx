"use client";
import { useState } from "react";
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Drawer as MUIDrawer,
  useTheme,
} from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./Logo";
import TopBar from "./TopBar";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Groups2Icon from "@mui/icons-material/Groups2";
import GroupIcon from "@mui/icons-material/Group";

export const PAGES_DATA = [
  {
    title: "Начало",
    path: "/",
    icon: <HomeIcon />,
  },
  {
    title: "Персонал",
    path: "/employees",
    icon: <GroupIcon />,
  },
  {
    title: "Пациенти",
    path: "/patients",
    icon: <Groups2Icon />,
  },
  {
    title: "График",
    path: "/schedule",
    icon: <CalendarMonthIcon />,
  },
];

export const DRAWER_WIDTH = 240;

interface AdminDrawerProps {
  children: React.ReactNode;
}

const Drawer: React.FC<AdminDrawerProps> = ({ children }) => {
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar handleDrawerToggle={handleDrawerToggle} pathname={pathname} />

      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <MUIDrawer
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
        >
          <CustomeDrawer pathname={pathname} />
        </MUIDrawer>
        <MUIDrawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
            },
          }}
          open
        >
          <CustomeDrawer pathname={pathname} />
        </MUIDrawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Drawer;

interface CustomeDrawerProps {
  pathname: string;
}

const CustomeDrawer: React.FC<CustomeDrawerProps> = ({ pathname }) => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box>
      <Logo />

      <Divider />
      <List>
        {PAGES_DATA.map((page) => (
          <ListItem
            key={page.title}
            sx={{
              bgcolor: pathname === page.path ? theme.palette.grey[100] : "",
            }}
            disablePadding
          >
            <ListItemButton
              onClick={() => router.push(`${page.path}`, { scroll: true })}
            >
              <ListItemIcon
                sx={{
                  color:
                    pathname === page.path ? "primary.main" : "common.black",
                }}
              >
                {page.icon}
              </ListItemIcon>
              <ListItemText
                primary={page.title}
                sx={{
                  color:
                    pathname === page.path ? "primary.main" : "common.black",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
