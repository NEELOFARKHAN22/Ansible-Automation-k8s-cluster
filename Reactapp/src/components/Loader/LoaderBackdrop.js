import React, { useState, useEffect } from "react";
import { Backdrop, CircularProgress } from "@mui/material";

const styles = {
  zIndex: 99999,
  color: "#fff"
};

export default function LoadingBackdrop(props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(props.open);
  }, [props]);

  return (
    <Backdrop style={styles} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}