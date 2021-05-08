import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Tree, Tabs, Spin, message } from 'antd';
import { useRequest, useSize } from 'ahooks';
import moment from 'moment';
import {
  fetchEngineerProjectListByParams,
  ProjectItemType,
  Engineer,
} from '@/services/visualization-results/side-tree';
import { useContainer } from '../../store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
const { TabPane } = Tabs;

/**
 * 树形结构
 */
export interface TreeNodeType {
  title: string;
  key: string;
  time?: string;
  status?: number;
  haveData?: boolean;
  haveSurveyData?: boolean;
  haveDesignData?: boolean;
  isExecutor?: boolean;
  children?: TreeNodeType[];
}
export interface SideMenuProps {
  className?: string;
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
      time: v.projectEndTime ? moment(v.projectEndTime).format('YYYY-MM-DD') : '',
      status: v.status,
      haveData: v.haveData,
      haveSurveyData: v.haveSurveyData,
      haveDesignData: v.haveDesignData,
      isExecutor: v.isExecutor,
    };
  });
};

const generateProjectTree = (engineerList: Engineer[]) => {
  let projectTree = engineerList.map((v) => {
    return {
      title: v.name,
      key: v.id,
      children: mapProjects2TreeNodeData(v.projects),
    };
  });

  return projectTree;
};

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>();
  const store = useContainer();
  const { vState } = store; //设置公共状态的id数据
  const { filterCondition } = vState;
  const { className } = props;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  /**
   * 获取全部数据
   */
  const { data: allData, loading: allLoading } = useRequest(
    () => fetchEngineerProjectListByParams(filterCondition),

    {
      refreshDeps: [filterCondition],
      onSuccess: () => {
        if (allData?.length) {
          console.log(allData);

          let listTree = generateProjectTree(allData);
          console.log(listTree);

          //设置树形数据
          setTreeData(listTree);

          setExpandedKeys(
            listTree.map((v) => {
              if (v.children) {
                return v.key;
              } else {
                return '';
              }
            }),
          );
          store.setProjectId(setTreeData[0]?.children[0]?.key);
        } else {
          message.warning('没有检索到数据');
        }
      },
      onError: () => {
        message.warning('获取数据失败');
      },
    },
  );

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  return (
    <>
      <div ref={ref} className={classNames(className, styles.sideMenuContainer)}>
        <div className={styles.title}>工程项目</div>
        {allLoading ? (
          <Spin spinning={allLoading} className={styles.loading} tip="正在载入中..."></Spin>
        ) : null}
        {allData ? (
          <div className={styles.sideMenu}>
            <Tree
              showLine
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent
              height={size.height ? size.height - 30 : 700}
              treeData={treeData}
            />
          </div>
        ) : null}
      </div>
    </>
  );
});

export default SideTree;
