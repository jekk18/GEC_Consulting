import React, { useEffect, useRef, useState } from "react";
import Fancybox from "../Fancybox/Fancybox";
import LoadList from "../LoadList/LoadList";

export const DetailPageComponent = (props) => {
  const minHeigthRef = useRef();
  const [height, setHeight] = useState(null);

  useEffect(() => {
    if (minHeigthRef.current) {
      setHeight(minHeigthRef.current.clientHeight - 30);
    }
  }, []); 

  return (
    <section id={props.overId}>
      <div className="detail-page-component padding-b">
        <div className="container">
          <div
            className={`detail-box ${props?.img?.file ? props.class : ""}`}
            style={{ minHeight: `${height}px` }}
          >
            {props.img && (
              <div className="detail-img">
                <Fancybox class="fancy">
                  <a
                    href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.img?.file}`}
                    data-fancybox="gallery"
                  >
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.img?.file}`}
                      alt="img-case"
                      loading="lazy"
                    />
                  </a>
                </Fancybox>
              </div>
            )}
            <div className="detail-right-b-and-c-list" ref={minHeigthRef}>
              {props?.businessNeeds?.length > 0 && (
                <div className="business-needs-detail-list bc-right-box">
                  <h2>{props.chNTitle}</h2>
                  <ul>
                    {props?.businessNeeds.map((item, index) => {
                      return <li key={index}>{item.title}</li>;
                    })}
                  </ul>
                </div>
              )}
              {props?.businessChallenges?.length > 0 && (
                <div className="challenges-detail-list bc-right-box">
                  <h2>{props.chCTitle}</h2>
                  <ul>
                    {props?.businessChallenges.map((item, index) => {
                      return <li key={index}>{item.title}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div className="detail-text">
              {props?.clients && (
                <LoadList
                  data={props.clients}
                  key={props.clients?.id}
                  title={props.clientTitle}
                />
              )}
              <div
                className="text-detail-page-g mg-t-1"
                dangerouslySetInnerHTML={{ __html: props?.text }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
