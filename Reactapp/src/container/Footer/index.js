import { Box } from "@mui/material";
import React from "react";
import { HeaderTypography } from "../../components/Common/CommonTypography";
import {
  HiddenOnMobile,
  ResponsiveHeaderTypography,
  WrapperFirst,
  WrapperSecond,
  WrapperThird,
  WrapperBox,
} from "./Styled";
import { useTheme } from "@mui/material/styles";

const FooterData = [
  { site: "utxo.meme", url: "http://utxo.meme/" },
  { site: "src20utxo.com", url: "http://src20utxo.com/" },
  { site: "src20utxo.app", url: "http://src20utxo.app/" },
];
const FooterPreData = ["Docs", "Github", "Gitbook"];
const FooterPreSouce = [
  {
    text: "Twitter",
    light: "social",
    dark: "social-dark",
    url: "https://twitter.com/src20_utxo?s=21&t=g5wuAI1cMd7gYWAGUbZEIg",
  },
  {
    text: "Telegram",
    light: "social-2",
    dark: "social-2-dark",
    url: "https://t.me/UTXO_SRC20",
  },
  {
    text: "Discord",
    light: "social-3",
    dark: "social-3-dark",
    url: "",
  },
];

const Footer = () => {
  const theme = useTheme();
  const handleButtonClick = (text, url) => {
    if (text !== "Discord") {
      window.open(url, "_blank");
    }
  };

  return (
    <Box
      bgcolor={theme?.palette?.primary?.contrastText}
      position={"relative"}
      zIndex={"1"}
      display={"flex"}
      justifyContent={"center"}
      width={"100%"}
    >
      <Box
        maxWidth={"1440px"}
        bgcolor={theme?.palette?.primary?.contrastText}
        // margin={"auto"}
        display="flex"
        width={"100%"}
        justifyContent="space-between"
        position={"relative"}
        zIndex={"1"}
        padding="25px 0px"
        margin="0% 10%"
        columnGap={"35px"}
      >
        <Box>
          <WrapperFirst
            src={
              theme?.palette?.mode === "light"
                ? "/images/footer-logo.svg"
                : "/images/logo-dark.svg"
            }
            alt="icon"
          ></WrapperFirst>

          <Box
            margin="29px 0px 10px"
            height="fit-content"
            display="flex"
            alignItems="center"
            gap="13px"
          >
            <WrapperSecond
              src={
                theme?.palette?.mode === "light"
                  ? "/images/discord.svg"
                  : "/images/discord-dark.svg"
              }
              alt="icon"
            ></WrapperSecond>
            <WrapperSecond
              src={
                theme?.palette?.mode === "light"
                  ? "/images/tweeter.svg"
                  : "/images/tweeter-dark.svg"
              }
              alt="icon"
              onClick={() =>
                window.open(
                  "https://twitter.com/src20_utxo?s=21&t=g5wuAI1cMd7gYWAGUbZEIg",
                  "_blank"
                )
              }
            ></WrapperSecond>
          </Box>
          <ResponsiveHeaderTypography fz="1em" fc="#fff">
            Credit by: utxo.meme
          </ResponsiveHeaderTypography>
        </Box>
        <HiddenOnMobile display={"flex"}>
          <Box>
            {/* <img src="/images/resouce.svg" alt="icon"></img> */}
            <HeaderTypography
              fz="1.063em"
              fc="#fff"
              fw="600"
              marginBottom={"15px"}
            >
              Source
            </HeaderTypography>
            {FooterPreSouce?.map((item) => {
              return (
                <>
                  <WrapperBox
                    display={"flex"}
                    columnGap={"10px"}
                    onClick={() => handleButtonClick(item.text, item?.url)}
                  >
                    <img
                      src={`/images/${
                        theme?.palette?.mode === "light"
                          ? item?.light
                          : item?.dark
                      }.svg`}
                      alt="icon"
                    ></img>
                    <WrapperThird className="mobile-footer">
                      {item.text}
                    </WrapperThird>
                  </WrapperBox>
                </>
              );
            })}
          </Box>
          <Box>
            <HeaderTypography
              fz="1.063em"
              fc="#fff"
              fw="600"
              marginBottom={"15px"}
            >
              Resource
            </HeaderTypography>
            {FooterPreData?.map((item) => {
              return <WrapperThird>{item}</WrapperThird>;
            })}
          </Box>
          <Box>
            <Box marginBottom={"15px"}>
              <HeaderTypography fz="1.0625em" fc="#fff" fw="500">
                Website
              </HeaderTypography>
            </Box>

            {FooterData?.map((item) => {
              return (
                <WrapperThird onClick={() => window.open(item?.url, "_blank")}>
                  {item?.site}
                </WrapperThird>
              );
            })}
          </Box>
        </HiddenOnMobile>
      </Box>
      {theme?.palette?.mode === "dark" && window.innerWidth > 756 && (
        <Box
          width={"681.67px"}
          height={"300px"}
          position={"absolute"}
          left="0"
          bottom={"220px"}
        >
          <img
            src="/images/shadow-bottom.png"
            alt="logo"
            width={"100%"}
            height={"100%"}
          />
        </Box>
      )}
    </Box>
  );
};

export default Footer;
