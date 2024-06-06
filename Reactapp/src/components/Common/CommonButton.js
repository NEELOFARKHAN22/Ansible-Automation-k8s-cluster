import styled from "@emotion/styled";
import { Button } from "@mui/material";

export const CommonButton = styled(Button)(
  {},
  ({ fz, bg, fc, pd, brdr, fw, mr, mfz, br, fcHover, bgHover }) => ({
    fontFamily: "Rubik, sans-serif",
    width: "fit-content",
    fontWeight: fw || 400,
    fontSize: fz || "1em",
    fontStyle: "normal",
    margin: mr || "auto",
    lineHeight: "normal",
    background: bg || "#0FAE96",
    color: fc || "#fff",
    padding: pd || "10px 20px",
    borderRadius: br || "8px",
    border: brdr || "none",
    textTransform: "initial",
    "&:hover": {
      color: fcHover || "#fff",
      background: bgHover || "#0FAE96",
    },
    "@media screen and (max-width: 756px)": {
      fontSize: mfz || "14px",
    },
  })
);
