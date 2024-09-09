import React from "react";
import { useEffect } from "react";
import CookieConsent, {
  Cookies,
  getCookieConsentValue, 
} from "react-cookie-consent";
import ReactGA from "react-ga4";
import { useRouter } from "next/router";

const Cookie = (props) => {
  const router = useRouter();
  const { locale } = router;

  const handleAcceptCookie = () => {
    if (props.analyticKey?.value) {
      ReactGA.initialize(props.analyticKey?.value);
    }
  };

  const handleDeclineCookie = () => {
    Cookies.remove("_ga", { path: "/" });
    Cookies.remove("_gid", { path: "/" });
    Cookies.remove("_gat", { path: "/" });
  };

  useEffect(() => {
    const isConsent = getCookieConsentValue();
    if (isConsent === "true") {
      handleAcceptCookie();
    }
  }, [props.analyticKey]);

    
  return (
    <section>
      {props?.analyticKey?.value  && (
        <div className="cookie-handle">
          <div className="container">
            <CookieConsent
              enableDeclineButton
              flipButtons
              buttonText={props?.cookie_accapt_button}
              declineButtonText={props?.cookie_decline_button}
              location="bottom" 
              cookieName="GecCookie"
              buttonClasses="accapt-button"
              declineButtonClasses="decline-button"
              buttonWrapperClasses="wrapper-button"
              style={{ background: "#1E2E38" }}
              onDecline={handleDeclineCookie}
              onAccept={handleAcceptCookie}
              expires={180}
            >
              <div className="cookie-text">
                {props?.cookieTitle && <h1>{props?.cookieTitle}</h1>}
                {props?.cookieDesc && (
                  <div className="text">{props.cookieDesc}</div>
                )}
              </div>
            </CookieConsent>
          </div> 
        </div>
      )}
    </section>
  );
};

export default Cookie;
