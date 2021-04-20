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
  children?: TreeNodeType[];
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
    };
  });
};

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
  const [checkedKeys, setCheckedKeys] = useState<
    | {
        checked: React.Key[];
        halfChecked: React.Key[];
      }
    | React.Key[]
  >();

  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);

  const { vState } = useContainer();
  const { filterCondition } = vState;
  const { className } = props;

  /**
   * 获取全部数据
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
              key: '-1',
              children: reShapeData,
            },
          ]);
          setExpandedKeys(['-1'])
        } else {
          message.warning('没有检索到数据');
        }
      },
    },
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (
    checked:
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        }
      | React.Key[],
    info: any,
  ) => {
    setCheckedKeys(checked);
  };
  return (
    <div className={classNames(className, styles.sideMenuContainer, styles.tabPane)}>
      <Tabs type="line" defaultActiveKey="1">
        <TabPane tab="全部项目" key="1">
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            className={classNames(styles.sideMenu)}
          />
        </TabPane>
        <TabPane tab="地州项目" key="2">
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkedKeys={checkedKeys}
            onCheck={onCheck}
            className={classNames(styles.sideMenu)}
            treeData={treeData}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SideMenu;
