import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import moment from "moment/moment";
import { useRouter } from "next/router";
import StatusIcon from "@/components/Icons/StatusIcon";
import LocationIcon from "@/components/Icons/LocationIcon";
import JobIcon from "@/components/Icons/JobIcon";
import ExperienceIcon from "@/components/Icons/ExperienceIcon";
import PopUp from "@/components/PopUp/PopUp";
import Alert from "@/components/Alert/Alert";
import { useTranslations } from "@/core/Translations/context";

const Detail = (props) => {
  const popupRef = useRef(null);
  const [popActive, setPopActive] = useState(false);
  const router = useRouter();
  const { locale } = router;
  // const translations = useTranslations();
  const [open, setOpen] = useState(false);
  const [succsess, setSuccess] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [dateExpired, setDateExpired] = useState(true);
  const translations = useTranslations();
  const end = moment(
    props?.page?.additional?.registration?.end_date,
    "DD/MM/YYYY"
  );

  const status = props?.page?.directories?.filter((x) => x.type_id === 9);
  const location = props?.page?.directories?.filter((x) => x.type_id === 5);
  const type = props?.page?.directories?.filter((x) => x.type_id === 8);

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

  const handleClickPopUp = (newValue) => {
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

  const momentPublishDate = useMemo(() => {
    return moment(props?.page?.start_date, "DD/MM/YYYY");
  }, [props?.page?.start_Date, locale]);
  const momentDeadlineDate = useMemo(() => {
    return moment(props?.page?.end_date, "DD/MM/YYYY");
  }, [props?.page?.end_date, locale]);

  return (
    <>
      <HorizontalBar page={props.page} overId={"overId-01"} />
      <section id="overId-01">
        <div className="vacancy-detail-page padding-b">
          <div className="container">
            <div className="vacancy-desc-date">
              <div className="v-d-date-box">
                <div className="v-d-date v-d-publish-date">
                  <h1>{translations?.publish_date}</h1>
                  <span>{momentPublishDate.format("DD / MM / YYYY")}</span>
                </div>
                <span className="line-010"></span>
                <div className="v-d-date v-d-deadline-date">
                  <h1>{translations?.deadline}</h1>
                  <span>{momentDeadlineDate.format("DD / MM / YYYY")}</span>
                </div>
              </div>
              <div className="v-d-line"></div>
              <div className="v-d-button">
                {props?.page?.additional?.registration?.enabled == 1 &&
                props?.page?.additional?.registration?.link ? (
                  // Condition 1: Link is present
                  moment(end).isAfter(new Date()) ||
                  !props?.page?.additional?.registration?.end_date ? (
                    <Link
                      href={props?.page?.additional?.registration?.link}
                      target="blank"
                    >
                      {translations?.vacancy_form_apply_btn}
                    </Link>
                  ) : (
                    <span>{translations?.registration_closed}</span>
                  )
                ) : props?.page?.additional?.registration?.enabled == 1 &&
                  !props?.page?.additional?.registration?.link ? (
                  // Condition 2: Link is not present
                  moment(end).isAfter(new Date()) ||
                  !props?.page?.additional?.registration?.end_date ? (
                    <button type="button" onClick={handleClickPopUp}>
                      {translations?.vacancy_form_apply_btn}
                    </button>
                  ) : (
                    <span>{translations?.registration_closed}</span>
                  )
                ) : null}
              </div>
            </div>
          </div>
          <div className="v-d-info-box">
            <div className="container">
              <div className="v-d-info">
                <div className="v-d-item">
                  <div className="v-d-icon">
                    <StatusIcon />
                  </div>
                  <div className="text">
                    <h2>{translations?.status}</h2>
                    <h3>{status?.[0]?.title}</h3>
                  </div>
                </div>
                <div className="v-d-item">
                  <div className="v-d-icon">
                    <LocationIcon />
                  </div>
                  <div className="text">
                    <h2>{translations?.location}</h2>
                    <h3>{location?.[0]?.title}</h3>
                  </div>
                </div>
                <div className="v-d-item">
                  <div className="v-d-icon">
                    <JobIcon />
                  </div>
                  <div className="text">
                    <h2>{translations?.job_type}</h2>
                    <h3>{type?.[0]?.title}</h3>
                  </div>
                </div>
                <div className="v-d-item">
                  <div className="v-d-icon">
                    <ExperienceIcon />
                  </div>
                  <div className="text">
                    <h2>{translations?.experience}</h2>
                    <h3>{props?.page?.locale_additional?.["experience"]}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div
              className="vacancy-detail-text"
              dangerouslySetInnerHTML={{ __html: props?.page?.text }}
            />
          </div>
        </div>
      </section>
      {popActive && (
        <div className="pop-up-register">
          <div className="pop-up-box" ref={popupRef}>
            <PopUp
              class="pop-up-form"
              click={handleClickPopUp}
              alertInfo={setAlertInfo}
              post_id={props?.page?.id}
            />
          </div>
        </div>
      )}
      {open && (
        <Alert
          click={handleCloseAlert}
          succsess={succsess}
          responseText={responseText}
        />
      )}
      {props?.components}
    </>
  );
};

export default Detail;
