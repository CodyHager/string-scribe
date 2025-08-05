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
            flexGrow: 1,
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
