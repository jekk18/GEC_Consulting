import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll"; 
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import ProjectItem from "./ProjectItem";
import { useTranslations } from "@/core/Translations/context";
import Link from "next/link";

  
const ProjectsComponent = (props) => {
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
 
  const showPosts = componentPosts
  ?.filter((item) => { 
    return !(
      props.data.component?.section_data_type === "automate" &&
      props.data.component?.component_data_type === "connected" &&
      item.id === props.page?.id &&
      props.isPost
    );
  });
  
  const cls =
  showPosts?.length > 1
      ? "project-component-item"
      : "project-component-item one-project-item";

  return (
    <section id={props?.data?.component_id}>
    {loader && <Loader />}
    {!loader && 
        <div className="projects-component padding">
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
          <div className={`row ${componentPosts.length > 1 ? 'row-slider-2' : ''}`}>
            <div className="projects-component-box">
              {componentPosts?.map((item, index) => {
                if (props.data.component?.section_data_type === "automate" && props.data.component?.component_data_type === "connected" && item.id === props.page?.id && props.isPost)
                return;
                if (item.published === 1 && item.active === 1) {  
                  let allLanguage = locale;
                  if(item?.additional?.shared_locale && item?.additional?.shared_locale?.image){
                    allLanguage = item?.additional.shared_locale.image;
                  }
                return (
                  <ProjectItem
                    class={cls}
                    key={item.id}
                    slug={item?.slugs?.filter((x) => x.locale === locale)[0]
                      ?.slug}
                    img={item?.files?.find(
                      (x) => x.locale === allLanguage)?.file}
                    alt={item?.files?.find(
                      (x) => x.locale === allLanguage)?.alt}
                    text={item?.title}
                    startDate={item?.start_date}
                    desc={item?.description}
                    endDate={item?.end_date}
                  />
                );
                }
              })}
            </div>
          </div>
        </div>
      </div>
    }
    </section>
  );
};

export default ProjectsComponent;
