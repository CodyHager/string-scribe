import { Star } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// this is the pop-up modal that prompts a user to subscribe

interface PaywallDialogProps {
  // message to display in the dialog
  message: string;
  // whether the dialog is open
  open: boolean;
  // react state fn for setting the dialog open/closed
  setOpen: (value: boolean) => void;
}

const PaywallDialog: React.FC<PaywallDialogProps> = ({
  message,
  open,
  setOpen,
}) => {
  // used to navigate to different pages
  const navigate = useNavigate();
  return (
    <Dialog open={open} onClose={() => setOpen(false)} sx={{ p: 5 }}>
      {/* // dialog title */}
      <DialogTitle textAlign="center" fontWeight={600}>
        Pro Subscription Required
      </DialogTitle>
      <DialogContent>
        <Divider />
        <Typography color="text.secondary">{message}</Typography>
        {/* // button that navigates to subscriptions page  */}
        <Button
          onClick={() => navigate("/subscriptions")}
          startIcon={<Star />}
          variant="contained"
          sx={{
            width: "300px",
            mx: "auto",
            mt: 2,
            // keeps the icon from wrapping to the top
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          View Subscriptions
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default PaywallDialog;
