import React, { useState } from "react";
import { Container, Typography, Box, Divider } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import FileUpload from "../components/FileUpload";
import YouTubeUpload from "../components/YouTubeUpload";
import { UploadFile, UploadYouTube } from "../requests";
import MusicViewer from "../components/MusicViewer";
import { IsPro } from "../util";

const Home: React.FC = () => {
  const { user } = useAuth0();
  const [isLoading, setIsLoading] = useState(false);
  const [mxml, setMxml] = useState("");
  const [midi, setMidi] = useState("");
  const isPremium = user ? IsPro(user) : false;

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
        // Handle rate limit error
        if (error.response?.status === 429) {
          alert("Translation limit reached. Please subscribe for unlimited access or try again later.");
        } else {
          alert("An error occurred while processing your file. Please try again.");
        }
      })
      .finally(() => {
        // remove loading state
        setIsLoading(false);
      });
  };

  const handleYouTubeSubmit = async (url: string) => {
    // check if user is logged in
    if (!user?.sub) {
      alert("Please log in to use YouTube transcription");
      return;
    }

    // update loading state
    setIsLoading(true);
    // send YouTube URL to backend for processing
    UploadYouTube(url, user.sub)
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
        // Handle different error types
        if (error.response?.status === 403) {
          alert("YouTube transcription is only available for premium subscribers. Please upgrade your account.");
        } else if (error.response?.status === 429) {
          alert("Translation limit reached. Please try again later.");
        } else {
          alert("An error occurred while processing the YouTube video. Please try again.");
        }
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
            Upload an audio file or paste a YouTube URL to generate beautiful violin sheet music using
            AI-powered transcription
          </Typography>
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
          
          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>
          
          <YouTubeUpload 
            onUrlSubmit={handleYouTubeSubmit} 
            isLoading={isLoading}
            isPremium={isPremium}
          />
        </Box>
      </Container>
      <Container maxWidth="lg">
        <MusicViewer selectedMxml={mxml} selectedMidi={midi} />
      </Container>
    </Box>
  );
};

export default Home;