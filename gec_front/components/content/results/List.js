import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import DownVector from "@/components/Icons/DownVector";
import SelectCloseIcon from "@/components/Icons/SelectCloseIcon";
import ServiceSelectItem from "@/components/ServicesComponent/ServiceSelectItem";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import GreenArrow from "@/components/Icons/GreenArrow";
import { directoryTypes } from "@/core/directories/constants";
import { getDirectories } from "@/core/directories/requests";
import { getResultsPosts, getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import ShareIcon from "@/components/Icons/ShareIcon";
import ShareComponent from "@/components/ShareComponents/ShareComponent";
import { useDebounce } from "@/helpers/use-debounce";
import SectionTitle from "@/components/SectionTitle";
import SeeAll from "@/components/SeeAll";
import Slider from "react-slick";
import ProjectItem from "@/components/ProjectsComponent/ProjectItem";
import { staticPageData } from "@/core/sections/constants";
import { useTranslations } from "@/core/Translations/context";

const List = (props) => {
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();
  const [openBusiness, setOpenBusiness] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();
  const [idArray, setIdArray] = useState([]);
  const [loader, setLoader] = useState(true);
  const [tpPage, setTpPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [directoriesBusinessNeeds, setDirectoriesBusinessNeeds] = useState([]);
  const [directoriesBusinessChallenges, setDirectoriesBusinessChallenges] =
    useState([]);
  const [directories, setDirectories] = useState([]);
  const [theArray, setTheArray] = useState([]);
  const [directoryQueryArray, setDirectoryQueryArray] = useState(
    Array.isArray(router.query.directories)
      ? router.query.directories
      : router.query.directories
      ? [router.query.directories]
      : []
  );

  const debounceDirectories = useDebounce(directoryQueryArray, 500);

  useEffect(() => {
    if (directories && directories.length > 0) {
      const itemsArray = directoryQueryArray
        .filter((element) =>
          directories.some((directory) => element == directory.id)
        )
        .map((element) => {
          const directory = directories.find((d) => d.id == element);
          return { title: directory.title, id: directory.id.toString() };
        });

      setTheArray(itemsArray);

      const ids = itemsArray.map((item) => item.id.toString());
      setIdArray(ids);
    }
  }, [directories]);

  const [data, setData] = useState();

  useEffect(() => {
    const combinedDirectories = [
      ...directoriesBusinessNeeds,
      ...directoriesBusinessChallenges,
    ];

    setDirectories(combinedDirectories);
  }, [directoriesBusinessNeeds, directoriesBusinessChallenges]);

  const checkActive = (item, checkCountLength) => {
    if (checkCountLength) {
      const itemsArray = [
        ...theArray,
        { title: item.currentTarget.title, id: item.currentTarget.id },
      ];
      const idItemsArray = [...idArray, item.currentTarget.id];
      const idItemsQueryArray = [...directoryQueryArray, item.currentTarget.id];
      setIdArray(idItemsArray);
      setTheArray(itemsArray);
      setDirectoryQueryArray(idItemsQueryArray);
    } else {
      let clickedItem = item.currentTarget.id;
      setIdArray((prevIdArray) =>
        prevIdArray.filter((el) => el !== clickedItem)
      );
      setTheArray((prevTheArray) =>
        prevTheArray.filter((el) => el.id !== clickedItem)
      );
      setDirectoryQueryArray((prevTheArray) =>
        prevTheArray.filter((el) => el !== clickedItem)
      );
      if (directoryQueryArray.length < 2) {
        filteredDirectories();
      }
    }
  };

  const getFilter = useCallback(() => {
    const query = {
      directories: directoryQueryArray ?? idArray ?? undefined,
    };

    return query;
  }, [idArray, directoryQueryArray]);

  const fetchDirectoriesBusinessNeeds = useCallback(() => {
    getDirectories(directoryTypes.business_needs).then(
      (response) => {
        setHasMore(!!response.directories.next_page_url);
        setDirectoriesBusinessNeeds([...response?.directories?.data]);
      }
    );
  }, [directoryTypes?.business_needs, tpPage]);

  const fetchDirectoriesBusinessCahallenges = useCallback(() => {
    getDirectories(directoryTypes.business_challenges).then(
      (response) => {
        setHasMore(!!response.directories.next_page_url);
        setDirectoriesBusinessChallenges([...response?.directories?.data]);
      }
    );
  }, [directoryTypes?.business_challenges]);

  useEffect(() => {
    fetchDirectoriesBusinessNeeds();
    fetchDirectoriesBusinessCahallenges();
  }, [locale]);

  const fetchData = async () => {
    setLoader(true);
    try {
      const query = getFilter();
      const posts = await getResultsPosts(query);
      setData(posts.posts.data);
    } catch (error) {
      console.error("Error fetching section posts:", error);
    }
    setLoader(false);
  };

  useEffect(() => {
    fetchData();
  }, [props.page.id, router.query, locale]);

  const handleFilter = (e) => {
    e?.preventDefault();
    const query = {
      directories: idArray ?? undefined,
    };

    router.push(
      {
        query: { ...router.query.asPath, ...query },
        pathname: `/${locale}${router.asPath?.split("?")[0]}`,
      },
      undefined,
      {
        shallow: true,
        locale: false,
      }
    );
  };

  const filteredDirectories = useCallback(() => {
    handleFilter();
  }, []);

  const handleRemoveItem = (event) => {
    let clickedItem = event.id;
    const resultId = idArray.filter((el) => el !== clickedItem);
    const resultTitle = theArray.filter((el) => el.id !== clickedItem);

    setIdArray(resultId);
    setTheArray(resultTitle);
    setDirectoryQueryArray(resultId);
    if (resultId.length < 1) {
      filteredDirectories();
    }
  };

  const servicesPosts = data?.filter(
    (x) => x?.section?.type_name == "services"
  );
  const projectsPosts = data?.filter(
    (x) => x?.section?.type_name == "projects"
  );
  const casesPosts = data?.filter((x) => x?.section?.type_name == "cases");

  const servicSliderRef = useRef(null);
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    arrows: false,
    draggable: false,
    responsive: [
      {
        breakpoint: 1638,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  };
  const onLinkMouseDown = (e) => {
    e.preventDefault();
  };

  const cls =
    projectsPosts?.length > 1
      ? "project-component-item"
      : "project-component-item one-project-item"; 

  const seeAllRef = useMemo(() => {
    return staticPageData["see-all"][locale].slugs.find((x) => x.locale == locale)
      ?.slug;
  }, [locale]);

  const handleSeeAll = (e, typeId) => {
    e.preventDefault();
    if (theArray.length > 0 && seeAllRef) {
      router.push({
        pathname: seeAllRef,
        query: {type_id: typeId ?? undefined, directories: idArray ?? directoryQueryArray ?? undefined },
      }); 
    }
  };  
 
  return (
    <>
      <section className="padding-b">
        <div className="horizontal-bar">
          <div className="main-banner">
            <div className="full-img-banners">
              <div className="banner-item-2">
                <img loading="lazy" src="/img/cover.png" alt="default" />
              </div>
            </div>
            <div className="bar-absolute-container">
              <div className="container">
                <h1>{translations?.result_page_title}</h1>
                <div className="share-bar-container">
                  <div className="share-click-box">
                    <div className="share-open">
                      <ShareIcon />
                    </div>
                    <div className="share-box wid-0-1">
                      <ShareComponent />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        {loader && <Loader />}
        {!loader && (
          <div
            className="project-page padding-b"
            style={{
              minHeight: openBusiness || openChallenges ? "300px" : "initial",
            }}
          >
            <div className="container">
              <div className="services-filter-box">
                <div className="filtered-box">
                  <div className="filter-left">
                    <div className="filter-title-box">
                      <h2 className="filter-title">{translations?.filter_by}</h2>
                      <div
                        className={`filter-btn hidden-apply-btn ${
                          theArray.length > 0 ? "active-button" : ""
                        }`}
                      >
                        <button type="button" onClick={handleFilter}>
                        {translations?.apply}
                        </button>
                      </div>
                    </div>
                    <div className="business-challanges-flex-box">
                      {directoriesBusinessNeeds && (
                        <div
                          className="bn-ch-box business-needs"
                          onClick={() => {
                            setOpenBusiness(!openBusiness);
                            setOpenChallenges(false);
                          }}
                        >
                          <h3
                            style={{
                              color: openBusiness ? "#049878" : "#6B6B6B",
                            }}
                          >
                            {translations?.business_needs}
                          </h3>
                          <div
                            className={`down-arrow ${
                              openBusiness ? "rotate-arrow" : ""
                            }`}
                          >
                            <DownVector color={"#6B6B6B"} />
                          </div>
                        </div>
                      )}
                      {directoriesBusinessChallenges && (
                        <div
                          className="bn-ch-box challenges"
                          onClick={() => {
                            setOpenChallenges(!openChallenges);
                            setOpenBusiness(false);
                          }}
                        >
                          <h3
                            style={{
                              color: openChallenges ? "#049878" : "#6B6B6B",
                            }}
                          >
                            {translations?.challenges}
                          </h3>
                          <div
                            className={`down-arrow ${
                              openChallenges ? "rotate-arrow" : ""
                            }`}
                          >
                            <DownVector color={"#6B6B6B"} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div
                    className={`filter-btn mobile-hidden-apply-btn ${
                      theArray.length > 0 ? "active-button" : ""
                    }`}
                  >
                    <button type="button" onClick={handleFilter}>
                    {translations?.apply}
                    </button>
                  </div>
                  <div
                    className="bn-ch-list business-list"
                    style={{ display: openBusiness ? "block" : "none" }}
                  >
                    <ul>
                      {directoriesBusinessNeeds?.map((item, index) => {
                        return (
                          <ServiceSelectItem
                            check={checkActive}
                            key={index}
                            title={item.title}
                            id={item.id}
                            idInArray={idArray.includes(item.id.toString())}
                          />
                        );
                      })}
                    </ul>
                  </div>
                  <div
                    className="bn-ch-list challenges-list"
                    style={{ display: openChallenges ? "block" : "none" }}
                  >
                    <ul>
                      {directoriesBusinessChallenges?.map((item, index) => {
                        return (
                          <ServiceSelectItem
                            check={checkActive}
                            key={index}
                            title={item.title}
                            id={item.id}
                            idInArray={idArray.includes(item.id.toString())}
                          />
                        );
                      })}
                    </ul>
                  </div>
                </div>
                {theArray.length > 0 && (
                  <div className="selected-box">
                    <h2 className="filter-title">{translations?.selected}</h2>
                     <div className="select-item-flex">
                     {theArray.map((item, index) => {
                      return (
                        <div className="selected-item" key={index}>
                          <span>{item.title}</span>
                          <div
                            className="close-s-item"
                            onClick={() => {
                              handleRemoveItem(item);
                            }}
                          >
                            <SelectCloseIcon />
                          </div>
                        </div>
                      );
                    })}
                     </div>
                  </div>
                )}
              </div> 
            </div>
          </div>
        )}
      </section>
      {servicesPosts && servicesPosts.length>0 &&(
        <section>
          {loader && <Loader />}
          {!loader && (
            <div className="margin">
              <div className="services-slider padding">
                <div className="container">
                  <div className="important-title title-link-service">
                    <SectionTitle title={"services"} titleColor="#000" />
                    <button type="button" name="see-btn-1" onClick={(e) => handleSeeAll(e, servicesPosts[0]?.section?.type_id)}>
                      <SeeAll seeLink={translations?.see_all} />
                    </button>
                  </div>
                  <div className="services-slider-box">
                    <Slider ref={servicSliderRef} {...settings}>
                      {servicesPosts?.map((item, index) => {
                        let allLanguage = locale;
                        if (
                          item?.additional?.shared_locale &&
                          item?.additional?.shared_locale?.image
                        ) {
                          allLanguage = item?.additional.shared_locale.image;
                        }
                        return (
                          <Link
                            key={item.id}
                            href={
                              item?.slugs?.filter((x) => x.locale === locale)[0]
                                ?.slug
                            }
                            className="__services-item"
                            onMouseDown={onLinkMouseDown}
                          >
                            <div className="services-icon">
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
                            </div>
                            <h1 className="title">{item.title}</h1>
                            <div
                              className="text"
                              dangerouslySetInnerHTML={{ __html: item?.text }}
                            />
                            <div className="read-more-box">
                              <span className="read-more-link">{translations?.read_more}</span>
                              <GreenArrow class="read-more-box" />
                            </div>
                          </Link>
                        );
                      })}
                    </Slider>
                  </div>
                  <div className="controls-services-slider">
                    <button
                      onClick={() => servicSliderRef?.current?.slickPrev()}
                    >
                      <GreenArrow class="arr__1 arr__1-prev" />
                      {translations?.prev}
                    </button>
                    <button
                      onClick={() => servicSliderRef?.current?.slickNext()}
                    >
                      {translations?.next}
                      <GreenArrow class="arr__1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
      {projectsPosts && projectsPosts.length>0 &&(
        <section>
          {loader && <Loader />}
          {!loader && (
            <div className="projects-component padding">
              <div className="container">
                <div className="important-title title-link-service">
                  <SectionTitle title={"Projects"} titleColor="#000" />
                  <button type="button" name="see-btn-2" onClick={(e) => handleSeeAll(e, projectsPosts[0]?.section?.type_id)}>
                    <SeeAll seeLink={translations?.see_all} />
                  </button>
                </div>
                <div
                  className={`row ${
                    projectsPosts?.length > 1 ? "row-slider-2" : ""
                  }`}
                >
                  <div className="projects-component-box">
                    {projectsPosts?.map((item, index) => {
                      let allLanguage = locale;
                      if (
                        item?.additional?.shared_locale &&
                        item?.additional?.shared_locale?.image
                      ) {
                        allLanguage = item?.additional.shared_locale.image;
                      }
                      return (
                        <ProjectItem
                          class={cls}
                          key={item.id}
                          slug={
                            item?.slugs?.filter((x) => x.locale === locale)[0]
                              ?.slug
                          }
                          img={
                            item?.files?.find((x) => x.locale === allLanguage)
                              ?.file
                          }
                          alt={
                            item?.files?.find((x) => x.locale === allLanguage)
                              ?.alt
                          }
                          text={item?.title}
                          desc={item?.description}
                          startDate={item?.start_date}
                          endDate={item?.end_date}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
      {casesPosts && casesPosts.length>0 &&(
        <section>
          {loader && <Loader />}
          {!loader && (
            <div className="case-section padding">
              <div className="container">
                <div className="important-title title-link-service">
                  <SectionTitle title={"Cases"} titleColor="#000" /> 
                  <button type="button" name="see-btn-3" onClick={(e) => handleSeeAll(e, casesPosts[0]?.section?.type_id)}>
                    <SeeAll seeLink={translations?.see_all} />
                  </button>
                </div>
                <div className="row row-mobile-slider">
                  <div className="cases-box">
                    {loader && <Loader />}
                    {!loader &&
                      casesPosts?.map((item, index) => {
                        let allLanguage = locale;
                        if (
                          item?.additional?.shared_locale &&
                          item?.additional?.shared_locale?.image
                        ) {
                          allLanguage = item?.additional.shared_locale.image;
                        }
                        return (
                          <div className="case-item" key={index}>
                            <Link
                              href={
                                item?.slugs?.filter(
                                  (x) => x.locale === locale
                                )[0]?.slug
                              }
                              className="case-img"
                            >
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
                            </Link>
                            <div className="case-text">
                              <div className="text__case_01">
                                <div
                                  className="text"
                                  dangerouslySetInnerHTML={{
                                    __html: item?.text,
                                  }}
                                />
                              </div>
                              <div className="read-more-box">
                                <Link
                                  href={
                                    item?.slugs?.filter(
                                      (x) => x.locale === locale
                                    )[0]?.slug
                                  }
                                  className="read-more-link"
                                >
                                 {translations?.read_more}
                                </Link>
                                <GreenArrow class="read-more-box" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default List;
