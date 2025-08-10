import React from "react";
import { AppBar, Toolbar, Typography, Box, Link } from "@mui/material";
import { MusicNote } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

const Header: React.FC = () => {
  return (
    <AppBar position="static" sx={{ mb: 3 }}>
      <Toolbar>
        <MusicNote sx={{ mr: 2 }} />
        <Link
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              textDecoration: "none",
            },
          }}
        >
          <Typography variant="h6" component="div">
            String Scribe
          </Typography>
        </Link>

        <Link
          component={RouterLink}
          to="/terms"
          sx={{
            textDecoration: "none",
            ml: 2,
            color: "inherit",
            "&:hover": {
              textDecoration: "none",
            },
          }}
        >
          <Typography variant="body1" component="div">
            Terms
          </Typography>
        </Link>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
