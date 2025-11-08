import React from "react";
import { Box, Typography } from "@mui/material";

// Simple component for the list items on the subscription cards

interface SubListItemProps {
  itemText: string;
  Icon?: React.ReactNode;
}

const SubListItem: React.FC<SubListItemProps> = ({ itemText, Icon }) => {
  return (
    <Box display="flex" gap={1} sx={{ mb: 1 }}>
      {Icon}
      <Typography>{itemText}</Typography>
    </Box>
  );
};

export default SubListItem;
