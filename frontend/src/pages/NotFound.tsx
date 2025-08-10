import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          mt: 12,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
        }}
      >
        <Typography
          variant="h1"
          component="h1"
          gutterBottom
          sx={{
            fontSize: "8rem",
            fontWeight: 700,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            filter: "drop-shadow(0 4px 8px rgba(102, 126, 234, 0.2))",
          }}
        >
          404
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 3,
          }}
        >
          Page Not Found
        </Typography>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 6,
            maxWidth: 500,
            lineHeight: 1.6,
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate("/")}
          size="large"
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(102, 126, 234, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
              boxShadow: "0 6px 24px rgba(102, 126, 234, 0.4)",
              transform: "translateY(-2px)",
            },
          }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
