import styled from "@emotion/styled";
import { Typography } from "@mui/material";

export const HeaderTypography = styled(Typography)({}, ({ fc, fz, fw }) => ({
  fontFamily: "Rubik, sans-serif",
  fontSize: fz || "1em",
  fontStyle: "normal",
  fontWeight: fw || "400",
  lineHeight: "normal",
  alignItems: "center",
  display: "flex",
  color: fc || "#2B2B2B",
}));
