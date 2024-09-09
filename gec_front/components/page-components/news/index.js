import NewsAndPublicationsSection from '@/components/NewsAndPublications/NewsAndPublication'
import React from 'react'

const index = (props) => {
  return (
    <NewsAndPublicationsSection data={props.componentData}  page={props.page} isPost={props.isPost} />
  )
}

export default index