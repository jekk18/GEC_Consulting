import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { InlineShareButtons } from 'sharethis-reactjs';
import { useRouter } from "next/router";
// import { useTranslations } from "@/core/Translations/context";

const ShareComponent = (props) => {
  // const translations = useTranslations();
  const router = useRouter();
  const [ogData, setOgData] = useState({})

  useEffect(() => {
    setOgData(typeof window !== 'undefined' ? {
      url: window?.location.href,
      image: document?.querySelector('meta[property="og:image"]')?.content,
      description: document?.querySelector('meta[property="og:description"]')?.content,
      title: document?.querySelector('meta[property="og:title"]')?.content,
    } : {})
  }, [router.asPath, router.isReady])


  return (
    <div className="share-box">
      <style dangerouslySetInnerHTML={{
        __html: `
          .st-inline-share-buttons{
            width:250px;
            z-index: 5!important;
          }
        `}} />
      {/* <h3>{translations?.share_via}: </h3> */}
      <InlineShareButtons
        key={`${ogData.title}${ogData.url}`}
        config={{
          alignment: 'left',  // alignment of buttons (left, center, right)
          color: 'social',      // set the color of buttons (social, white)
          enabled: true,        // show/hide buttons (true, false)
          font_size: 12,        // font size for the buttons
          // labels: 'cta',        // button labels (cta, counts, null)
          language: 'en',       // which language to use (see LANGUAGES)
          networks: [           // which networks to include (see SHARING NETWORKS)
            'facebook',
            'twitter',
            'linkedin',
            'messenger',
            'sharethis'
          ],
          padding: 12,          // padding within buttons (INTEGER)
          radius: 4,            // the corner radius on each button (INTEGER)
          show_total: false,
          size: 40,             // the size of each button (INTEGER)

          ...ogData
          // OPTIONAL PARAMETERS

          // min_count: 40, // (threshold for total share count to be displayed)
          // url: window.location.href, // (defaults to current url)
          // image: 'https://bit.ly/2CMhCMC',  // (defaults to og:image or twitter:image)
          // description: 'custom text',       // (defaults to og:description or twitter:description)
          // title: 'custom title',            // (defaults to og:title or twitter:title)
          // message: 'custom email text',     // (only for email sharing)
          // subject: 'custom email subject',  // (only for email sharing)
          // username: 'custom twitter handle' // (only for twitter sharing)
        }}
      />
    </div>
  );
};

export default ShareComponent;
