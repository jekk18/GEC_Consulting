import React, { useCallback, useEffect, useMemo, useState } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";

const List = (props) => {
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();
  const [data, setData] = useState();
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

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

  useEffect(() => {
    fetchData();
  }, [props.page.id, router.query, locale]);
 
  return (
    <>
      <HorizontalBar overId={"overId-01"} page={props?.page} />
      <section id="overId-01">
        {loader && <Loader />}
        {!loader && (
          <div className="clients-list-page padding-b">
            <div className="container">
              <div className="clients-list-box">
                {data?.map((item, index) => {
                  if (item.published === 1 && item.active === 1) {
                    return (
                      <Link href={item?.additional ?.redirect_link? item?.additional?.redirect_link : ''} className="clients-list-item" target="blank" key={item.id} style={{pointerEvents: item?.additional?.redirect_link ? 'initial' : 'none'}}>
                        <div className="clients-img">
                        {item?.list_image?.file &&
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.list_image?.file}`}
                              alt={item?.list_image?.alt}
                              loading="lazy"
                            />
                        }
                        </div>
                        {/* <h1>{item.title}</h1> */}
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
      {props?.components}
    </>
  );
};

export default List;
