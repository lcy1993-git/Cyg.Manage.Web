import classnames from 'classnames';
import styles from './index.less';

const imgResourse = {
  kancha: {
    light: require('@/assets/image/webgis/layers/kancha.png'),
    dark: require('@/assets/image/webgis/layers/kancha1.png')
  },
  fangan: {
    light: require('@/assets/image/webgis/layers/fangan.png'),
    dark: require('@/assets/image/webgis/layers/fangan1.png')
  },
  sheji: {
    light: require('@/assets/image/webgis/layers/sheji.png'),
    dark: require('@/assets/image/webgis/layers/sheji1.png')
  },
  chaichu: {
    light: require('@/assets/image/webgis/layers/chaichu.png'),
    dark: require('@/assets/image/webgis/layers/chaichu1.png')
  },
}
interface ListProps {
  name: string;
  state: boolean;
  sign: string;
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
  const { name, state, onChange, sign } = props;
  return (
    <div className={classnames(styles.listItem, state ? styles.activeBackground : "")} key={'listItem' + name} onClick={onChange}>
        <div className={state ? styles.active : null}><img src={state ? imgResourse[sign].light : imgResourse[sign].dark } /></div>
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
            sign="kancha"
            state={surveyLayerVisible}
            onChange={() => setSurveyLayerVisible(!surveyLayerVisible)}
          />
          <ListItem
            name="方案图层"
            sign="fangan"
            state={planLayerVisible}
            onChange={() => setPlanLayerVisible(!planLayerVisible)}
          />
          <ListItem
            name="设计图层"
            sign="sheji"
            state={designLayerVisible}
            onChange={() => setDesignLayerVisible(!designLayerVisible)}
          />
          <ListItem
            name="拆除图层"
            sign="chaichu"
            state={dismantleLayerVisible}
            onChange={() => setDismantleLayerVisible(!dismantleLayerVisible)}
          />
        </div>
      </div>
    </div>
  );
};

export default ControlLayers;
