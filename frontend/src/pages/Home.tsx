import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import FileUpload from "../components/FileUpload";
import { UploadFile } from "../requests";
import MusicViewer from "../components/MusicViewer";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mxml, setMxml] = useState("");
  const [midi, setMidi] = useState("");

  const handleFileSelect = async (file: File) => {
    // update loading state
    setIsLoading(true);
    // send file to backend for processing
    UploadFile({ file: file })
      .then((resp) => {
        // set MXML and MIDI states
        if (resp.data?.mxml) {
          setMxml(resp.data.mxml);
        }
        if (resp.data?.midi) {
          setMidi(resp.data.midi);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        // remove loading state
        setIsLoading(false);
      });
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="md">
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 700,
            }}
          >
            Transform Audio to Sheet Music
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              fontWeight: 400,
              maxWidth: 600,
              ml: "auto",
              mr: "auto",
              lineHeight: 1.6,
            }}
          >
            Upload an audio file and generate beautiful violin sheet music using
            AI-powered transcription
          </Typography>
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        </Box>
      </Container>
      <Container maxWidth="lg">
        <MusicViewer selectedMxml={mxml} selectedMidi={midi} />
      </Container>
    </Box>
  );
};

export default Home;
