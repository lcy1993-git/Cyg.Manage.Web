import Tabs from 'antd/lib/tabs';
import React from 'react';
import ManualUpload from './components/tab-child';
import styles from './index.less';

const {TabPane} = Tabs
const tabList = [
  {
    title:'管理端',
    id:'manageEnd'
  },{
    title:'勘察端',
    id:'surveyEnd'
  },{
    title:'设计端',
    id:'designSide'
  },{
    title:'造价模块',
    id:'costModule'
  },{
    title:'评审端',
    id:'judgingEnd'
  },
]
const ManualManagement: React.FC = () => {

  const callback = ()=>{

  }
  return (
    <div className={styles.manualManagement}>
      <div className={styles.mainBox}>
        <Tabs defaultActiveKey="manageEnd" onChange={callback}>
          {
            tabList.map(item=>{
              return <TabPane tab={item.title} key={item.id}>
                <ManualUpload id={item.id}/>
              </TabPane>
            })
          }
        </Tabs>
      </div>
    </div>
  );
};

export default ManualManagement;
