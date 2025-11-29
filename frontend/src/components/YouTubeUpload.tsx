import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  LinearProgress,
} from "@mui/material";
import { YouTube } from "@mui/icons-material";

interface YouTubeUploadProps {
  onUrlSubmit?: (url: string) => void;
  isLoading?: boolean;
  isPremium?: boolean;
}

const YouTubeUpload: React.FC<YouTubeUploadProps> = ({
  onUrlSubmit,
  isLoading = false,
  isPremium = false,
}) => {
  const [url, setUrl] = useState("");

  const handleSubmit = () => {
    if (!url.trim()) {
      alert("Please enter a YouTube URL");
      return;
    }
    if (!isPremium) {
      alert("YouTube transcription is only available for premium subscribers");
      return;
    }
    onUrlSubmit?.(url);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        border: "2px dashed rgba(102, 126, 234, 0.3)",
        backgroundColor: "white",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "rgba(102, 126, 234, 0.6)",
          backgroundColor: "rgba(102, 126, 234, 0.02)",
        },
      }}
    >
      <YouTube
        sx={{
          fontSize: 64,
          color: isPremium ? "#FF0000" : "#9e9e9e",
          mb: 3,
        }}
      />
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "text.primary",
          mb: 2,
        }}
      >
        YouTube URL {!isPremium && "(Premium Only)"}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
          lineHeight: 1.6,
          maxWidth: 400,
          mx: "auto",
        }}
      >
        {isPremium
          ? "Paste a YouTube URL to transcribe the audio directly"
          : "Upgrade to premium to transcribe YouTube videos"}
      </Typography>

      <Box sx={{ maxWidth: 500, mx: "auto" }}>
        <TextField
          fullWidth
          placeholder="https://www.youtube.com/watch?v=..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={isLoading || !isPremium}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "&:hover fieldset": {
                borderColor: "#667eea",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#667eea",
              },
            },
          }}
        />

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={isLoading || !isPremium}
          sx={{
            background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
            fontSize: "1.1rem",
            px: 4,
            py: 1.5,
            borderRadius: 3,
            boxShadow: "0 4px 16px rgba(255, 0, 0, 0.3)",
            "&:hover": {
              background: "linear-gradient(135deg, #CC0000 0%, #990000 100%)",
              boxShadow: "0 6px 24px rgba(255, 0, 0, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              background: "#e0e0e0",
              color: "#9e9e9e",
              boxShadow: "none",
              transform: "none",
            },
          }}
        >
          Transcribe YouTube Video
        </Button>
      </Box>

      {isLoading && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: "rgba(255, 0, 0, 0.05)",
            borderRadius: 2,
          }}
        >
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(255, 0, 0, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: "linear-gradient(135deg, #FF0000 0%, #CC0000 100%)",
              },
            }}
          />
          <Typography
            variant="body2"
            sx={{
              mt: 2,
              fontWeight: 500,
              textAlign: "center",
              color: "#CC0000",
            }}
          >
            Downloading and processing YouTube video...
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default YouTubeUpload;
