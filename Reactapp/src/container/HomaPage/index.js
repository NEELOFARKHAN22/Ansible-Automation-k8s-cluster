import { Box, useTheme } from "@mui/material";
import React from "react";
import Header from "../Header";
import Footer from "../Footer";
import ContentBox from "./ContentBox";
import { HomeCardsData } from "./content";
import {
  JoinTelegramButton,
  StyledBox,
  StyledImage,
  UtxoImage,
} from "./styled";
import { HeaderTypography } from "../../components/Common/CommonTypography";
import { MainBox } from "../Header/Styled";

const HomePage = () => {
  const theme = useTheme();

  return (
    <MainBox mode={theme?.palette?.mode}>
      <Header />
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={"72px"}
        alignItems={"center"}
        sx={{
          "@media screen and (max-width: 1024px)": {
            gap: "40px",
          },
        }}
      >
        <Box
          display={"flex"}
          padding={"0px 0px 0px 112px"}
          maxWidth={"1440px"}
          sx={{
            "@media screen and (max-width: 1024px)": {
              padding: "0px 0px 0px 60px",
            },
            "@media screen and (max-width: 768px)": {
              padding: "0px 0px 0px 40px",
            },
            "@media screen and (max-width: 468px)": {
              padding: "20px 0 20px 20px",
              alignItems: "flex-start",
            },
          }}
        >
          <Box>
            <HeaderTypography
              fz="64px"
              fw="600"
              fc={theme?.palette?.primary?.typography}
              sx={{
                "@media screen and (max-width: 1024px)": {
                  fontSize: "48px",
                },
                "@media screen and (max-width: 768px)": {
                  fontSize: "32px",
                },
                "@media screen and (max-width: 468px)": {
                  fontSize: "28px",
                },
              }}
            >
              <HeaderTypography style={{ display: "contents" }} fc="#1DD773">
                UTXO&nbsp;
              </HeaderTypography>{" "}
              IS WAY MORE THAN JUST AN UTXO ON BITCON
            </HeaderTypography>
            <JoinTelegramButton
              variant="contained"
              endIcon={
                <img src="/images/telegram.svg" alt="telegram" height="40" />
              }
              onClick={() => window.open("https://t.me/UTXO_SRC20", "_blank")}
            >
              Join us on Telegram
            </JoinTelegramButton>
          </Box>
          <UtxoImage src="/images/utxo1.svg" alt="UTXO" />
        </Box>
        {HomeCardsData?.map((item) => (
          <StyledBox
            display={"flex"}
            gap={"53px"}
            padding={"72px 112px"}
            alignItems={"center"}
          >
            <StyledImage src={item?.imageUrl} alt="UTXO" />
            <ContentBox data={item} theme={theme} />
          </StyledBox>
        ))}
      </Box>
      <Footer />
    </MainBox>
  );
};

export default HomePage;
