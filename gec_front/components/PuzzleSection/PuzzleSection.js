import Puzzle from "./Puzzle";
import Link from "next/link";
import SectionTitle from "../SectionTitle";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";

const PuzzleSection = (props) => {
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
  let file = null; 

  if (
    componentPosts[0]?.additional?.shared_locale &&
    componentPosts[0]?.additional?.shared_locale?.image
  ) {
    allLanguage = componentPosts[0]?.additional?.shared_locale?.image;
  }
  file = componentPosts[0]?.files?.find((x) => x.locale === allLanguage);


  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="puzzleSection padding">
          <div className="container">
            <div className="important-title title-link-service"> 
            {
              props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />  
              )
            } 
            </div>
            <div className="row">
              <div className="col-xxl-5 col-lg-6 col-sm-12 col-12">
                <div className="puzzle-left-text">
                  <SectionTitle title={componentPosts[0]?.title} titleColor="#000" />
                  <div className="text">{componentPosts[0]?.description}</div>
                 {
                  componentPosts[0]?.locale_additional && componentPosts[0]?.locale_additional?.button_name &&
                  <div className="see-button" style={{pointerEvents: componentPosts[0]?.locale_additional?.redirect_link ? 'initial' : 'none'}}>
                    <Link target="blank" href={componentPosts[0]?.locale_additional?.redirect_link || ''}>{componentPosts[0]?.locale_additional?.button_name}</Link>
                  </div>
                 }
                </div>
              </div>
              <div className="col-xxl-7 col-lg-6 col-sm-12 col-12">
                <div className="puzzle">
                   { componentPosts[0].published === 1 &&
                    componentPosts[0]?.active === 1 && (
                        <> 
                          <Puzzle file={file} puzzleTitle={componentPosts[0]?.locale_additional?.puzzle_title}/>
                        </>
                      )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section> 
  );
};

export default PuzzleSection;
