import { useEffect, useState } from "react";
import {
  AppBar,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { DRAWER_WIDTH } from "./Drawer";
import { USER_USERNAME } from "@/helpers/helpers";
import { signOut } from "@/services/Auth/auth";

interface TopBarProps {
  handleDrawerToggle: () => void;
  pathname: string;
}

const TopBar: React.FC<TopBarProps> = ({ handleDrawerToggle }) => {
  const [firstName, setFirstName] = useState<string>("");

  useEffect(() => {
    if (USER_USERNAME) {
      setFirstName(USER_USERNAME);
    } else {
      window.location.href = "/auth/login";
    }
  }, []);

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { sm: `${DRAWER_WIDTH}px` },
      }}
    >
      <Toolbar sx={{ bgcolor: "common.white" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon sx={{ color: "common.black" }} />
        </IconButton>

        <Stack
          width="100%"
          direction="row"
          justifyContent="flex-end"
          alignItems="center"
          gap={1}
        >
          <Typography component="p" variant="h5" color="common.black">
            {firstName}
          </Typography>
          <Tooltip title="Изход">
            <IconButton color="inherit" onClick={signOut}>
              <LogoutIcon sx={{ color: "common.black" }} />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
