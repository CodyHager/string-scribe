import { useAuth0 } from "@auth0/auth0-react";
import {
  Drawer,
  Typography,
  Box,
  Divider,
  CircularProgress,
  Button,
  Avatar,
  Chip,
  IconButton,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { Close, Person, Star, CreditCard, Upgrade } from "@mui/icons-material";
import { IsPro, PurpleGradientHoverSX, PurpleGradientSX } from "../util";
import { useNavigate } from "react-router-dom";
import { STRIPE_CUSTOMER_PORTAL } from "../config";

// AccountDrawer.tsx is the pop out when clicking the profile icon

interface AccountDrawerProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const AccountDrawer: React.FC<AccountDrawerProps> = ({ isOpen, setOpen }) => {
  const { user, isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const hasProSubscription = (): boolean => {
    // first, check if user is even signed in
    if (!isAuthenticated || isLoading || !user) {
      return false;
    }
    // check if user has pro role
    return IsPro(user);
  };

  const handleClickViewPlans = () => {
    // navigate to subscriptions page
    navigate("/subscriptions");
    // close panel
    setOpen(false);
  };

  // redirects to stripe customer portal
  const handleClickManageSubscription = () => {
    if (!STRIPE_CUSTOMER_PORTAL) {
      console.error("stripe customer portal not defined");
    } else {
      window.location.href = STRIPE_CUSTOMER_PORTAL;
      setOpen(false);
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={() => setOpen(false)}
      anchor="right"
      PaperProps={{
        sx: {
          width: 480,
        },
      }}
    >
      <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            background: PurpleGradientSX,
            color: "white",
            p: 3,
            position: "relative",
          }}
        >
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: "white",
            }}
          >
            <Close />
          </IconButton>
          <Typography variant="h5" gutterBottom>
            Account
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
          {/* loading state */}
          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 200,
              }}
            >
              <CircularProgress />
            </Box>
          ) : (
            // Unauthenticated state
            <>
              {!isAuthenticated || !user ? (
                <Card sx={{ backgroundColor: "#c9c9c9" }}>
                  <CardContent sx={{ textAlign: "center", py: 4 }}>
                    <Person
                      sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                    />
                    <Typography variant="h6" gutterBottom>
                      Not Signed In
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Please log in to view your account.
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                // Authenticated state
                <Stack spacing={3}>
                  {/* User Information */}
                  <Card elevation={2}>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          mb: 3,
                        }}
                      >
                        {/* Image from Auth0 */}
                        <Avatar
                          src={user.picture}
                          sx={{
                            width: 80,
                            height: 80,
                          }}
                        ></Avatar>
                        {/* Name and subscription status  */}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" gutterBottom>
                            {user.name}
                          </Typography>
                          <Chip
                            icon={hasProSubscription() ? <Star /> : <Person />}
                            label={
                              hasProSubscription() ? "Pro Plan" : "Free Plan"
                            }
                            // blue for pro subscriptoin
                            color={hasProSubscription() ? "primary" : "default"}
                            size="small"
                          />
                        </Box>
                      </Box>
                      <Divider sx={{ my: 2 }} />
                      {/* Email  */}
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontSize: 11 }}
                          >
                            EMAIL
                          </Typography>
                          <Typography variant="body1">{user.email}</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Subscription section */}
                  <Card elevation={2}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom>
                        Subscription
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 3 }}
                      >
                        {hasProSubscription()
                          ? "You're on the Pro plan with unlimited access to all features."
                          : "Upgrade to Pro for unlimited transcriptions and advanced features."}
                      </Typography>
                      {/* // Pro subscription state  */}
                      {hasProSubscription() ? (
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<CreditCard />}
                          onClick={handleClickManageSubscription}
                          sx={{
                            background: PurpleGradientSX,
                            "&:hover": {
                              background: PurpleGradientHoverSX,
                            },
                          }}
                        >
                          Manage Subscription
                        </Button>
                      ) : (
                        // Unsubscribed (but signed in) state
                        <Button
                          variant="contained"
                          fullWidth
                          startIcon={<Upgrade />}
                          onClick={handleClickViewPlans}
                          sx={{
                            background: PurpleGradientSX,
                            "&:hover": {
                              background: PurpleGradientHoverSX,
                            },
                          }}
                        >
                          View Plans & Upgrade
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </Stack>
              )}
            </>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};

export default AccountDrawer;
