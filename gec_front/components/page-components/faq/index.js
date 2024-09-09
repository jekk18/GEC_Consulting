import FaqComponent from '@/components/FaqComponent/FaqComponent'
import React from 'react'

const index = (props) => {
  return (
    <FaqComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index