import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import React, { useEffect, useState } from 'react'

const List = (props) => {
  const router = useRouter();
  const { locale } = router;
  const [currentPage, setCurrentPage] = useState();
  const [totalPostItem, setTotalPostItem] = useState();
  const [perPagePostItem, setPerPagePostItem] = useState();

  const handlePageChange = (page) => {
    router.push({ query: { ...router.query, page }, pathname: `/${locale}${router.asPath?.split('?')[0]}` }, undefined, {
      shallow: true,
      locale: false,
    });
  };
  return (
    <>
      <HorizontalBar overId={'overId-01'} page={props?.page}  />
      <section id='overId-01'>
        <div className="submenu-page padding-b">
          <div className="container">
            <div className="submenu-text" dangerouslySetInnerHTML={{ __html: props.page?.text }}>
            </div>
            <div className="submenu-box"> 
              {
                props.page?.children?.length > 0 &&
                props.page?.children?.map((item, index) => {
                  return (
                    < Link href={item?.slug?.slug} className="submenu-item" >
                      <div className="s-item-title">
                        {item?.title}
                      </div>
                      <div className="submenu-img">
                        <img src="/img/submenu-img.png" alt="submenu" />
                      </div>
                    </Link>)
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
      </section>
      {props?.components}
    </>
  );
};

export default List;
