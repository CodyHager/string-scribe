import { useAuth0 } from "@auth0/auth0-react";
import {
  Drawer,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Button,
} from "@mui/material";
import { IsPro } from "../util";
import { Navigate, useNavigate } from "react-router-dom";

interface AccountDrawerProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const AccountDrawer: React.FC<AccountDrawerProps> = ({ isOpen, setOpen }) => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const handleClickViewPlans = () => {
    // navigate to subscriptions page
    navigate("/subscriptions");
    // close panel
    setOpen(false);
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      anchor="right"
      PaperProps={{
        sx: {
          width: 420,
          padding: 3,
        },
      }}
    >
      <Box sx={{ padding: 2 }}>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h4" textAlign="center">
              Account Information
            </Typography>
            <Divider />
            {!isAuthenticated || !user ? (
              <Typography variant="body1">
                Log in to view your account.
              </Typography>
            ) : (
              <>
                <Typography variant="h6">Name: {user?.name}</Typography>
                <Typography variant="h6">Email: {user?.email}</Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
                >
                  <Typography variant="h6">
                    Subscription: {!IsPro(user) ? "Free Plan" : "Pro Plan"}
                  </Typography>
                  {IsPro(user) ? (
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        "&:hover": {
                          backgroundColor: "error.dark",
                        },
                      }}
                    >
                      Unsubscribe
                    </Button>
                  ) : (
                    <Button variant="contained" onClick={handleClickViewPlans}>
                      View Plans
                    </Button>
                  )}
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default AccountDrawer;
