import Link from "next/link";  
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import GreenArrow from "../Icons/GreenArrow";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import PublicationItem from "./PublicationItem";
import { useTranslations } from "@/core/Translations/context"; 
import { directoryTypes } from "@/core/directories/constants";

const NewsAndPublicationsSection = (props) => {
 
    const [componentPosts, setComponentPosts] = useState([]);
    const [loader, setLoader] = useState(true);
    const router = useRouter();
    const { locale } = router;
    const translations = useTranslations();

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
         {!loader && 
            <div className='news-and-publications-section padding'>
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
              <div className="news-and-publications-box row-mobile-slider">
              {loader && <Loader/>}
              {
                !loader && componentPosts?.map((item,index) => {
                  if (props.data.component?.section_data_type === "automate" && props.data.component?.component_data_type === "connected" && item.id === props.page?.id && props.isPost)
                  return;
                  if (item.published === 1 && item.active === 1) {   
                    return (
                        <PublicationItem data={item} key={item.id} component={true}/>
                    )
                }
            })
          }
              </div>
            </div>
        </div>
         } 
     </section>
  )
}

export default NewsAndPublicationsSection; 