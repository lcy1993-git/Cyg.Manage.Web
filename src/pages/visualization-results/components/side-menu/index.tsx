import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import { Tree, Tabs, Spin, message } from 'antd';
import { useRequest, useSize } from 'ahooks';
import moment from 'moment';
import {
  GetEngineerProjectListByParams,
  GetEngineerCompanyProjectListByParams,
} from '@/services/visualization-results/side-menu';
import { useContainer } from '../../result-page/store';
import { ProjectList } from '@/services/visualization-results/visualization-results';

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
    };
  });
};

const SideMenu: FC<SideMenuProps> = (props: SideMenuProps) => {
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
  const [projectIdList, setProjectIds] = useState<ProjectList[]>([]);
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>(['0-0-0', '0-0-1']);

  const { vState, setProjectIdList } = useContainer();
  const { filterCondition } = vState;
  const { className } = props;

  const ref = useRef();
  const size = useSize(ref);

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
          setExpandedKeys(['-1']);
        } else {
          message.warning('没有检索到数据');
        }
      },
      onError: () => {
        message.warning('获取数据失败');
      },
    },
  );

  /**
   * 获取地州项目
   */
  const { data: companyData, run: fetchCompanyDate, loading: companyLoading } = useRequest(
    GetEngineerCompanyProjectListByParams,

    {
      refreshDeps: [filterCondition],
      manual: true,
      onSuccess: () => {
        if (companyData.length) {
          console.log(123);

          let reShapeData = companyData.map((v: CompanyProjectType) => {
            return {
              title: v.companyName,
              key: v.companyId,
              type: 'companyParent',
              children: v.engineers.map((v: Engineer) => {
                return {
                  title: v.name,
                  key: v.id,
                  type: 'company',
                  children: mapProjects2TreeNodeData(v.projects),
                };
              }),
            };
          });

          setTreeData(reShapeData);
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

  const onAllCheck = (checked: React.Key[], info: any) => {
    /**
     * 只要子节点的id不要父节点的id
     */

    //选中子节点时
    //当选中的时候
    if (!info.node.children && info.checked) {
      projectIdList?.push({
        id: info.node.key,
        time: info.node.time,
        status: info.node.status.toString(),
      });
    }
    //当没有选中的时候
    if (!info.node.children && !info.checked) {
      setProjectIds(projectIdList?.filter((v: ProjectList) => v.id !== info.node.key));
    }
    //选中父节点时
    //选中的时候
    if (info.node.children && info.checked) {
      info.node.children.forEach((v: { key: string; time: string; status: number }) => {
        projectIdList?.push({
          id: v.key,
          status: v.status.toString(),
          time: v.time,
        });
      });
    }
    //没有选中的时候
    if (info.node.children && !info.checked) {
      let unCheckedKeys = info.node.children.map(
        (v: { key: string; time: string; status: number }) => v.key,
      );

      setProjectIds(
        projectIdList?.filter((v: ProjectList) => {
          return unCheckedKeys.indexOf(v.id) === -1;
        }),
      );
    }

    setCheckedKeys(checked);
  };

  const onCompanyCheck = (checked: React.Key[], info: any) => {
    /**
     * 只要子节点的id不要父节点的id
     */

    //选中子节点时
    //当选中的时候
    if (!info.node.children && info.checked) {
      projectIdList?.push({
        id: info.node.key,
        time: info.node.time,
        status: info.node.status,
      });
    }
    //当没有选中的时候
    if (!info.node.children && !info.checked) {
      setProjectIds(projectIdList?.filter((v: ProjectList) => v.id !== info.node.key));
    }
    //选中父节点时
    //选中的时候
    if (info.node.children && info.checked && info.node.type === 'company') {
      info.node.children.forEach((v: { key: string; time: string; status: number }) => {
        projectIdList?.push({
          id: v.key,
          status: v.status.toString(),
          time: v.time,
        });
      });
    }

    if (info.node.children && info.checked && info.node.type === 'companyParent') {
      info.node.children.forEach((v: { children: any[] }) => {
        v.children.forEach((v: { key: string; time: string; status: number }) => {
          projectIdList?.push({
            id: v.key,
            status: v.status.toString(),
            time: v.time,
          });
        });
      });
    }
    //没有选中的时候
    if (info.node.children && !info.checked && info.node.type === 'company') {
      let unCheckedKeys = info.node.children.map(
        (v: { key: string; time: string; status: number }) => v.key,
      );
      setProjectIds(
        projectIdList?.filter((v: ProjectList) => {
          return unCheckedKeys.indexOf(v.id) !== -1;
        }),
      );
    }
    if (info.node.children && !info.checked && info.node.type === 'companyParent') {
      let unCheckedKeys: string[] = [];
      info.node.children.forEach((v: { children: any[] }) => {
        v.children.forEach((v: { key: string; time: string; status: number }) => {
          unCheckedKeys?.push(v.key);
        });
      });
      setProjectIds(
        projectIdList?.filter((v: ProjectList) => {
          return unCheckedKeys.indexOf(v.id) !== -1;
        }),
      );
    }
    setCheckedKeys(checked);
  };

  const onTabChange = (activeKey: string) => {
    setProjectIdList([]);

    if (activeKey === '1') {
      fetchAll();
    } else {
      fetchCompanyDate(filterCondition);
    }
    setCheckedKeys([]);
  };

  useEffect(() => {
    setProjectIdList(projectIdList);
  }, [checkedKeys]);

  return (
    <div ref={ref} className={classNames(className, styles.sideMenuContainer, styles.tabPane)}>
      <Tabs onChange={onTabChange} type="line" defaultActiveKey="1" style={{ height: '100%' }}>
        <TabPane tab="全部项目" key="1">
          {allLoading ? (
            <Spin spinning={allLoading} className={styles.loading} tip="正在载入中..."></Spin>
          ) : null}
          {allData ? (
            <Tree
              height={size.height}
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              onCheck={onAllCheck}
              checkedKeys={checkedKeys}
              treeData={treeData}
              className={classNames(styles.sideMenu)}
            />
          ) : null}
        </TabPane>
        <TabPane tab="地州项目" key="2">
          {companyLoading ? (
            <Spin spinning={companyLoading} className={styles.loading} tip="正在载入中..."></Spin>
          ) : null}
          {companyData ? (
            <Tree
              checkable
              height={size.height}
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              checkedKeys={checkedKeys}
              onCheck={onCompanyCheck}
              className={classNames(styles.sideMenu)}
              treeData={treeData}
            />
          ) : null}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SideMenu;
