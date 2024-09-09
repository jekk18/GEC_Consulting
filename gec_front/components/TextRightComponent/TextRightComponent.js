import Link from "next/link";
import React from "react";
import Fancybox from "../Fancybox/Fancybox";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useTranslations } from "@/core/Translations/context";

const TextRightComponent = (props) => {
  const translations = useTranslations();
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

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
  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="padding">
          <div className="container">
            <div className="important-title title-link-service"> 
            {
              props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />
              )
            } 
              {seeAllSlug && (
                <Link href={seeAllSlug}>
                  <SeeAll seeLink={translations?.see_all} />
                </Link>
              )}
            </div>
            <div className="text-and-img-component text-left">
              <div className="l-text">
                <h1>{componentPosts[0]?.title}</h1>
                <div
                  className="text"
                  dangerouslySetInnerHTML={{
                    __html: componentPosts[0]?.description,
                  }}
                />
                {componentPosts[0]?.locale_additional?.redirect_link && (
                  <div className="see-button">
                    <Link
                      href={componentPosts[0]?.locale_additional?.redirect_link}
                    >
                      {componentPosts[0]?.locale_additional?.button_name ||
                         translations?.read_more}
                    </Link>
                  </div>
                )}
              </div>
              <div className="img-comp">
                 {
                  file && 
                  <Fancybox class={'full-height-fancy'}>
                  <a href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.file}`} data-fancybox="gallery">
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.file}`}
                      alt={file?.alt}
                      loading="lazy"
                    />
                  </a>
                </Fancybox>
                 }
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default TextRightComponent;
