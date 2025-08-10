import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  isLoading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  isLoading = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [agreedToTOS, setAgreedToTOS] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("audio/")) {
      alert("Please select an audio file");
    } else if (!agreedToTOS) {
      alert("you must agree to the terms of service");
    } else {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 4,
        textAlign: "center",
        border: dragActive
          ? "2px dashed #667eea"
          : "2px dashed rgba(102, 126, 234, 0.3)",
        backgroundColor: dragActive ? "rgba(102, 126, 234, 0.05)" : "white",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          borderColor: "rgba(102, 126, 234, 0.6)",
          backgroundColor: "rgba(102, 126, 234, 0.02)",
        },
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CloudUpload
        sx={{
          fontSize: 64,
          color: dragActive ? "#667eea" : "#9e9e9e",
          mb: 3,
          transition: "all 0.3s ease",
          filter: dragActive
            ? "drop-shadow(0 4px 8px rgba(102, 126, 234, 0.3))"
            : "none",
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
        Upload Audio File
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
        Drag and drop an audio file here, or click to browse.
      </Typography>

      <input
        accept="audio/*"
        style={{ display: "none" }}
        id="audio-file-input"
        type="file"
        onChange={handleFileInput}
        disabled={isLoading || !agreedToTOS}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControlLabel
          control={
            <Checkbox
              checked={agreedToTOS}
              onChange={(e) => setAgreedToTOS(e.target.checked)}
              color="primary"
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 24,
                },
                "&.Mui-checked": {
                  color: "#667eea",
                },
              }}
            />
          }
          label={
            <Typography variant="body2" color="text.secondary">
              I agree to the{" "}
              <Link
                component={RouterLink}
                to="/terms"
                sx={{
                  color: "#667eea",
                  textDecoration: "underline",
                  fontWeight: 500,
                  "&:hover": {
                    color: "#5a6fd8",
                  },
                }}
              >
                Terms of Service
              </Link>
            </Typography>
          }
          sx={{ mb: 3 }}
        />

        <label htmlFor="audio-file-input">
          <Button
            variant="contained"
            component="span"
            disabled={isLoading || !agreedToTOS}
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
              "&:disabled": {
                background: "#e0e0e0",
                color: "#9e9e9e",
                boxShadow: "none",
                transform: "none",
              },
            }}
          >
            Choose File
          </Button>
        </label>
      </Box>

      {isLoading && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: "rgba(102, 126, 234, 0.05)",
            borderRadius: 2,
          }}
        >
          <LinearProgress
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(102, 126, 234, 0.1)",
              "& .MuiLinearProgress-bar": {
                borderRadius: 4,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              },
            }}
          />
          <Typography
            variant="body2"
            color="primary"
            sx={{
              mt: 2,
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            Processing {selectedFile?.name || "audio file..."}
          </Typography>
        </Box>
      )}

      {selectedFile && !isLoading && (
        <Box
          sx={{
            mt: 4,
            p: 3,
            backgroundColor: "rgba(76, 175, 80, 0.05)",
            borderRadius: 2,
            border: "1px solid rgba(76, 175, 80, 0.2)",
          }}
        >
          <Typography
            variant="body2"
            color="success.main"
            sx={{ fontWeight: 500, mb: 1 }}
          >
            ✓ Selected: {selectedFile.name}
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block" }}
          >
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
