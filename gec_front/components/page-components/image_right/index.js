import TextRightComponent from '@/components/TextRightComponent/TextRightComponent'
import React from 'react'

const index = (props) => {
  return (
    <TextRightComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index