import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Suspense } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import App from "./routes";
import LoadingBackdrop from "./components/Loader/LoaderBackdrop";
import { ThemeContextProvider, useThemeContext } from "./theme/theme";

// Define light and dark themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2B2B2B",
      light: "#ffffff",
      dark: "#ECF1F0",
      contrastText: "#0FAE96",
      menuItemText: "#2B2B2B",
      borderColor: "#34313114",
      popoverText: "#000000",
      popoverBg: "#EFEFEF",
      typography: '#121212'
    },
    secondary: {
      main: "#808080",
      light: "#ECF1F0",
      dark: "#000000",
      subHeading: "#808080",
      link: "#46A1F5",
      wallet: "#2B2B2B",
      tborderColor: "#CBCBCB",
      trowbg: "#FFFFFF",
      trow2bg: "#F5F6F9",
    },
    accent: {
      main: "#46A1F5",
      lightGrey: "#CCCCCC",
      placeholder: "#C6C6C6",
      grey: "#EFEFEF",
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#FFFFFF",
      light: "#191919",
      dark: "#202020",
      contrastText: "#171717",
      menuItemText: "#0FAE96",
      borderColor: "#FFFFFF14",
      popoverText: "#FFFFFF",
      popoverBg: "#696969",
      typography: '#ffffff'
    },
    secondary: {
      main: "#ffffff",
      light: "#414141",
      dark: "#ffffff",
      subHeading: "#ECF1F0",
      link: "#ECF1F0",
      wallet: "#ECF1F0",
      tborderColor: "#9B9B9B",
      trowbg: "#242323",
      trow2bg: "#262525",
    },
    accent: {
      dark1: "#292929",
      dark2: "#3B3A3A",
      dark3: "#C6C6C6",
      dark4: "#191919",
    },
  },
});

const Root = () => {
  const { theme } = useThemeContext();

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <Suspense fallback={<LoadingBackdrop open={true} />}>
          <App />
        </Suspense>
      </ThemeProvider>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <ThemeContextProvider>
    <Root />
  </ThemeContextProvider>,
  document.getElementById("root")
);
