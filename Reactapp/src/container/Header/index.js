import { Box } from "@mui/material";
import React, { useState } from "react";
import {
  HeaderText,
  LeftConatiner,
  RightContainer,
  StyledButton,
} from "./Styled";
import { useTheme } from "@mui/material/styles";
import ToggleButton from "../../components/ToggleButton/toggleButton";

const Header = () => {
  const [viewPopover, setViewPopover] = useState(false);
  const theme = useTheme();
  const [windowWidth, setWindowWidth] = React.useState(window?.innerWidth);

  React.useEffect(() => {
    function handleResize() {
      setWindowWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleButtonClick = () => {
    window.open('http://www.src20utxo.app/', '_blank');
  };

  return (
    <>
      <Box
        position={"relative"}
        zIndex={"1"}
        padding="42px 112px"
        gap={"10px"}
        sx={{
          "@media screen and (max-width: 1024px)": {
            padding: "42px 60px",
          },
          "@media screen and (max-width: 768px)": {
            padding: "42px 40px 20px",
          },
          "@media screen and (max-width: 468px)": {
            padding: "32px 12px 20px",
          },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          gap="30px"
          position={"relative"}
          zIndex={"1"}
          alignItems={"center"}
        >
          <LeftConatiner>
            <Box>
              {theme?.palette?.mode === "light" ? (
                <img src="/images/logo.svg" alt="logo"></img>
              ) : (
                <img src="/images/logo-dark-header.svg" alt="logo" />
              )}
            </Box>
          </LeftConatiner>
          {windowWidth > 600 && (
            <Box
              display={"flex"}
              gap={"74px"}
              sx={{
                "@media screen and (max-width: 1024px)": {
                  gap: "30px",
                },
              }}
            >
              <HeaderText color={theme?.palette?.primary?.typography}>
                Explore
              </HeaderText>
              <HeaderText color={theme?.palette?.primary?.typography}>
                Socials
              </HeaderText>
            </Box>
          )}
          <RightContainer>
            <Box>
              <ToggleButton />
            </Box>
            <Box id="header-pop">
              <StyledButton
                fz="24px"
                pd="12px 33.5px"
                br="16px"
                fc="#121212"
                fcHover="#121212"
                bg="#06FF79"
                bgHover="#06FF79"
                aria-describedby={viewPopover ? "simple-popover" : undefined}
                onClick={handleButtonClick}
              >
                Enter Dapp
              </StyledButton>
            </Box>
          </RightContainer>
        </Box>
        {windowWidth < 601 && (
          <Box
            display={"flex"}
            gap={"74px"}
            margin="10px 10px 0"
            sx={{
              "@media screen and (max-width: 1024px)": {
                gap: "30px",
              },
            }}
          >
            <HeaderText color={theme?.palette?.primary?.typography}>
              Explore
            </HeaderText>
            <HeaderText color={theme?.palette?.primary?.typography}>
              Socials
            </HeaderText>
          </Box>
        )}
      </Box>
    </>
  );
};

export default Header;
