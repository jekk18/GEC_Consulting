import React, { useEffect, useState } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import LinkOfficeIcon from "@/components/Icons/LinkOfficeIcon"; 
import { useTranslations } from "@/core/Translations/context";

const List = (props) => {
  const [active, setActive] = useState(null);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();

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
          <div className="offices-page padding-b">
            <div className="container">
              <div className="offices-list-box">
                {data?.map((item) => {
                  if (item.published === 1 && item.active === 1) {
                    return (
                      <div className="offices-item" key={item.id}>
                        <div className="left-office-info">
                          <div className="office-link">
                            <img src="/img/office-svg.svg" alt="office" />
                            <Link 
                              href={
                                item?.additional?.location_link
                                  ? item?.additional?.location_link
                                  : "#"
                              }
                              target="_blank"
                              style={{
                                pointerEvents: item?.additional?.location_link
                                  ? "initial"
                                  : "none",
                              }}
                            >
                              {item.title}
                              <div className="ofc-link-icon">
                                <LinkOfficeIcon />
                              </div>
                            </Link>
                          </div>
                          {item?.locale_additional?.working_hours && (
                            <div className="working-hours office-contact">
                              <h2>{translations?.working_hours}</h2>
                              <span>
                                {item?.locale_additional?.working_hours}
                              </span>
                            </div>
                          )}
                         {item?.additional?.email && <a
                            href="mailto:info@gec-consulting.com"
                            className="offices-email office-contact"
                          >
                            <h2>{translations?.email}:</h2>
                            <span>{item?.additional?.email}</span>
                          </a>}
                         {item?.additional?.phone && <a
                            href="tel:+995 99966 236 555"
                            className="offices-phone office-contact"
                          >
                            <h2>{translations?.phone}: </h2>
                            <span>{item?.additional?.phone}</span>
                          </a>}
                        </div>
                        {
                            item?.additional?.location &&
                            <div className="right-office-map">
                            <iframe
                              src={item?.additional?.location}
                              width="100%"
                              height="100%"
                              allowFullScreen=""
                              loading="lazy"
                              referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                          </div>
                        }
                      </div>
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
      {props.components}
    </>
  );
};

export default List;
