import Link from "next/link"; 
import ReadMore from "../ReadMore";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import GreenArrow from "../Icons/GreenArrow";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useTranslations } from "@/core/Translations/context";


const CaseSection = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();
  
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

  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="case-section padding">
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
            <div className="row row-mobile-slider">
              <div className="cases-box">
              {loader && <Loader/>}
              {
                !loader && componentPosts?.map((item,index) => {
                  if (props.data.component?.section_data_type === "automate" && props.data.component?.component_data_type === "connected" && item.id === props.page?.id && props.isPost)
                  return;
                  if (item.published === 1 && item.active === 1) {  
                    let allLanguage = locale;
                    if(item?.additional?.shared_locale && item?.additional?.shared_locale?.image){
                      allLanguage = item?.additional.shared_locale.image;
                    }
                    return (
                      <div className="case-item" key={index}>
                      <Link href={item?.slugs?.filter((x) => x.locale === locale)[0]
                            ?.slug} className="case-img"> 
                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.files?.find(
                            (x) => x.locale === allLanguage)?.file}`} alt={item?.files?.find(
                              (x) => x.locale === allLanguage)?.alt} loading="lazy"/>
                      </Link>
                      <div className="case-text"> 
                        <div className="text__case_01">
                          <div className="text" dangerouslySetInnerHTML={{ __html: item?.text }}  />
                        </div>
                        <div className="read-more-box">
                          <Link href={ item?.slugs?.filter((x) => x.locale === locale)[0]
                            ?.slug} className="read-more-link">
                           {translations?.read_more}
                          </Link>
                          <GreenArrow class="read-more-box" />
                        </div>
                      </div>
                    </div>
                    )
                  }
                })
              }
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default CaseSection;
