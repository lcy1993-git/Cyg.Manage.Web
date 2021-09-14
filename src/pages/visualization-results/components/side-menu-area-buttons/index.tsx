import { useState } from 'react';
import { Button } from 'antd';
import styles from './index.less';

interface BtnProps {
  title: string;
  dart: string;
  light: string;
  onClick: () => void;
  style?: any
}

interface SiderMenuAreaButtonsProps {
  buttonProps: BtnProps[]
}

const ButtonImageSourse = {
  cg: {
    dart: require('@/assets/icon-image/menu-tree-icon/成果管理.png'),
    light: require('@/assets/icon-image/menu-tree-icon/成果管理-light.png'),
  },
  cl: {
    dart: require('@/assets/icon-image/menu-tree-icon/材料统计.png'),
    light: require('@/assets/icon-image/menu-tree-icon/材料统计-light.png'),
  },
  sy: {
    dart: require('@/assets/icon-image/menu-tree-icon/审阅消息.png'),
    light: require('@/assets/icon-image/menu-tree-icon/审阅消息-light.png'),
  },
  dmt: {
    dart: require('@/assets/icon-image/menu-tree-icon/导出多媒体.png'),
    light: require('@/assets/icon-image/menu-tree-icon/导出多媒体-light.png'),
  },
  zb: {
    dart: require('@/assets/icon-image/menu-tree-icon/导出坐标.png'),
    light: require('@/assets/icon-image/menu-tree-icon/导出坐标-light.png'),
  },
}

const SiderMenuAreaButtons: React.FC<SiderMenuAreaButtonsProps> = ({
  buttonProps
}) => {

  const [onButtonHover, setOnButtonHover] = useState<number>(-1)

  return (
    <>
          {
        buttonProps.map((item, index) => {
          return (
            <Button key={item.title} onMouseEnter={() => setOnButtonHover(index)} onMouseLeave={() => setOnButtonHover(-1)} title={item.title} onClick={item.onClick} style={item?.style}>
            <img className={styles.img} src={ onButtonHover === index ? item.light : item.dart}></img>
          </Button>
          )
        })
      }
    {/* <Button onMouseEnter={() => setOnButtonHover(0)} onMouseLeave={() => setOnButtonHover(-1)} title="成果管理">
      <img className={styles.img} src={ onButtonHover === 0 ? ButtonImageSourse.cg.light : ButtonImageSourse.cg.dart}></img>
    </Button>
    <Button onMouseEnter={() => setOnButtonHover(1)} onMouseLeave={() => setOnButtonHover(-1)} title="材料统计">
      <img className={styles.img} src={ onButtonHover === 1 ? ButtonImageSourse.cl.light : ButtonImageSourse.cl.dart}></img>
    </Button>
    <Button onMouseEnter={() => setOnButtonHover(2)} onMouseLeave={() => setOnButtonHover(-1)} title="审阅消息">
      <img className={styles.img} src={ onButtonHover === 2 ? ButtonImageSourse.sy.light : ButtonImageSourse.sy.dart}></img>
    </Button>
    <Button onMouseEnter={() => setOnButtonHover(3)} onMouseLeave={() => setOnButtonHover(-1)} title="导出多媒体">
      <img className={styles.img} src={ onButtonHover === 3 ? ButtonImageSourse.dmt.light : ButtonImageSourse.dmt.dart}></img>
    </Button>
    <Button onMouseEnter={() => setOnButtonHover(4)} onMouseLeave={() => setOnButtonHover(-1)} title="导出坐标">
      <img className={styles.img} src={ onButtonHover === 4 ? ButtonImageSourse.zb.light : ButtonImageSourse.zb.dart}></img>
    </Button> */}
    </>
  );
}

export default SiderMenuAreaButtons;