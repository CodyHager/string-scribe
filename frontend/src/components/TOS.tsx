import { FormControlLabel, Checkbox, Typography, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface TOSProps {
  // whether or not the box is selected
  agreed: boolean;
  // React method for selecting the box
  setAgreed: (newValue: boolean) => void;
  // disables the checkbox
  disabled: boolean;
}

// this is a simple checkbox with a link to the TOS page

const TOS: React.FC<TOSProps> = ({ agreed, setAgreed, disabled }) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          disabled={disabled}
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          color="primary"
          sx={{
            "& .MuiSvgIcon-root": {
              fontSize: 24,
            },
            "&.Mui-checked": {
              color: "#667eea",
            },
          }}
        />
      }
      label={
        <Typography variant="body2" color="text.secondary">
          I agree to the{" "}
          <Link
            component={RouterLink}
            to="/terms"
            sx={{
              color: "#667eea",
              textDecoration: "underline",
              fontWeight: 500,
            }}
          >
            Terms of Service
          </Link>
        </Typography>
      }
      sx={{ mb: 3 }}
    />
  );
};

export default TOS;
