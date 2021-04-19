import React from 'react';
import styles from './index.less';
import Filterbar from '../components/filter-bar';
import classNames from 'classnames';
import Footer from '../components/footer';
import PageCommonWrap from '@/components/page-common-wrap';
import SideMenu from '../components/side-menu';
import MapContainerShell from '../components/map-container-shell';
import SidePopup from '../components/side-popup';
import { Provider, useContainer, VisualizationResultsStateType } from './store';

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

      <main className={classNames(styles.content, 'flex')}>
        {/* 侧边树形结构 */}
        <SideMenu />

        {/* map放在这 */}
        <MapContainerShell />
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
    <Provider>
      <VisualizationResults />
    </Provider>
  );
};

export default StoreProvider;
