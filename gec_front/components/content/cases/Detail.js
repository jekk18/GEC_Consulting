import { DetailPageComponent } from '@/components/DetailPageComponent/DetailPageComponent'
import HorizontalBar from '@/components/HorizontalBar/HorizontalBar'
import { useTranslations } from '@/core/Translations/context';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Detail = (props) => {
  const translations = useTranslations();
  const router = useRouter(); 
  const { locale } = router; 
 
  const imgUrl = props?.page?.image;
  const businessNeeds = props?.page?.directories?.filter((x) => x.type_id === 1)
  const businessChallenges = props?.page?.directories?.filter((x) => x.type_id === 2)
  const clients = props?.page?.relates?.filter((x) => x.type === 'clients')
  
  return (
    <>
    <HorizontalBar overId={'overId-01'} page={props?.page} />
    <DetailPageComponent
      text={props?.page?.text}
      img={imgUrl}
      businessNeeds={businessNeeds}
      businessChallenges={businessChallenges}
      overId={'overId-01'}
      chNTitle={translations?.business_needs}
      chCTitle={translations?.challenges}
      class={'case-min-height'}
      clients={clients[0]?.post && clients}
      clientTitle={translations?.clients}
    />
    {props?.components}
  </>
  )
}

export default Detail