import React, { FC, useContext } from 'react';
import { IndexContext } from '../../context';
import ChartBox from '../chart-box';
import ProjetctRefreshList from '../project-info-refresh-list';
export interface ProjectRefreshListWrapperProps {
  componentProps?: string[];
}
const ProjectRefreshListWrapper: FC<ProjectRefreshListWrapperProps> = (props) => {
  const { currentAreaInfo } = useContext(IndexContext);
  return (
    <>
      <ChartBox title="实时项目数据">
        <ProjetctRefreshList currentAreaInfo={currentAreaInfo} {...props} />
      </ChartBox>
    </>
  );
};

export default ProjectRefreshListWrapper;
