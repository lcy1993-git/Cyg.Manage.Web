import React, { useEffect } from 'react';
import styles from './index.less';
import classNames from 'classnames';
import PageCommonWrap from '@/components/page-common-wrap';
import SideTree from '../components/side-tree';
import MapContainerShell from '../components/map-container-shell';
import Filterbar from '../components/filter-bar';
import { Provider, useContainer } from './mobx-store';
import { observer } from 'mobx-react-lite';
import { MenuFoldOutlined } from '@ant-design/icons';

const VisualizationResults: React.FC = observer(() => {
  const store = useContainer();
  const { vState } = store;
  const { visibleLeftSidebar } = vState;
  useEffect(() => {
    return () => {
      store.clear();
    };
  }, []);

  return (
    <PageCommonWrap noPadding={true}>
      {/* <Filterbar /> */}
      <MapContainerShell />
    </PageCommonWrap>
  );
});

const StoreProvider: React.FC = () => {
  return (
    <Provider>
      <VisualizationResults />
    </Provider>
  );
};

export default StoreProvider;
