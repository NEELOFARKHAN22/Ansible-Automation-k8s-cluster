import styled from "styled-components";
import { Box, Button } from "@mui/material";

export const PrimaryButton = styled(Button)`
  border: 2px solid #05b858 !important;
  border-radius: 16px !important;
  padding: 12px 31.5px !important;
  font-size: 24px !important;
  line-height: 36px !important;
  font-weight: 400 !important;
  color: #05b858 !important;
  width: fit-content;
  @media screen and (max-width: 1024px) {
    padding: 10px 20px !important;
    font-size: 18px !important;
    line-height: normal !important;
  }
  @media screen and (max-width: 768px) {
    font-size: 14px !important;
  }
  &:hover {
    color: #ffffff !important;
    background-color: #05b858 !important;
  }
`;

export const StyledBox = styled(Box)`
  max-width: 1440px;
  &:nth-child(odd) {
    flex-direction: row-reverse;
  }
  @media screen and (max-width: 1024px) {
    padding: 60px !important;
    gap: 50px !important;
  }
  @media screen and (max-width: 768px) {
    padding: 40px !important;
    gap: 20px !important;
  }
  @media screen and (max-width: 468px) {
    flex-direction: column !important;
    padding: 20px !important;
    align-items: flex-start !important;
  }
`;

export const JoinTelegramButton = styled(Button)`
  background-color: #06ff79 !important;
  box-shadow: none !important;
  border-radius: 16px !important;
  padding: 12px 16px !important;
  font-weight: 400 !important;
  font-size: 24px !important;
  line-height: 36px !important;
  color: #121212 !important;
  margin-top: 32px !important;
  white-space: nowrap;
  @media screen and (max-width: 1024px) {
    padding: 10px !important;
    font-size: 18px !important;
    line-height: normal !important;
  }
  @media screen and (max-width: 768px) {
    font-size: 14px !important;
  }
  @media screen and (max-width: 468px) {
    margin-top: 16px !important;
    .MuiButton-endIcon {
      margin-left: 4px !important;
      img {
        height: 20px;
      }
    }
  }
`;

export const UtxoImage = styled.img`
  height: 800px;
  @media screen and (max-width: 1200px) {
    height: 700px;
  }
  @media screen and (max-width: 1024px) {
    height: 400px;
  }
  @media screen and (max-width: 768px) {
    height: 250px;
  }
  @media screen and (max-width: 600px) {
    height: 150px;
  }
  @media screen and (max-width: 350px) {
    height: 120px;
  }
`;

export const StyledImage = styled.img`
  height: 435px;
  @media screen and (max-width: 820px) {
    height: 300px;
  }
  @media screen and (max-width: 600px) {
    height: 200px;
  }
  @media screen and (max-width: 468px) {
    height: 150px;
  }
`;
