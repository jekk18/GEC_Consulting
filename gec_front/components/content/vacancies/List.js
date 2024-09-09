import React, { useMemo, useState, useEffect, useCallback, useRef } from "react";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import { useRouter } from "next/router";
import Pagination from "@/components/Pagination/Pagination";
import Link from "next/link";
import DatePicker, {
  DateObject,
  getAllDatesInRange,
} from "react-multi-date-picker";
import "react-datepicker/dist/react-datepicker.css";
import "react-multi-date-picker/styles/colors/green.css";
import CalendarIcon from "@/components/Icons/CalendarIcon";
import DownVector from "@/components/Icons/DownVector";
import GreenArrow from "@/components/Icons/GreenArrow"; 
import moment from "moment/moment"; 
import { getSectionPosts } from "@/core/sections/requests";
import Loader from "@/components/Loader/Loader";
import PublicationItem from "@/components/NewsAndPublications/PublicationItem";
import PopUp from "@/components/PopUp/PopUp"; 
import Alert from "@/components/Alert/Alert";
import { useTranslations } from "@/core/Translations/context";
 

const List = (props) => { 
     const popupRef = useRef(null);
     const [popActive, setPopActive] = useState(false);
     const translationsR = useTranslations();
    const router = useRouter();
    const { locale } = router;
    const [currentPage, setCurrentPage] = useState();
    const [totalPages, setTotalPages] = useState();
    const [totalPostItem, setTotalPostItem] = useState();
    const [perPagePostItem, setPerPagePostItem] = useState();
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);
    const [active, setActive] = useState(null)
    const [startDate, setStartDate] = useState(router.query.start_date)
    const [endDate, setEndDate] = useState(router.query.end_date)
    const [dates, setDates] = useState([]);
    const [allDates, setAllDates] = useState([]);
 
    const [open, setOpen] = useState(false);
    const [succsess, setSuccess] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [dateExpired, setDateExpired] = useState(true);
     const [postId, setPostId] = useState(null);

    const translations = {
      en: {
        weekDays: ["S", "M", "T", "W", "T", "F", "S"],
        months: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
      ka: {
        weekDays: ["კ", "ო", "ს", "ო", "ხ", "პ", "შ"],
        months: [
          "იან",
          "თებ",
          "მარ",
          "აპრ",
          "მაი",
          "ივნ",
          "ივლ",
          "აგვ",
          "სექ",
          "ოქტ",
          "ნოე",
          "დეკ",
        ],
      },
      ru: {
        weekDays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        months: [
          "Янв",
          "Фев",
          "Мар",
          "Апр",
          "Май",
          "Июн",
          "Июл",
          "Авг",
          "Сен",
          "Окт",
          "Ноя",
          "Дек",
        ],
      },
    };
     
  const { weekDays, months } = translations[locale] || translations.en; 

  const handlePageChange = (page) => {
    router.push({ query: { ...router.query, page }, pathname: `/${locale}${router.asPath?.split('?')[0]}` }, undefined, {
      shallow: true,
      locale: false,
    });
  };
   
  useEffect(() => {
    const dateArr = [];
    allDates?.map((index) => dateArr.push(index.format("DD/MM/YYYY")));
    const start = dateArr[0];
    const end = dateArr[dateArr.length - 1];
    
    setStartDate(start);
    setEndDate(end);
  }, [dates, allDates]);  

const getFilter = useCallback(() => {
  const query = { 
    start_date: startDate ?? undefined,
    end_date: endDate ?? undefined,
    page: router.query.page,
  };

  return query;
}, [startDate, endDate, router.query.page]);
   
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
    start_date: startDate ?? undefined,
    end_date: endDate ?? undefined,
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

useEffect(() => {
     function handleClickOutside(event) {
       if (popupRef.current && !popupRef.current.contains(event.target)) {
         setPopActive(false);
       }
     }
 
     document.addEventListener("mousedown", handleClickOutside);
     return () => {
       document.removeEventListener("mousedown", handleClickOutside);
     };
   }, [popupRef]);
 
   const handleClickPopUp = (postId, newValue) => {
     setPostId(postId);
     setPopActive(newValue);
   }; 
   const handleCloseAlert = (openValue) => {
     setOpen(openValue);
   };
   const setAlertInfo = (succsess, responseText, openValue) => {
     setOpen(openValue);
     setSuccess(succsess);
     setResponseText(responseText);
   };
   
   
  return (
    <>
      
      <HorizontalBar overId={'overId-01'} page={props?.page}  />
      <section id='overId-01'>
        <div className="publication-list-page vacancies-list-page padding-b">
          <div className="container">
            <div className="services-filter-box">
               <div className="filtered-box">
                <div className="filter-left filter-left-2">
                  <div className="filter-title-box">
                    <h2 className="filter-title">{translationsR?.filter_by}</h2>
                    <div
                      className={`filter-btn hidden-apply-btn ${
                        active  ? "active-button" : ""
                      }`}
                    >
                      <button type="button" onClick={handleFilter}>{translationsR?.apply}</button>
                    </div>
                  </div>
                  <div className={`calendar-range-box ${active ? 'calendar-active' : ''}`}> 
                        <div className="calendar-title">
                        <CalendarIcon />
                        <h2>{translationsR?.pick_date_range}</h2>
                        <DownVector color="#163749" />
                      </div> 
                    <div className="picker-calendar">
                     <div className="calendar-icon">
                     <CalendarIcon />
                     </div>
                      <DatePicker
                        numberOfMonths={1}
                        className="dataPPPicker green"
                        rangeHover={true}
                        range
                        calendarPosition="bottom-right"
                        fixMainPosition
                        value={dates}
                        weekDays={weekDays}
                        months={months}
                        onChange={(dateObjects) => {
                            setActive(true);
                            setDates(dateObjects);
                            setAllDates(getAllDatesInRange(dateObjects));
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`filter-btn mobile-hidden-apply-btn ${
                    active ? "active-button" : ""
                  }`}
                >
                  <button type="button" onClick={handleFilter}>{translationsR?.apply}</button>
                </div>
              </div>
            </div> 
            <div className="text-page-text general-text-01"  dangerouslySetInnerHTML={{
              __html: props?.page?.text,
            }} />
            <div className="vacancies-list-box">
            {loader && <Loader />}
            {!loader &&
             data?.map((item, index) => { 
               if (item.published === 1 && item.active === 1) {  
                    const startDate = moment(item?.start_date, "DD/MM/YYYY");
                    const endDate = moment(item?.end_date, "DD/MM/YYYY");   
                    return (
                         <div className="vacancy-item" key={item.id}>
                         <div className="vacancy-img">
                            {
                              item?.list_image?.file ? 
                              <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.list_image?.file}`} alt={item?.list_image?.alt} />
                              :
                              <img src="/img/vacancy.png" alt="vacancy" />
                            }
                           <h1>{item.title}</h1>
                         </div>
                         <div className="vacancy-date publish-date">
                            <h3>{translationsR?.publish_date}</h3><span>{startDate.format("MMMM DD, YYYY")}</span>
                         </div>
                         <div className="vacancy-date Deadline">
                         <h3>{translationsR?.deadline}</h3><span>{endDate.format("MMMM DD, YYYY")}</span>
                         </div>
                         <div className="apply-box">
                           <div className="read-more-box">
                               <Link href={item?.slug?.slug} className="read-more-link">{translationsR?.read_more}</Link>
                               <GreenArrow class="read-more-box" />
                           </div>
                          {item?.additional?.registration?.enabled == 1 &&
                                 <>
                                 <span className="vacancy-line"></span>
                                {
                                  item?.additional?.registration?.link ? 
                                  <Link href={item?.additional?.registration?.link} className="vacancy-apply-link" target="blank">{translationsR?.vacancy_form_apply_btn}</Link>
                                  :
                                  <button type="button" name="btn" className="vacancy-apply-link vacancy-apply-btn" onClick={() => handleClickPopUp(item.id, true)}>{translationsR?.vacancy_form_apply_btn}</button>
                                }
                                </>
                          }
                         </div>
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
        {popActive && (
        <div className="pop-up-register">
          <div className="pop-up-box" ref={popupRef}>
            <PopUp
              class="pop-up-form"
              click={handleClickPopUp}
              alertInfo={setAlertInfo}
              post_id={postId}
            />
          </div>
        </div>
      )}
       {
            open && (
              <Alert click={handleCloseAlert} succsess={succsess} responseText={responseText} />
            )
          }
      </section>
      {props?.components} 
    </>
  );
};

export default List;
