import styled from "styled-components";
import { HeaderTypography } from "../../components/Common/CommonTypography";
import { Box } from "@mui/material";

export const WrapperFirst = styled.img`
  @media screen and (max-width: 654px) {
    width: 70%;
  }
`;
export const WrapperSecond = styled.img`
  cursor: pointer;
  @media screen and (max-width: 654px) {
    width: 15%;
    min-width: 28px;
  }
`;
export const WrapperThird = styled.div`
  cursor: pointer;
  height: 37px;
  display: flex;
  align-items: center;
  // margin-bottom: 9px;
  color: #fff;
  font-size: 1.25em;
  @media screen and (max-width: 654px) {
    font-size: 14px;
  }
`;

export const ResponsiveHeaderTypography = styled(HeaderTypography)`
  @media screen and (max-width: 654px) {
    font-size: 12px;
  }
`;

export const HiddenOnMobile = styled(Box)`
  column-gap: 73px;
  @media screen and (max-width: 510px) {
    column-gap: 7px !important;
    font-size: 12px;
  }
  @media screen and (max-width: 1000px) {
    column-gap: 50px;
  }
`;

export const WrapperBox = styled(Box)`
  cursor: pointer;
  @media screen and (max-width: 756px) {
    padding: 9px 0px 5px 0px;
    justify-content: center;
  }
`;
