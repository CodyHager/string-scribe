import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button } from "@mui/material";

const LoginButton = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const buttonStyle = {
    backgroundColor: "primary.light",
  };

  return (
    <Box>
      {!isAuthenticated ? (
        <Button
          variant="contained"
          onClick={() => loginWithRedirect()}
          sx={buttonStyle}
        >
          Log In
        </Button>
      ) : (
        <Button
          variant="contained"
          onClick={() =>
            logout({ logoutParams: { returnTo: window.location.origin } })
          }
          sx={buttonStyle}
        >
          Log Out
        </Button>
      )}
    </Box>
  );
};

export default LoginButton;
