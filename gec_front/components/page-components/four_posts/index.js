import PostFourComponent from '@/components/PostFourComponent/PostFourComponent'
import React from 'react'

const index = (props) => {
  return (
    <PostFourComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index