import React from 'react';
import qs from 'qs';
import { Tabs } from 'antd';
import styles from './index.less';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';

import { useMount, useUnmount } from 'ahooks';
import { useLayoutStore } from '@/layouts/context';

const { TabPane } = Tabs;

const WorkHandover: React.FC = () => {
  const userId = qs.parse(window.location.href.split('?')[1]).id as string;
  const name = qs.parse(window.location.href.split('?')[1]).name as string;

  console.log(userId, name, '11');

  const { setWorkHandoverFlag } = useLayoutStore();

  useMount(() => {
    setWorkHandoverFlag?.(true);
  });

  useUnmount(() => {
    setWorkHandoverFlag?.(false);
    //   window.localStorage.setItem('manageId', '');
  });

  return (
    <PageCommonWrap noPadding={true}>
      <div>
        <div>
          <CommonTitle>工作交接-{name}</CommonTitle>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default WorkHandover;
