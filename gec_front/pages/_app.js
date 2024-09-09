import Meta from "@/components/Meta/Meta";
import Layout from "@/components/Layout/Layout";
import  Header   from "@/components/Header/Header";
import "../styles/bootstrap.css";
import "../styles/globals.css";
import "../styles/fonts.css";
import "../styles/responsive.css"; 
import axios from "axios";
import { useRouter } from "next/router";
import { appWithTranslation } from "next-i18next";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "next-i18next";
import { SettingProvider } from "@/core/settings/context";
import { TranslationProvider } from "@/core/Translations/context";
import Footer from "@/components/Footer/Footer";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const { t } = useTranslation();
  const { locale } = router;
  const [staticPageLang, setStaticPageLang] = useState('')
  const [metaTitle, setMetaTitle] = useState('');

  let headerMenu;
  let footerMenu;
  let homeSLug;
  let upperFooterMenu;

  if (!pageProps.menu) {
    return null;
  }

  upperFooterMenu = pageProps.menu.filter((x) =>
    x.menu_types.includes("Upper Header")
  );
  headerMenu = pageProps.menu.filter((x) => x.menu_types.includes("header"));
  footerMenu = pageProps.menu.filter((x) => x.menu_types.includes("footer"));
  homeSLug = pageProps.menu.filter((item) => item.type_id === 1);


   
  const image = useMemo(() => {
    let file = false;
    if (pageProps.page?.sluggable) {
      if(pageProps?.page?.sluggable?.gallery && pageProps?.page?.sluggable?.gallery[0]?.file){
         file = pageProps?.page?.sluggable?.gallery[0]?.file
      }else if(pageProps?.page?.sluggable?.image && pageProps?.page?.sluggable?.image?.file){
        file = pageProps?.page?.sluggable?.image?.file;
      }else  if(pageProps?.page?.sluggable?.section_cover?.file){
        file = pageProps?.page?.sluggable?.section_cover?.file;
      } 
        // .sort((a, b) => a.sort - b.sort)[0]?.file; 

      return  file === false ? '/img/logo2.png' : `${process.env.NEXT_PUBLIC_IMAGE_URL}${file}`;
    }
  }, [pageProps.page]);
  
  useEffect(() => {
    if (pageProps.page && !pageProps.page.slugs) {
       setMetaTitle(pageProps.page[locale]?.sluggable?.title);
      const slugArray = Object.values(pageProps.page).map(localeData => { 
        return {
          locale: localeData.slugs[0].locale,
          slug: localeData.slugs[0].slug
        };
      });
      setStaticPageLang(slugArray);
    }
  }, [pageProps.page]);
  
  return (
    <>
  <GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}>  
      <SettingProvider>
        <TranslationProvider>
          <Meta
            title={pageProps.page?.sluggable?.title ?? metaTitle}
            description={pageProps.page?.sluggable?.description ?? ""}
            site={t("site")}
            keywords={t("keywords")}
            image={image}
          />
          <Header 
            menu={headerMenu}
            homeSlug={homeSLug}
            type_id={pageProps.page?.sluggable?.type_id}
            page={pageProps.page?.slugs ?? staticPageLang }
            localUrl={locale}
          />
          <Layout>
            <Component {...pageProps} />
          </Layout> 
          <Footer menu={footerMenu} homeSlug={homeSLug} localUrl={locale} upperMenu={upperFooterMenu}/>
        </TranslationProvider>
      </SettingProvider >
      </GoogleReCaptchaProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
