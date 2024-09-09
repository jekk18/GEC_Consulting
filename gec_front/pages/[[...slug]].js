import { getMenus, getPage } from "@/core/sections/requests";
import getPageComponents from "@/getPageComponents";
import getPageSections from "@/getPageSections";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LoadingWrapper } from "@/components/LoadingWrapper";
import { staticPageData, staticPages } from "@/core/sections/constants";
import axios from "axios";
import moment from 'moment';
import 'moment/locale/ka';
import 'moment/locale/ru';
import NotFound404 from "@/components/Error/404";


export async function getServerSideProps({ params, locale, res }) {
 
  let fullSlug;
  if (!params.slug) {
    fullSlug = `${locale}/`;
  } else {
    fullSlug = params.slug;
    fullSlug = `${locale}/${fullSlug}`;
  }

  axios.defaults.headers['Accept-Language'] = locale;
  moment.locale(locale)

  const translations = await serverSideTranslations(locale, ['common']);
  const page = await getPage(fullSlug);
  
  const menu = await getMenus();  

  if (!page) {
    const staticPage = staticPages[fullSlug];
    if (!staticPage) {
      res.statusCode = 404;
      return { props: { ...translations, menu, notFound: true, fullSlug} };
    }
    else {
      const pageData = staticPageData[staticPage];
      return { props: { ...translations, menu, notFound: false, fullSlug, staticPage, page: pageData, isStatic: true } };
    }
  } else if (page.sluggable.active !== 1) {
    res.statusCode = 404;
    return { props: { ...translations, menu, notFound: true, fullSlug } };
  }

  else {
    return {
      props: {
        ...translations, menu, page, notFound: false, fullSlug, isStatic: false,
      },
    };
  }
}



export default function MyPage(props) {

  const router = useRouter();
  const { locale } = router;
  const [isLoading, setIsLoading] = useState(true);

  axios.defaults.headers['Accept-Language'] = locale;
  moment.locale(locale)

  useEffect(() => {
    if (!router.isFallback) {
      setIsLoading(false);
    }
  }, [router.isFallback]);


  if (props.notFound) {
    return <NotFound404 />
  }


  if (props.isStatic) {
    const StaticPage = getPageSections(props.staticPage, false);
    return <LoadingWrapper Component={StaticPage({
      page: props?.page,
      components: [],
    })} />;
  }

  const Page = getPageSections(
    props.page?.sluggable?.type_name,
    props.page?.sluggable?.detail && !props.page?.sluggable?.list
  );

  const isPost = props.page?.sluggable_type == 'Post' || props.page?.sluggable?.detail === 1 && props.page?.sluggable?.list === 0;
  const pageData = isPost
    ? props.page?.sluggable
    : props.page?.sluggable;

    
  if (!pageData) {
    return <NotFound404 />
  }

  return (
    <LoadingWrapper
      Component={Page({
        page: pageData,
        breadcrumb: props.page.breadcrumb,
        components: getPageComponents(props?.page?.sluggable?.componentables, pageData, isPost),
        detail: props.page.sluggable.detail,
        list: props.page.sluggable.list,
      })}
    />
  );
}