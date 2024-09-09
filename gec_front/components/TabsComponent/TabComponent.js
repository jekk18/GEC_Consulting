import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll"; 
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import TabVector from "../Icons/TabVector"; 
import { directoryTypes } from "@/core/directories/constants";

const TabComponent = (props) => { 
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
  }, [props.data?.component_id, locale]);
 
  const seeAllSlug = useMemo(() => {
    if (props.data?.component?.section) {
      return props.data.component.section.slugs.find((x) => x.locale === locale)
        ?.slug;
    }
  }, [props.data, locale]);

  const [visibleTab, setVisibleTab] = useState(componentPosts[0]?.id ?? 0);
  const [activeTab, setActiveTab] = useState(componentPosts[0]?.id ?? 0);
 
  const listTitles = componentPosts?.map((item, index) => (
    <div
      key={item.id}
      onClick={() => setVisibleTab(item.id)}
      className={
        visibleTab === item.id || visibleTab === index ? "tab-title tab-title--active" : "tab-title"
      }
    >
      <h2>{item.title}</h2>
    </div>
  ));

  const listContent = componentPosts?.map((item, index) => (
    <div style={visibleTab === item.id || visibleTab === index ? {display: "block" } : { display: "none" }} key={index}>
      <h2>{item.title}</h2>
      <div className="text">{item.description}</div>
    </div>
  ));  

  return (
    <section id={props?.data?.component_id}>
    {loader && <Loader />}
     {!loader && 
        <div className="tab-component padding">
        <div className="container">
        {props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />
              )}
              {seeAllSlug && (
                <Link href={seeAllSlug}>
                  <SeeAll seeLink={translations?.see_all} />
                </Link>
              )}
          <div className="tabs">
            <div className="tabs-titles">{listTitles}</div>
            <div className="tab-content">{listContent}</div>
          </div>
          <div className="mobile-tabs-component">
            {componentPosts?.map((item, index) => {
              return (
                <div className={`mob-tabs-item ${
                    activeTab === item.id ? "active-mob-tab" : ""
                  }`} key={index}>
                  <div
                    className="mob-tab-title "
                    onClick={() => {
                      if(activeTab === item.id){
                        setActiveTab(-1);
                      }else{
                        setActiveTab(item.id);
                      }
                    }}
                  >
                    <h3>{item.title}</h3>
                    <TabVector
                      color={`${activeTab === item.id ? "#049878" : "#000"}`}
                    />
                  </div>
                  <div className="mob-tab-text">{item?.description}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
     }
    </section>
  );
};

export default TabComponent;
