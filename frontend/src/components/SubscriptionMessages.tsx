import { Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import { useSearchParams } from "react-router-dom";

// displays messages on the subscriptions page based on the URL params
// success=true: displays success message
// success=false: displays error message
// neither: displays nothing

const messageBoxSX = {
  display: "flex",
  alignItems: "center",
  width: 400,
  mx: "auto",
  mt: 5,
};

const SubscriptionMessages: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  if (!searchParams.get("success")) {
    // param not present
    return null;
  } else if (searchParams.get("success") == "true") {
    // success=true
    return (
      <Box sx={{ ...messageBoxSX, backgroundColor: "#22c746" }}>
        <CheckIcon sx={{ ml: 2 }} />
        <Typography variant="h4" sx={{ mx: "auto" }}>
          Subscription Successful!
        </Typography>
      </Box>
    );
  } else if (searchParams.get("success") == "false") {
    // success=false
    return (
      <Box sx={{ ...messageBoxSX, backgroundColor: "#d63848" }}>
        <ErrorIcon sx={{ ml: 2 }} />
        <Typography variant="h4" sx={{ mx: "auto" }}>
          Failed to create subscription.
        </Typography>
      </Box>
    );
  }
  return null;
};

export default SubscriptionMessages;
