import { Container, Box, Button, CircularProgress } from "@mui/material";
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
        <Box sx={{ mb: 2, textAlign: "center" }}>
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
            sx={{ minWidth: 150 }}
          >
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
        </Box>
      )}

      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          minHeight: "400px",
          border: selectedMxml !== "" ? "1px solid #ccc" : "none",
          borderRadius: "4px",
        }}
      >
        {selectedMxml === "" && (
          <Box sx={{ p: 2, textAlign: "center", color: "text.secondary" }}>
            No music selected
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default MusicViewer;
