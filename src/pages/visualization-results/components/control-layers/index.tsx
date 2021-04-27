import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';
import Icon from '@ant-design/icons';

import styles from './index.less';

const LayereIcon = () => (
  <svg
    // t="1619065560359"
    className="icon"
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
interface ListProps {
  name: string;
  state: boolean;
  onChange: () => void;
};

interface Props {
  surveyLayerVisible: boolean;
  planLayerVisible: boolean;
  designLayerVisible: boolean;
  dismantleLayerVisible: boolean;
  setSurveyLayerVisible: (arg0: boolean) => void;
  setPlanLayerVisible: (arg0: boolean) => void;
  setDesignLayerVisible: (arg0: boolean) => void;
  setDismantleLayerVisible: (arg0: boolean) => void;
}

const ListItem = (props: ListProps) => {
  const { name, state, onChange } = props;
  return (
    <div className={styles.listItem} key={"listItem" + name}>
      <Checkbox defaultChecked={state} onChange={onChange}>
        {name}
      </Checkbox>
    </div>
  );
};

const ControlLayers = (props: Props) => {
  const [visiabel, setVisiabel] = useState<boolean>(false);
  const { surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible, setSurveyLayerVisible, setPlanLayerVisible, setDesignLayerVisible, setDismantleLayerVisible} = props;

  console.log(surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible)
  return (
    <div className={styles.container}>
      <div
        className={styles.icon}
        onMouseEnter={() => setVisiabel(true)}
        onMouseLeave={() => setVisiabel(false)}
      >
        <Icon style={{backgroundColor: "rgba(255,255,255, 0.6)", padding: "3px"}} component={LayereIcon} />
        {visiabel &&
          <div className={styles.list}>
            <div className={styles.listItem} key="surveyLayerVisible">
              <ListItem  name="勘察图层" state={surveyLayerVisible} onChange={() => setSurveyLayerVisible(!surveyLayerVisible)} />
            </div>
            <div className={styles.listItem} key="planLayerVisible">
              <Divider style={{ margin: 2 }} />
              <ListItem  name="方案图层" state={planLayerVisible} onChange={() => setPlanLayerVisible(!planLayerVisible)} />
            </div>
            <div className={styles.listItem} key="designLayerVisible">
              <Divider style={{ margin: 2 }} />
              <ListItem  name="设计图层" state={designLayerVisible} onChange={() => setDesignLayerVisible(!designLayerVisible)}/>
            </div>
            <div className={styles.listItem} key="dismantleLayerVisible">
              <Divider style={{ margin: 2 }} />
              <ListItem  name="拆除图层" state={dismantleLayerVisible} onChange={() => setDismantleLayerVisible(!dismantleLayerVisible)}/>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default ControlLayers;
