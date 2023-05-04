import classnames from 'classnames'
import { observer } from 'mobx-react-lite'
import { useContainer } from '../../result-page/mobx-store'
import styles from './index.less'

const imgResourse = {
  kancha: {
    light: require('@/assets/icon-image/menu-tree-icon/kancha-light.png'),
    dark: require('@/assets/icon-image/menu-tree-icon/kancha.png'),
  },
  fangan: {
    light: require('@/assets/icon-image/menu-tree-icon/fangan-light.png'),
    dark: require('@/assets/icon-image/menu-tree-icon/fangan.png'),
  },
  sheji: {
    light: require('@/assets/icon-image/menu-tree-icon/sheji-light.png'),
    dark: require('@/assets/icon-image/menu-tree-icon/sheji.png'),
  },
  chaichu: {
    light: require('@/assets/icon-image/menu-tree-icon/chaichu-light.png'),
    dark: require('@/assets/icon-image/menu-tree-icon/chaichu.png'),
  },
  yushe: {
    light: require('@/assets/icon-image/menu-tree-icon/yushe-light.png'),
    dark: require('@/assets/icon-image/menu-tree-icon/yushe.png'),
  },
}
interface ListProps {
  name: string
  state: boolean
  sign: string
  onChange: () => void
}

interface Props {
  surveyLayerVisible: boolean
  planLayerVisible: boolean
  designLayerVisible: boolean
  dismantleLayerVisible: boolean
  preDesignVisible: boolean
  setPreDesignVisible: (preDesignVisible: boolean) => void
  setSurveyLayerVisible: (surveyLayerVisible: boolean) => void
  setPlanLayerVisible: (planLayerVisible: boolean) => void
  setDesignLayerVisible: (designLayerVisible: boolean) => void
  setDismantleLayerVisible: (dismantleLayerVisible: boolean) => void
}

const ListItem = (props: ListProps) => {
  const { name, state, onChange, sign } = props
  return (
    <div
      className={classnames(styles.listItem, state ? styles.activeBackground : '')}
      key={'listItem' + name}
      onClick={onChange}
    >
      <div className={state ? styles.active : null}>
        <img
          className={styles.img}
          src={state ? imgResourse[sign].light : imgResourse[sign].dark}
        />
      </div>
      <div className={state ? styles.active : null}>
        <span className={styles.text}>{name}</span>
      </div>
    </div>
  )
}

const ControlLayers = observer((props: Props) => {
  const { preDesignVisible, setPreDesignVisible } = props

  const store = useContainer()
  const { vState } = store
  const { isSj, surveyLayerVisible, planLayerVisible, designLayerVisible, dismantleLayerVisible } =
    vState

  return (
    <div className={styles.container}>
      <div className={styles.icon}>
        <div className={`${styles.list}  ${isSj ? styles.sjList : ''}`}>
          {!isSj && (
            <ListItem
              name="规划图层"
              sign="yushe"
              state={preDesignVisible}
              onChange={() => setPreDesignVisible(!preDesignVisible)}
            />
          )}

          <ListItem
            name="勘察图层"
            sign="kancha"
            state={surveyLayerVisible}
            onChange={() => {
              store.setSurveyLayerVisible()
            }}
          />
          <ListItem
            name="方案图层"
            sign="fangan"
            state={planLayerVisible}
            onChange={() => store.setPlanLayerVisible()}
          />
          <ListItem
            name="设计图层"
            sign="sheji"
            state={designLayerVisible}
            onChange={() => store.setDesignLayerVisible()}
          />
          <ListItem
            name="拆除图层"
            sign="chaichu"
            state={dismantleLayerVisible}
            onChange={() => store.setDismantleLayerVisible()}
          />
        </div>
      </div>
    </div>
  )
})

export default ControlLayers
