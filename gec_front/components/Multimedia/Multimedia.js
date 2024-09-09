import SectionTitle from "../SectionTitle"; 
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader/Loader";
import Fancybox from "../Fancybox/Fancybox";
import PlayIcon from "../Icons/PlayIcon";
 
const Multimedia = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      try {
        const posts = await getComponentPosts(props.data.component_id);
        setComponentPosts(posts.posts);
      } catch (error) {
        console.error("Error fetching section posts:", error);
      }
      setLoader(false);
    };
    fetchData();
  }, [props.data.component_id, router.query.page, locale]);


  let allLanguage = locale;
  if(componentPosts[0]?.additional?.shared_locale &&  componentPosts[0]?.additional?.shared_locale?.gallery){
    allLanguage =  componentPosts[0]?.additional.shared_locale.gallery;
  } 
  const componentsLocaleFiles = componentPosts[0]?.files?.filter(
    (x) => x.locale === allLanguage 
  );   

  const file = "/img/project2.png"; 
  let thumbnailUrl = file;
  
  return (
    <section id={props?.data?.component_id}>
       {loader && <Loader />}
       {!loader && 
        <div className="multimedia-component padding">
        <div className="container">
        {props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />
              )}
          <div className="row row-slider-10">
            <Fancybox class="multimedia-fancy">
            <div className="multimedia-container-box">
              {componentsLocaleFiles?.map((item) =>  {
                  if (!item.file && item?.video_link) {
                    const videoIdMatch = item?.video_link.match(/(?:[?&]|\b)v=([^&#]+)/);
                    if (!videoIdMatch) {
                      console.error("Video Id is not defined");
                    }
                    const videoId = videoIdMatch[1] || "nx_2KIwYEWA";
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
                  }
                return ( 
                <div className="multimedia-item" key={item.id}> 
                    <a
                      href={`${item.video_link ? item.video_link : `${process.env.NEXT_PUBLIC_IMAGE_URL}${item.file}`}`}
                      data-fancybox="gallery"
                    >
                      {item.file ? (
                        <img src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${item.file}`} alt={item.alt} />
                      ) : (
                        <img src={thumbnailUrl} alt={item.alt ?? 'default'} />
                      )}
                    </a>
                  
                  {item.video_link && (
                    <>
                      <div className="testimonial-bg"></div>
                      <div className="testimonial-play">
                        <PlayIcon />
                      </div>
                    </>
                  )}
                </div>
                  )
                }
               )}
            </div>
                </Fancybox>
          </div>
        </div>
      </div>
       }
    </section>
  );
};

export default Multimedia;
