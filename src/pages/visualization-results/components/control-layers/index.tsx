import React, { useState } from 'react';
import { Checkbox, Divider } from 'antd';
import { QuestionCircleOutlined }  from '@ant-design/icons';

import styles from './index.less';
import { text } from 'express';

interface ListProps {
  name: string;
  state: boolean;
  onChange: () => void;
}

interface Props {
  surveyLayerVisible: boolean;
  planLayerVisible: boolean;
  designLayerVisible: boolean;
  dismantleLayerVisible: boolean;
  setSurveyLayerVisible: (surveyLayerVisible: boolean) => void;
  setPlanLayerVisible: (planLayerVisible: boolean) => void;
  setDesignLayerVisible: (designLayerVisible: boolean) => void;
  setDismantleLayerVisible: (dismantleLayerVisible: boolean) => void;
}

const ListItem = (props: ListProps) => {
  const { name, state, onChange } = props;
  return (
    <div className={styles.listItem } key={'listItem' + name} onClick={onChange}>
        <div className={state ? styles.active : null}><QuestionCircleOutlined /></div>
        <div className={state ? styles.active : null}><span className={styles.text}>{name}</span></div>
    </div>
  );
};

const ControlLayers = (props: Props) => {
  const {
    surveyLayerVisible,
    planLayerVisible,
    designLayerVisible,
    dismantleLayerVisible,
    setSurveyLayerVisible,
    setPlanLayerVisible,
    setDesignLayerVisible,
    setDismantleLayerVisible,
  } = props;

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <div className={styles.list}>
          <ListItem
            name="勘察图层"
            state={surveyLayerVisible}
            onChange={() => setSurveyLayerVisible(!surveyLayerVisible)}
          />
          <Divider style={{height: "30%", marginBottom: "6px"}} type="vertical" />
          <ListItem
            name="方案图层"
            state={planLayerVisible}
            onChange={() => setPlanLayerVisible(!planLayerVisible)}
          />
          <Divider style={{height: "30%", marginBottom: "6px"}} type="vertical" />
          <ListItem
            name="设计图层"
            state={designLayerVisible}
            onChange={() => setDesignLayerVisible(!designLayerVisible)}
          />
          <Divider style={{height: "30%", marginBottom: "6px"}} type="vertical" />
          <ListItem
            name="拆除图层"
            state={dismantleLayerVisible}
            onChange={() => setDismantleLayerVisible(!dismantleLayerVisible)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlLayers;
