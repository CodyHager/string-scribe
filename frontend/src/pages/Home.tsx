import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import FileUpload from "../components/FileUpload";
import Header from "../components/Header";
import { UploadFile } from "../requests";
import MusicViewer from "../components/MusicViewer";

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mxml, setMxml] = useState("");

  const handleFileSelect = async (file: File) => {
    setIsLoading(true);
    UploadFile({ file: file })
      .then((resp) => {
        if (resp.data?.mxml) {
          setMxml(resp.data.mxml);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mb: 2 }}>
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
            Upload Audio
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Upload an audio file to generate violin sheet music
          </Typography>
          <FileUpload onFileSelect={handleFileSelect} isLoading={isLoading} />
        </Box>
      </Container>
      <MusicViewer selectedMxml={mxml}></MusicViewer>
    </>
  );
};

export default Home;
