import React, { FC, useContext } from 'react';
import { IndexContext } from '../../context';
import ProjectNumber from '../project-number';

export interface ProjectNumberComponent {
  componentProps?: string[];
}
const ProjectNumberComponent: FC<ProjectNumberComponent> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext);
  const { componentProps } = props;
  return (
    <>
      <ProjectNumber componentProps={componentProps} currentAreaInfo={currentAreaInfo} />
    </>
  );
};

export default ProjectNumberComponent;
