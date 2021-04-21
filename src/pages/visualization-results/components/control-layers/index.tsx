import React, { useMemo, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import {ControlLayearsData} from '../../utils'
import styles from './index.less';

type ListProps = {
  onLayersStateChange: (arg0: number) => void;
} & ControlLayearsData;

interface Props {
  controlLayearsData: ControlLayearsData[];
  onLayersStateChange: (arg0: number) => void;
}

const ListItem = (props: ListProps) => {
  const { name, state, index, onLayersStateChange } = props
  return (
    <div className={styles.listItem}>
          <Checkbox defaultChecked={state} style={{}} onChange={()=>onLayersStateChange(index)}>{ name }</Checkbox>
    </div>

  );
}

const ControlLayers = (props: Props) => {
  const [visiabel, setVisiabel] = useState<boolean>(false);
  const { controlLayearsData, onLayersStateChange } = props;
  const ListItemNode = useMemo(() => {
    return controlLayearsData.map((item: ControlLayearsData, index: number) => {
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