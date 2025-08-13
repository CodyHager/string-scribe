import {
  Container,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import { PictureAsPdf, PlayArrow, StopCircle } from "@mui/icons-material";
import { useEffect, useState, useRef, SetStateAction } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import generatePDF from "react-to-pdf";
import { Midi } from "@tonejs/midi";
import * as Tone from "tone";
import { DecodeBase64Data } from "../util";
interface MusicViewerProps {
  selectedMxml: string;
  //   selectedMidi: Uint8Array;
  selectedMidi: string; //base64 string
}

const MusicViewer = ({ selectedMxml, selectedMidi }: MusicViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [osmd, setOsmd] = useState<OpenSheetMusicDisplay | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isPlayingMidi, setIsPlayingMidi] = useState(false);
    const [activeNotes, setActiveNotes] = useState<string[]>([]);

  // Violin sampler using FluidR3 soundfont
  const violinSampler = new Tone.Sampler({
    urls: {
      C4: "C4.mp3",
      E4: "E4.mp3",
      G4: "G4.mp3",
      C5: "C5.mp3",
    },
    baseUrl:
      "https://gleitz.github.io/midi-js-soundfonts/FluidR3_GM/violin-mp3/",
    release: 1,
  }).toDestination();

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

  const handlePlayMidi = async () => {
    if (!isPlayingMidi) {
      setIsPlayingMidi(true);

      const midiBytes = DecodeBase64Data(selectedMidi);
      const midi = new Midi(midiBytes);
      const now = Tone.now() + 0.5;
      let notes: string[] = [];
      midi.tracks.forEach((track) => {
        //create a synth for each track
        // const synth = new Tone.PolySynth(Tone.Synth, {
        //   envelope: {
        //     attack: 0.02,
        //     decay: 0.1,
        //     sustain: 0.3,
        //     release: 1,
        //   },
        // }).toDestination();
        // synths.push(synth);
        //schedule all of the events
        track.notes.forEach((note) => {
          violinSampler.triggerAttackRelease(
            note.name,
            note.duration,
            note.time + now,
            note.velocity
          );
          notes.push(note.name)
        });
    });
    setActiveNotes(notes)
    } else {
      // stop playing
      setIsPlayingMidi(false);
      violinSampler.triggerRelease(activeNotes);
      violinSampler.releaseAll(Tone.now())
      violinSampler.disconnect();
      violinSampler.dispose();
      setActiveNotes([])
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
          <Button
            variant="contained"
            startIcon={isPlayingMidi ? <StopCircle /> : <PlayArrow />}
            onClick={handlePlayMidi}
            sx={{
              background:
                "linear-gradient(135deg, #3429ff 0%,rgb(20, 0, 109) 100%)",
              fontSize: "1.1rem",
              px: 4,
              py: 1.5,
              borderRadius: 3,
              ml: 4,
              boxShadow: "0 4px 16px rgba(21, 0, 95, 0.99)",
              "&:hover": {
                background:
                  "linear-gradient(135deg, #3429ff 0%,rgb(17, 2, 85) 100%)",
                boxShadow: "0 4px 16px rgba(21, 0, 95, 0.47)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {!isPlayingMidi ? "Play Generated Music" : "Stop Generated Music"}
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
