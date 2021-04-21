import React, { useMemo, useState } from 'react';
import { Checkbox, Divider } from 'antd';

import styles from './index.less';

const ListItem = (props: any) => {
  const { name, state, index, onLayersStateChange } = props
  return (
    <div className={styles.listItem}>
          <Checkbox defaultChecked={state} style={{}} onChange={()=>onLayersStateChange(index)}>{ name }</Checkbox>
    </div>

  );
}

const ControlLayers = (props: any) => {
  const [visiabel, setVisiabel] = useState<boolean>(false);
  const { controlLayearsData, onLayersStateChange } = props;
  const ListItemNode = useMemo(() => {
    return controlLayearsData.map((item: any, index: any) => {
      if (index === 0) return <div className={styles.listItem} key={item.index}><ListItem onLayersStateChange={onLayersStateChange} {...item} /></div>;
      return (
        <div className={styles.listItem} key={item.index}>
          <Divider style={{margin: 2}}/>
          <ListItem onLayersStateChange={onLayersStateChange} {...item} />
        </div>
      )
    })
  }, [JSON.stringify(controlLayearsData)])

  return (
    <div className={styles.container} >
      <div className={styles.icon} onMouseEnter={()=> setVisiabel(true)} onMouseLeave={()=> setVisiabel(false)}>
        图层图标
        {visiabel &&
        <div className={styles.list}>
          {ListItemNode}
      </div>}
      </div>
    </div>
  );
}

export default ControlLayers;