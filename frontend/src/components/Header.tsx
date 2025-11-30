import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link,
  Container,
  IconButton,
} from "@mui/material";
import { MusicNote, AccountBox } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import LoginButton from "./LoginButton";
import AccountDrawer from "./AccountDrawer";
import { PurpleGradientSX } from "../util";

const Header: React.FC = () => {
  const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
  // simply toggle whether or not the account panel is open
  const handleClickAccount = () => {
    const oldValue = accountDrawerOpen;
    // complement the boolean
    setAccountDrawerOpen(!oldValue);
  };

  const headerLinkSX = {
    textDecoration: "none",
    color: "white",
    px: 2,
    py: 1.5,
    borderRadius: 2,
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      transform: "translateY(-1px)",
    },
  };

  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: PurpleGradientSX,
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ px: { xs: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              {/* Left side */}
              <MusicNote
                sx={{
                  mr: 2,
                  fontSize: 32,
                  color: "white",
                  filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
                }}
              />
              <Link
                component={RouterLink}
                to="/"
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  "&:hover": {
                    opacity: 0.9,
                  },
                }}
              >
                <Typography
                  variant="h5"
                  component="div"
                  sx={{
                    fontWeight: 700,
                    color: "white",
                    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    mr: 2,
                  }}
                >
                  String Scribe
                </Typography>
              </Link>

              <Link component={RouterLink} to="/about" sx={headerLinkSX}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ fontWeight: 500 }}
                >
                  About
                </Typography>
              </Link>
              <Link component={RouterLink} to="/terms" sx={headerLinkSX}>
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ fontWeight: 500 }}
                >
                  Terms
                </Typography>
              </Link>
              <Link
                component={RouterLink}
                to="/subscriptions"
                sx={headerLinkSX}
              >
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ fontWeight: 500 }}
                >
                  Subscriptions
                </Typography>
              </Link>
              {/* Right side  */}
              <Box sx={{ display: "flex", ml: "auto", alignItems: "center" }}>
                <LoginButton />
                <IconButton onClick={handleClickAccount}>
                  <AccountBox sx={{ fontSize: 45 }} />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <AccountDrawer
        isOpen={accountDrawerOpen}
        setOpen={setAccountDrawerOpen}
      />
    </>
  );
};

export default Header;
