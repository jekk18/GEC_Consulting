import SectionTitle from "../SectionTitle";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import BannerItem from "./BannerItem";
import { useTranslations } from "@/core/Translations/context";

const Banners = (props) => {
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

  // console.log(componentPosts, 'banners')
  
  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="banners-box-section padding">
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
            <div className="banners">
             {
               componentPosts?.map((item, index) => {
                  if (item?.published === 1 && item?.active === 1) {
                     let allLanguage = locale;
                     let file = null;
                     if (
                       item?.additional?.shared_locale &&
                       item?.additional?.shared_locale?.image
                     ) {
                       allLanguage = item?.additional?.shared_locale?.image;
                     }  
                     file = item?.files?.find((x) => x.locale === allLanguage);  
                     return(
                        <BannerItem
                        key={item.id}
                        bannerUrl={item?.locale_additional?.redirect_link}
                        bannerTitle={item.title}
                        bannerImg={file}
                      />  
                     )
                  }
               })
             }
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banners;
