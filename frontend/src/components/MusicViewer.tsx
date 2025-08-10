import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { PictureAsPdf } from "@mui/icons-material";
import React, { useEffect, useState, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import generatePDF from "react-to-pdf";

interface MusicViewerProps {
  selectedMxml: string;
}

const MusicViewer = ({ selectedMxml }: MusicViewerProps) => {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const o = new OpenSheetMusicDisplay(containerRef.current);
      setOsmd(o);
    }
  }, []);

  useEffect(() => {
    if (osmd && selectedMxml && selectedMxml !== "") {
      const renderMusic = async () => {
        try {
          await osmd.load(selectedMxml);
          osmd.render();
        } catch (error) {
          console.error("Error rendering music:", error);
        }
      };
      renderMusic();
    }
  }, [osmd, selectedMxml]);

  const handleExportPdf = async () => {
    try {
      setIsExporting(true);
      const rawTitle =
        osmd?.GraphicSheet.Title.toString() || "string-scribe-export";
      // Clean the filename by removing parentheses and their contents, extra spaces, and file extensions
      const cleanTitle = rawTitle
        .replace(/\([^)]*\)/g, "") // Remove anything in parentheses
        .replace(/\.(mid|midi|mp3|wav|m4a|flac)$/i, "") // Remove common audio file extensions
        .replace(/\s+/g, " ") // Replace multiple spaces with single space
        .trim(); // Remove leading/trailing spaces
      const musicName = `${cleanTitle}.pdf`;
      await generatePDF(containerRef, { filename: musicName });
    } catch (error) {
      console.error("Error exporting PDF:", error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Container sx={{ width: "100%" }}>
      {selectedMxml !== "" && (
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Button
            variant="contained"
            startIcon={
              isExporting ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <PictureAsPdf />
              )
            }
            onClick={handleExportPdf}
            disabled={isExporting}
            sx={{
              background: "linear-gradient(135deg, #f50057 0%, #c51162 100%)",
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(245, 0, 87, 0.3)",
              "&:hover": {
                background: "linear-gradient(135deg, #e6004c 0%, #b30d56 100%)",
                boxShadow: "0 6px 24px rgba(245, 0, 87, 0.4)",
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
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </Box>
      )}

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          minHeight: "500px",
          border:
            selectedMxml !== "" ? "2px solid rgba(102, 126, 234, 0.2)" : "none",
          backgroundColor: selectedMxml !== "" ? "white" : "transparent",
          boxShadow:
            selectedMxml !== "" ? "0 4px 20px rgba(0, 0, 0, 0.08)" : "none",
          overflow: "hidden",
        }}
      >
        {selectedMxml === "" && (
          <Box
            sx={{
              p: 8,
              textAlign: "center",
              color: "text.secondary",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "500px",
            }}
          >
            <PictureAsPdf sx={{ fontSize: 64, color: "#e0e0e0", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Music Selected
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload an audio file to see the generated sheet music here
            </Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MusicViewer;
