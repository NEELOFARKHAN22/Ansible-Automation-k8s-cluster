import * as React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export default function CommonPopover(props) {
  const { content, open, onClose, anchorEl } = props || "";

  return (
    <Popover
      open={open}
      onClose={onClose}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        horizontal: "right",
      }}
    >
      <Typography>{content}</Typography>
    </Popover>
  );
}
