import { Container, Box } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface MusicViewerProps {
  selectedMxml: string;
}

const MusicViewer = ({ selectedMxml }: MusicViewerProps) => {
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);
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

  return (
    <Container
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
    </Container>
  );
};

export default MusicViewer;
