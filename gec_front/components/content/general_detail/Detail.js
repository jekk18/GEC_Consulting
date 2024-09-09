import HorizontalBar from '@/components/HorizontalBar/HorizontalBar';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'

const Detail = (props) => {

  const router = useRouter(); 
  const { locale } = router;   
  
     
  return (
    <> 
      <HorizontalBar class="hidden-bar-0" page={props.page} overId={'overId-01'}/> 
      <section id='overId-01'>
        <div className="text-page-section padding-b">
          <div className="container">
            <div className="text-page-text"  dangerouslySetInnerHTML={{
              __html: props?.page?.text,
            }} />
          </div>
        </div>
      </section>
      {props.components}
    </>
  )
}

export default Detail