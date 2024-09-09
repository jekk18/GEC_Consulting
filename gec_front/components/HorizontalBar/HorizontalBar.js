import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ShareIcon from "../Icons/ShareIcon";
import ShareComponent from "../ShareComponents/ShareComponent";
import LinkdinIcon from "../Icons/LinkdinIcon";
import { useRouter } from "next/router";

function HorizontalBar(props) {
  const [horizontalId, setHorizontalId] = useState(1);
  const [show, setShow] = useState(false);
  const [fixed, setFixed] = useState(false);
  const [barList, setBarList] = useState([]);
  const bannerRef = useRef();
  const barTextRef = useRef();

  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    function handleScroll() {
      const offsetTop = bannerRef.current?.offsetHeight || 0;
      const yOffset = window.innerHeight / 2 - (headerHeight() - 60);

      setShow(window.pageYOffset >= offsetTop - offsetTop / 2);
      setFixed(window.pageYOffset >= offsetTop);
    }

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (props?.page?.componentables) {
      const newBarList = props?.page?.componentables
        .filter((x) => x?.short_title)
        .map((x) => ({ title: x.short_title, id: x.component_id }));
      setBarList(newBarList);
    }
  }, [props?.page?.componentables]); 

  function headerHeight() {
    const headerElement = document.getElementsByClassName("__header")[0];
    return headerElement ? headerElement.clientHeight : 0;
  }

  let allLanguage = locale;
  let content = null; 
  
 let cover = props?.page?.post_cover || props?.page?.section_cover;
  

  if (cover?.video_link) {
    const videoEmbedUrl = `${cover?.video_link}&autoplay=1&modestbranding=1&controls=0&mute=1&rel=0&loop=1`;
    content = (
      <div className="banner-item-2">
        <iframe
          style={{ width: "100%", height: "100%" }}
          src={videoEmbedUrl}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>
    );
  } else if (cover?.file) {
    const imageSrc = `${process.env.NEXT_PUBLIC_IMAGE_URL}${cover?.file}`;
    content = (
      <div className="banner-item-2">
        <img loading="lazy" src={imageSrc} alt={cover?.alt} />
      </div>
    );
  } else {
    content = (
      <div className="banner-item-2">
        <img loading="lazy" src="/img/cover.png" alt="default" />
      </div>
    );
  }

  function scrollItemIntoView(itemId) {
    const itemElement = document.getElementById(itemId);
    if (itemElement) {
      const yOffset =
        window.innerHeight / 2 -
        (itemElement.clientHeight / 2 - headerHeight() - 60);
      const elementTop = itemElement.getBoundingClientRect().top;
      const scrollToY = window.pageYOffset + elementTop - yOffset;

      window.scrollTo({
        top: scrollToY,
        behavior: "smooth",
      });
    }
  } 
  return (
    <section className="padding-b">
      <div className="horizontal-bar">
        <div className="main-banner">
          <div className="full-img-banners" ref={bannerRef}> 
              {content} 
          </div>
          <div className="bar-absolute-container">
            <div className="container"> 
                <h1>{props?.page?.title}</h1>   
              <div className="share-bar-container">
                {props?.page?.additional?.linkedin && (
                  <div className="linkdin-link">
                    <Link href={props?.page?.additional?.linkedin} target="blank">
                      <LinkdinIcon />
                    </Link>
                  </div>
                )}
                <div className="share-click-box">
                  <div className="share-open">
                    <ShareIcon />
                  </div>
                  <div className="share-box wid-0-1">
                    <ShareComponent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {barList.length > 0 && (
        <div
          className="components-name-bar"
          style={{ position: fixed ? "fixed" : "sticky" }}
        >
          <div className="container">
            <div className="bar-list">
              <div className="left-side">
                <div className={`section-title-hide ${show ? "show" : ""}`}>
                  <h2>{props.page?.title}</h2>
                </div>
                <ul>
                  <li
                    className={horizontalId === props.overId ? "active" : ""}
                    onClick={() => {
                      setHorizontalId(props.overId);
                      scrollItemIntoView(props.overId);
                    }}
                  >
                    <span>Overview</span>
                  </li>
                  {barList?.map((item, index) => (
                    <li
                      id={index}
                      className={horizontalId === item.id ? "active" : ""}
                      onClick={() => {
                        setHorizontalId(item.id);
                        scrollItemIntoView(item.id);
                      }}
                      key={index}
                    >
                      <span>{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="horizontal-share-box">
                <div className="share-this-click share-possition">
                  <div className="share-open">
                    <ShareIcon color="#01977A" />
                  </div>
                  <div className="share-box wid-0">
                    <ShareComponent />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HorizontalBar;
