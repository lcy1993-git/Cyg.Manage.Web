import React, { useMemo, useState } from 'react';
import { Checkbox, Divider } from 'antd';
import Icon from '@ant-design/icons';

import { ControlLayearsData } from '../../utils';
import styles from './index.less';
const LayereIcon = () => (
  <svg
    t="1619065560359"
    class="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2967"
    width="30"
    height="30"
  >
    <path
      d="M744.72668481 358.18206787L512 222.01367187 279.29309082 358.18206787 512 494.35046386l232.72668481-136.16839599zM512 647.70367408l301.29290796-176.2679441L882.78857422 512.11865234l-370.78857422 216.99041773L141.21142578 512.11865234l69.56488061-40.68786645L512 647.70861817z m0 153.75860595l301.29290796-176.57446241 69.49566626 40.58898902L512 882.78857422 141.21142578 665.47680664l69.56488061-40.58898902L512 801.46228003zM141.21142578 358.18206787L512 141.21142578l370.78857422 216.97064209-370.78857422 216.97064209L141.21142578 358.18206787z"
      p-id="2968"
      fill="#ffffff"
    ></path>
  </svg>
);
type ListProps = {
  onLayersStateChange: (arg0: number) => void;
} & ControlLayearsData;

interface Props {
  controlLayearsData: ControlLayearsData[];
  onLayersStateChange: (arg0: number) => void;
}

const ListItem = (props: ListProps) => {
  const { name, state, index, onLayersStateChange } = props;
  return (
    <div className={styles.listItem}>
      <Checkbox defaultChecked={state} style={{}} onChange={() => onLayersStateChange(index)}>
        {name}
      </Checkbox>
    </div>
  );
};

const ControlLayers = (props: Props) => {
  const [visiabel, setVisiabel] = useState<boolean>(false);
  const { controlLayearsData, onLayersStateChange } = props;
  const ListItemNode = useMemo(() => {
    return controlLayearsData.map((item: ControlLayearsData, index: number) => {
      if (index === 0)
        return (
          <div className={styles.listItem} key={item.index}>
            <ListItem onLayersStateChange={onLayersStateChange} {...item} />
          </div>
        );
      return (
        <div className={styles.listItem} key={item.index}>
          <Divider style={{ margin: 2 }} />
          <ListItem onLayersStateChange={onLayersStateChange} {...item} />
        </div>
      );
    });
  }, [JSON.stringify(controlLayearsData)]);

  return (
    <div className={styles.container}>
      <div
        className={styles.icon}
        onMouseEnter={() => setVisiabel(true)}
        onMouseLeave={() => setVisiabel(false)}
      >
        <Icon component={LayereIcon} />
        {visiabel && <div className={styles.list}>{ListItemNode}</div>}
      </div>
    </div>
  );
};

export default ControlLayers;
