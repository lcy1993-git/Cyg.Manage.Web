import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Tree, Tabs, Spin, message } from 'antd';
import { useRequest, useSize } from 'ahooks';
import moment from 'moment';
import {
  fetchEngineerProjectListByParams,
} from '@/services/visualization-results/side-menu';
import { useContainer } from '../../store';
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
  status: number;
}

export interface CompanyProjectType {
  companyId: string;
  companyName: string;
  createdOn: number;
  engineers: Engineer[];
}

export interface Engineer {
  name: string;
  id: string;
  type: string;
  createdOn: number;
  projects: ProjectItemType[];
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

const SideMenu: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);
  const store = useContainer();
  const { vState } = store; //设置公共状态的id数据
  const { filterCondition } = vState;
  const { className } = props;

  const ref = useRef();
  const size = useSize(ref);

  /**
   * 获取全部数据
   */
  const { data: allData, run: fetchAll, loading: allLoading } = useRequest(
    () => fetchEngineerProjectListByParams(filterCondition),

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

          //设置树形数据
          setTreeData(reShapeData);
          setExpandedKeys(
            reShapeData.map((v: TreeNodeType) => {
              if (v.children) {
                return v.key;
              }
            }),
          );
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
    <div ref={ref} className={classNames(className, styles.sideMenuContainer)}>
      <div className={styles.title}>工程项目</div>
      {allLoading ? (
        <Spin spinning={allLoading} className={styles.loading} tip="正在载入中..."></Spin>
      ) : null}
      {allData ? (
        <div  className={styles.sideMenu}>
          <Tree
            showLine
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            autoExpandParent
            height={size.height}
            treeData={treeData}
           
          />
        </div>
      ) : null}
    </div>
  );
});

export default SideMenu;
