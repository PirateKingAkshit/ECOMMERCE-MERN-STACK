import React from 'react'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../MainPage/Carousel.css";
import CarouselInfo from "./CarouselInfo";

const Carousel = () => {
    const settings = {
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay:true,
      autoplaySpeed:1750,
      nextArrow: (
        <div>
          <div className="next-slick-arrow"> ⫸ </div>
        </div>
      ),
      prevArrow: (
        <div>
          <div className="prev-slick-arrow"> ⫷ </div>
        </div>
      ),
    };
  return (
    <div>
      <div className="content">
        <div className="container">
          <Slider {...settings}>
            {CarouselInfo.map((item) => (
              <div key={item.id}>
                <img src={item.src} alt={item.alt} className="img" />
                <h2 className="title">{item.title}</h2>
                <p className="description">{item.description}</p>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Carousel