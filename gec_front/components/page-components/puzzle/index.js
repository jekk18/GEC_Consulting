import PuzzleSection from '@/components/PuzzleSection/PuzzleSection'
import React from 'react'

const index = (props) => { 
  return (
    <PuzzleSection data={props.componentData}  page={props.page} isPost={props.isPost} />  
  )
}

export default index