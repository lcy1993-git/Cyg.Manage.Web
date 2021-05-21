import React, { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import _, { size } from 'lodash';
import { Tree, Tabs, Spin, message } from 'antd';
import { useRequest, useSize } from 'ahooks';
import { useLocation } from 'react-router-dom';
import {
  fetchEngineerProjectListByParamsAndArea,
  fetchEngineerProjectListByParamsAndCompany,
  ProjectListByAreaType,
  fetchCommentCountById,
  Properties,
} from '@/services/visualization-results/side-tree';
import { useContainer } from '../../result-page/mobx-store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
const { TabPane } = Tabs;

/**
 * 树形结构
 */
export interface TreeNodeType {
  title: string;
  key: string;
  id: string;
  levelCategory?: number;
  engineerId?: string;
  parentId?: string;
  propertys?: Properties;
  children?: TreeNodeType[];
}
export interface SideMenuProps {
  className?: string;
}

/**
 * 把传进来的projectList数据传唤成需要的数组类型
 * @param projectList
 * @returns TreeNodeType[]
 */
function generateProjectTree(projectList?: ProjectListByAreaType[]): TreeNodeType[] {
  return projectList
    ? projectList.map((v) => {
        return {
          title: v.name,
          id: v.id,
          key: Math.random().toString(),
          engineerId: v.parentId,
          parentId: v.parentId,
          levelCategory: v.levelCategory,
          propertys: v.propertys,
          children: generateProjectTree(v.children),
        };
      })
    : [];
}

function generatorProjectInfoItem(item: TreeNodeType): ProjectList {
  return {
    id: item.id,
    time: moment(item.propertys?.deadline).format('YYYY-MM-DD'),
    engineerId: item.engineerId ?? '',
    status: item.propertys?.status,
    isExecutor: item.propertys?.isExecutor,
  };
}

type keyType =
  | React.Key[]
  | {
      checked: React.Key[];
      halfChecked: React.Key[];
    };

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [checkedKeys, setCheckedKeys] = useState<keyType>();
  const [projectIdList, setProjectIdList] = useState<ProjectList[]>([]); //筛选的id数据
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');
  const [showDefaultSelectCity, setShowDefaultSelectCity] = useState<boolean>(true);
  const store = useContainer();
  const { vState } = store; //设置公共状态的id数据
  const { filterCondition } = vState;
  const { className } = props;
  const location: any = useLocation();
  const { query } = location;

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);

  const pushAllKeys = (data: TreeNodeType[]) => {
    data.forEach((v) => {
      if (v.children) {
        expandedKeys.push(v.key);
        pushAllKeys(v.children);
      }
    });
  };

  const clearState = () => {
    setCheckedKeys([]);
    setProjectIdList([]);
  };

  const getExpanedCityProjectKeys = (
    items: TreeNodeType[],
  ): { expanded: string[]; checked: TreeNodeType[] } => {
    const reg = new RegExp('^[0-9]*$');
    const expanded = new Array<string>();
    const checked = new Array<TreeNodeType>();
    const dfs = (node: TreeNodeType, isSelect: boolean) => {
      const { id, children, key, title, levelCategory } = node;

      if (reg.test(query.selectCity)) {
        expanded.push(key);
        if (id === query.selectCity) {
          children?.forEach((v) => {
            dfs(v, true);
          });

          return;
        }

        if (isSelect) {
          levelCategory === 6 ? checked.push(node) : expanded.push(key);

          children?.forEach((v) => {
            dfs(v, isSelect);
          });
        } else {
          children?.forEach((v) => {
            dfs(v, isSelect);
          });
          expanded.pop();
        }
      } else {
        expanded.push(key);
        if (title === query.selectCity) {
          children?.forEach((v) => {
            dfs(v, true);
          });

          return;
        }

        if (isSelect) {
          levelCategory === 6 ? checked.push(node) : expanded.push(key);

          children?.forEach((v) => {
            dfs(v, isSelect);
          });
        } else {
          children?.forEach((v) => {
            dfs(v, isSelect);
          });
          expanded.pop();
        }
      }
    };
    items.forEach((v) => {
      dfs(v, false);
    });

    return { expanded, checked };
  };

  const initSideTree = (data: TreeNodeType[]) => {
    // pushAllKeys(data);
    // expandedKeys.push('-1');
    // setExpandedKeys([...expandedKeys]);

    if (query && query.selectCity && tabActiveKey === '1' && showDefaultSelectCity) {
      const key = getExpanedCityProjectKeys(data);
      const { expanded, checked } = key;
      setExpandedKeys(['-1', ...expanded]);
      setCheckedKeys(checked.map((v: TreeNodeType) => v.key));
      setProjectIdList(checked.map((v: TreeNodeType) => generatorProjectInfoItem(v)));
    } else {
      setExpandedKeys(['-1']);
      clearState();
    }
  };
  useEffect(() => {
    clearState();
  }, [filterCondition]);

  const { data: treeListReponseData, loading: treeListDataLoading } = useRequest(
    () =>
      tabActiveKey === '2'
        ? fetchEngineerProjectListByParamsAndCompany(filterCondition)
        : fetchEngineerProjectListByParamsAndArea(filterCondition),

    {
      refreshDeps: [filterCondition, tabActiveKey],
      onSuccess: () => {
        // console.log(window.location.search.substring(1).split('='));
        let data = generateProjectTree(treeListReponseData);
        if (data.length) {
          setTreeData([{ title: '全选', id: '-1000', key: '-1', children: data }]);
          initSideTree(data);
        } else {
          message.warning('无数据');
        }
      },
      onError: () => {
        message.error('获取数据失败');
      },
    },
  );

  /**
   *
   * @param expandedKeysValue
   */

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  /**
   * 	
      levelCategory层级类别(1:省 2:市 3:区 4:公司 5:工程 6:项目)
   * @param checked 
   * @param info  checked: true
                  checkedNodes: (229) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
                  checkedNodesPositions: (229) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, …]
                  event: "check"
                  halfCheckedKeys: []
                  nativeEvent: MouseEvent {isTrusted: true, screenX: 2613, screenY: 319, clientX: 53, clientY: 216, …}
                  node: {title: "全选", id: "-1000", key: "-1", children: Array(2), expanded: true, …}
   */
  const onCheck = (
    checked:
      | React.Key[]
      | {
          checked: React.Key[];
          halfChecked: React.Key[];
        },
    info: any,
  ) => {
    let r = info.checkedNodes
      .filter((v: TreeNodeType) => v.levelCategory === 6)
      .map((v: TreeNodeType) => generatorProjectInfoItem(v));
    //去重
    let res = _.unionBy(r, (item: ProjectList) => item.id);

    setProjectIdList(res);

    setCheckedKeys(checked);
  };

  useEffect(() => {
    // if (projectIdList.length === 1) {
    //   feetchCommentCountRquest();
    // }

    store.setProjectIdList(projectIdList);

    if (projectIdList.length === 0) {
      store.toggleObserveTrack(false);
    }
  }, [projectIdList]);

  const onTabChange = (key: string) => {
    setTabActiveKey(key);
    setShowDefaultSelectCity(false);
  };

  useEffect(() => {
    setTreeData([]);
    clearState();
  }, [tabActiveKey]);

  const activeStyle = '#ebedee';

  return (
    <>
      <div ref={ref} className={classNames(className, styles.sideTree, styles.tabPane)}>
        <div
          style={{ backgroundColor: tabActiveKey === '1' ? activeStyle : '#fff' }}
          className={styles.tabBar}
        >
          <div className={styles.tabBarItem} onClick={() => onTabChange('1')}>
            按地区
          </div>
          <div
            style={{ backgroundColor: tabActiveKey === '2' ? activeStyle : '#fff' }}
            className={styles.tabBarItem}
            onClick={() => onTabChange('2')}
          >
            按公司
          </div>
        </div>

        <Tabs
          renderTabBar={() => <></>}
          onChange={(tabActiveKey) => setTabActiveKey(tabActiveKey)}
          style={{ height: 'calc(100% - 72px)', backgroundColor: activeStyle }}
        >
          <TabPane style={{ overflow: 'hidden' }} key="1">
            {treeListDataLoading ? (
              <Spin
                spinning={treeListDataLoading}
                className={styles.loading}
                tip="正在载入中..."
              ></Spin>
            ) : null}
            {treeListReponseData ? (
              <Tree
                height={size.height ? size.height - 80 : 680}
                checkable
                onExpand={onExpand}
                defaultExpandAll
                expandedKeys={expandedKeys}
                onCheck={(checked, info) => onCheck(checked, info)}
                checkedKeys={checkedKeys}
                treeData={treeData}
                className={classNames(styles.sideMenu)}
              />
            ) : null}
          </TabPane>
          <TabPane style={{ overflow: 'hidden' }} tab="按公司" key="2">
            {treeListDataLoading ? (
              <Spin
                spinning={treeListDataLoading}
                className={styles.loading}
                tip="正在载入中..."
              ></Spin>
            ) : null}
            {treeListReponseData ? (
              <Tree
                height={size.height ? size.height - 85 : 680}
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
    </>
  );
});

export default SideTree;
