import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import GreenArrow from "../Icons/GreenArrow";
import moment from "moment/moment";
import { useTranslations } from "@/core/Translations/context";

const ProjectItem = (props) => {
  const end = moment(props.endDate, "DD/MM/YYYY")
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();

  const momentStDate = useMemo(() => {
    return moment(props.startDate, "DD/MM/YYYY");
  }, [props.startDate, locale]);
  const momentEnDate = useMemo(() => {
    return moment(props.endDate, "DD/MM/YYYY");
  }, [props.endDate, locale]); 
  
  return (
    <Link href={props?.slug} className={`project-item ${props.class}`}>
      <div className="project-item-img">
        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props.img}`} alt={props.alt} />
        <div className="project-date">
          <div className="date-01">
            <div className="date-co">
              <div className="start-date">
                <span className="start-date month">
                  {momentStDate.format("MMM")}
                </span>
                <span className="start-date day">
                  {momentStDate.format("DD")},
                </span>
                <span className="start-date year">
                  {momentStDate.format("YYYY")}
                </span>
              </div>
              {props.endDate && <span className="sm-line"></span>}
              {props.endDate && (
                <div className="end-date">
                  <span className="end-month">
                    {momentEnDate.format("MMM")}
                  </span>
                  <span className="day">
                    {momentEnDate.format("DD")},
                  </span>
                  <span>{momentEnDate.format("YYYY")}</span>
                </div>
              )}
            </div>
            <span className="line-date"></span>
            <div className="completed-box">
              {moment(end).isAfter(new Date()) || !props.endDate ? (
                <span style={{ color: "#F0B91C" }}>{translations?.ongoing}</span>
              ) : (
                <span style={{ color: "#049879" }}>{translations?.completed}</span>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="project-text">
        <div className="text" dangerouslySetInnerHTML={{ __html: props?.text }} />
        <div className="text-desc" dangerouslySetInnerHTML={{ __html: props?.desc }} />
        <div className="read-more-box">
          <span className="read-more-link">{translations?.read_more}</span>
          <GreenArrow class="read-more-box" />
        </div>
      </div>
    </Link>
  );
};

export default ProjectItem;
