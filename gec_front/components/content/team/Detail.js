import { DetailPageComponent } from "@/components/DetailPageComponent/DetailPageComponent";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar";
import { useTranslations } from "@/core/Translations/context";
import { useRouter } from "next/router";
import React from "react";
 
const Detail = (props) => { 

  const router = useRouter();
  const { locale } = router;
const translations = useTranslations();
  
  const experties = props?.page?.directories?.filter((x) => x.type_id === 6)

  return ( 
    <>
      <HorizontalBar page={props.page}  overId={'overId-01'}/>
      <DetailPageComponent
        text={props?.page?.text}
        businessNeeds={experties}
        chNTitle={translations?.experties}
        overId={'overId-01'} 
      />
      {props.components}
    </>
  );
};

export default Detail;
