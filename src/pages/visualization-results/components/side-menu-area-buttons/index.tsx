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

const SiderMenuAreaButtons: React.FC<SiderMenuAreaButtonsProps> = ({
  buttonProps
}) => {

  const [onButtonHover, setOnButtonHover] = useState<number>(-1)

  return (
    <>
          {
        buttonProps.map((item, index) => {
          return (
            <Button key={item.title} onMouseEnter={() => setOnButtonHover(index)} onMouseLeave={() => setOnButtonHover(-1)} title={item.title} onClick={item.onClick} style={{width: "100%", ...item?.style}}>
            <img className={styles.img} src={ onButtonHover === index ? item.light : item.dart}></img>
          </Button>
          )
        })
      }
    </>
  );
}

export default SiderMenuAreaButtons;