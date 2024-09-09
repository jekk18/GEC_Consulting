import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Slider from "react-slick";
import { useTranslations } from "@/core/Translations/context";

const MainBanner = (props) => { 
  const translations = useTranslations();
  const sliderRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sliderCount, setSliderCount] = useState(0);
  const [autoplay, setAutoplay] = useState(true)


  const settings = {
    dots: false,
    infinite: true,  
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    draggable: false,
    initialSlide: currentIndex,
    afterChange: (i) => {
      setCurrentIndex(i);
      // const currentItem = props.data[i];
      // const result =  
      // setAutoplay(result);
      // console.log("Autoplay updated to:", result);
    },
  };

  let fontW = 700;

  if (currentIndex === 0) {
    fontW = 400;
  }

let countSLider = 0; 

  return (
    <section>
      <div className="margin-b">
        <div className="banner-slider-relative">
          <Slider ref={sliderRef} {...settings}>
            {props.data?.map((item, i) => {
              if (item.published === 1 && item.active === 1) {
                countSLider = ++i;
                if (
                  item?.list_image?.video_link
                ) {
                  return (
                    <div className="item item-video" key={i}>
                      <div className="banner-item">
                        <div className="__img-side">
                          <iframe
                            style={{ width: '100%', height: '100%' }}
                            src={
                              `${item.list_image?.video_link}&autoplay=1&modestbranding=1&controls=0&mute=1&rel=0&loop=1`
                            }
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          ></iframe>

                          <div className="blur-img-background"></div>
                        </div>
                        <div className="img-text-side-absolute">
                          <div className="container">
                            <span
                              dangerouslySetInnerHTML={{
                                __html: item?.title,
                              }}
                            />
                            {item?.locale_additional?.button_name &&
                              item?.locale_additional?.redirect_link ? (
                              <Link
                                target="blank"
                                href={item?.locale_additional?.redirect_link}
                              >
                                {item?.locale_additional?.button_name}
                              </Link>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="item" key={i}>
                    <div className="banner-item">
                      <div className="__img-side">
                        <img loading="lazy"
                          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.list_image?.file
                            }`}
                          alt={
                            item.list_image?.alt
                          }
                        />
                        <div className="blur-img-background"></div>
                      </div>
                      <div className="img-text-side-absolute" aria-hidden="true">
                        <div className="container">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: item.title,
                            }}
                          />
                          {item?.locale_additional?.button_name &&
                            item?.locale_additional?.redirect_link ? (
                            <Link
                              target="blank"
                              href={item?.locale_additional?.redirect_link} 
                            >
                              {item?.locale_additional?.button_name}
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </Slider>
          <div className="control-arrows">
            <button
              className="main-slider-arrow prev-arr"
              style={{ fontWeight: fontW }}
              onClick={() => sliderRef?.current?.slickPrev()}
            >
              {translations?.prev}
            </button>
            <span className="slider-items-current">
              {" "}
              {(currentIndex + 1).toString().padStart(2, "0")}{" "}
            </span>
            <div className="slider-line"></div>
            <span className="slider-items-count">
              {countSLider.toString().padStart(2, "0")}
            </span>
            <button
              className="main-slider-arrow next-arr"
              onClick={() => sliderRef.current?.slickNext()}
            >
              {translations?.next}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainBanner;
