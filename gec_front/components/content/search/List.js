import CloseIcon from "@/components/Icons/CloseIcon";
import SeccondSearchIcon from "@/components/Icons/SeccondSearchIcon";
import DownVector from "@/components/Icons/DownVector";
import SelectCloseIcon from "@/components/Icons/SelectCloseIcon";
import ServiceSelectItem from "@/components/ServicesComponent/ServiceSelectItem";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader/Loader";
import { directoryTypes } from "@/core/directories/constants";
import { getDirectories } from "@/core/directories/requests";
import { getSearchResults, getSectionPosts } from "@/core/sections/requests";
import { useTranslations } from "@/core/Translations/context";

const List = (props) => {
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();
  const [keyword, setKeyword] = useState("");
  const [openBusiness, setOpenBusiness] = useState(false);
  const [openChallenges, setOpenChallenges] = useState(false);
  const [theArray, setTheArray] = useState(
    Array.isArray(router.query.directories)
      ? router.query.directories
      : router.query.directories
      ? [router.query.directories]
      : []
  );
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

  const [data, setData] = useState();

  const showSearchPosts = router.asPath.includes("?");

  useEffect(() => {
    const combinedDirectories = [
      ...directoriesBusinessNeeds,
      ...directoriesBusinessChallenges,
    ];

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
      setIdArray(idItemsArray);
      setTheArray(itemsArray);
    } else {
      let clickedItem = item.currentTarget.id;
      setIdArray((prevIdArray) =>
        prevIdArray.filter((el) => el !== clickedItem)
      );
      setTheArray((prevTheArray) =>
        prevTheArray.filter((el) => el.id !== clickedItem)
      );
      if (idArray.length < 2) {
        handleFilter();
      }
    }
  };

  const handleClear = () => {
    setKeyword("");
  };

  const getFilter = useCallback(() => {
    const query = {
      keyword: keyword,
      directories: idArray ?? undefined,
      page: router.query.page,
    };

    return query;
  }, [keyword, idArray, router.query.page]);

  const fetchDirectoriesBusinessNeeds = useCallback(() => {
    getDirectories(directoryTypes.business_needs).then((response) => {
      setHasMore(!!response.directories.next_page_url);
      setDirectoriesBusinessNeeds([...response?.directories?.data]);
    });
  }, [directoryTypes?.business_needs]);

  const fetchDirectoriesBusinessCahallenges = useCallback(() => {
    getDirectories(directoryTypes.business_challenges).then((response) => {
      setHasMore(!!response.directories.next_page_url);
      setDirectoriesBusinessChallenges([...response?.directories?.data]);
    });
  }, [directoryTypes?.business_challenges]);

  useEffect(() => {
    fetchDirectoriesBusinessNeeds();
    fetchDirectoriesBusinessCahallenges();
  }, [locale]);

  const fetchData = async () => {
    setLoader(true);
    try {
      const query = getFilter();
      const posts = await getSearchResults(query.page ?? 1, query);
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
      keyword: keyword,
      directories: idArray ?? undefined,
      page: router.query.page,
    };

    router.push(
      {
        query: { ...query },
        pathname: `/${locale}${router.asPath?.split("?")[0]}`,
      },
      undefined,
      {
        shallow: true,
        locale: false,
      }
    );
  };

  const handleRemoveItem = (event) => {
    let clickedItem = event.id;
    setIdArray((prevIdArray) => prevIdArray.filter((el) => el !== clickedItem));
    setTheArray((prevTheArray) =>
      prevTheArray.filter((el) => el.id !== clickedItem)
    );
    if (idArray.length < 2) {
      handleFilter();
    }
  };

  return (
    <section>
      <div className="search-page padding">
        <div className="container">
          <div className="search-form">
            <form onSubmit={handleFilter}>
              <input
                type="text"
                name="search"
                placeholder={translations?.placeholder_search}
                onChange={(e) => {
                  setKeyword(e.currentTarget.value);
                }}
                value={keyword}
              />
              <button type="button" className="search-icon-0" onClick={handleFilter}>
                <SeccondSearchIcon />
              </button>
              <button
                type="button"
                className="clear-icon"
                onClick={handleClear}
              >
                <CloseIcon />
              </button>
            </form>
         {showSearchPosts &&
           <>
           {!loader && (
                <div className="showing-box">
                  {locale == "en"
                    ? `Showing ${
                        totalPostItem > perPagePostItem
                          ? perPagePostItem
                          : totalPostItem
                      } - ${perPagePostItem ?? ""} of ${
                        totalPostItem ?? ""
                      } Results`
                    : locale == "ka"
                    ? `ნაჩვენებია ${
                        totalPostItem > perPagePostItem
                          ? perPagePostItem
                          : totalPostItem
                      } - ${perPagePostItem ?? ""} შედეგი ${
                        totalPostItem ?? ""
                      }-დან`
                    : locale == "ru"
                    ? `Показаны ${
                        totalPostItem > perPagePostItem
                          ? perPagePostItem
                          : totalPostItem
                      } - ${perPagePostItem ?? ""} из ${
                        totalPostItem ?? ""
                      } результатов`
                    : ""}
                </div>
              )}
           </>
         }
          </div>
          {!loader && (
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
                      <button type="button" onClick={handleFilter}>{translations?.apply}</button>
                    </div>
                  </div>
                  <div className="business-challanges-flex-box">
                    <div
                      className="bn-ch-box business-needs"
                      onClick={() => {
                        setOpenBusiness(!openBusiness);
                        setOpenChallenges(false);
                      }}
                    >
                      <h3
                        style={{ color: openBusiness ? "#049878" : "#6B6B6B" }}
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
                  </div>
                </div>
                <div
                  className={`filter-btn mobile-hidden-apply-btn ${
                    theArray.length > 0 || keyword.length > 3
                      ? "active-button"
                      : ""
                  }`}
                >
                  <button type="button" onClick={handleFilter}>
                    {" "}
                    {translations?.apply}
                  </button>
                </div>
                <div
                  className="bn-ch-list business-list"
                  style={{ display: openBusiness ? "block" : "none" }}
                >
                  <ul>
                    {directoriesBusinessNeeds.map((item, index) => {
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
                    {directoriesBusinessChallenges.map((item, index) => {
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
          )}
          {showSearchPosts && (
            <>
              {loader && <Loader />}
              {!loader && (
                <div className="search-results-box">
                  {data?.map((item, index) => {
                    const slug = item?.slugs?.find((x) => x.locale === locale);
                    return (
                      <Link
                        href={slug?.slug}
                        className="search-result-item"
                        key={item.id}
                      >
                        <div className="search-section-title">
                          {item?.section?.title}
                        </div>
                        <h1>{item.title}</h1>
                        <div
                          className="text"
                          dangerouslySetInnerHTML={{
                            __html: item?.description,
                          }}
                        />
                        <span>{translations?.read_more}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
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
        ) : null}
      </div>
    </section>
  );
};

export default List;
