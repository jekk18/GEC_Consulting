import React, { useEffect, useMemo, useState } from "react";
import CountUp from "react-countup";
import { getComponentPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import { useRouter } from "next/router";
import SectionTitle from "../SectionTitle";
import { useTranslations } from "@/core/Translations/context";

const CounterUp = (props) => {
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
        <div className="counter-up-container padding">
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
            <div className="row row-slider">
              <div className="counter-up-box">
                {componentPosts?.map((item, index) => {
                  if (item.published === 1 && item.active === 1) {
                    const value = item?.locale_additional?.value;
                    const match = value ? value.match(/^(\d+)(.*)$/) : null;
                    const value_number = match ? parseFloat(match[1]) : 0;
                    const value_string = match ? match[2] : "";

                    return (
                      <div className="counter-item" key={index}>
                        <span className="counter-up-title">{item.title}</span>
                        <CountUp
                          className="counter-up-number"
                          style={
                            value?.length
                              ? {
                                  minWidth: `${value.length}ch`,
                                }
                              : {}
                          }
                          end={value_number}
                          suffix={value_string}
                          enableScrollSpy
                          scrollSpyOnce
                          separator={""}
                          delay={2000}
                          useEasing
                          duration={10}
                        />
                      </div>
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

export default CounterUp;
