import TextLeftComponent from '@/components/TextLeftComponent/TextLeftComponent'
import React from 'react'

const index = (props) => {
  return (
    <TextLeftComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index