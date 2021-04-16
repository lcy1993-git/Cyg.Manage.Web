import React, { useState } from 'react';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import classNames from 'classnames';
import Footer from '../components/footer';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import { createContainer } from 'unstated-next';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import SidePopup from '../components/side-popup';
import MapContainerBox from '../components/map-container-box';
import { Provider, useContainer, VisualizationResultsStateType } from './store';
import { Button } from '_antd@4.15.1@antd';

interface StoreProps {
  initialState: VisualizationResultsStateType;
}

const VisualizationResults: React.FC = () => {
  const { vState, togglePropertySidePopup } = useContainer();
  const { propertySidePopupShow } = vState;
  return (
    <PageCommonWrap noPadding={true}>
      {/* 顶层filter 筛选项目 */}

      <Filterbar />
      <Button onClick={() => togglePropertySidePopup()}>test</Button>
      <main className={classNames(styles.content, 'flex')}>
        {/* 侧边树形结构 */}
        <SideMenu />
        {/* map */}
        <MapContainerBox />
      </main>
      <Footer />

      <SidePopup visible={propertySidePopupShow} onClose={() => togglePropertySidePopup()} />
    </PageCommonWrap>
  );
};

const StoreProvider: React.FC<StoreProps> = () => {
  const initialState: VisualizationResultsStateType = {
    filterCondition: { kvLevel: -1 },
  };
  return (
    <Provider initialState={initialState}>
      <VisualizationResults />
    </Provider>
  );
};

export default StoreProvider;
