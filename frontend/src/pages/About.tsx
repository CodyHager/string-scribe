import React from "react";
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const About: React.FC = () => {
  const h4Style = {
    color: "#667eea",
    fontWeight: 600,
    borderBottom: "2px solid rgba(102, 126, 234, 0.2)",
    pb: 1,
    mb: 3,
  };
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Box sx={{ textAlign: "center", mb: 6 }}>
        <Typography
          variant="h2"
          component="h1"
          gutterBottom
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 700,
            mb: 2,
          }}
        >
          About String Scribe
        </Typography>
      </Box>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{ lineHeight: 1.7, mb: 2 }}
      >
        String Scribe is a web app that transforms the way violinists learn and
        transcribe music. Whether you’re a beginner learning your first pieces
        or a professional musician arranging complex compositions, String Scribe
        helps you generate beautiful, accurate sheet music in seconds.
        <br />
        Built by musicians for musicians, our platform uses advanced audio
        processing and AI transcription to convert your playing or recordings
        into clear, professional-quality sheet music — tailored specifically for
        the violin. You can easily download your creations, making it the
        perfect tool for practice, and collaboration.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom sx={h4Style}>
        Why Choose String Scribe?
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <List dense sx={{ maxWidth: 600 }}>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    🎻 Violin-Specific Accuracy
                  </Box>{" "}
                  – Our transcription is fine-tuned for violin range, technique,
                  and notation.
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    ⚡ Fast & Easy
                  </Box>
                  – Upload your file and see the sheet music within seconds.
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    🌐 Accessible Anywhere
                  </Box>
                  – Works right in your browser, no downloads required.
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
        </List>
      </Box>
      <Typography variant="h4" component="h2" gutterBottom sx={h4Style}>
        Our Mission
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{ lineHeight: 1.7 }}
      >
        Ever wanted to learn to play a song on the violin, but you can't find
        the score or a tutorial anywhere? This is a very disappointing feeling.
        The only way to learn the song is to learn it by ear, which is time
        consuming (although also a good exercise). String Scribe is meant to aid
        violin players in this position,{" "}
        <Box component="span" fontWeight="fontWeightBold">
          not replacing the process of learning a song through hearing,{" "}
        </Box>
        but helping the player along the way. Automatic sheet music
        transcription is an area of ongoing research, so the sheet music
        generated from String Scribe will not be perfect. However, it can be
        close for most songs or parts of songs, allowing the player to fill in
        the gaps themselves.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom sx={h4Style}>
        Who we Serve
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{ lineHeight: 1.7, mb: 2 }}
      >
        We proudly support:
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <List dense sx={{ maxWidth: 600 }}>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Violin students{" "}
                  </Box>
                  seeking to practice from personalized sheet music
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Teachers{" "}
                  </Box>
                  creating exercises and arrangements for their students
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Professionals{" "}
                  </Box>
                  arranging or transcribing original works
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
          <ListItem sx={{ py: 0.5 }}>
            <ListItemText
              primary={
                <Typography>
                  <Box component="span" fontWeight="fontWeightBold">
                    Hobbyists{" "}
                  </Box>
                  exploring new music in a fun, intuitive way
                </Typography>
              }
              sx={{ "& .MuiListItemText-primary": { lineHeight: 1.6 } }}
            />
          </ListItem>
        </List>
      </Box>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{ lineHeight: 1.7, mb: 2 }}
      >
        Whether you’re arranging your own compositions, learning a new piece, or
        simply experimenting with sound, String Scribe can help you create
        violin sheet music.
      </Typography>
      <Typography variant="h4" component="h2" gutterBottom sx={h4Style}>
        Support
      </Typography>
      <Typography
        variant="body1"
        component="p"
        gutterBottom
        sx={{ lineHeight: 1.7, mb: 2 }}
      >
        You may reach out to{" "}
        <Link href="mailto:stringscribe@gmail.com">stringscribe@gmail.com</Link>{" "}
        for support or inquiries.
      </Typography>
    </Container>
  );
};

export default About;
