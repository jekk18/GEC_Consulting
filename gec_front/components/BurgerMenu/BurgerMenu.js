import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image"; 
import CloseIcon from "../Icons/CloseIcon";
import SubArrow from "../Icons/SubArrow";
import BurgerList from "./BurgerList";
import BurgerLi from "./BurgerLi";
import { useTranslations } from "@/core/Translations/context";
import { settings } from "@/core/settings/request";
  
const BurgerMenu = (props) => { 
  const translations = useTranslations();

  const [langVector, setLangVector] = useState(false);
  const [active, setActive] = useState(null)
  const [childrenActive, setChildrenActive] = useState(null)
 
  const burgerRef = useRef();
 
  const [elementHeight, setElementHeight] = useState('max-content');
  const router = useRouter()
 
  useEffect(() => {  
    const handleResize = () => {
        if (window.innerHeight > burgerRef.current.clientHeight) {
          setElementHeight('max-content');
        } else {
          setElementHeight('100%');
        }
      };
      window.addEventListener('resize', handleResize);
 
      handleResize(); 
      return () => {
        window.removeEventListener('resize', handleResize);
      };
  }, []);

  const handleActiveHeight = ( item ) => {
    if (active === item) {
        setActive(null)
    } else {
        setActive(item);
    }
  }
  const handleChildrenActiveHeight = (item) => {
    if (childrenActive === item) {
        setChildrenActive(null)
    } else {
        setChildrenActive(item);
    }
  }
 
  
  return (
    <div className="burger-container" ref={burgerRef} style={{height: elementHeight}}>
      <div className="container">
        <div className="burger-box">
          <div className="burger-top">
            <div className="logo">
              <Image src={require("../../assets/img/logo2.png")} alt="img" />
            </div>
            <div
              className="close-burger-icon"
              onClick={() => props.click(false)}
            >
              <CloseIcon />
            </div>
          </div>
          <div className="burger-submenu-list-box">
            <BurgerList class="burger-ul">
              {props?.burgerData?.map((item, index) => (
                <BurgerLi class={`burger-li ${active === item.id ? 'active-burger-li' : ' '}`} key={item.id}>
                  <div className="drop-box">
                    <Link href={item.slug} className="burger-a">
                      {item.title}
                    </Link>
                    {item.children && item.children.length > 0 && (
                      <div className={`burger-arrow ${active === item.id ? 'active-arrow' : ''}`} onClick={() => handleActiveHeight(item.id)}>
                        <SubArrow />
                      </div>
                    )}
                  </div>
                  {item.children && item.children.length > 0 && (
                    <BurgerList class="burger-children-box">
                      {item.children?.map((item, index) => (
                        <BurgerLi class={`burger-children-li ${childrenActive === item.id ? 'active-burger-children-li' : ' '}`} key={item.id}>
                          <div className="drop-box-children">
                            <Link
                              href={item.slug}
                              className="burger-children-a"
                            >
                              {item.title}
                            </Link>
                            {item.children && item.children.length > 0 && (
                              <div className={`burger-arrow ${childrenActive === item.id ? 'active-arrow' : ''}`} onClick={() => handleChildrenActiveHeight(item.id)}>
                              <SubArrow />
                            </div>
                            )}
                          </div>
                          {item.children && item.children.length > 0 && (
                            <BurgerList class="burger-grandson-box">
                              {item.children?.map((item, index) => (
                                <BurgerLi class="grandson-li" key={item.id}>
                                  <div className="drop-box-grandson">
                                    <Link
                                      href={item.slug}
                                      className="burger-grandson-a"
                                    >
                                      {item.title}
                                    </Link>
                                  </div>
                                </BurgerLi>
                              ))}
                            </BurgerList>
                          )}
                        </BurgerLi>
                      ))}
                    </BurgerList>
                  )}
                </BurgerLi>
              ))}
            </BurgerList>
          </div>
          <div className="contact-us-box">
            <div className="contact-btn-link">
              {
                props.contactBtnName && props.contactLink && 
                <Link href={props.contactLink} className="contact-link-btn" target="blank">
                {props.contactBtnName}
              </Link>
              } 
            </div>
            <div className={`__lang-box __lang-box2 ${langVector ? "select-open" : ""}`}>
              <div className="lang-select">
              <span className="defmobileLang">{translations[props?.locale]}</span>
              {
                        props?.page?.filter((x) => x.locale !== props.setting[settings?.disableLang]?.value).map((item, index) => {
                          if(item.locale === props?.locale) return;
                            return (
                                <Link href={item.slug} key={index} locale={false} >{translations[item?.locale]} <span></span></Link>
                            )
                        })
                    }
              </div>
              <span
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
                    fill="#000"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurgerMenu;
