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
import { useContainer } from '../../result-page/mobx-store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import Filterbar from '../filter-bar';
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
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>();
  const [projectIdList, setProjectIdList] = useState<ProjectList[]>([]); //筛选的id数据
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

          //设置树形数据
          setTreeData([
            {
              title: '全选',
              key: '-1',
              children: reShapeData,
            },
          ]);
          setExpandedKeys(['-1', reShapeData[0].key]);
          setProjectIdList([
            {
              id: reShapeData[0].children[0].key,
              status: reShapeData[0].children[0].status,
              time: reShapeData[0].children[0].time,
              haveData: reShapeData[0].children[0].haveData,
              haveSurveyData: reShapeData[0].children[0].haveSurveyData,
              haveDesignData: reShapeData[0].children[0].haveDesignData,
              isExecutor: reShapeData[0].children[0].isExecutor,
            },
          ]);
          setCheckedKeys([reShapeData[0].children[0].key]);
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


  /**
   * https://ant.design/components/tree-cn/#header 组件文档
   * @param checked 
   * @param info 
   * 
   * - 工程名字
   *  - 项目名字
   * 
   * 只需要获取项目的id和一些地图需要的数据
   */
  const onCheck = (checked: React.Key[], info: any) => {
    //全选的时候
    if (info.node.key === '-1') {
      if (info.checked) {
        //全选
        let children = info.node.children;

        children.forEach((v: { children: TreeNodeType[] }) => {
          v.children.forEach((v: TreeNodeType) => {
            projectIdList.push({
              id: v.key,
              time: v.time,
              status: v.status?.toString(),
              haveData: v.haveData,
              haveSurveyData: v.haveSurveyData,
              haveDesignData: v.haveDesignData,
              isExecutor: v.isExecutor,
            });
          });
        });
      } else {
        //取消全选
        setProjectIdList([]);
      }
    } else {
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
          haveData: info.node.haveData,
          haveSurveyData: info.node.haveSurveyData,
          haveDesignData: info.node.haveDesignData,
          isExecutor: info.node.isExecutor,
        });
      }
      //当没有选中的时候
      if (!info.node.children && !info.checked) {
        setProjectIdList(projectIdList?.filter((v: ProjectList) => v.id !== info.node.key));
      }
      //选中父节点时
      //选中的时候
      if (info.node.children && info.checked) {
        info.node.children.forEach((v: { key: string; time: string; status: number }) => {
          projectIdList?.push({
            id: v.key,
            status: v.status.toString(),
            time: v.time,
            haveData: info.node.haveData,
            haveSurveyData: info.node.haveSurveyData,
            haveDesignData: info.node.haveDesignData,
            isExecutor: info.node.isExecutor,
          });
        });
      }
      //没有选中的时候
      if (info.node.children && !info.checked) {
        let unCheckedKeys = info.node.children.map(
          (v: { key: string; time: string; status: number }) => v.key,
        );

        setProjectIdList(
          projectIdList?.filter((v: ProjectList) => {
            return unCheckedKeys.indexOf(v.id) === -1;
          }),
        );
      }
    }

    setCheckedKeys(checked);
  };

  const onTabChange = (activeKey: string) => {
    // setProjectIdList([]);

    if (activeKey === '1') {
      fetchAll();
    } else {
      fetchCompanyDate(filterCondition);
    }
    setCheckedKeys([]);
  };

  useEffect(() => {
    store.setProjectIdList(projectIdList);
    if (projectIdList.length === 0) {
      store.toggleObserveTrack(false);
    }
  }, [checkedKeys]);

  return (
    <>
      <div ref={ref} className={classNames(className, styles.sideMenuContainer, styles.tabPane)}>
        <Filterbar />
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
                onCheck={onCheck}
                checkedKeys={checkedKeys}
                treeData={treeData}
                className={classNames(styles.sideMenu)}
              />
            ) : null}
          </TabPane>
        </Tabs>
      </div>
    </>
  );
});

export default SideMenu;
