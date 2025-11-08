import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "../components/LoginButton";
import { BACKEND_BASE } from "../config";
import SubListItem from "../components/SubListItem";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import { IsPro } from "../util";
import SubscriptionMessages from "../components/SubscriptionMessages";

const Subscriptions: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth0();

  if (isLoading) {
    // handle loading state
    return (
      <Box textAlign="center">
        <CircularProgress sx={{ mt: 4 }}></CircularProgress>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        mt: 2,
      }}
    >
      {isAuthenticated && user && user.sub !== "" ? (
        // Authenticated state
        <Stack sx={{ width: "100%", textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              flexShrink: 0,
              gap: 3,
              justifyContent: "center",
              width: "100%",
              alignItems: "flex-start",
            }}
          >
            {/* First card  */}
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "30%",
                p: 3,
              }}
            >
              <Typography variant="h3" textAlign="center">
                Free Subscription
              </Typography>
              <Divider sx={{ mb: 2, width: "100%" }} />
              <Box
                component="img"
                alt="Free plan icon"
                src="free-tier.svg"
                sx={{
                  height: 250,
                  mb: 3,
                  objectFit: "contain",
                }}
              />
              <Box textAlign="left">
                <SubListItem
                  itemText="Three free transcriptions"
                  Icon={<DoDisturbOnIcon color="warning" />}
                />
                <SubListItem
                  itemText="No Transcriptions via YouTube link"
                  Icon={<CancelIcon color="error" />}
                />
                <SubListItem
                  itemText="No Custom transcription features"
                  Icon={<CancelIcon color="error" />}
                />
              </Box>
              <Typography variant="h4" gutterBottom>
                Monthly Cost: Free
              </Typography>
              <Button type="submit" variant="contained" disabled>
                Free plan activated
              </Button>
            </Paper>
            {/* Second card  */}
            <Paper
              elevation={2}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                minWidth: "30%",
                p: 3,
              }}
            >
              <Typography variant="h3" textAlign="center">
                Upgrade to Pro
              </Typography>
              <Divider sx={{ mb: 2, width: "100%" }} />
              <Box
                component="img"
                alt="Pro plan icon"
                src="pro-tier.svg"
                sx={{
                  height: 250,
                  mb: 3,
                  objectFit: "contain",
                }}
              />
              <Box textAlign="left">
                <SubListItem
                  itemText="Unlimited transcriptions"
                  Icon={<CheckCircleIcon color="success" />}
                ></SubListItem>
                <SubListItem
                  itemText="Transcriptions via YouTube link (coming soon!)"
                  Icon={<CheckCircleIcon color="success" />}
                ></SubListItem>
                <SubListItem
                  itemText="Custom transcription features (coming soon!)"
                  Icon={<CheckCircleIcon color="success" />}
                ></SubListItem>
              </Box>
              <Typography variant="h4" gutterBottom>
                Monthly Cost: $5.99
              </Typography>
              <form
                action={`${BACKEND_BASE}/api/v1/create-checkout-session`}
                method="POST"
              >
                <input type="hidden" name="id" value={user.sub!} />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={IsPro(user)}
                >
                  {IsPro(user) ? "Pro plan activated" : "Go Pro"}
                </Button>
              </form>
            </Paper>
          </Box>
          <SubscriptionMessages />
        </Stack>
      ) : (
        // Unauthenticated state: user must sign in before they can subscribe
        <Box textAlign="center">
          <Typography variant="h4" component="h4" gutterBottom>
            Please sign in to view subscriptions.
          </Typography>
          <Box sx={{ m: "auto" }}>
            <LoginButton />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Subscriptions;
