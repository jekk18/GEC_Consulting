import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import LoadList from "@/components/LoadList/LoadList";
import DirectoryLoadList from "@/components/LoadList/DirectoryLoadList";
import moment from "moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useTranslations } from "@/core/Translations/context";

const Detail = (props) => {
  const translations = useTranslations();
  const router = useRouter();
  const { locale } = router;
  const end = moment(props?.page?.end_date, "DD/MM/YYYY");

  const services = props?.page?.relates?.filter((x) => x.type === "service");
  const clients = props?.page?.relates?.filter((x) => x.type === "clients");

  const needs = props?.page?.directories?.filter((x) => x.type_id === 1);
  const challanges = props?.page?.directories?.filter((x) => x.type_id === 2);

  const agency = props?.page?.directories?.filter((x) => x.type_id === 3);
  const countries = props?.page?.directories?.filter((x) => x.type_id === 5);
  const industries = props?.page?.directories?.filter((x) => x.type_id === 4); 

  const momentStDate = useMemo(() => {
    return moment(props?.page?.start_date, "DD/MM/YYYY");
  }, [props?.page?.start_date, locale]);
  const momentEnDate = useMemo(() => {
    return moment(props?.page?.end_date, "DD/MM/YYYY");
  }, [props?.page?.end_date, locale]);

  return (
    <>
      <HorizontalBar overId={"overId-01"} page={props?.page} />
      <section id="overId-01">
        <div className="project-detail-page padding-b">
          <div className="container">
            <div className="detail-project-box">
              <div className="left-img">
                <img
                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.page?.image?.file}`}
                  alt={props?.page?.image?.alt}
                />
                <div className="project-date">
                  <div className="date-01">
                    <div className="date-co">
                      <div className="start-date">
                        <span className="start-date month">
                          {momentStDate.format("MMMM")}
                        </span>
                        <span className="start-date year">
                          {momentStDate.format("YYYY")}
                        </span>
                      </div>
                      {props?.page?.end_date && (
                        <span className="sm-line"></span>
                      )}
                      {props?.page?.end_date && (
                        <div className="end-date">
                          <span className="end-month">
                            {momentEnDate.format("MMMM")}
                          </span>
                          <span>{momentEnDate.format("YYYY")}</span>
                        </div>
                      )}
                    </div>
                    <span className="line-date"></span>
                    <div className="completed-box">
                      {moment(end).isAfter(new Date()) || !props?.page?.end_date ? (
                        <span style={{ color: "#F0B91C" }}>
                          {translations?.ongoing}
                        </span>
                      ) : (
                        <span style={{ color: "#049879" }}>
                          {translations?.completed}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="project-detail-b-c">
                <div className="business-needs-detail-list bc-right-box">
                  {
                    needs?.length>0 && <h2>{translations?.business_needs}</h2>
                  } 
                  <ul>
                    {needs?.map((item, index) => {
                      return <li key={index}>{item.title}</li>;
                    })}
                  </ul>
                </div>
                <div className="challenges-detail-list bc-right-box">
                   {challanges?.length>0 && <h2>{translations?.challenges}</h2>}
                  <ul>
                    {challanges?.map((item, index) => {
                      return <li key={index}>{item.title}</li>;
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div className="p-l-list-box">
              {clients && clients?.length> 0 &&(
                <LoadList
                  data={clients}
                  key={clients?.id}
                  title={translations?.clients}
                />
              )}
              {agency && agency.length> 0 &&(
                <DirectoryLoadList
                  data={agency}
                  key={agency?.id}
                  title={translations?.agency}
                />
              )}
              {industries && industries.length>0 &&(
                <DirectoryLoadList
                  data={industries}
                  key={industries?.id}
                  title={translations?.industries}
                />
              )}
              {countries && countries.length>0 &&(
                <DirectoryLoadList
                  data={countries}
                  key={countries?.id}
                  title={translations?.countries}
                />
              )}
              {services && services.length>0 &&(
                <LoadList
                  data={services}
                  key={services?.id}
                  title={translations?.services}
                />
              )}
            </div>
            <div
              className="project-detail-text"
              dangerouslySetInnerHTML={{ __html: props?.page?.text }}
            />
          </div>
        </div>
      </section>
      {props.components}
    </>
  );
};

export default Detail;
