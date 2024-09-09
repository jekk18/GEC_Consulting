import Link from "next/link";
import Image from "next/image";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useRef, useState } from "react";
import Loader from "@/components/Loader/Loader";
import GreenArrow from "../Icons/GreenArrow";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslations } from "@/core/Translations/context";
import { directoryTypes } from "@/core/directories/constants";

const ServicesSection = (props) => {
  const servicSliderRef = useRef(null);
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 1638,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          variableWidth: true, 
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1, 
          infinite: true,
          variableWidth: true,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          variableWidth: true, 
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          variableWidth: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
          infinite: true,
        },
      },
    ],
  };

  const onLinkMouseDown = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        let business_needs = undefined;
        if (props.page?.directories) {
          business_needs = props.page.directories
            .filter((x) => x.type_id === directoryTypes.business_needs)
            .map((x) => x.id);
        }
        const posts = await getComponentPosts(props.data?.component_id, {
          business_needs,
        });
        setComponentPosts(posts.posts);
      } catch (error) {
        console.error("Error fetching section posts:", error);
      }
      setLoader(false);
    };
    fetchData();
  }, [props.data?.component_id, locale]);

  const seeAllSlug = useMemo(() => {
    if (props.data?.component?.section) {
      return props.data.component.section.slugs.find((x) => x.locale === locale)
        ?.slug;
    }
  }, [props.data, locale]);
  
  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="margin">
          <div className={"services-slider padding"}>
            <div className="container">
              <div className="important-title title-link-service">
                {props?.data?.title && (
                  <SectionTitle title={props?.data?.title} titleColor="#000" />
                )}
                {seeAllSlug && (
                  <Link href={seeAllSlug}>
                    <SeeAll seeLink={translations?.see_all} />
                  </Link>
                )}
              </div>
              <div className={`services-slider-box ${componentPosts?.length < 4 ? 'flex-left-side' : ''}`}>
                <Slider ref={servicSliderRef} {...settings}>
                  {componentPosts?.map((item, index) => {
                    if (
                      props.data.component?.section_data_type === "automate" &&
                      props.data.component?.component_data_type ===
                        "connected" &&
                      item.id === props.page?.id &&
                      props.isPost
                    )
                      return;
                    if (item.published === 1 && item.active === 1) {
                      let allLanguage = locale;
                      if (
                        item?.additional?.shared_locale &&
                        item?.additional?.shared_locale?.image
                      ) {
                        allLanguage = item?.additional.shared_locale.image;
                      }
                      return (
                        <Link
                          key={item.id}
                          href={
                            item?.slugs?.filter((x) => x.locale === locale)[0]
                              ?.slug
                          }
                          className="__services-item"
                          onMouseDown={onLinkMouseDown}
                        >
                          <div className="services-icon">
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${
                                item?.files?.find(
                                  (x) => x.locale === allLanguage
                                )?.file
                              }`}
                              alt={
                                item?.files?.find(
                                  (x) => x.locale === allLanguage
                                )?.alt
                              }
                              loading="lazy"
                            />
                          </div>
                          <h1 className="title">{item.title}</h1>
                          <div
                            className="text"
                            dangerouslySetInnerHTML={{
                              __html: item?.description,
                            }}
                          />
                          <div className="read-more-box">
                            <span className="read-more-link">
                              {translations?.read_more}
                            </span>
                            <GreenArrow class="read-more-box" />
                          </div>
                        </Link>
                      );
                    }
                  })}
                </Slider>
              </div> 
                <div className={`controls-services-slider ${'hide-s-item-'+componentPosts?.length}`}>
                  <button onClick={() => servicSliderRef?.current?.slickPrev()}>
                    <GreenArrow class="arr__1 arr__1-prev" />
                    {translations?.prev}
                  </button>
                  <button onClick={() => servicSliderRef?.current?.slickNext()}>
                    {translations?.next}
                    <GreenArrow class="arr__1" />
                  </button>
                </div> 
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ServicesSection;
