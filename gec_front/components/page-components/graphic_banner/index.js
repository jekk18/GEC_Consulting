import BookBanner from '@/components/BookBanner/BookBanner'
import React from 'react' 

const index = (props) => {
  return ( 
      <BookBanner data={props.componentData}  page={props.page} isPost={props.isPost}/>  
  )
}

export default index