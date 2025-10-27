import { Box, Button, Container, Typography } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import { BACKEND_BASE } from "../config";

const Subscriptions: React.FC = () => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <Container>
      {isAuthenticated && user && user.sub !== "" ? (
        <form action={`${BACKEND_BASE}/create-checkout-session`} method="POST">
          <input type="hidden" name="id" value={user.sub!} />
          <Button type="submit" variant="contained">
            Checkout
          </Button>
        </form>
      ) : (
        <Box display="flex" flexDirection="column">
          <Typography variant="h6" component="h6" align="center" gutterBottom>
            Please sign in to subscribe.
          </Typography>
          <Box sx={{ m: "auto" }}>
            <LoginButton />
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default Subscriptions;
