import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useThemeContext } from "../../theme/theme";

const MaterialUISwitch = styled(Switch)(({ theme }) => {
  return {
    width: 78,
    height: 37,
    padding: 0,
    margin: "0 !important",
    "& .MuiSwitch-track": {
      opacity: "1 !important",
      backgroundColor:
        theme.palette.mode === "dark"
          ? "#121212 !important"
          : "#06FF79 !important",
      borderRadius: 40,
      "&::before, &::after": {
        content: '""',
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        width: 28,
        height: 28,
      },
      "&::before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="28" width="28" viewBox="0 0 32 32"><path fill="${encodeURIComponent(
          "#FFD057"
        )}" d="M11.3309 5.98493L9.04 3.69635L7.24545 5.49909L9.52364 7.78767L11.3309 5.98493ZM7.81818 13.2215H4V15.7785H7.81818V13.2215ZM19.2727 0.5H16.7273V4.27169H19.2727V0.5ZM28.7545 5.49909L26.96 3.69635L24.6818 5.98493L26.4764 7.78767L28.7545 5.49909ZM24.6691 23.0151L26.9473 25.3164L28.7418 23.5137L26.4509 21.2251L24.6691 23.0151ZM28.1818 13.2215V15.7785H32V13.2215H28.1818ZM18 6.82877C13.7873 6.82877 10.3636 10.268 10.3636 14.5C10.3636 18.732 13.7873 22.1712 18 22.1712C22.2127 22.1712 25.6364 18.732 25.6364 14.5C25.6364 10.268 22.2127 6.82877 18 6.82877ZM16.7273 28.5H19.2727V24.7283H16.7273V28.5ZM7.24545 23.5009L9.04 25.3037L11.3182 23.0023L9.52364 21.1995L7.24545 23.5009Z"/></svg>')`,
        left: 4,
      },
      "&::after": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="30" viewBox="0 0 39 37" fill="none"><path d="M10.6129 4.5L11.424 7.15378H14.049L11.9254 8.79391L12.7365 11.4477L10.6129 9.80756L8.48929 11.4477L9.30044 8.79391L7.17683 7.15378H9.80175L10.6129 4.5Z" fill="%23FFD057"/><g filter="url(%23filter0_d_110_22)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.7898 19.2167C12.2289 20.4789 14.0728 21.2377 16.0812 21.2377C20.6734 21.2377 24.4055 17.2705 24.4055 12.3888C24.4055 10.2539 23.6917 8.29395 22.5044 6.76418C22.633 6.75986 22.7622 6.75769 22.8918 6.75769C29.5714 6.75769 34.9999 12.5283 34.9999 19.6289C34.9999 26.7294 29.5714 32.5 22.8918 32.5C16.2122 32.5 10.7837 26.7294 10.7837 19.6289C10.7837 19.4909 10.7857 19.3535 10.7898 19.2167Z" fill="%23FFD057"/></g><defs><filter id="filter0_d_110_22" x="0.783691" y="0.75769" width="44.2162" height="45.7423" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="5"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_110_22"/><feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_110_22" result="shape"/></filter></defs></svg>')`,
        top: "51%",
        right: 8,
      },
    },
    "& .MuiSwitch-thumb": {
      width: 28,
      height: 28,
      margin: 4,
      padding: 0,
      backgroundColor: "#fff",
    },
    "& .MuiSwitch-switchBase": {
      padding: 0,
    },
    "& .Mui-checked": {
      transform: "translateX(41px) !important",
    },
  };
});

export default function ToggleButton() {
  const { theme, toggleTheme } = useThemeContext();
  const [switchState, setSwitchState] = React.useState(
    theme === "dark" ? false : true
  );

  const handleSwitchChange = () => {
    setSwitchState(!switchState);
    toggleTheme();
  };

  return (
    <FormGroup position="relative">
      <FormControlLabel
        position="relative"
        id={"switch-toggle"}
        control={
          <MaterialUISwitch
            sx={{ m: 1 }}
            defaultChecked={switchState}
            onChange={handleSwitchChange}
          />
        }
      />
    </FormGroup>
  );
}
