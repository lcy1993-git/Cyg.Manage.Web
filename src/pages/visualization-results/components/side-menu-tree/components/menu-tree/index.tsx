import { Divider, Tree, Tabs, Spin, Button } from 'antd';
import { useSize } from 'ahooks';
import styles from './index.less';

const { TabPane } = Tabs;

interface Props {
  className: any;
}

const areaArray = ["省", "市", "县", "工", "项"];

const MenuTree: React.FC<any> = ({
  className,
  ref,
  onTabChange,
  activeStyle,
  tabActiveKey,
  treeListDataLoading,
  buttonActive,
  treeProps,
  handlerAreaButtonCheck

}) => {
  const size = useSize(ref);
  console.log(size);

  const areaButtons = (buttonActive: number) => {
    return areaArray.map((item, index) => {
      return (
        <div key={item} className={styles.areaButtonsItem}>
          <Button style={{ width: "100%" }} type={buttonActive === index ? "primary" : "default"} onClick={() => handlerAreaButtonCheck(index, buttonActive)}>{item}</Button>
        </div>
      )
    })
  }

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
                
                <Tree {...treeProps} />
              </div>
            </div>
          ) : null}
        </TabPane>
      </Tabs>
    </div>
  );
}

export default MenuTree;