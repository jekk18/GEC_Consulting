import Link from "next/link";
import SectionTitle from "../SectionTitle";
import SeeAll from "../SeeAll";
import { getComponentPosts } from "@/core/sections/requests";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/Loader/Loader";
import { useTranslations } from "@/core/Translations/context"; 

const PostThreeComponent = (props) => {
  const [componentPosts, setComponentPosts] = useState([]);
  const [loader, setLoader] = useState(true);
  const router = useRouter();
  const { locale } = router;
  const translations = useTranslations();
  
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

  const seeAllSlug = useMemo(() => {
    if (props.data?.component?.section) {
      return props.data.component.section.slugs.find((x) => x.locale === locale)
        ?.slug;
    }
  }, [props.data, locale]);

   

  return (
    <section id={props?.data?.component_id}>
      {loader && <Loader />}
      {!loader && (
        <div className="post-component-cont padding padding-minus-b">
          <div className="container">
            <div className="important-title title-link-service"> 
            {
              props?.data?.title && (
                <SectionTitle title={props?.data?.title} titleColor="#000" />  
              )
            } 
              {seeAllSlug && (
                <Link href={seeAllSlug}>
                  <SeeAll seeLink={translations?.see_all} />
                </Link>
              )}
            </div>
            <div className="row row-slider">
              <div className="posts-box">
                {componentPosts?.map((item, index) => {
                  if (item.published === 1 && item.active === 1) {
                    let allLanguage = locale;
                    let file = null;
                    if (
                      item?.additional?.shared_locale &&
                      item?.additional?.shared_locale?.image
                    ) {
                      allLanguage = item?.additional?.shared_locale?.image;
                    }
                    file = item?.files?.find((x) => x.locale === allLanguage);
                    return (
                      <Link
                        key={item.id}
                        href={item?.locale_additional?.redirect_link}
                        className="post-components-item post-three-item"
                        target="blank"
                      >
                        <div className="post-img">
                          {file ? (
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${file?.file}`}
                              alt={file?.alt}
                              loading="lazy"
                            />
                          ) :  (<img
                          src='/img/defpostsicon.svg'
                          alt={'defaultIcon'}
                          loading="lazy"
                        />)
                          }
                        </div>
                        <div className="post-title">
                          <h1>{item?.title}</h1>
                        </div>
                        <div
                          className="post-text"
                          dangerouslySetInnerHTML={{ __html: item?.description }}
                        />
                      </Link>
                    );
                  }
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PostThreeComponent;
