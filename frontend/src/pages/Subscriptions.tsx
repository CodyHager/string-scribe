import { Button, Container } from "@mui/material";
import { BACKEND_BASE } from "../config";

const Subscriptions: React.FC = () => {
  return (
    <Container>
      <form action={`${BACKEND_BASE}/create-checkout-session`} method="POST">
        <Button
          type="submit"
          variant="contained"
          sx={{ backGroundColor: "primary.light" }}
        >
          Checkout
        </Button>
      </form>
    </Container>
  );
};

export default Subscriptions;
