import SectionTitle from "../SectionTitle";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import Fancybox from "../Fancybox/Fancybox";
import PlayIcon from "../Icons/PlayIcon";
import TestimonialIcon from "../Icons/TestimonialIcon";

const Testimonial = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const posts = await getComponentPosts(props.data?.component_id);
        setComponentPosts(posts.posts);
      } catch (error) {
        console.error("Error fetching section posts:", error);
      }
      setLoader(false);
    };
    fetchData();
  }, [props.data?.component_id, locale]);
 

  let allLanguage = locale;
  let file = "/img/project2.png";

  if (componentPosts[0]?.published === 1 && componentPosts[0]?.active === 1) {
    if (
      componentPosts[0]?.additional?.shared_locale &&
      componentPosts[0]?.additional?.shared_locale?.image
    ) {
      allLanguage = componentPosts[0]?.additional?.shared_locale?.image;
    }
    file = `${process.env.NEXT_PUBLIC_IMAGE_URL}${
      componentPosts[0]?.files?.find((x) => x.locale === allLanguage)?.file
    }`;
  }

  const videoUrl = componentPosts[0]?.files?.find((x) => x.locale === allLanguage)?.video_link 

  let thumbnailUrl = file;

  if (!file && videoUrl) {
    const videoIdMatch = videoUrl.match(/\/embed\/([^?]+)/);
    if (!videoIdMatch) {
      console.error("Video Id is not defined");
    }
    const videoId = videoIdMatch[1] || "nx_2KIwYEWA";
    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
  }

  return (
    <section id={props?.data?.component_id}>
      <div className="testimonial-component padding">
        <div className="container">
          {props?.data?.title && (
            <SectionTitle title={props?.data?.title} titleColor="#000" />
          )}
          <div className="tesimonial-box">
            <div className="testimonial-text">
              {componentPosts[0]?.title && (
                <div className="title">
                  <TestimonialIcon />
                  <h2>{componentPosts[0]?.title}</h2>
                </div>
              )}

              <div className="text"  dangerouslySetInnerHTML={{
                    __html: componentPosts[0]?.description,
                  }}/>
            </div>
            <div className="testimonial-video">
              <Fancybox class="testimonial-fancy">
                <a
                  href={`${videoUrl ? videoUrl : file}`}
                  data-fancybox="gallery"
                >
                  {file ? (
                    <img src={file} alt={componentPosts[0]?.files?.find((x) => x.locale === allLanguage)?.alt} />
                  ) : (
                    <img src={thumbnailUrl} alt={componentPosts[0]?.files?.find((x) => x.locale === allLanguage)?.alt}  />
                  )}
                </a>
              </Fancybox>
              <div className="testimonial-bg"></div>
              {videoUrl && (
                <div className="testimonial-play">
                  <PlayIcon />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
