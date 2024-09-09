import { useTranslations } from "@/core/Translations/context";
import { useEffect } from "react";

const { useRouter } = require("next/router");

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const translations = useTranslations();
    const router = useRouter();
    const query = router.query;
  
    const handlePageChange = (page) => {
      onPageChange(page);
    };
  
    const handlePrevious = (e) => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };
  
    const handleNext = () => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };
  
    const handleNumberedPage = (page) => {
      handlePageChange(page);
    };

    useEffect(() => {
      setTimeout(() => {
       window.scrollTo({
         top: 0,
         behavior: 'smooth', // You can change this to 'auto' for an instant scroll
       }); 
      }, 800);
   },[query?.page])
  
    const getPageNumbers = () => {
      const pageNumbers = [];
      const maxVisiblePages = 2;
  
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      let endPage = startPage + maxVisiblePages - 1;
  
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
  
      for (let page = startPage; page <= endPage; page++) {
        pageNumbers.push(page);
      }
  
      return pageNumbers;
    };
  
    return (
      <div className="pagination-flex">
        <button
          onClick={handlePrevious}
          className={
            currentPage > 1 ? "pagination-btn" : "pagination-btn p-p-disable"
          }
        >
          {translations?.prev}
        </button> 
            <button className="pagination-number current-page"> 
            <span className="slider-items-current"> {(currentPage)?.toString()?.padStart(2,'0')} </span>
          </button> 
          <div className="pagination-line"></div>
            <button className="pagination-number total-page"> 
            <span className="slider-items-current"> {(totalPages)?.toString()?.padStart(2,'0')} </span>
          </button>  
        <button
          onClick={handleNext}
          className={
            currentPage < totalPages
              ? "pagination-btn"
              : "pagination-btn p-p-disable"
          }
        >
           {translations?.next}
        </button>
      </div>
    );
  };

  export default Pagination