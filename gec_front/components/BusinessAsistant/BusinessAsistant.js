import ReadMore from "../ReadMore";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import SelectItem from "./SelectItem";
import { staticPageData } from "@/core/sections/constants";
import { useTranslations } from "@/core/Translations/context";

const BusinessAsistant = (props) => {
  const [showItemsBox, setShowItemsBox] = useState(false);
  const [showNextSelectBox, setShowNextSelectBox] = useState(false);
  const [showPrevSelectBox, setShowPrevSelectBox] = useState(false);
  const [count, setCount] = useState(0);
  const [theArray, setTheArray] = useState([]);

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

  const handleShowItems = () => {
    setShowItemsBox(!showItemsBox);
  };

  const checkCount = (item, checkCountLength) => {
    if (checkCountLength) {
      setCount(count + 1);
      const itemsArray = [...theArray, item.currentTarget.id];
      setTheArray(itemsArray);
      // console.log(itemsArray)
    } else {
      setCount(count - 1);
      let clickedItem = item.currentTarget.id;
      let result = theArray.filter((el) => el !== clickedItem);
      setTheArray(result);
    }
  };

 

  const handleNextSelectBox = () => {
    setShowNextSelectBox(true);
    setShowPrevSelectBox(false);
    setShowItemsBox(false);
  };
  const handleHideItems = () => {
    setShowNextSelectBox(false);
    setShowPrevSelectBox(true);
  };
  useEffect(() => {
    setShowNextSelectBox(false);
    setShowPrevSelectBox(true);
  }, []);

  // const intentContainer = useRef();

  // useEffect(() => {
  //   console.log(intentContainer.current.childNodes.length)
  // }, [])

  const businessNeeds = componentPosts[0]?.directories?.filter((x) => x.type_id === 1)
  const businessChallenges = componentPosts[0]?.directories?.filter((x) => x.type_id === 2)

  const resultRef = useMemo(() => {
    return staticPageData['results'][locale].slugs.find(x => x.locale == locale)?.slug;
  }, [locale])

  const handleResult = (e) => {
    e.preventDefault();
    if (theArray.length > 0 && resultRef) {
        router.push({
            pathname: resultRef,
            query: { directories: theArray},
        });
    }
}
   
  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="full-container padding">
          <div className="parent-container">
            <div className="business-assistant-box">
              <div className="container">
                <div
                  className={`__selector-boxes ${
                    showNextSelectBox ? "open-selector-box" : ""
                  } ${showPrevSelectBox ? "open-selector-box-2" : ""}`}
                >
                  <div className="__selector-box_01">
                  {props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" class="business_assistant-title"
                />
              )}
                    <div className="questions-number-box">
                      <div className="title-box_1">
                        <div className="circle"></div>
                        <div className="title">
                          <h2>{componentPosts[0]?.title}</h2>
                          <div className="question-num">
                            <h4>{translations?.question}</h4>
                            <span className="_n_1">1</span>
                            <h4>{translations?.of}</h4>
                            <span className="_n_2">2</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-box_1">
                      {componentPosts[0]?.description}
                      </div>
                    </div>
                    <h2 className="choose-options-title">
                      {translations?.choose_several_option} 
                    </h2>
                    <div className="item-form-box">
                      <div
                        className={`choose-items-box ${
                          showItemsBox ? "open-choose-item-box" : ""
                        }`}
                      >
                        {
                          businessNeeds?.map((item, index) => (
                            <SelectItem
                            key={item.id}
                            check={checkCount}
                            itemTitle={item.title}
                            itemId={item.id}
                          /> 
                          ))
                        }
                        
                      </div>
                      <div className="select-buttons">
                        <div className="left-show-all">
                          {
                            showItemsBox ? 
                            <h3 onClick={handleShowItems}>{translations?.show_less || 'show less'}</h3>
                            :
                            <h3 onClick={handleShowItems}>{translations?.show_all  || 'show all'}</h3>
                          }
                           
                        </div>
                        <div className="next-question-btn">
                          <div
                            className={`next-btn ${
                              count > 0 ? "active-btn" : ""
                            }`}
                            onClick={handleNextSelectBox}
                          >
                            {translations?.next_question}
                            <span>
                              <svg
                                width="12"
                                height="20"
                                viewBox="0 0 12 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M7.66045 10L0.647949 2.98754L2.65112 0.984375L11.6668 10L2.65112 19.0157L0.647949 17.0125L7.66045 10Z"
                                  fill="white"
                                />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="__selector-box_02">
                  {props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" class="business_assistant-title"
                />
              )}
                    <div className="questions-number-box">
                      <div className="title-box_1">
                        <div
                          className="circle"
                          style={{ background: "rgba(22,55,73,0.15)" }}
                        ></div>
                        <div className="title">
                          <h2 style={{ color: "#163749" }}>
                            {componentPosts[0]?.locale_additional?.business_challenges_title}
                          </h2>
                          <div className="question-num">
                            <h4>{translations?.question}</h4>
                            <span className="_n_1" style={{ color: "#163749" }}>
                              2
                            </span>
                            <h4>{translations?.of}</h4>
                            <span className="_n_2">2</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-box_1">
                      {componentPosts[0]?.locale_additional?.business_challenges_description}
                      </div>
                    </div>
                    <h2 className="choose-options-title">
                    {translations?.choose_several_option}
                    </h2>
                    <div className="item-form-box">
                      <div
                        className={`choose-items-box ${
                          showItemsBox ? "open-choose-item-box" : ""
                        }`}
                      >
                       {
                          businessChallenges?.map((item, index) => (
                            <SelectItem
                            key={item.id}
                            check={checkCount}
                            itemTitle={item.title}
                            itemId={item.id}
                          /> 
                          ))
                        }
                      </div>
                      <div className="select-buttons">
                        <div className="left-show-all">
                        {
                            showItemsBox ? 
                            <h3 onClick={handleShowItems}>{translations?.show_less}</h3>
                            :
                            <h3 onClick={handleShowItems}>{translations?.show_all}</h3>
                          }
                        </div>
                        <div className="next-question-btn next-question-btn_2">
                          <div className="previous" onClick={handleHideItems}>
                            <span>
                              <svg
                                width="12"
                                height="20"
                                viewBox="0 0 12 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M4.33967 9.99996L11.3522 17.0125L9.34901 19.0156L0.33334 9.99996L9.34901 0.984291L11.3522 2.98746L4.33967 9.99996Z"
                                  fill="#1B1B1B"
                                />
                              </svg>
                            </span>
                            {translations?.previus_question || 'Previous'}
                          </div>
                          <div className="btn-line-01"></div>
                          <button className="apply-btn__" onClick={handleResult} style={{pointerEvents: theArray.length>0 ? 'initial': 'none'}}>{translations?.apply}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BusinessAsistant;
