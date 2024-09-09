import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import Hamburger from "../Icons/Hamburger";
import SearchIcon from "../Icons/SearchIcon";
import BurgerMenu from "../BurgerMenu/BurgerMenu";
import { flatArrayToTree } from "@/helpers/TreeHelpers";
import { sectionTypes, staticPageData } from "@/core/sections/constants";

import { useTranslations } from "@/core/Translations/context";
import { useSettings } from "@/core/settings/context";
import { settings } from "@/core/settings/request";
import Cookie from "../Cookie/Cookie";

const Header = (props) => {
  const translations = useTranslations();
  const [langVector, setLangVector] = useState(false);
  const [burgerActive, setBurgerActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [classN, setClassN] = useState(false);

  useEffect(() => {
    function watchScroll() {
      window.addEventListener("scroll", () => {
        setScrollY(window.pageYOffset);
      });
    }
    watchScroll();
  });

  const router = useRouter();
  const { locale } = router;

  const nav = flatArrayToTree(props.menu);
  const updateSlug = nav.filter((item) => item.type_id !== sectionTypes?.home);

  const searchHref = useMemo(() => {
    return staticPageData["search"][locale].slugs.find(
      (x) => x.locale == props.localUrl
    )?.slug;
  }, [props.localUrl]); 
  const localRouter = useRouter(); 
  const updateLocalUrl = localRouter.asPath.substring(1);
  let localPageUrl;
  if(props?.page) {
    localPageUrl =  props?.page?.filter((x) => x.locale === props.localUrl);
  } 

  useEffect(() => {
    if (props.type_id === sectionTypes.home) {
      setClassN(true);
    } else {
      setClassN(false);
    }
  }, [localRouter, props.type_id]);

  const handleClick = (bool) => {
    setBurgerActive(bool);
    setClassN(bool);
  };

  useEffect(() => {
    setBurgerActive(false);
  }, [localRouter.query]);

  const langDef = props?.localUrl;
  const defaultLang = translations[langDef];

  const setting = useSettings();

  const contactLink =
    setting[settings?.headerRedirectLinkGeneral]?.[props.localUrl]?.value ?? "";
  const contactBtnName =
    setting[settings?.HeaderButtonName]?.[props.localUrl]?.value ?? "";

    useEffect(()=> {
      setLangVector(false)
    },[router])

  return (
    <header>
      <Cookie
        analyticKey={setting[settings.googleAnalyticsKey]}
        cookieTitle={translations?.cookie_title}
        cookieDesc={translations?.cookie_description}
        cookie_accapt_button={translations?.cookie_accapt_button}
        cookie_decline_button={translations?.cookie_decline_button}
      />
      <div
        className={`__header ${classN ? "" : "change-header"} ${
          scrollY > 10 ? "change-header" : ""
        }`}
      >
        <div className="container">
          <div className="__header-child">
            <div className="__header-left">
              <Link href={props.homeSlug[0]?.slug ?? ""} className="logo">
                {scrollY > 10 || !classN ? (
                  <Image
                    src={require("../../assets/img/logo2.png")}
                    alt="img"
                  />
                ) : (
                  <Image
                    src={require("../../assets/img/logo1.png")}
                    alt="img"
                  />
                )}
              </Link>
              <nav className="__nav">
                <ul>
                  {updateSlug.map((item, index) => (
                    <li
                      key={item.id}
                      className={`${
                        updateLocalUrl.split("?")[0] === item.slug.split("/")[1]
                          ? "active-link"
                          : ""
                      }`}
                    >
                      <Link href={item.slug} className="nav-link">
                        {item.title}
                      </Link>
                      {item.children && item.children.length > 0 && (
                        <div className="sub-children-container">
                          <div className="sub-children-box">
                            <div className="container">
                              <div className="sub-ul">
                                {item.children.map((subItem) => (
                                  <div className="sub-li" key={subItem.id}>
                                    <Link href={subItem.slug} className="sub-a">
                                      {subItem.title}
                                    </Link>
                                    {subItem.children &&
                                      subItem.children.length > 0 && (
                                        <div className="sub-grandchild-list">
                                          {subItem.children.map(
                                            (grandsonItem) => (
                                              <div
                                                className="grandchild-li"
                                                key={grandsonItem.id}
                                              >
                                                <Link
                                                  href={grandsonItem.slug}
                                                  className="grandchild-a"
                                                >
                                                  {grandsonItem.title}
                                                </Link>
                                              </div>
                                            )
                                          )}
                                        </div>
                                      )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
            <div className="__search-lang-cont">
              <div className="__search-icon-link">
                <Link href={searchHref ?? "/"} locale={false} aria-label="Search">
                  <SearchIcon />
                </Link>
                <div
                  className="burger-line"
                  onClick={() => setBurgerActive(true)}
                >
                  <Hamburger />
                </div>
              </div>

              <div className="contact-btn-link">
                {setting[settings?.headerRedirectLinkGeneral]?.[props.localUrl]
                  ?.value &&
                  setting[settings?.HeaderButtonName]?.[props.localUrl]
                    ?.value && (
                    <Link
                      href={
                        setting[settings?.headerRedirectLinkGeneral]?.[
                          props.localUrl
                        ]?.value
                      }
                      className="contact-link-btn"
                    >
                      {
                        setting[settings?.HeaderButtonName]?.[props.localUrl]
                          ?.value
                      }
                    </Link>
                  )}
              </div>
              <div className={`__lang-box ${langVector ? "select-open" : ""}`}>
                <div className="lang-select">
                  <span className="langDefault">{defaultLang}</span>
                  {props.page && props.page
                    ?.filter(
                      (x) => x.locale !== setting[settings?.disableLang]?.value
                    )
                    .map((item, index) => {
                      const lang = item.locale;
                      return (
                        <Link
                          href={item.slug}
                          key={index}
                          locale={false}
                          className={`${
                            props.localUrl === lang ? "lang-active" : ""
                          }`}
                        >
                          {translations[lang]}
                          <span></span>
                        </Link>
                      );
                    })}
                </div>
               {props?.page && <span
                  className="lang-vector"
                  onClick={() => {
                    setLangVector(!langVector);
                  }}
                >
                  <svg
                    width="14"
                    height="8"
                    viewBox="0 0 14 8"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7.00001 5.17192L11.95 0.221924L13.364 1.63592L7.00001 7.99992L0.636014 1.63592L2.05001 0.221923L7.00001 5.17192Z"
                      fill="white"
                    />
                  </svg>
                </span>}
              </div>
            </div>
          </div>
        </div>
        <div className="__header-line"></div>
      </div>
      {burgerActive && (
        <div
          className={`burger-menu ${burgerActive ? "active-burger-menu" : ""}`}
        >
          <BurgerMenu
            click={handleClick}
            setting={setting}
            burgerData={updateSlug}
            localeUrl={props.localUrl}
            page={props?.page}
            contactBtnName={contactBtnName}
            contactLink={contactLink}
            locale={locale} 
          />
        </div>
      )}
    </header>
  );
};

export default Header;
