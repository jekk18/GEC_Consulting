import React, { useEffect, useState } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import GreenArrow from "@/components/Icons/GreenArrow";
import { useTranslations } from "@/core/Translations/context";

const List = (props) => {
  const translations = useTranslations();
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();
  const [data, setData] = useState();
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const posts = await getSectionPosts(
          props.page.id,
          router.query.page ?? 1
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
    fetchData();
  }, [props.page.id, router.query.page, locale]);

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

  return (
    <>
      <HorizontalBar overId={"overId-01"} page={props?.page} />
      <section id="overId-01">
        {loader && <Loader />}
        {!loader && (
          <div className="project-page padding-b">
            <div className="container">
              <div
                className="service-list-text"
                dangerouslySetInnerHTML={{
                  __html: props?.page?.text,
                }}
              />
              <div className="case-list-box">
                {loader && <Loader />}

                {!loader &&
                data?.map((item, index) => {
                  if (item.published === 1 && item.active === 1) { 
                    return (
                      <Link
                        key={item.id}
                        href={
                          item?.slug?.slug
                        }
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
        )}
      </section>
    </>
  );
};

export default List;
