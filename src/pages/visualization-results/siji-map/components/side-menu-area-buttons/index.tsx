import { Button } from 'antd'
import { useState } from 'react'
import styles from './index.less'

interface SiderMenuAreaButtonsProps {
  buttonProps: any[]
}

const SiderMenuAreaButtons: React.FC<SiderMenuAreaButtonsProps> = ({ buttonProps }) => {
  const [onButtonHover, setOnButtonHover] = useState<number>(-1)

  return (
    <>
      {buttonProps.map((item: any, index: any) => {
        return (
          <Button
            key={item.title}
            onMouseEnter={() => setOnButtonHover(index)}
            onMouseLeave={() => setOnButtonHover(-1)}
            title={item.title}
            onClick={item.onClick}
            style={{ width: '100%', ...item?.style }}
          >
            <img
              className={styles.img}
              src={onButtonHover === index ? item.light : item.dart}
              alt=""
            ></img>
          </Button>
        )
      })}
    </>
  )
}

export default SiderMenuAreaButtons
