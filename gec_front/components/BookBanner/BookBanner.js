import Link from "next/link";
import React from "react";
import SectionTitle from "../SectionTitle";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import BookingPopUp from "../BookingPopUp/BookingPopUp"; 

const BookBanner = (props) => {
  const [open, setOpen] = useState("");
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router; 
  const pId = props?.page?.list && props?.page?.list === 1 ? '' : props?.page?.id; 
 
  const handleOpen = (check) => {
    setOpen(check);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const posts = await getComponentPosts(props.data?.component_id);
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

  let allLanguage = locale;
  let file = null;

  if (componentPosts[0]?.published === 1 && componentPosts[0]?.active === 1) {
    if (
      componentPosts[0]?.additional?.shared_locale &&
      componentPosts[0]?.additional?.shared_locale?.image
    ) {
      allLanguage = componentPosts[0]?.additional?.shared_locale?.image;
    }
    file = componentPosts[0]?.files?.find((x) => x.locale === allLanguage);
  }

  let backgroundImage = `url(/img/graphic-banner.png)`;
  if (file?.file) {
    backgroundImage = `url(${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.file})`;
  } 
  return ( 
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <>
          <div className="book-banner-component padding">
            <div className="container">
              {props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />
              )}
              <div
                className="book-banner"
                style={{
                  backgroundImage: backgroundImage,
                  backgroundPosition: "left",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <h1>{componentPosts[0]?.title}</h1>
                <div
                  className="text"
                  dangerouslySetInnerHTML={{
                    __html: componentPosts[0]?.description,
                  }}
                />
                {componentPosts[0]?.additional?.registration?.enabled == 1 && (
                  <div className="see-button">
                    {componentPosts[0]?.additional?.registration?.link ? (
                      <Link
                        href={componentPosts[0]?.additional?.registration?.link}
                        target="blank"
                      >
                        {componentPosts[0]?.locale_additional?.button_name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        name="btn"
                        onClick={() => {
                          setOpen(true);
                        }}
                      >
                        {componentPosts[0]?.locale_additional?.button_name}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="booking-btn-01">
            {open && <BookingPopUp hancleClick={handleOpen} pageId={pId}/>}
          </div>
        </>
      )}
    </section> 
  );
};

export default BookBanner;
