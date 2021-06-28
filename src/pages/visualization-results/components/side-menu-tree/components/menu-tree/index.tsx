import { useRef, useMemo } from 'react';
import { Divider, Tree, Tabs, Spin, Button } from 'antd';
import { useSize } from 'ahooks';
import styles from './index.less';

const { TabPane } = Tabs;
const { TreeNode } = Tree;
interface TreeDataProps {
  onExpand: any;
  onCheck: (checked: any, info: any) => void;
  onSelect: (a0: any, a1: any) => void;
}

interface Props {
  className: string;
  onTabChange: (arg0: "1" | "2") => void;
  activeStyle: (arg0: string) => string;
  tabActiveKey: string;
  treeListDataLoading: boolean;
  buttonActive: number;
  handlerAreaButtonCheck: (index: number, active: number) => void;
  expandedKeys: any[];
  selectedKeys: string[],
  treeProps: TreeDataProps;
  checkedKeys: any[];
  treeData: any[];
}

const areaArray = ["省", "市", "县", "工", "项"];

const MenuTree: React.FC<Props> = ({
  className,
  onTabChange,
  activeStyle,
  tabActiveKey,
  treeListDataLoading,
  buttonActive,
  expandedKeys,
  selectedKeys,
  treeProps,
  handlerAreaButtonCheck,
  checkedKeys,
  treeData

}) => {

  const ref = useRef<HTMLDivElement>(null);
  const size = useSize(ref)

  const areaButtons = (buttonActive: number) => {
    return areaArray.map((item, index) => {
      return (
        <div key={item} className={styles.areaButtonsItem}>
          <Button style={{ width: "100%" }} type={buttonActive === index ? "primary" : "default"} onClick={() => handlerAreaButtonCheck(index, buttonActive)}>{item}</Button>
        </div>
      )
    })
  }

  // 计算高度
  const operrationHeight = useMemo(() => {
    const addTopHeight = tabActiveKey === "1" ? -30 : 0;
    if (size.height) {
      return size.height - 60 + addTopHeight
    }
    return window.innerHeight > 936 ? 820 : 460

  }, [JSON.stringify(size), tabActiveKey])

  return (
    <div ref={ref} className={styles.sideTree}>
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
        <TabPane key="1">
          {treeListDataLoading ? (
            <Spin
              spinning={treeListDataLoading}
              className={styles.loading}
              tip="正在载入中..."
            ></Spin>
          ) : null}
          {!treeListDataLoading ? (
            <div style={{ height: "calc(100%-32px)" }}>
              {tabActiveKey === "1" ? (
                <div className={styles.areaButtons}>
                  {areaButtons(buttonActive)}
                </div>
              ) : null}
              <div style={{ height: "calc(100% - 36px)" }}>

                { size.height && <Tree {...treeProps} height={operrationHeight} checkable={true} multiple={true} expandedKeys={expandedKeys} selectedKeys={selectedKeys} checkedKeys={checkedKeys} treeData={treeData}/>}
              </div>
            </div>
          ) : null}
        </TabPane>
      </Tabs>
    </div>
  );
}

export default MenuTree;