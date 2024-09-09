import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useTranslations } from "@/core/Translations/context";

const PartnersComponent = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try { 
        const posts = await getComponentPosts(props.data?.component_id );
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
        <div className="partners-container padding">
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
            <div className="row row-slider-2">
              <div className="partners-box">
                {loader && <Loader />}
                {!loader &&
                  componentPosts?.map((item, index) => {
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
                        target="blank"
                          href={
                            item?.additional?.redirect_link
                              ? item?.additional?.redirect_link
                              : ""
                          }
                          className="partner-item"
                          key={item.id}
                          style={{
                            pointerEvents: item?.additional?.redirect_link
                              ? "initial"
                              : "none",
                          }}
                        >
                          <div className="partner-absolute">
                            <div className="partner-logo">
                              {item?.files ? (
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
                              ) : (
                                <img src="/img/partner1.svg" alt="partner" />
                              )}
                            </div>
                            <div
                              className="partner-text"
                              dangerouslySetInnerHTML={{
                                __html: item?.text,
                              }}
                            />
                          </div>
                        </Link>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PartnersComponent;
