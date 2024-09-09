import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import DownVector from "@/components/Icons/DownVector";
import SelectCloseIcon from "@/components/Icons/SelectCloseIcon";
import ServiceSelectItem from "@/components/ServicesComponent/ServiceSelectItem";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import GreenArrow from "@/components/Icons/GreenArrow";
import { directoryTypes } from "@/core/directories/constants";
import { getDirectories } from "@/core/directories/requests";
import { getPostsByTypeId } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import ShareIcon from "@/components/Icons/ShareIcon";
import ShareComponent from "@/components/ShareComponents/ShareComponent";
import { useDebounce } from "@/helpers/use-debounce";
import ProjectItem from "@/components/ProjectsComponent/ProjectItem";
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
  const [typeId, setTypeId] = useState(router.query.type_id);

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

  const handlePageChange = (page) => {
    router.push(
      {
        query: { ...router.query, page },
        pathname: `/${locale}${router.asPath?.split("?")[0]}`,
      },
      undefined,
      {
        shallow: true,
        locale: false,
      }
    );
  };

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
      page: router.query.page,
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
  }, [directoryTypes?.business_needs]);

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
      const posts = await getPostsByTypeId(typeId, query.page ?? 1, query);
      setData(posts.posts.data);
      setCurrentPage(posts.posts.current_page);
      setTotalPages(posts.posts.last_page);
      setTotalPostItem(posts.posts.total);
      setPerPagePostItem(posts.posts.per_page);
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
      page: router.query.page,
    };

    router.push(
      {
        query: { ...router.query, ...query },
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

  const cls =
    data?.length > 1
      ? "project-component-item"
      : "project-component-item one-project-item";

  const title =
    typeId == 4
      ? "Services"
      : typeId == 5
      ? "Cases"
      : typeId == 7
      ? "Projects"
      : "See All";

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
                <h1>{title}</h1>
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
      {typeId == 4 ? (
        <section>
          <div className="services-list-page padding-b">
            <div className="container">
              <div className="services-list-box">
                {loader && <Loader />}
                {!loader &&
                  data?.map((item, index) => {
                    if (item.published === 1 && item.active === 1) {
                      return (
                        <Link
                          href={item?.slug?.slug}
                          className="service-item"
                          key={item.id}
                        >
                          <div className="serv-icon-box">
                            {item?.list_image?.file ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.list_image?.file}`}
                                alt={item?.list_image?.alt}
                                loading="lazy"
                              />
                            ) : (
                              ""
                            )}
                          </div>
                          <div className="title">{item?.title}</div>
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
                    }
                  })}
              </div>
            </div>
          </div>
        </section>
      ) : typeId == 5 ? (
        <section>
          <div className="project-page padding-b">
            <div className="container">
              <div className="case-list-box">
                {loader && <Loader />}

                {!loader &&
                  data?.map((item, index) => {
                    if (item.published === 1 && item.active === 1) {
                      return (
                        <Link
                          key={item.id}
                          href={item?.slug?.slug}
                          className="case-list-item"
                        >
                          <div className="c-list-img">
                            {item?.list_image?.file ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.list_image?.file}`}
                                alt={item?.list_image?.alt}
                                loading="lazy"
                              />
                            ) : (
                              <img
                                src="/img/default.png"
                                alt="default"
                                loading="lazy"
                              />
                            )}
                          </div>
                          <div className="c-text">
                            <div className="text">{item.title}</div>
                            <div className="read-more-box">
                              <span className="read-more-link">{translations?.read_more}</span>
                              <GreenArrow class="read-more-box" />
                            </div>
                          </div>
                        </Link>
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </section>
      ) : typeId == 7 ? (
        <section>
          <div className="project-page padding-b">
            <div className="container">
              <div className="project-list-box">
                {loader && <Loader />}
                {!loader &&
                  data?.map((item, index) => {
                    if (item.published === 1 && item.active === 1) {
                      return (
                        <ProjectItem
                          class={cls}
                          key={item.id}
                          slug={item?.slug?.slug}
                          img={item?.list_image?.file}
                          alt={item?.list_image?.alt}
                          text={item?.title}
                          desc={item?.description}
                          startDate={item?.start_date}
                          endDate={item?.end_date}
                        />
                      );
                    }
                  })}
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div></div>
      )}

      {totalPostItem > perPagePostItem ? (
        <div className="container">
          <div className="pagination pagination-2">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default List;
