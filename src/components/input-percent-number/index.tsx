import type { ReactElement } from 'react';
import { Button, Input } from "antd";
import styles from './index.less';
import classnames from 'classnames';

interface InputPercentNumberProps {
  // slot容器
  preSlot?: () => ReactElement; 
  nextSlot?: () => ReactElement;
  // input宽度
  width?: number;
  // 范围 步长
  max?: number;
  min?: number;
  step?: number;
  value: number;
  // 单位
  unit?: string;
  onChange: (percent: number) => void;
  className?: string;
  // 格式化
  format?: (percent: number) => number;
}

/**
 * 调整百分比的百分比容器组件
 */
const InputPercentNumber: React.FC<InputPercentNumberProps> = ({
  preSlot,
  nextSlot,
  width = 66,
  max = 1000,
  min = 100,
  step = 100,
  unit = "%",
  value,
  onChange,
  className,
  format = (n) => n,
}) => {

  const increaseHandleClick = () => {
    let current = value + step;
    if (current > max) {
      current = max
    }
    onChange?.(format(current))
  }

  const minusHandleClick = () => {
    let current = value - step;
    if (current < min) {
      current = min
    }
    onChange?.(format(current))
  }

  return (
    <div className={classnames(styles.inputPercentNumberWrap, className)}>
      <Button className={styles.preSlot} onClick={minusHandleClick}>
        {
          preSlot ?
            preSlot() :
            (
              <span>-</span>
            )
        }
      </Button>
      <Input style={{ width }} value={value + unit} className={styles.input}/>
      <Button className={styles.nextSlot} onClick={increaseHandleClick}>
        {
          nextSlot ?
            nextSlot() :
            (
              <span>+</span>
            )
        }
      </Button>
    </div>
  );
}

export default InputPercentNumber;