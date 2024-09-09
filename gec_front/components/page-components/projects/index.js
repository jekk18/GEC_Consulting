import ProjectsComponent from '@/components/ProjectsComponent/ProjectsComponent'
import React from 'react'

const index = (props) => {
  return (
    <ProjectsComponent data={props.componentData}  page={props.page} isPost={props.isPost}/> 
  )
}

export default index