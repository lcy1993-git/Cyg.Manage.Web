import React, { FC, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import styles from './index.less';
import _ from 'lodash';
import { Tree, Tabs, Spin, message, Input, Button, Divider, DatePicker } from 'antd';
import { SearchOutlined, AlignLeftOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import { useRequest, useSize } from 'ahooks';
import {
  fetchAreaEngineerProjectListByParams,
  fetchCompanyEngineerProjectListByParams,
  ProjectListByAreaType,
  Properties,
} from '@/services/visualization-results/side-tree';
import ProjectDetailInfo from '@/pages/project-management/all-project/components/project-detail-info';
import { downloadMapPositon } from '@/services/visualization-results/list-menu';
import ExportMapPositionModal from '../export-map-position-modal';
import CommentModal from '../comment-modal';
import FilterModal from '../filter-modal';
import ResultModal from '../result-modal';
import MaterialModal from '../material-modal';
import SidePopup from '../side-popup';
import { useContainer } from '../../result-page/mobx-store';
import { ProjectList } from '@/services/visualization-results/visualization-results';
import { observer } from 'mobx-react-lite';
import { flattenDeepToKey } from '../../utils/utils'
import ControlLayers from '../control-layers';
const { TabPane } = Tabs;
import achievementSvg from '@/assets/image/webgis/svg/achievements.svg'
import exportSvg from '@/assets/image/webgis/svg/export.svg'
import materiaSvg from '@/assets/image/webgis/svg/material.svg'
import messageSvg from '@/assets/image/webgis/svg/message.svg';

// 解决datePiker月份不为中文的bug
import moment from 'moment'
import locale from 'antd/lib/date-picker/locale/zh_CN'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

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
  sidePopupProps: any;
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
  // 项目详情
  const [projectModalActiveId, setProjectModalActiveId] = useState<string>("");
  const [projectModalVisible, setProjectModalVisible] = useState<boolean>(false);

  // 筛选
  const [filterModalVisibel, setFilterModalVisibel] = useState<boolean>(false);
  // 成果管理
  const [resultVisibel, setResultVisibel] = useState<boolean>(false);
  // 审阅消息
  const [commentModalVisible, setCommentModalVisible] = useState<boolean>(false);
  const [buttonActive, setButtonActive] = useState<number>(-1);
  // Tree State
  const [selectArrayStuck, setSelectArrayStuck] = useState<any[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<any[]>([]);
  const [checkedKeys, setCheckedKeys] = useState<keyType>();
  const [projectIdList, setProjectIdList] = useState<ProjectList[]>([]);
  const [treeData, setTreeData] = useState<TreeNodeType[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  // 地区or公司状态
  const [tabActiveKey, setTabActiveKey] = useState<string>('1');

  // 处理关闭项目详情模态框，没有关闭选中状态的bug
  useEffect(() => {
    if(!projectModalVisible){
      setSelectedKeys([])
      setSelectedKeys(selectArrayStuck)
    }

  }, [projectModalVisible])

  const [exportMapPositionModalVisible, setexportMapPositionModalVisible] = useState<boolean>(
    false,
  );
  const [materialModalVisible, setMaterialModalVisible] = useState<boolean>(false);

  const startDateRef = useRef<any>(null);
  const endDateRef = useRef<any>(null);
  const [startDateValue, setStartDateValue] = useState<moment.Moment | undefined>(undefined);
  const [endDateValue, setEndDateValue] = useState<moment.Moment | undefined>(undefined);

  const [exportMapPositionLoading, setexportMapPositionLoading] = useState<boolean>(false);
  // const [allCheck, setAllCheck] = useState<boolean>(false);
  // const [indeterminate, setIndeterminate] = React.useState(false);
  const store = useContainer();
  const { vState } = store;
  const { filterCondition, checkedProjectIdList, checkedProjectDateList } = vState;
  const { className, onChange, sideMenuVisibel } = props;
  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref);
  const activeStyle = (key: string) => (tabActiveKey === key ? '#0e7b3b' : '#000');

  useEffect(() => {
    setTreeData([]);
    clearState();
    setSelectedKeys([]);
    setButtonActive(-1);
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

  // const clearCheckAll = () => {
  //   setIndeterminate(false);
  //   // setAllCheck(false);
  // };

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
      // setIndeterminate(true);
      // setAllCheck(false);
    } else if (allProjectKey.length === temp.length) {
      // setAllCheck(true);
      // setIndeterminate(false);
    } else {
      // clearCheckAll();
    }

    if (info.checkedNodes.length === 0) {
      // clearCheckAll();
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
        // clearCheckAll();
      } else {
        message.warning('无数据');
      }
    },
    onError: () => {
      message.error('获取数据失败');
    },
  });

  const handlerAreaButtonCheck = (index: number, buttonActive: number) => {
    if(index === buttonActive) {
      setButtonActive(-1);
      setSelectedKeys([])
      return;
    }
    const resKey = flattenDeepToKey(treeData, index, "key", "-1");
    let keyArray: string[] = [];
    if (index < 0) {
      setSelectedKeys(keyArray)
    } else {
      const deepKeyArray = (data: TreeNodeType[]) => {
        data.forEach((item: TreeNodeType) => {
          // console.log(item.levelCategory, "等级", index + 1, "按钮等级");
          // if(item.levelCategory === 4) console.log(item);
          /**
           * 判断按钮区与tree数据层级的关系比较
           */
          const levelCategoryFlag = item.levelCategory < 4 ? item.levelCategory >= index + 1 :  item.levelCategory > index + 1
          if(levelCategoryFlag) {
            keyArray.push(item.key)
          }
          if(Array.isArray(item.children)) {
            deepKeyArray(item.children)
          }
        })
      }
      deepKeyArray(treeData);
      console.log(keyArray);
      
      setSelectedKeys(keyArray)
    }

    setExpandedKeys(resKey);
    setButtonActive(index);
  }

  const areaButtons = (buttonActive: number) => {
    return areaArray.map((item, index) => {
      return (
        <div key={item} className={styles.areaButtonsItem}>
          <Button style={{ width: "100%" }} type={buttonActive === index ? "primary" : "default"} onClick={() => handlerAreaButtonCheck(index, buttonActive)}>{item}</Button>
        </div>

      )
    })
  }
  const treeNodeRender = (data: any) => {

    return data.map((item: any) => {
      let rest = {}
      if (item.children && Array.isArray(item.Children)) {
        return <Tree.TreeNode key={item.key} title={item.title} checkable {...rest} children={treeNodeRender(item.children)} />
      } else {
        return <Tree.TreeNode key={item.key} title={item.title} checkable />
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

  useEffect(() => {
    store.setStartDate(startDateValue ? moment(startDateValue).format('YYYY/MM/DD') : startDateValue);
  }, [startDateValue])

  useEffect(() => {
    store.setEndDate(endDateValue ? moment(endDateValue).format('YYYY/MM/DD') : endDateValue);
  }, [endDateValue])

  const renderStartDateButton = () => {
    return (
      <Button type="link" style={{ width: "100%" }} onClick={() => {
        if (!checkedProjectDateList || checkedProjectDateList.length === 0) {
          message.error('当前未选择项目');
        } else {
          setStartDateValue(moment(checkedProjectDateList[0]))
        }
        startDateRef && startDateRef.current?.blur();
      }}>定位最早项目时间</Button>
    );
  }

  const renderEndDateButton = () => {
    return (
      <Button type="link" style={{ width: "100%" }} onClick={() => {
        if (!checkedProjectDateList || checkedProjectDateList.length === 0) {
          message.error('当前未选择项目');
        } else {
          setEndDateValue(moment(checkedProjectDateList[checkedProjectDateList.length - 1]))
        }
        endDateRef && endDateRef.current?.blur();
      }}>定位最晚项目时间</Button>
    );
  }

  return (
    <div className={`${styles.wrap} ${projectModalVisible? styles.wrapSelect : ""}`}>
      <div className={styles.searchWrap}>
        <Input prefix={<SearchOutlined />} placeholder="请输入" style={{ width: "78%" }} />
        <Button type="text" onClick={() => setFilterModalVisibel(true)}><AlignLeftOutlined />筛选</Button>
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
                  selectedKeys={selectedKeys}
                  multiple={true}
                  onSelect={(e, g: any) => {
                    if (!(Array.isArray(g.node.children) && g.node.children.length > 0)) {
                      setSelectedKeys([g.node.key]);
                      setProjectModalActiveId(g.node.id)
                      setProjectModalVisible(true);
                      setSelectArrayStuck(selectedKeys);
                    }
                  }
                  }
                >
                </Tree>
              </>
            ) : null}
          </TabPane>
        </Tabs>
      </div>
      <div className={styles.timeLine}>
        {/* <Space direction="vertical"> */}
        <DatePicker ref={startDateRef} locale={locale} style={{ width: "100%" }} placeholder='请选择日期起' value={startDateValue} showToday={false} renderExtraFooter={renderStartDateButton} onChange={(e) => setStartDateValue(e!)} />
        <DatePicker ref={endDateRef} locale={locale} style={{ width: "100%" }} placeholder='请选择日期止' value={endDateValue} showToday={false} renderExtraFooter={renderEndDateButton} onChange={(e) => setEndDateValue(e!)} />

        {/* </Space> */}
      </div>
      <div className={styles.functionButton}>
        <div className={styles.row}>
          <Button onClick={() => setexportMapPositionModalVisible(true)}><img className={styles.svg} src={exportSvg} />导出坐标</Button>
          <Button onClick={() => setMaterialModalVisible(true)}><img className={styles.svg} src={materiaSvg} />材料统计</Button>
        </div>
        <div className={styles.row}>
          <Button
            disabled={!(Array.isArray(checkedKeys) && checkedKeys?.length === 1)}
            onClick={() => setResultVisibel(true)}
          >
            <img className={styles.svg} src={achievementSvg} />成果管理
          </Button>
          <Button
            disabled={!(Array.isArray(checkedKeys) && checkedKeys?.length === 1)}
            onClick={() => setCommentModalVisible(true)}
          >

            <img className={styles.svg} src={messageSvg} />审阅消息
          </Button>
        </div>
      </div>
      <div className={styles.controlLayers}>
        <ControlLayers {...props.controlLayersProps} />
      </div>
      <div className={styles.handlerSideBarVisibelButton} onClick={() => onChange()}>
        {sideMenuVisibel ? <LeftOutlined style={{ fontSize: 10 }} /> : <RightOutlined style={{ fontSize: 10 }} />}
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
      <div>
        <SidePopup {...props.sidePopupProps} />
      </div>
      {projectModalVisible && <ProjectDetailInfo
        projectId={projectModalActiveId}
        visible={projectModalVisible}
        onChange={setProjectModalVisible}
        isResult={false}
      />}
      <ResultModal projectId={projectIdList[0]?.id ?? ""} visible={resultVisibel} onChange={setResultVisibel} />
      <CommentModal visible={commentModalVisible} onOk={() => setCommentModalVisible(false)} onCancel={() => setCommentModalVisible(false)} checkedProjectIdList={checkedProjectIdList} />
      <FilterModal defaultData={filterCondition} visible={filterModalVisibel} onChange={setFilterModalVisibel} onSure={(values) => store.setFilterCondition(values)} />
    </div>

  );
});

export default SideTree;
