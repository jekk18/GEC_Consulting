import React, { useCallback, useEffect, useMemo, useState } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import DownVector from "@/components/Icons/DownVector";
import SelectCloseIcon from "@/components/Icons/SelectCloseIcon";
import ServiceSelectItem from "@/components/ServicesComponent/ServiceSelectItem";
import { useRouter } from "next/router";
import ProjectItem from "@/components/ProjectsComponent/ProjectItem";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import GreenArrow from "@/components/Icons/GreenArrow";
import { directoryTypes } from "@/core/directories/constants";
import { getDirectories } from "@/core/directories/requests";
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import { useDebounce } from "@/helpers/use-debounce";
import { useTranslations } from "@/core/Translations/context";

const List = (props) => {
  // console.log(props, 'project-props')
  const router = useRouter();
  const { locale } = router;
  const translations= useTranslations();
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
  const [directoriesBusinessChallenges, setDirectoriesBusinessChallenges] = useState([]);
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
    const combinedDirectories = [...directoriesBusinessNeeds, ...directoriesBusinessChallenges];

    setDirectories(combinedDirectories);
  }, [directoriesBusinessNeeds, directoriesBusinessChallenges]);


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
  }, [idArray, router.query.page]);


  const fetchDirectoriesBusinessNeeds = useCallback(() => {
    getDirectories(directoryTypes.business_needs).then(
      (response) => {
        setHasMore(!!response.directories.next_page_url)
        setDirectoriesBusinessNeeds([...response?.directories?.data])
      }
    )
  }, [directoryTypes?.business_needs]);

  const fetchDirectoriesBusinessCahallenges = useCallback(() => {
    getDirectories(directoryTypes.business_challenges).then(
      (response) => {
        setHasMore(!!response.directories.next_page_url)
        setDirectoriesBusinessChallenges([...response?.directories?.data])
      }
    )
  }, [directoryTypes?.business_challenges]);

  useEffect(() => {
    fetchDirectoriesBusinessNeeds();
    fetchDirectoriesBusinessCahallenges();
  }, [locale])


  const fetchData = async () => {
    setLoader(true);
    try {
      const query = getFilter();
      const posts = await getSectionPosts(
        props.page.id,
        query.page ?? 1,
        query,
      );
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

  
  const cls =
  data?.length > 1
      ? ""
      : "one-project-item";
 

  return (
    <>
      <HorizontalBar overId={'overId-01'} page={props?.page}/>
      <section id='overId-01'>
        <div className="project-page padding-b">
          <div className="container">
            <div className="services-filter-box">
              <div className="filtered-box">
                <div className="filter-left">
                  <div className="filter-title-box">
                    <h2 className="filter-title"></h2>
                    <div
                      className={`filter-btn hidden-apply-btn ${theArray.length > 0 ? "active-button" : ""
                        }`}
                    >
                      <button type="button" onClick={handleFilter}>{translations?.apply}</button>
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
                          className={`down-arrow ${openBusiness ? "rotate-arrow" : ""
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
                          className={`down-arrow ${openChallenges ? "rotate-arrow" : ""
                            }`}
                        >
                          <DownVector color={"#6B6B6B"} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`filter-btn mobile-hidden-apply-btn ${theArray.length > 0 ? "active-button" : ""
                    }`}
                >
                  <button type="button" onClick={handleFilter}>{translations?.apply}</button>
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
                          idInArray={idArray.includes(item.id.toString())} />
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
                          idInArray={idArray.includes(item.id.toString())} />
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
            <div
              className="service-list-text"
              dangerouslySetInnerHTML={{
                __html: props?.page?.text,
              }}
            />
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
        </div>
      </section>
      {props.components}
    </>
  );
};

export default List;
