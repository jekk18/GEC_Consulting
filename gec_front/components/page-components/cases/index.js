import CaseSection from '@/components/CaseSection/CaseSection'
import React from 'react'

const index = (props) => { 
  return (
    <CaseSection data={props.componentData}  page={props.page} isPost={props.isPost}/>  
  )
}

export default index