import styled from "@emotion/styled";
import { Box } from "@mui/material";
import { CommonButton } from "../../components/Common/CommonButton";

export const LeftConatiner = styled.div`
  display: flex;
  gap: 42px;
  align-items: center;
  @media screen and (max-width: 1475px) {
    display: flex;
    flex-direction: column;
    align-items: baseline;
    width: fit-content;
    gap: 65px;
  }
  img {
    width: 171px;
    height: 65px;
    @media screen and (max-width: 600px) {
      height: 50px;
      width: auto;
    }
  }
`;

export const RightContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  @media screen and (max-width: 800px) {
    height: fit-content;
    gap: 0px;
  }
`;

export const HeaderText = styled.div(
  {},
  ({ color }) => `
  font-size: 24px;
  line-height: 36px;
  font-weight: 400;
  color: ${color};
  :hover {
    cursor: pointer;
    color: #1dd773;
  }
  @media screen and (max-width: 1024px) {
    font-size: 18px;
    line-height: normal;
  }
`
);

export const MainBox = styled(Box)(
  {},
  ({ mode }) => `
    background: ${
        mode === "dark"
          ? `url('/images/dark mode.jpg') no-repeat center center/cover`
          : `url('/images/light mode.jpg') no-repeat center center/cover`
      };
`
);

export const StyledButton = styled(CommonButton)`
  @media screen and (max-width: 1024px) {
    font-size: 20px;
    padding: 10px 20px;
  }
  @media screen and (max-width: 768px) {
    font-size: 16px;
  }
  @media screen and (max-width: 468px) {
    font-size: 14px;
    padding: 10px 10px;
  }
`;
