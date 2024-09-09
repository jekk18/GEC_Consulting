import BusinessAsistant from '@/components/BusinessAsistant/BusinessAsistant'
import React from 'react'

const index = (props) => { 
  
  return (
    <BusinessAsistant data={props.componentData}  page={props.page} isPost={props.isPost}/>  
  )
}

export default index