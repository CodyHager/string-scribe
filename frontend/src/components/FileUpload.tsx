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
    if (file.type.startsWith("audio/")) {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else {
      alert("Please select an audio file");
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
      elevation={2}
      sx={{
        p: 3,
        textAlign: "center",
        border: dragActive ? "2px dashed #1976d2" : "2px dashed #ccc",
        backgroundColor: dragActive ? "#f5f5f5" : "white",
        transition: "all 0.2s ease",
      }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <CloudUpload sx={{ fontSize: 48, color: "#666", mb: 2 }} />

      <Typography variant="h6" gutterBottom>
        Upload Audio File
      </Typography>

      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        Drag and drop an audio file here, or click to browse.
      </Typography>

      <input
        accept="audio/*"
        style={{ display: "none" }}
        id="audio-file-input"
        type="file"
        onChange={handleFileInput}
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
            />
          }
          label={
            <Typography variant="body2" color="textSecondary">
              I agree to the{" "}
              <Link component={RouterLink} to="/terms">
                Terms of Service
              </Link>
            </Typography>
          }
        />

        <label htmlFor="audio-file-input">
          <Button
            variant="contained"
            component="span"
            disabled={isLoading || !agreedToTOS}
          >
            Choose File
          </Button>
        </label>
      </Box>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
            Processing {selectedFile?.name || "audio file..."}
          </Typography>
        </Box>
      )}

      {selectedFile && !isLoading && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="primary">
            Selected: {selectedFile.name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

export default FileUpload;
