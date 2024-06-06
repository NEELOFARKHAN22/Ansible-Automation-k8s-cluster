import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Box } from "@mui/material";
import { HeaderTypography } from "./CommonTypography";
import styled from "@emotion/styled";

export const CustomMenu = styled(Menu)(({ bgColor }) => ({
  "&:hover": {
    backgroundColor: "transparent",
  },
}));
export const CustomMenuItem = styled(MenuItem)(() => ({
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

export default function CommonMenuItem(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { butonContent, theme } = props || "";
  const themeCheck = theme?.mode === "light" ? "#fff" : "rgb(48 46 46)";
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        {butonContent}
      </Button>
      <CustomMenu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <CustomMenuItem
          onClick={handleClose}
          style={{
            background: themeCheck,
          }}
        >
          <HeaderTypography
            fw="500"
            fz="1.25em"
            fc={theme?.primary?.menuItemText}
          >
            <img
              src={
                theme?.mode === "light"
                  ? "/images/low.svg"
                  : "/images/low_dark.svg"
              }
              alt="icon"
            ></img>
            Low: 14 sats/vB
          </HeaderTypography>
        </CustomMenuItem>
        <CustomMenuItem
          onClick={handleClose}
          style={{
            background: themeCheck,
          }}
        >
          <HeaderTypography
            fw="500"
            fz="1.25em"
            fc={theme?.primary?.menuItemText}
          >
            <img
              src={
                theme?.mode === "light"
                  ? "/images/standard.svg"
                  : "/images/standard_dark.svg"
              }
              alt="icon"
            ></img>
            Standard: 15 sats/vB
          </HeaderTypography>
        </CustomMenuItem>
        <CustomMenuItem
          onClick={handleClose}
          style={{
            background: themeCheck,
          }}
        >
          <HeaderTypography
            fw="500"
            fz="1.25em"
            fc={theme?.primary?.menuItemText}
          >
            <img
              src={
                theme?.mode === "light"
                  ? "/images/high.svg"
                  : "/images/high_dark.svg"
              }
              alt="icon"
            ></img>
            High: 16 sats/vB
          </HeaderTypography>
        </CustomMenuItem>
      </CustomMenu>
    </Box>
  );
}
