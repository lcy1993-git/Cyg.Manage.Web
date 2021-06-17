import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import _, { divide } from 'lodash';
import { Tree, Tabs, Spin, message, Input, Button, Divider, DatePicker,  } from 'antd';
import { SearchOutlined, AlignLeftOutlined, MessageOutlined, RightOutlined, ExportOutlined, NodeIndexOutlined, LeftOutlined } from '@ant-design/icons';
import { useRequest, useSize } from 'ahooks';
import {
  fetchAreaEngineerProjectListByParams,
  fetchCompanyEngineerProjectListByParams,
  ProjectListByAreaType,
  Properties,
} from '@/services/visualization-results/side-tree';
import { downloadMapPositon } from '@/services/visualization-results/list-menu';
import ExportMapPositionModal from '../export-map-position-modal';
import MaterialModal from '../material-modal';
import { useContainer } from '../../result-page/mobx-store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { flattenDeepToKey } from '../../utils/utils'
import ControlLayers from '../control-layers';
const { TabPane } = Tabs;

export interface TreeNodeType {
  title: string;
  key: string;
  id: string;
  levelCategory: number;
  engineerId?: string;
  parentId?: string;
  propertys?: Properties;
  children?: TreeNodeType[];
}
export interface SideMenuProps {
  className?: string;
  onChange: () => void;
  sideMenuVisibel: boolean;
  controlLayersProps: any;
}

/**
 * 把传进来的projectList数据转换成需要的数组类型
 * @param projectList
 * @returns TreeNodeType[]
 */
function generateProjectTree(projectList: ProjectListByAreaType[]): TreeNodeType[] {
  return projectList.map((v) => {
    return {
      title: v.name,
      id: v.id,
      key: Math.random().toString(),
      engineerId: v.parentId,
      parentId: v.parentId,
      levelCategory: v.levelCategory,
      propertys: v.propertys,
      children: v.children ? generateProjectTree(v.children) : [],
    };
  });
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

const areaArray = ["省", "市", "县", "工", "项"];

const SideTree: FC<SideMenuProps> = observer((props: SideMenuProps) => {
  const [checkedKeys, setCheckedKeys] = useState<keyType>();
  const [projectIdList, setProjectIdList] = useState<ProjectList[]>([]);
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [buttonActive, setButtonActive] = useState<number>(0);
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  const [exportMapPositionModalVisible, setexportMapPositionModalVisible] = useState<boolean>(
    false,
  );
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);

  const [exportMapPositionLoading, setexportMapPositionLoading] = useState<boolean>(false);
  const [commentTableModalVisible, setCommentTableModalVisible] = useState<boolean>(false);
  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [indeterminate, setIndeterminate] = React.useState(false);
  const store = useContainer();
  const { vState } = store;
  const { filterCondition, checkedProjectIdList} = vState;
  const { className, onChange, sideMenuVisibel } = props;
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const activeStyle = (key: string) => (tabActiveKey === key ? '#0e7b3b' : '#000');

  useEffect(() => {
    setTreeData([]);
    clearState();
  }, [tabActiveKey]);

  useEffect(() => {
    clearState();
  }, [filterCondition]);

  useEffect(() => {
    store.setProjectIdList(projectIdList);
  }, [projectIdList]);

  const clearState = () => {
    setCheckedKeys([]);
    setProjectIdList([]);
  };

  const isProjectLevel = (level: number | TreeNodeType): boolean =>
    typeof level === 'number' ? level === 6 : level.levelCategory === 6;

  const generatorProjectInfoList = (list: TreeNodeType[]) => list.map(generatorProjectInfoItem);

  /**
   *
   * @param list key key不是id，是随机生成的随机数，id是v.id
   * @returns
   */
  const getKeyList = (list: TreeNodeType[]) => list.map((v: TreeNodeType) => v.key);

  const whichTabToFetch = () =>
    tabActiveKey === '1'
      ? fetchAreaEngineerProjectListByParams(filterCondition)
      : fetchCompanyEngineerProjectListByParams(filterCondition);

  const initSideTree = (data: TreeNodeType[]) => {
    /**
     * 由于有从可视化界面点击的功能，所以在点过来以后，
     * 做的任何改变树的操作都要避免自动展开可视化点击过来的城市
     *
     * 判断是否需要展开和选中从可视化界面跳转过来的城市
     * 通过localstorage是否存在来判断，用了以后立即清除这样可以当其他操作刷新tree的时候
     * 可以不用做额外的标记来判断
     *
     */

    const selectCity = localStorage.getItem('selectCity');

    if (selectCity) {
      const key = getSelectCityExpanedAndCheckedProjectKeys(data, selectCity);

      localStorage.removeItem('selectCity');
      const { expanded, checked } = key;
      setExpandedKeys([...expanded]);
      setCheckedKeys(getKeyList(checked));
      setProjectIdList(generatorProjectInfoList(checked));
    } else {
      setExpandedKeys(['-1']);
      clearState();
    }
  };

  /**
   * 从可视化界面跳转过来自动展开地区项目，并选中所有项目
   * @param items
   * @returns
   */
  const getSelectCityExpanedAndCheckedProjectKeys = (
    items: TreeNodeType[],
    selectCity: string,
  ): { expanded: string[]; checked: TreeNodeType[] } => {
    const reg = new RegExp('^[0-9]*$');
    const expanded = new Array<string>();
    const checked = new Array<TreeNodeType>();

    const dfsByName = (node: TreeNodeType, isSelect: boolean) => {
      const { children, key, title, levelCategory } = node;
      expanded.push(key);
      if (title === selectCity) {
        children?.forEach((v) => {
          dfsByName(v, true);
        });

        return;
      }

      if (isSelect) {
        isProjectLevel(levelCategory) ? checked.push(node) : expanded.push(key);

        children?.forEach((v) => {
          dfsByName(v, isSelect);
        });
      } else {
        children?.forEach((v) => {
          dfsByName(v, isSelect);
        });
        expanded.pop();
      }
    };

    const dfsById = (node: TreeNodeType, isSelect: boolean) => {
      const { children, key, id, levelCategory } = node;
      expanded.push(key);
      if (id === selectCity) {
        children?.forEach((v) => {
          dfsById(v, true);
        });

        return;
      }

      if (isSelect) {
        isProjectLevel(levelCategory) ? checked.push(node) : expanded.push(key);
        children?.forEach((v) => {
          dfsById(v, isSelect);
        });
      } else {
        children?.forEach((v) => {
          dfsById(v, isSelect);
        });
        expanded.pop();
      }
    };

    if (reg.test(selectCity)) {
      items.forEach((v) => {
        dfsById(v, false);
      });
    } else {
      items.forEach((v) => {
        dfsByName(v, false);
      });
    }

    return { expanded, checked };
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const clearCheckAll = () => {
    setIndeterminate(false);
    setAllCheck(false);
  };

  const getAllKey = () => {
    const keys = new Array<string>();
    const dfs = (v: TreeNodeType) => {
      keys.push(v.key);
      v.children?.forEach((item) => {
        dfs(item);
      });
    };
    treeData.forEach((v) => {
      dfs(v);
    });

    return keys;
  };

  const getAllProjectNodes = () => {
    const nodes = new Array<TreeNodeType>();
    const dfs = (v: TreeNodeType) => {
      if (isProjectLevel(v)) {
        nodes.push(v);
      }

      v.children?.forEach((item) => {
        dfs(item);
      });
    };
    treeData.forEach((v) => {
      dfs(v);
    });

    return nodes;
  };
  const allProjectKey = useMemo(getAllProjectNodes, [treeData]);
  // const onCheckAll = (e: any) => {
  //   if (e.target.checked) {
  //     onCheck(getAllKey(), { checkedNodes: getAllProjectNodes() });
  //     setIndeterminate(false);
  //   } else {
  //     clearState();
  //   }
  //   setAllCheck(e.target.checked);
  // };

  /**
   * 	
      levelCategory层级类别(1:省 2:市 3:区 4:公司 5:工程 6:项目)
   * @param checked 
   * @param info  、
   * checked: true
     checkedNodes: (229) 
     halfCheckedKeys: []
     node: {title: "全选", id: "-1000", key: "-1", children: Array(2), expanded: true, …}     
   */
  const onCheck = (checked: keyType, info: any) => {
    let temp = info.checkedNodes.filter((v: TreeNodeType) => isProjectLevel(v.levelCategory));

    if (allProjectKey.length > temp.length) {
      setIndeterminate(true);
      setAllCheck(false);
    } else if (allProjectKey.length === temp.length) {
      setAllCheck(true);
      setIndeterminate(false);
    } else {
      clearCheckAll();
    }

    if (info.checkedNodes.length === 0) {
      clearCheckAll();
    }
    //去重,这里考虑到按公司筛选的时候，不同的公司可以有同一个项目
    let res = _.unionBy(generatorProjectInfoList(temp), (item: ProjectList) => item.id);

    setProjectIdList(res);
    setCheckedKeys(checked);
  };

  useEffect(() => {
    store.setProjectIdList(projectIdList);
  }, [projectIdList]);

  const onTabChange = (key: string) => {
    setTabActiveKey(key);
  };

  const { data: treeListReponseData, loading: treeListDataLoading } = useRequest(whichTabToFetch, {
    refreshDeps: [filterCondition, tabActiveKey],
    onSuccess: () => {
      if (treeListReponseData?.length) {
        const data = generateProjectTree(treeListReponseData);
        setTreeData(data);
        initSideTree(data);
        clearCheckAll();
      } else {
        message.warning('无数据');
      }
    },
    onError: () => {
      message.error('获取数据失败');
    },
  });

  const handlerAreaButtonCheck = (index: number) => {
    const resKey = flattenDeepToKey(treeData, index, "key", "-1");
    setExpandedKeys(resKey);
    setButtonActive(index);
  }

  const areaButtons = (buttonActive: number) => {
    return areaArray.map((item, index) => {
      return (
        <div key={item} className={styles.areaButtonsItem}>
          <Button style={{ width: "100%" }} type={buttonActive === index ? "primary" : "default"} onClick={() => handlerAreaButtonCheck(index)}>{item}</Button>
        </div>

      )
    })
  }
  const treeNodeRender = (data: any) => {

   return data.map((item: any) => {
    let rest = {}
    if(item.children && Array.isArray(item.Children)){
      return <Tree.TreeNode key={item.key} title={item.title} checkable {...rest} children={treeNodeRender(item.children)}/>
    }else{
      return <Tree.TreeNode key={item.key} title={item.title} checkable/>
    }

  })

  } 

  const { data: mapPosition, run: downloadMapPositonRequest } = useRequest(downloadMapPositon, {
    manual: true,
    onSuccess: () => {
      const a = document.createElement('a');
      a.download = '项目坐标.zip';
      const blob = new Blob([mapPosition], { type: 'application/zip;charset=utf-8' });
      // text指需要下载的文本或字符串内容
      a.href = window.URL.createObjectURL(blob);
      // 会生成一个类似blob:http://localhost:8080/d3958f5c-0777-0845-9dcf-2cb28783acaf 这样的URL字符串
      document.body.appendChild(a);
      a.click();
      a.remove();
      setexportMapPositionModalVisible(false);
      setexportMapPositionLoading(false);
    },
    onError: () => {
      message.warn('导出失败');
    },
  });

  const onOkWithExportMapPosition = () => {
    downloadMapPositonRequest(checkedProjectIdList.map((item) => item.id));
    setexportMapPositionLoading(true);
  };

  const renderStartDateButton = () => {
    return (
      <Button type="link" style={{width: "100%"}}>定位最早项目时间</Button>
    );
  }
  const renderEndDateButton = () => {
    return (
      <Button type="link" style={{width: "100%"}}>定位最晚项目时间</Button>
    );
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.searchWrap}>
        <Input prefix={<SearchOutlined />} placeholder="请输入" style={{width: "78%"}}/>
        <Button type="text"><AlignLeftOutlined />筛选</Button>
        {/* <Button type="text"></Button> */}
      </div>
      <div ref={ref} className={classNames(className, styles.sideTree, styles.tabPane)}>
        <div style={{ color: activeStyle('1') }} className={styles.tabBar}>
          <div className={styles.tabBarItem} onClick={() => onTabChange('1')}>
            按地区
          </div>
          <Divider type="vertical" />
          <div
            style={{ color: activeStyle('2') }}
            className={styles.tabBarItem}
            onClick={() => onTabChange('2')}
          >
            按公司
          </div>
        </div>

        <Tabs
          renderTabBar={() => <></>}
          style={{ height: 'calc(100% - 42px)', font: activeStyle(tabActiveKey), color: '#d6d6d6' }}
        >
          <TabPane style={{ overflow: 'hidden' }} key="1">
            {treeListDataLoading ? (
              <Spin
                spinning={treeListDataLoading}
                className={styles.loading}
                tip="正在载入中..."
              ></Spin>
            ) : null}
            {!treeListDataLoading ? (
              <>
                {tabActiveKey === "1" ? (
                  <div className={styles.areaButtons}>
                    {areaButtons(buttonActive)}
                  </div>
                ) : null}
                {/* <Checkbox
                checked={allCheck}
                indeterminate={indeterminate}
                style={{ marginLeft: '8px', marginTop: '4px' }}
                onChange={onCheckAll}
              >
                全选
              </Checkbox> */}
                <Tree
                  height={size.height ? size.height - 120 : 680}
                  checkable
                  onExpand={onExpand}
                  defaultExpandAll
                  expandedKeys={expandedKeys}
                  onCheck={(checked, info) => onCheck(checked, info)}
                  checkedKeys={checkedKeys}
                  treeData={treeData}
                  className={classNames(styles.sideMenu)}
                >
                  {/* {
                    treeNodeRender(treeData)
                  } */}
                </Tree>
              </>
            ) : null}
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.timeLine}>
      {/* <Space direction="vertical"> */}
        <DatePicker style={{width: "100%"}} placeholder='请选择日期起' showToday={false} renderExtraFooter={renderStartDateButton} onChange={(e) => store.setStartDate(e?.format('YYYY/MM/DD')) }/>
        <DatePicker style={{width: "100%"}} placeholder='请选择日期止' showToday={false} renderExtraFooter={renderEndDateButton} onChange={(e) => store.setEndDate(e?.format('YYYY/MM/DD'))}/>

      {/* </Space> */}
      </div>
      <div className={styles.functionButton}>
        <div className={styles.row}>
          <Button onClick={() => setexportMapPositionModalVisible(true)}><ExportOutlined />导出坐标</Button>
          <Button onClick={() => setMaterialModalVisible(true)}><NodeIndexOutlined />材料统计</Button>
        </div>
        <div className={styles.row}>
          <Button><MessageOutlined />成果管理</Button>
          <Button><MessageOutlined />审阅消息</Button>
        </div>
      </div>
      <div className={styles.controlLayers}>
        <ControlLayers {...props.controlLayersProps}/>
      </div>
      <div className={styles.handlerSideBarVisibelButton} onClick={() => onChange()}>
        {sideMenuVisibel ? <LeftOutlined style={{fontSize: 10}} /> : <RightOutlined style={{fontSize: 10}}/>}
      </div>
      <ExportMapPositionModal
        confirmLoading={exportMapPositionLoading}
        visible={exportMapPositionModalVisible}
        onCancel={() => setexportMapPositionModalVisible(false)}
        onOk={onOkWithExportMapPosition}
      />
      <MaterialModal
        checkedProjectIdList={checkedProjectIdList?.map((v: ProjectList) => v.id)}
        visible={materialModalVisible}
        onCancel={() => setMaterialModalVisible(false)}
        onOk={() => setMaterialModalVisible(false)}
      />
    </div>

  );
});

export default SideTree;
