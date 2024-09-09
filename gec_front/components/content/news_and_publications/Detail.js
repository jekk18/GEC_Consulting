import Fancybox from "@/components/Fancybox/Fancybox";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import DownloadArrow from "@/components/Icons/DownloadArrow"; 
import { useTranslations } from "@/core/Translations/context";
import moment from "moment/moment";
import { useRouter } from "next/router";
import React, { useMemo } from "react";

const Detail = (props) => {
  const router = useRouter();
  const { locale } = router; 
  const defaultImg = '/img/defaul.png'
  const translations= useTranslations();
  
  const momentStDate = useMemo(() => {
    return moment(props?.page?.additional?.date, "DD/MM/YYYY");
  }, [props?.page?.additional?.date, locale]);

  
  return (
    <>
      <HorizontalBar
       overId={'overId-01'}
        page={props?.page} 
      />
      <section id="overId-01">
        <div className="detail-page-component padding-b">
          <div className="container">
            <div className="detail-box">
              <div className="detail-img detail-img-2">
                <Fancybox class="fancy">
                  {props?.page?.gallery?.map((item, index) => {
                    let thumbnailUrl = item?.file;  
                    if (!item?.file && item?.video_link) {
                      const videoIdMatch = item.video_link.match(/\/embed\/([^?]+)/);
                      if (!videoIdMatch) {
                        console.error("Video Id is not defined");
                      }
                      const videoId = videoIdMatch[1] || "nx_2KIwYEWA";
                      thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`; 
                    }
                    return (
                      <a href={`${item?.video_link ? item.video_link : process.env.NEXT_PUBLIC_IMAGE_URL}${thumbnailUrl}`} data-fancybox="gallery" key={item.id}>
                         {
                          item?.file ? (
                            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.file}`} alt={item?.alt} loading="lazy" />
                          )
                          : !item.file && item.video_link ?(
                            <img src={ thumbnailUrl} alt={item?.alt} loading="lazy" />
                          )
                          :
                          (
                            <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${defaultImg}`} alt={item?.alt} loading="lazy" />
                          )
                         }
                      </a>
                    );
                  })}
                </Fancybox>
                <div className="pub-time">
                  {props?.page?.publication?.file
                    ? `${momentStDate.format("YYYY")}`
                    : `${momentStDate.format("MMM DD, YYYY")}`}
                </div>
              </div>
              <div className="detail-text" dangerouslySetInnerHTML={{ __html: props?.page?.text }}/>
              {props?.page?.publication?.file && (
                <a href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${props?.page?.publication?.file}`} className="download" download={true}>
                  <DownloadArrow />
                  {translations?.download}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
      {props.components}
    </>
  );
};

export default Detail;
