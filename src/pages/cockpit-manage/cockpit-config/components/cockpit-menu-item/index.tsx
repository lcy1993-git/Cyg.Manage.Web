import React from "react";
import { CockpitProps, ChildrenData } from '../../utils';
import addIcon from '@/assets/cockpit-assets/add.png'
import uuid from "node-uuid";
import styles from './index.less';



interface CockpitMenuItemProps {
  type: string;
  name: string;
  icon: string;
  childrenData: ChildrenData[];
  configArray: CockpitProps[];
  addConfig: (a0: any) => void
}

const CockpitMenuItem: React.FC<CockpitMenuItemProps> = ({
  type,
  name,
  icon,
  childrenData,
  configArray,
  addConfig
}) => {

  const addConfigItem = (e: ChildrenData) => {

    let w: number = 3;
    if(e.name === "mapComponent" || e.name ===  'projectProgress'){
      w = 6
    }
    
    addConfig?.(
      {
        name: e.name,
        componentProps: e.componentProps,
        x: 0,
        y: 0,
        w,
        h: 11,
        key: uuid.v1()
      }
    )
  }

  const childrenElement = () => {
    return childrenData.map((item) => {
      return (
        <div className={styles.cockpitMenuItemItem}>
          <div>
            {item.title}
          </div>
          <div>
            {
              configArray.findIndex((e) => e.name === item.name) === -1 ?
                <span className={styles.add} onClick={() => addConfigItem(item)}>
                  <img className={styles.addIcon} src={addIcon} />
                  添加</span> :
                <span className={styles.added}>已添加</span>
            }
          </div>
        </div>
      );
    })
  }

  return (
    <div className={styles.cockpitMenuItemWrap}>
      <div className={styles.cockpitMenuItemTitle}>
        <div className={styles.img}>
          <img src={icon} alt="" />
        </div>
        <div>
          {name}
        </div>
      </div>
      {childrenElement()}
    </div>
  );
}

export default CockpitMenuItem;