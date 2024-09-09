import React, { useEffect, useState } from 'react'
import { DetailPageComponent } from "@/components/DetailPageComponent/DetailPageComponent";
import HorizontalBar from "@/components/HorizontalBar/HorizontalBar"; 
import { useRouter } from 'next/router';
import { useTranslations } from '@/core/Translations/context';

  
const Detail = (props) => {
  const router = useRouter(); 
  const { locale } = router;  
  const translations = useTranslations();

  const businessNeeds = props?.page?.directories?.filter((x) => x.type_id === 1) 
  const challanges = props?.page?.directories?.filter((x) => x.type_id === 2)

  return (
    <>
      <HorizontalBar  overId={'overId-01'} page={props?.page}  />
      <DetailPageComponent
        text={props?.page?.text}
        businessNeeds={businessNeeds}
        businessChallenges={challanges}
        chNTitle={translations?.business_needs} 
        chCTitle={translations?.challenges}
        overId={'overId-01'}
      /> 
      {props?.components}
    </>
  );
};

export default Detail;
