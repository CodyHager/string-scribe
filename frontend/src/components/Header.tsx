import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Link,
  Container,
} from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Header: React.FC = () => {
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
    <AppBar
      position="static"
      elevation={0}
      sx={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ px: { xs: 0 } }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
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
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
