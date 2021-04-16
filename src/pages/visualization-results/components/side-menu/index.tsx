import React, { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Tree, Tabs, Spin } from 'antd';
import { useRequest } from 'ahooks';
import { GetEngineerProjectList } from '@/services/visualization-results/side-menu';
const { TabPane } = Tabs;
export interface TreeNodeType {
  title: string;
  key: string;
  children: TreeNodeType[];
}
export interface SideMenuProps {
  className?: string;
}

export interface ProjectType {
  id: string;
  name: string;
  createdOn: Date;
  projects: ProjectItemType[];
}

export interface ProjectItemType {
  id: string;
  name: string;
  haveData: boolean;
  haveSurveyData: boolean;
  haveDesignData: boolean;
  projectEndTime: Date;
  isExecutor: boolean;
}

const mapProjects2TreeNodeData = (projectItemsType: ProjectItemType[]): TreeNodeType[] => {
  return projectItemsType.map((v: ProjectItemType) => {
    return {
      title: v.name,
      key: v.id,
      children: [],
    };
  });
};

const SideMenu: FC<SideMenuProps> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['allSelect']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const { className } = props;
  const {
    data,
    error,
    loading,
  }: { data: ProjectType[]; error: Error | undefined; loading: boolean } = useRequest(
    GetEngineerProjectList,
    {
      onSuccess: () => {
        let reShapeData = data.map((v: ProjectType) => {
          return {
            title: v.name,
            key: v.id,
            children: mapProjects2TreeNodeData(v.projects),
          };
        });

        setTreeData([
          {
            title: '全选',
            key: 'allSelect',
            children: reShapeData,
          },
        ]);
      },
    },
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue: React.Key[]) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onSelect = (selectedKeysValue: React.Key[], info: any) => {
    setSelectedKeys(selectedKeysValue);
  };
  return (
    <div className={classNames(className, styles.sideMenuContainer)}>
      {loading ? (
        <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
          <Spin spinning={loading} tip="正在载入中..."></Spin>
        </div>
      ) : null}

      {error ? null : null}

      {data ? (
        <Tabs defaultActiveKey="1">
          <TabPane tab="全部项目" key="1">
            <Tree
              checkable
              className={classNames(styles.sideMenu)}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          </TabPane>
          /** 这里tabpane有点问题所以 需要设置一个特殊的margin */
          <TabPane tab="地州项目" style={{ margin: 0 }} key="2"></TabPane>
        </Tabs>
      ) : null}
    </div>
  );
};

export default SideMenu;
