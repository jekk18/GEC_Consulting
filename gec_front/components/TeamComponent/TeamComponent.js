import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useTranslations } from "@/core/Translations/context";
import { directoryTypes } from "@/core/directories/constants";

const TeamComponent = (props) => {
  const translations = useTranslations();
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

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
  }, [props.data?.component_id, router.query, locale]); 
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
        <div className="team-component-box padding">
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
              <div className="team-list-box team-list-slider">
                {componentPosts?.map((item, index) => {
                  if (
                    props.data.component?.section_data_type === "automate" &&
                    props.data.component?.component_data_type === "connected" &&
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
                      <Link key={item.id}
                      href={
                        item?.slugs?.filter((x) => x.locale === locale)[0]
                          ?.slug
                      } className="team-list-item">
                      <div className="team-img-box">
                      <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${
                                item?.files?.find((x) => x.locale === allLanguage && x.type == 'image')
                                  ?.file
                              }`}
                              alt={
                                item?.files?.find((x) => x.locale === allLanguage && x.type == 'image')
                                  ?.alt
                              }
                              loading="lazy"
                            />
                      </div>
                      <div className="team-member-name">
                        <h1>{item.title}</h1>
                      </div>
                       {
                        item?.locale_additional?.position &&
                        <div className="team-member-text">{item?.locale_additional?.position}</div>
                       }
                    </Link>
                    )
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

export default TeamComponent;
