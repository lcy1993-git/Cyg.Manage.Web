import React, { useMemo, useState } from 'react';
import { Checkbox, Divider } from 'antd';

import styles from './index.less';
import jsonp from 'jsonp';

const ListItem = (props: any) => {
  const { name, state } = props
  return (
    <div className={styles.listItem}>
          <Checkbox defaultChecked={state} style={{}} onChange={()=>console.log(1)}>{ name }</Checkbox>
    </div>

  );
}

const ControlLayers = () => {
  const [visiabel, setVisiabel] = useState<boolean>(false);
  const ControlLayearsData = [
    {
      name: "勘察图层",
      state: false,
      index: 0
    },
    {
      name: "方案图层",
      state: false,
      index: 1
    },
    {
      name: "设计图层",
      state: false,
      index: 2
    },
    {
      name: "拆除图层",
      state: false,
      index: 3
    },
  ];

  const ListItemNode = useMemo(() => {
    return ControlLayearsData.map((item, index) => {
      if (index === 0) return <div className={styles.listItem}><ListItem {...item} /></div>;
      return (
        <div className={styles.listItem}>
          <Divider style={{margin: 2}}/>
          <ListItem key {...item} />
        </div>
      )
    })
  }, [JSON.stringify(ControlLayearsData)])

  return (
    <div className={styles.container} >
      <div className={styles.icon} onMouseEnter={()=> setVisiabel(true)} onMouseLeave={()=> setVisiabel(false)}>
        图层图标
        {visiabel &&
        <div className={styles.list}>
          {/* <ListItem />
          <Divider style={{margin: 2}}/>
          <ListItem />
          <Divider style={{margin: 2}}/>
          <ListItem />
          <Divider style={{margin: 2}}/>
          <ListItem /> */}
          {ListItemNode}
      </div>}
      </div>
    </div>
  );
}

export default ControlLayers;