import React from "react";
import GreenArrow from "../Icons/GreenArrow";
import Link from "next/link";
import moment from "moment"; 
import { useRouter } from "next/router";
import { useTranslations } from "@/core/Translations/context";

const PublicationItem = (props) => {
  
  const router = useRouter();
  const { locale } = router;  
  const translations = useTranslations();
  const momentDate = moment(props?.data?.additional?.date, "DD/MM/YYYY");
  
  
  const genericSlug = props?.data?.slugs?.find(x => x.locale === locale).slug;

  let publication;
  let file;
  let shareLocalefile = props?.data?.additional?.shared_locale?.gallery || locale;
  let shareLocalepublication = props?.data?.additional?.shared_locale?.publication || locale;

  if(props.component){ 
    file = props?.data?.files.find((x)=> x.locale === shareLocalefile && x.type == 'gallery')
    publication = props?.data?.files.find((x)=> x.locale === shareLocalepublication && x.type == 'publication')  
  } 

  const publicationIndicator = {
    "en": {
      publication: [
        {
          title: "Publication",
        } 
      ]
    },
    "ka": {
      publication: [
        {
          title: "პუბლიკაცია",
        } 
      ]
    },
    "ru": {
      publication: [
        {
          title: "Публикация",
        } 
      ]
    }
  };  
 

  return (
   <>
    {props.component ? (
      <div className={`_n_p-item publication-item__ ${props.class}`}>
      <Link
        href={`${genericSlug}`}
        className="item-img_n_p"
      >
        {file?.file ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.file}`}
            alt={file?.alt}
          />
        ) : (
          <img src="/img/project2.png" alt={"default"} />
        )}
        <div className="indicator-title">
          {publication?.file ? (
            <>
              <h3>{publicationIndicator[`${locale}`]?.publication[0]?.title}</h3>
              <div className="n_p-date pub-date">
                {momentDate.format("YYYY")}
              </div>
            </>
          ) : (
            <div className="n_p-date pub-date">
              {momentDate.format("MMMM DD, YYYY")}
            </div>
          )}
        </div>
      </Link>
      <div className="_n_p-text">
        <h1>{props?.data?.title}</h1>
        <div className="text">
          <div
            className="text_inside"
            dangerouslySetInnerHTML={{
              __html: props?.data?.text,
            }}
          />
        </div>
        <div className="read-more-box">
          <Link href={`${genericSlug}`} className="read-more-link">
          {translations?.read_more}
          </Link> 
          <GreenArrow className="read-more-box" />
        </div>
      </div>
    </div>
    ) : 
    (
      <div className={`_n_p-item publication-item__ ${props.class}`}>
      <Link
        href={props?.data?.slug?.slug}
        className="item-img_n_p"
      >
        {props?.data?.list_image?.file ? (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.data?.list_image?.file}`}
            alt={props?.data?.list_image?.alt}
          />
        ) : (
          <img src="/img/project2.png" alt={"default"} />
        )}
        <div className="indicator-title">
          {props?.data?.publication?.file ? (
            <>
              <h3>{publicationIndicator[`${locale}`]?.publication[0]?.title}</h3>
              <div className="n_p-date pub-date">
                {momentDate.format("YYYY")}
              </div>
            </>
          ) : (
            <div className="n_p-date pub-date">
              {momentDate.format("MMMM DD, YYYY")}
            </div>
          )}
        </div>
      </Link>
      <div className="_n_p-text">
        <h1>{props.data.title}</h1>
        <div className="text">
          <div
            className="text_inside"
            dangerouslySetInnerHTML={{
              __html: props.data.text,
            }}
          />
        </div>
        <div className="read-more-box">
          <Link href={props?.data?.slug?.slug} className="read-more-link">
          {translations?.read_more}
          </Link> 
          <GreenArrow className="read-more-box" />
        </div>
      </div>
    </div>
    )
    }
   </>
  );
};            

export default PublicationItem;
