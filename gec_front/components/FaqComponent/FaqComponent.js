import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import SubArrow from "../Icons/SubArrow";
import { useTranslations } from "@/core/Translations/context";
 

const FaqComponent = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const [active, setActive] = useState(null);
  const translations = useTranslations();

  const handleActive = (id) => {
    if (active === id) {
      setActive(null);
    } else {
      setActive(id);
    }
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
 
  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="faq-page padding">
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
            <div className="faq-list-box">
              {loader && <Loader />}
              {!loader &&
                componentPosts?.map((item, index) => {
                  if (
                    props.data.component?.section_data_type === "automate" &&
                    props.data.component?.component_data_type === "connected" &&
                    item.id === props.page?.id &&
                    props?.isPost
                  )
                    return;
                  if (item?.published === 1 && item?.active === 1) {
                    return (
                      <div className="faq-list-item" key={item.id}>
                        <div className="faq-title">
                          <h1>{item?.title}</h1>
                          <div
                            className={`faq-arrow ${
                              active === item.id ? "faq-active" : ""
                            }`}
                            onClick={() => handleActive(item.id)}
                          >
                            <SubArrow />
                          </div>
                        </div>
                        {item?.id === active && (
                          <div
                            className="faq-text"
                            dangerouslySetInnerHTML={{ __html: item?.text }}
                          />
                        )}
                      </div>
                    );
                  }
                })}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FaqComponent;
