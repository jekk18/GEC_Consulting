import React, { useEffect, useState } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import Link from "next/link";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import SubArrow from "@/components/Icons/SubArrow"; 

  
const List = (props) => {

  const [active, setActive] = useState(null)
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPages] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();
  const [data, setData] = useState([]);
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
      const handleActive = ( id ) => {
        if (active === id) {
            setActive(null)
        } else {
            setActive(id);
        }
      }

return (
    <>
      <HorizontalBar overId={"overId-01"} page={props?.page} />
      <section id="overId-01">
       {loader && <Loader />}
       {!loader && 
          <div className="faq-page padding-b">
          <div className="container">
            <div className="faq-list-box">
                {
                    data?.map((item) => {
                      if (item.published === 1 && item.active === 1) {
                        
                        return (
                          <div className="faq-list-item" key={item.id}>
                          <div className="faq-title">
                            <h1>{item.title}</h1>
                            <div className={`faq-arrow ${active === item.id ? 'faq-active' : ''}`} onClick={() => handleActive(item.id)}>
                              <SubArrow />
                            </div>
                          </div>
                          {
                              item.id === active &&  
                              <div className="faq-text" dangerouslySetInnerHTML={{
                                __html: item?.text, }} />
                          }
                        </div>
                      )
                      }
                    
                    })
                } 
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
       }
      </section> 
      {props.components}
    </>
  );
};

export default List;
