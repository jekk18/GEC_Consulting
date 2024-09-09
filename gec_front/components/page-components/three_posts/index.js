import PostThreeComponent from '@/components/PostThreeComponent/PostThreeComponent'
import React from 'react'

const index = (props) => {
  return (
    <PostThreeComponent data={props.componentData}  page={props.page} isPost={props.isPost} /> 
  )
}

export default index