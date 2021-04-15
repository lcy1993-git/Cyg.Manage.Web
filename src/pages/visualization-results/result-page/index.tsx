import React, { useState } from 'react';
import { Drawer, Button, Table } from 'antd';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import classNames from 'classnames';
import Footer from '../components/footer';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import SidePopUp from '../components/side-popup';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import MapContainerBox from '../components/map-container-box';

const VisualizationResults: React.FC = () => {
  const [projectVisible, setProjectVisible] = useState<boolean>(false);
  return (
    <PageCommonWrap noPadding={true}>
      {/* 顶层filter */}
      <Filterbar />

      {/* 中间content */}
      <main className={classNames(styles.content, 'flex')}>
        {/* 侧边树形结构 */}
        <SideMenu />

        <div>
          <SidePopUp />
          <Button type="primary" onClick={() => setProjectVisible(!projectVisible)}>
            modal
          </Button>
          {/* map放在这 */}
          <MapContainerBox />
        </div>
      </main>
      <Footer />

      {projectVisible && (
        <ProjectDetailInfo
          projectId={'1374245188349775872'}
          visible={projectVisible}
          onChange={setProjectVisible}
        />
      )}
    </PageCommonWrap>
  );
};

export default VisualizationResults;
