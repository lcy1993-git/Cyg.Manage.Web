import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { Input, Button, Modal, Form, message, Spin, Tooltip, Tabs } from 'antd';
import styles from './index.less';
import PageCommonWrap from '@/components/page-common-wrap';
import CommonTitle from '@/components/common-title';
import Drawing from '../drawing';
import Material from '../material';
import Component from '../component';

const { TabPane } = Tabs;

const ResourceManage: React.FC = () => {
  const libId = qs.parse(window.location.href.split('?')[1]).libId as string;
  const libName = qs.parse(window.location.href.split('?')[1]).libName as string;

  return (
    <PageCommonWrap noPadding={true}>
      <div className={styles.resourceManage}>
        <div className={styles.moduleTitle}>
          <CommonTitle>模块-{libName}</CommonTitle>
        </div>
        <div className={styles.moduleTabs}>
          <Tabs type="card">
            <TabPane tab="图纸" key="drawing">
              <div className={styles.pannelTable}>
                <Drawing libId={libId} />
              </div>
            </TabPane>
            <TabPane tab="物料" key="material">
              <div className={styles.pannelTable}>
                <Material />
              </div>
            </TabPane>
            <TabPane tab="组件" key="component">
              <div className={styles.pannelTable}>
                <Component />
              </div>
            </TabPane>
            <TabPane tab="电气设备" key="electric">
              44
            </TabPane>
            <TabPane tab="电缆设计" key="cable">
              55
            </TabPane>
            <TabPane tab="架空设计" key="overhead">
              66
            </TabPane>
            <TabPane tab="应力弧垂表" key="sag">
              77
            </TabPane>
          </Tabs>
        </div>
      </div>
    </PageCommonWrap>
  );
};

export default ResourceManage;
