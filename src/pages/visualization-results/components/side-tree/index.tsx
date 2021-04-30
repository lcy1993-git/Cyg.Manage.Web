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

const generatorIdItem = (item: TreeNodeType) => {
  return {
    id: item.key,
    time: item.time,
    status: item.status?.toString(),
    haveData: item.haveData,
    haveSurveyData: item.haveSurveyData,
    haveDesignData: item.haveDesignData,
    isExecutor: item.isExecutor,
  };
};

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [checkedKeys, setCheckedKeys] = useState<
    | React.Key[]
    | {
        checked: React.Key[];
        halfChecked: React.Key[];
      }
  >();
  const [projectIdList, setProjectIdList] = useState<ProjectList[]>([]); //筛选的id数据
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
          let listTree = generateProjectTree(allData);
          //设置树形数据
          setTreeData([
            {
              title: '全选',
              key: '-1',
              children: listTree,
            },
          ]);
          setExpandedKeys(['-1', listTree[0].key]);

          let firstChild = {
            id: listTree[0].children[0].key,
            status: listTree[0].children[0].status?.toLocaleString(),
            time: listTree[0].children[0].time,
            haveData: listTree[0].children[0].haveData,
            haveSurveyData: listTree[0].children[0].haveSurveyData,
            haveDesignData: listTree[0].children[0].haveDesignData,
            isExecutor: listTree[0].children[0].isExecutor,
          };
          setProjectIdList([firstChild]);
          setCheckedKeys([firstChild.id]);
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
   * 当点击第一层结构的时候
   */
  const onCheckParent = (info: any) => {
    if (info.checked) {
      //全选
      let children = info.node.children;

      children.forEach((v: { children: TreeNodeType[] }) => {
        v.children.forEach((v: TreeNodeType) => {
          projectIdList.push(generatorIdItem(v));
        });
      });
    } else {
      //取消全选
      setProjectIdList([]);
    }
  };

  /**
   * 单独点击子节点的时候
   * @param info
   */
  const onCheckChild = (info: any) => {
    /**
     * 只要子节点的id不要父节点的id
     */

    //选中子节点时
    //当选中的时候
    if (!info.node.children && info.checked) {
      projectIdList?.push(generatorIdItem(info.node));
    }
    //当没有选中的时候
    if (!info.node.children && !info.checked) {
      setProjectIdList(projectIdList?.filter((v: ProjectList) => v.id !== info.node.key));
    }
    //选中父节点时
    //选中的时候
    if (info.node.children && info.checked) {
      info.node.children.forEach((v: TreeNodeType) => {
        projectIdList?.push(generatorIdItem(v));
      });
    }
    //没有选中的时候
    if (info.node.children && !info.checked) {
      let unCheckedKeys = info.node.children.map((v: { key: string }) => v.key);

      setProjectIdList(
        projectIdList?.filter((v: ProjectList) => {
          return unCheckedKeys.indexOf(v.id) === -1;
        }),
      );
    }
  };

  const onCheck = (
    checked:
      | React.Key[]
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        },
    info: any,
  ) => {
    //全选的时候
    if (info.node.key === '-1') {
      onCheckParent(info);
    } else {
      onCheckChild(info);
    }

    setCheckedKeys(checked);
  };

  useEffect(() => {
    store.setProjectIdList(projectIdList);
    if (projectIdList.length === 0) {
      store.toggleObserveTrack(false);
    }
  }, [checkedKeys]);

  return (
    <div ref={ref} className={classNames(className, styles.sideMenuContainer, styles.tabPane)}>
      <Filterbar />
      <Tabs type="line" defaultActiveKey="1" style={{ height: '100%' }}>
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
              onCheck={(checked, info) => onCheck(checked, info)}
              checkedKeys={checkedKeys}
              treeData={treeData}
              className={classNames(styles.sideMenu)}
            />
          ) : null}
        </TabPane>
      </Tabs>
    </div>
  );
});

export default SideTree;
