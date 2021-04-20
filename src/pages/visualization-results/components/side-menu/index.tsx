import React, { FC, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Tree, Tabs, Spin, message } from 'antd';
import { useRequest, useMount } from 'ahooks';
import { EngineerProjetListFilterParams } from '@/services/visualization-results/side-menu';
import { GetEngineerProjectListByParams } from '@/services/visualization-results/side-menu';
import { useContainer } from '../../result-page/store';
const { TabPane } = Tabs;

/**
 * 树形结构
 */
export interface TreeNodeType {
  title: string;
  key: string;
  children: TreeNodeType[];
}
export interface SideMenuProps {
  className?: string;
}
/**
 * 获得的projectList的类型
 */
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

/**
 * 把传进来的projectList数据传唤成需要的数组类型
 * @param projectItemsType
 * @returns
 */
const mapProjects2TreeNodeData = (projectItemsType: ProjectItemType[]): TreeNodeType[] => {
  return projectItemsType.map((v: ProjectItemType) => {
    return {
      title: v.name,
      key: v.id,
      children: [],
    };
  });
};

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['allSelect']);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const { vState } = useContainer();
  const { filterCondition } = vState;
  const { className } = props;

  /**
   * 获取数据
   */
  const { data: allData, run: fetchAll, loading: allLoading } = useRequest(
    () => GetEngineerProjectListByParams(filterCondition),

    {
      refreshDeps: [filterCondition],
      onSuccess: () => {

        if (allData.length) {
          let reShapeData = allData.map((v: ProjectType) => {
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
  
          setCheckedKeys([reShapeData[0].key]);
        } else {
          message.warning("没有检索到数据")
        }
       
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
    <div className={classNames(className, styles.sideMenuContainer, styles.tabPane)}>
      <Tabs type="line" defaultActiveKey="1">
        <TabPane tab="全部项目" key="1">
          {allLoading ? <Spin spinning={allLoading} tip="正在载入中..."></Spin> : null}

          {treeData ? (
            <Tree
              checkable
              className={classNames(styles.sideMenu)}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              checkedKeys={checkedKeys}
              onSelect={onSelect}
              selectedKeys={selectedKeys}
              treeData={treeData}
            />
          ) : null}
        </TabPane>
        <TabPane tab="地州项目" key="2">
          123
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SideMenu;
