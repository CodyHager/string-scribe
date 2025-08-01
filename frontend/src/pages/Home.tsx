import React from "react";
import { Container, Typography, Box } from "@mui/material";
import FileUpload from "../components/FileUpload";
import { UploadFile } from "../requests";

const Home: React.FC = () => {
  const handleFileSelect = async (file: File) => {
    UploadFile({ file: file })
      .then(() => {
        console.log("success");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          String Scribe
        </Typography>
        <Typography variant="body1" gutterBottom>
          Hello World! 🎻
        </Typography>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
          Upload Audio
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          Upload an audio file to generate violin sheet music
        </Typography>
        <FileUpload onFileSelect={handleFileSelect} />
      </Box>
    </Container>
  );
};

export default Home;
