import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, CircularProgress } from "@mui/material";

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect, logout, isLoading } = useAuth0();

  const buttonStyle = {
    backgroundColor: "primary.light",
  };

  // pattern here is:
  // 1. handle loading state
  // 2. else handle authenticated state
  // 3. else handle unauthenticated state

  const handleClick = () => {
    if (isLoading) {
      // do nothing
      return;
    } else if (isAuthenticated) {
      logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      loginWithRedirect();
    }
  };

  const getButtonText = (): string => {
    if (isLoading) {
      return "";
    } else if (isAuthenticated) {
      return "Log Out";
    } else {
      return "Log In";
    }
  };

  return (
    <Box>
      <Button
        variant="contained"
        onClick={handleClick}
        sx={buttonStyle}
        endIcon={
          isLoading ? <CircularProgress size={20} color="inherit" /> : null
        }
      >
        {getButtonText()}
      </Button>
    </Box>
  );
};

export default LoginButton;
