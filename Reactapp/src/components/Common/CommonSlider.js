import { Box, useTheme } from "@mui/material";
import React from "react";
import Slider from "react-slick";

function CommonSlider(propsData) {
  const {
    InitialShowNumber = "",
    responsiveArray,
    CardContent,
  } = propsData || "";
  const theme = useTheme();
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className="slick-arrow"
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <img
          src={
            theme?.palette?.mode === "light"
              ? "/images/right-arrow.svg"
              : "/images/arrow-right-dark.svg"
          }
          alt="arrow_left"
        />
      </div>
    );
  }
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className="slick-arrow-left"
        style={{ ...style, display: "block" }}
        onClick={onClick}
      >
        <img
          src={
            theme?.palette?.mode === "light"
              ? "/images/left-arrow.svg"
              : "/images/arrow-left-dark.svg"
          }
          alt="arrow_left"
        />
      </div>
    );
  }
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: InitialShowNumber ? InitialShowNumber : 3,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: responsiveArray
      ? responsiveArray
      : [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: InitialShowNumber ? InitialShowNumber : 2,
            },
          },
          {
            breakpoint: 956,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              initialSlide: InitialShowNumber ? InitialShowNumber : 2,
            },
          },
          {
            breakpoint: 556,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              initialSlide: InitialShowNumber ? InitialShowNumber : 1,
            },
          },
        ],
  };

  const Cards = ["card", "card2", "card3"];
  return (
    <div className="slider-container">
      <Slider {...settings}>
        {CardContent
          ? CardContent
          : Cards?.map((item) => {
              return (
                <Box id="slider-wrap">
                  <img src={`/images/${item}.svg`} alt="icon"></img>
                </Box>
              );
            })}
      </Slider>
    </div>
  );
}

export default CommonSlider;
